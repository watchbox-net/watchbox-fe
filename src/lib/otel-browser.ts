// 브라우저(클라이언트 컴포넌트)용 OpenTelemetry 부트스트랩
// ──────────────────────────────────────────────────────────────────
// 동작 방식:
// 1. 클라이언트 컴포넌트가 처음 import할 때 모듈 최상위 코드가 1회 실행 → SDK 초기화
// 2. WebTracerProvider 등록 → 이후 /api/* 요청에만 trace span 생성
// 3. 같은 origin의 /api/* fetch/XHR에 traceparent 헤더 자동 첨부
//    → BFF(watchbox-next)와 백엔드(watchbox-spring)까지 하나의 trace로 연결
//
// CORS 회피 전략:
// - 브라우저는 외부 호스트의 OTel Collector(:4318)에 직접 못 보냄 (CORS + 보안)
// - 그래서 OTLP body를 Next.js의 BFF 프록시(`/api/otel/v1/traces`) 경유 (same origin)
//
// 주의: 폴더명이 `_otel` 이면 Next.js의 private folder 컨벤션에 걸려 라우팅에서 제외됨
//      → /api/[...path] catch-all로 빠져서 백엔드까지 잘못 전달되니 반드시 underscore 빼야 함
//
// 환경 분기:
// - local : 비활성 (개발 PC에서 OTel Collector 없음)
// - dev/prod : 활성 (process.env.NEXT_PUBLIC_ENV로 빌드 타임 인라인)
//
// 수집 범위 (의도적으로 좁힘 — Tempo / Collector 부하 + 네트워크 비용 절감):
// - ✅ axios (XHR) → /api/*  (사용자 액션, React Query)
// - ✅ native fetch → /api/*  (혹시 모를 직접 호출)
// - ❌ documentLoad / resourceFetch (CSS/font/JS chunk 로드 timing) — 제거
// - ❌ Next.js RSC 페이로드 fetch (route 경로, /api/ 아님) — 필터로 제외
// - ❌ TMDB 이미지 등 외부 호출 — 필터로 제외
//
// span 이름 정규화:
// - 경로의 숫자 세그먼트(tmdbId, boxId 등)를 :id 로 치환한다
// - Tempo metrics-generator가 span_name을 라벨로 쓰기 때문에, 원본 경로를 그대로 두면
//   사용자가 새 콘텐츠를 볼 때마다 시계열이 하나씩 늘어 카디널리티가 무한히 커진다
//   (백엔드는 http.route 덕에 /api/contents/{mediaType}/{tmdbId} 로 이미 템플릿화됨)
// - method 는 XHR 인스턴스에서 직접 읽는다 (아래 patchXhrOpen 주석 참고)

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

/**
 * 스팬 이름용 경로 정규화 — 숫자 세그먼트를 `:id` 로 치환.
 *
 * 이 앱의 경로 파라미터(tmdbId, boxId, memberId, requestId)는 모두 숫자라
 * 숫자 세그먼트만 걸러도 충분하다. mediaType(MOVIE/TV/PERSON)처럼 값이 유한한
 * 세그먼트는 그대로 둔다 — 라벨로 남아 있어야 구분이 되고 개수도 늘지 않는다.
 *
 * 예) /api/contents/MOVIE/1030571 → /api/contents/MOVIE/:id
 */
function normalizePathForSpanName(path: string): string {
  return path
    .split('/')
    .map((segment) => (/^\d+$/.test(segment) ? ':id' : segment))
    .join('/');
}

/** `GET /api/contents/MOVIE/:id` 형태의 스팬 이름을 만든다. */
function buildSpanName(method: string, rawUrl: string): string {
  const path = new URL(rawUrl, window.location.origin).pathname;
  return `${method} ${normalizePathForSpanName(path)}`;
}

/**
 * `open()` 을 감싸 method / url 을 XHR 인스턴스에 기록한다.
 *
 * OTel XHR 계측은 이 둘을 내부 WeakMap(`_xhrMem`)에만 들고 있고 xhr 객체에는 남기지 않는다.
 * 그래서 applyCustomAttributesOnSpan 콜백에서 꺼낼 방법이 없고, 심어주는 쪽이 없으면
 * `_method` 가 항상 undefined 라 'GET' 폴백이 걸린다. 실제로 axios(=XHR)로 나가는 모든
 * mutation 이 `GET /api/...` 로 기록되고 있었다 — 이름만 틀리고 http.method 속성은 POST 로
 * 정상이라 눈에 잘 안 띄었다.
 *
 * 계측 등록 순서와는 무관하다. 콜백은 span 종료 시점에 호출되므로 그때는 이미 세팅돼 있다.
 */
