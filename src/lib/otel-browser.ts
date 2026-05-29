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

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { XMLHttpRequestInstrumentation } from '@opentelemetry/instrumentation-xml-http-request';

const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

// SSR 단계에서는 import만 되고 실행 X (window 가드)
// 중복 초기화 방지 (HMR / 모듈 다중 로드 대응)
declare global {
  // eslint-disable-next-line no-var
  var __WATCHBOX_OTEL_INITIALIZED__: boolean | undefined;
}

if (typeof window !== 'undefined' && appEnv !== 'local' && !globalThis.__WATCHBOX_OTEL_INITIALIZED__) {
  globalThis.__WATCHBOX_OTEL_INITIALIZED__ = true;

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
            const method = xhrAny._method || 'GET';
            if (rawUrl) {
              const path = new URL(rawUrl, window.location.origin).pathname;
              span.updateName(`${method} ${path}`);
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
              const path = new URL(url, window.location.origin).pathname;
              span.updateName(`${method} ${path}`);
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
