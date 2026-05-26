// Next.js 서버 부트 훅 — 라우트 로드 전에 단 한 번 실행
// 1. OTel SDK 등록 (trace 자동 수집 — Server Component / Route Handler / fetch)
// 2. 시작 로그 기록
export async function register() {
  // Edge Runtime(미들웨어)은 제외, Node.js 서버 프로세스에서만 실행
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

  // local : trace 비활성 (개발 PC에서 OTel Collector 띄울 필요 없음)
  // dev/prod : OTLP HTTP로 OTel Collector에 trace 전송 → Tempo
  //   - fetch auto-instrumentation 포함 → BFF의 backend fetch가 traceparent 자동 전파
  //   - 백엔드(Spring Boot)와 동일한 W3C propagator → trace 자동 연결
  if (appEnv !== 'local') {
    const { registerOTel } = await import('@vercel/otel');
    registerOTel({
      serviceName: 'watchbox-next',
      attributes: {
        'service.version': process.env.APP_VERSION ?? 'unknown',
        'service.namespace': 'watchbox',
        'deployment.environment': appEnv,
      },
      // OTEL_EXPORTER_OTLP_ENDPOINT 환경변수 자동 사용 (ex. http://otel-collector:4318)
      // → /v1/traces 로 OTLP/HTTP 전송
    });
  }

  const { logger } = await import('@/lib/logger');
  logger.info(
    { version: process.env.APP_VERSION, env: appEnv },
    'watchbox-next server started',
  );
}
