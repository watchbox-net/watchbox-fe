import { NextRequest, NextResponse } from 'next/server';

/**
 * 브라우저 → OTel Collector OTLP 프록시
 *
 * 브라우저는 외부 host의 OTel Collector(:4318)에 직접 못 보냄 (CORS / 포트 미노출).
 * 이 라우트가 same-origin으로 받은 OTLP body를 그대로 Collector에 forward.
 *
 * 주의: 이 라우트 자체의 trace는 무한 루프 방지를 위해 비활성화하는 게 이상적이나,
 *      Next.js의 @vercel/otel은 path 기반 ignore가 까다로워 일단 그대로 둠.
 *      대신 브라우저 FetchInstrumentation에서 `/api/otel/`을 ignoreUrls로 제외함.
 *
 * 폴더명 주의: `_otel` 처럼 underscore로 시작하면 Next.js의 private folder 컨벤션에 걸려
 *            라우팅에서 자동 제외됨 → /api/[...path] catch-all로 떨어져 백엔드까지 잘못 전달,
 *            그 결과 401 응답으로 사용자 쿠키까지 삭제되는 사고 발생.
 *            반드시 underscore 없는 이름 사용할 것.
 */
const OTEL_COLLECTOR_URL =
  (process.env.OTEL_EXPORTER_OTLP_ENDPOINT ?? 'http://localhost:4318') + '/v1/traces';

export async function POST(request: NextRequest) {
  try {
    // OTLP/HTTP body는 JSON 또는 protobuf 바이너리 (브라우저 exporter 기본은 JSON)
    const body = await request.arrayBuffer();
    const contentType = request.headers.get('content-type') ?? 'application/json';

    const res = await fetch(OTEL_COLLECTOR_URL, {
      method: 'POST',
      headers: { 'Content-Type': contentType },
      body,
    });

    // Collector 응답 그대로 (성공시 200, empty body)
    return new NextResponse(null, { status: res.status });
  } catch {
    // 텔레메트리 실패가 앱 동작에 영향 주면 안 됨 — 조용히 무시
    return new NextResponse(null, { status: 204 });
  }
}
