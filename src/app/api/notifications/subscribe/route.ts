import type { NextRequest } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

// SSE는 장시간 연결이라 정적 최적화/캐싱을 절대 적용하면 안 됨
export const dynamic = 'force-dynamic';

/**
 * SSE 알림 구독 전용 BFF 프록시.
 *
 * 기존 catch-all 프록시(`/api/[...path]`)는 `backendRes.text()`로 전체 응답을
 * 버퍼링하므로 스트리밍(text/event-stream)을 지원하지 못한다.
 * 이 라우트는 백엔드 응답 body(ReadableStream)를 그대로 클라이언트로 파이프한다.
 *
 * 인증: HttpOnly 쿠키의 accessToken을 Authorization 헤더로 변환.
 * 브라우저 EventSource는 same-origin이라 쿠키를 자동 전송 → 여기서 헤더로 변환.
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  if (!accessToken) {
    return new Response('Unauthorized', { status: 401 });
  }

  let backendRes: Response;
  try {
    backendRes = await fetch(`${BACKEND_API_URL}/notifications/subscribe`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'text/event-stream',
      },
      cache: 'no-store',
      // 클라이언트가 연결을 끊으면 백엔드 fetch도 중단되도록 abort signal 전달
      signal: request.signal,
    });
  } catch {
    return new Response('Upstream connection failed', { status: 502 });
  }

  if (!backendRes.ok || !backendRes.body) {
    return new Response('Failed to subscribe', { status: backendRes.status || 502 });
  }

  // 백엔드 SSE 스트림을 그대로 클라이언트로 파이프
  return new Response(backendRes.body, {
    status: 200,
    headers: {
      'Content-Type': 'text/event-stream; charset=utf-8',
      'Cache-Control': 'no-cache, no-transform',
      // nginx 등 리버스 프록시의 버퍼링 비활성화 (SSE 즉시 전달)
      'X-Accel-Buffering': 'no',
    },
  });
}
