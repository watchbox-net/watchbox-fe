// 브라우저(클라이언트 컴포넌트)용 OpenTelemetry 부트스트랩
// ──────────────────────────────────────────────────────────────────
// 동작 방식:
// 1. 클라이언트 컴포넌트가 처음 import할 때 모듈 최상위 코드가 1회 실행 → SDK 초기화
// 2. WebTracerProvider 등록 → 이후 모든 fetch / document load에 trace span 자동 생성
// 3. 같은 origin의 /api/* fetch에 traceparent 헤더 자동 첨부
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

import { WebTracerProvider } from '@opentelemetry/sdk-trace-web';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { resourceFromAttributes } from '@opentelemetry/resources';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ZoneContextManager } from '@opentelemetry/context-zone';
import { registerInstrumentations } from '@opentelemetry/instrumentation';
import { FetchInstrumentation } from '@opentelemetry/instrumentation-fetch';
import { DocumentLoadInstrumentation } from '@opentelemetry/instrumentation-document-load';

const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

// SSR 단계에서는 import만 되고 실행 X (window 가드)
// 중복 초기화 방지 (HMR / 모듈 다중 로드 대응)
declare global {
  // eslint-disable-next-line no-var
  var __WATCHBOX_OTEL_INITIALIZED__: boolean | undefined;
}

if (typeof window !== 'undefined' && appEnv !== 'local' && !globalThis.__WATCHBOX_OTEL_INITIALIZED__) {
  globalThis.__WATCHBOX_OTEL_INITIALIZED__ = true;

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
      // 첫 페이지 로드의 navigation timing, resource timing → 페이지 로드 성능 측정
      new DocumentLoadInstrumentation(),
      // 모든 fetch 자동 trace span 생성 + traceparent 헤더 자동 첨부
      new FetchInstrumentation({
        // 같은 origin의 /api/* 만 trace context 전파
        // (TMDB 이미지 등 외부 호출에 우리 trace_id 누출 방지)
        propagateTraceHeaderCorsUrls: [
          new RegExp(`^${window.location.origin}/api/`),
        ],
        // OTel 자체 송신 fetch는 trace 안 함 (무한 루프 방지)
        ignoreUrls: [/\/api\/otel\//],
      }),
    ],
  });
}

export {};
