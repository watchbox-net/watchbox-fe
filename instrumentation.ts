// Next.js 서버 부트 훅 — 라우트 로드 전에 단 한 번 실행
// 1. OTel SDK 등록 (trace 자동 수집 — Server Component / Route Handler / fetch)
// 2. 시작 로그 기록
export async function register() {
  // Edge Runtime(미들웨어)은 제외, Node.js 서버 프로세스에서만 실행
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';

  // 부트 디버깅 — logger 도달 전 silent throw 추적용 (stderr 직접 출력)
  process.stderr.write(`[instrumentation] register() entered, appEnv=${appEnv}\n`);

  // local : trace 비활성 (개발 PC에서 OTel Collector 띄울 필요 없음)
  // dev/prod : OTLP HTTP로 OTel Collector에 trace 전송 → Tempo
  if (appEnv !== 'local') {
    try {
      const { registerOTel } = await import('@vercel/otel');
      registerOTel({
        serviceName: 'watchbox-next',
        attributes: {
          'service.version': process.env.APP_VERSION ?? 'unknown',
          'service.namespace': 'watchbox',
          'deployment.environment': appEnv,
        },
      });
      process.stderr.write(`[instrumentation] OTel SDK registered\n`);
    } catch (err) {
      process.stderr.write(`[instrumentation] OTel SDK FAILED: ${err instanceof Error ? err.stack : String(err)}\n`);
    }
  }

  try {
    const { logger } = await import('@/lib/logger');
    logger.info(
      { version: process.env.APP_VERSION, env: appEnv },
      'watchbox-next server started',
    );
  } catch (err) {
    process.stderr.write(`[instrumentation] logger import FAILED: ${err instanceof Error ? err.stack : String(err)}\n`);
  }
}
