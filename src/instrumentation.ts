// Next.js 서버 부트 훅 — 라우트 로드 전에 단 한 번 실행
// 1. OTel SDK 등록 (trace 자동 수집 — Server Component / Route Handler / fetch)
// 2. 시작 로그 기록
//
// 주의: import는 top-level (정적)으로 유지 — Next.js file tracer가 standalone 빌드에
//      포함시키려면 dynamic import는 추적 못 하는 케이스가 있음.
//      registerOTel 호출만 조건부로 분기.
import { registerOTel } from '@vercel/otel';

export async function register() {
  // Edge Runtime(미들웨어)은 제외, Node.js 서버 프로세스에서만 실행
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

  // 부트 디버깅 — silent throw 추적용 (Edge runtime 호환 위해 console.error 사용)
  console.error(`[instrumentation] register() entered, appEnv=${appEnv}`);

  // local : trace 비활성 (개발 PC에서 OTel Collector 띄울 필요 없음)
  // dev/prod : OTLP HTTP로 OTel Collector에 trace 전송 → Tempo
  //   - OTEL_EXPORTER_OTLP_ENDPOINT env로 endpoint 자동 사용 (/v1/traces)
  //   - fetch auto-instrumentation 포함 → BFF의 backend fetch가 traceparent 자동 전파
  if (appEnv !== 'local') {
    try {
      registerOTel({
        serviceName: 'watchbox-next',
        attributes: {
          'service.version': process.env.APP_VERSION ?? 'unknown',
          'service.namespace': 'watchbox',
          'deployment.environment': appEnv,
        },
      });
      console.error(`[instrumentation] OTel SDK registered`);
    } catch (err) {
      console.error(`[instrumentation] OTel SDK FAILED: ${err instanceof Error ? err.stack : String(err)}`);
    }
  }

  try {
    const { logger } = await import('@/lib/logger');
    logger.info(
      { version: process.env.APP_VERSION, env: appEnv },
      'watchbox-next server started',
    );
  } catch (err) {
    console.error(`[instrumentation] logger import FAILED: ${err instanceof Error ? err.stack : String(err)}`);
  }
}