function patchXhrOpen() {
  const originalOpen = XMLHttpRequest.prototype.open;

  // 원본 open 은 오버로드가 있어 그대로는 대입이 안 된다 — 캐스팅으로 시그니처를 맞춘다
  XMLHttpRequest.prototype.open = function (
    this: XMLHttpRequest,
    ...args: Parameters<typeof originalOpen>
  ) {
    const [method, url] = args;
    Object.assign(this, { _method: method, _url: String(url) });
    return originalOpen.apply(this, args);
  } as typeof originalOpen;
}

// SSR 단계에서는 import만 되고 실행 X (window 가드)
// 중복 초기화 방지 (HMR / 모듈 다중 로드 대응)
declare global {
  // eslint-disable-next-line no-var
  var __WATCHBOX_OTEL_INITIALIZED__: boolean | undefined;
}

if (typeof window !== 'undefined' && appEnv !== 'local' && !globalThis.__WATCHBOX_OTEL_INITIALIZED__) {
  globalThis.__WATCHBOX_OTEL_INITIALIZED__ = true;

  patchXhrOpen();

  // URL 필터링 정규식
  // - /api/* 외 모든 URL은 ignore (negative lookahead로 정확히 /api/ 포함 안 된 경로 매칭)
  // - /api/otel/* 는 자기 자신이라 별도로 제외 (무한 루프 방지)
  const NON_API_URL = /^(?!.*\/api\/).*/;
  const OTEL_PROXY_URL = /\/api\/otel\//;
  const IGNORE_URLS = [NON_API_URL, OTEL_PROXY_URL];

  const provider = new WebTracerProvider({
    resource: resourceFromAttributes({
      'service.name': 'watchbox-browser',
      'service.namespace': 'watchbox',
      'service.version': process.env.APP_VERSION ?? 'unknown',
      'deployment.environment': appEnv,
    }),
    spanProcessors: [
      new BatchSpanProcessor(
        new OTLPTraceExporter({
          // BFF 프록시 경유 — same origin이라 CORS 불필요
          url: '/api/otel/v1/traces',
        }),
      ),
    ],
  });

  provider.register({
    // 비동기 컨텍스트 전파 — Promise / setTimeout 너머로도 active span 유지
    contextManager: new ZoneContextManager(),
  });

  registerInstrumentations({
    instrumentations: [
      // axios가 브라우저에서 기본적으로 XHR을 사용하므로 별도 instrumentation 필수
      // (fetch만 잡으면 React Query → axios 호출이 trace에서 누락됨)
      new XMLHttpRequestInstrumentation({
        propagateTraceHeaderCorsUrls: [
          new RegExp(`^${window.location.origin}/api/`),
        ],
        ignoreUrls: IGNORE_URLS,
        applyCustomAttributesOnSpan: (span, xhr) => {
          try {
            const xhrAny = xhr as XMLHttpRequest & { _url?: string; _method?: string };
            const rawUrl = xhrAny.responseURL || xhrAny._url || '';
            const method = (xhrAny._method || 'GET').toUpperCase();
            if (rawUrl) {
              span.updateName(buildSpanName(method, rawUrl));
            }
          } catch {
            // 무시
          }
        },
      }),
      // native fetch — /api/* 만 trace (RSC 페이로드, static asset 등은 IGNORE_URLS로 제외)
      new FetchInstrumentation({
        propagateTraceHeaderCorsUrls: [
          new RegExp(`^${window.location.origin}/api/`),
        ],
        ignoreUrls: IGNORE_URLS,
        applyCustomAttributesOnSpan: (span, request, response) => {
          try {
            let url = '';
            let method = 'GET';

            if (response instanceof Response && response.url) {
              url = response.url;
            } else if (request instanceof Request) {
              url = request.url;
              method = request.method;
            }

            if (!(request instanceof Request) && request && typeof request === 'object') {
              method = (request as { method?: string }).method ?? method;
            }

            if (url) {
              span.updateName(buildSpanName(method, url));
            }
          } catch {
            // 이름 변경 실패해도 trace 자체는 영향 X
          }
        },
      }),
    ],
  });
}

export {};
