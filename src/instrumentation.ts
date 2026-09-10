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
  //   - propagateContextUrls로 백엔드 호출에 traceparent 전파 (아래 주석)
  if (appEnv !== 'local') {
    // @vercel/otel의 fetch 계측은 기본적으로 Vercel 배포 URL(VERCEL_URL)과 http://localhost
    // 으로 나가는 요청에만 trace context를 전파한다. 자체 호스팅이라 VERCEL_URL이 없고
    // 백엔드도 http://watchbox-be:8080 이라 어느 쪽에도 안 걸려 전파가 통째로 빠져 있었다.
    //
    // 백엔드 URL을 명시해서 켠다. 계측은 fetch CLIENT span을 active로 만든 뒤 inject하므로
    // 백엔드 서버 span의 부모가 CLIENT span으로 잡힌다 — Tempo service graph가
    // watchbox-next → watchbox-spring 엣지를 만들려면 이 부모 관계가 필요하다.
    // (직접 propagation.inject를 하면 그 시점 active span이 라우트 핸들러 span이라 어긋난다)
    const backendApiUrl = process.env.BACKEND_API_URL;
    if (!backendApiUrl) {
      console.error('[instrumentation] BACKEND_API_URL 미설정 — 백엔드로 trace context 전파 안 됨');
    }

    try {
      registerOTel({
        serviceName: 'watchbox-next',
        attributes: {
          'service.version': process.env.APP_VERSION ?? 'unknown',
          'service.namespace': 'watchbox',
          'deployment.environment': appEnv,
        },
        instrumentationConfig: {
          fetch: {
            // 문자열은 prefix 매칭 — 빈 문자열은 모든 URL에 걸리므로 미설정 시엔 넣지 않는다
            propagateContextUrls: backendApiUrl ? [backendApiUrl] : [],
          },
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
