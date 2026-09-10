import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';
import { logger } from '@/lib/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

// ─── 리프레시토큰으로 액세스/리프레시 토큰 재발급(회전) ──────────────
// 백엔드가 회전(rotation)으로 새 refreshToken도 함께 내려주므로 둘 다 받아 반환한다.
async function refreshTokens(
  refreshToken: string,
): Promise<{ accessToken: string; refreshToken: string } | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    // 201 Created 반환
    if (!res.ok) return null;

    const { data } = await res.json();
    if (!data?.accessToken) return null;
    // 구버전 백엔드(refreshToken 미반환) 대비: 없으면 기존 값 유지
    return { accessToken: data.accessToken, refreshToken: data.refreshToken ?? refreshToken };
  } catch {
    return null;
  }
}

// ─── BFF 프록시 핵심 로직 ─────────────────────────────────────
async function proxyRequest(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const pathStr = path.join('/');

  // 리프레시 엔드포인트 자체는 갱신 로직 생략 (무한루프 방지)
  const isRefreshEndpoint = pathStr === 'auth/refresh';

  // 쿼리스트링 유지
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const backendUrl = `${BACKEND_API_URL}/${pathStr}${queryString ? `?${queryString}` : ''}`;

  // body는 스트림이라 한 번만 읽을 수 있으므로 미리 저장
  let body: string | null = null;
  if (!['GET', 'HEAD'].includes(request.method)) {
    try {
      body = await request.text();
    } catch {
      body = null;
    }
  }

  // 첫 번째 요청
  const accessToken = request.cookies.get('accessToken')?.value;
  const headers: Record<string, string> = { 'Content-Type': 'application/json' };
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  // traceparent는 @vercel/otel의 fetch 계측이 주입한다 (instrumentation.ts의 propagateContextUrls).
  // 여기서 propagation.inject를 직접 하면 아직 fetch CLIENT span이 없어 라우트 핸들러 span이
  // 부모로 박히고, 그러면 Tempo가 next→spring 서비스 그래프 엣지를 만들지 못한다.

  let backendRes = await fetch(backendUrl, { method: request.method, headers, body });

  // ── 401 처리: 리프레시 시도 후 재요청 ────────────────────────
  if (backendRes.status === 401 && !isRefreshEndpoint) {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      const refreshed = await refreshTokens(refreshToken);

      if (refreshed) {
        logger.info(
          { method: request.method, path: pathStr },
          `${request.method} /${pathStr} access token refreshed`,
        );

        // 새 토큰으로 재요청
        headers['Authorization'] = `Bearer ${refreshed.accessToken}`;
        backendRes = await fetch(backendUrl, { method: request.method, headers, body });

        // 재요청 성공 → 회전된 access/refresh 토큰을 모두 쿠키에 세팅 후 응답 반환
        // (refreshToken을 갱신하지 않으면 다음 회전 때 폐기된 토큰을 보내 강제 로그아웃됨)
        const retryData = await backendRes.text();
        const response = new NextResponse(retryData, {
          status: backendRes.status,
          headers: {
            'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
          },
        });
        response.cookies.set('accessToken', refreshed.accessToken, TOKEN_COOKIE_OPTIONS);
        response.cookies.set('refreshToken', refreshed.refreshToken, TOKEN_COOKIE_OPTIONS);
        return response;
      }
    }

    // 리프레시 실패(만료 등) → 쿠키 삭제 후, 토큰 없이 익명으로 재요청하여 그 결과를 그대로 반환
    // - 공개 가능 엔드포인트(예: 콘텐츠 상세): 공개 콘텐츠 200 응답 → 계속 열람 가능(개인화만 빠짐)
    // - 인증 필수 엔드포인트: 백엔드가 401 → 클라이언트 privateApi 인터셉터가 /login 처리
    logger.warn(
      { method: request.method, path: pathStr },
      `${request.method} /${pathStr} session expired, falling back to anonymous request`,
    );
    delete headers['Authorization'];
    const anonRes = await fetch(backendUrl, { method: request.method, headers, body });

    const anonData = await anonRes.text();
    const response = new NextResponse(anonData, {
      status: anonRes.status,
      headers: {
        'Content-Type': anonRes.headers.get('Content-Type') || 'application/json',
      },
    });
    // 만료된 세션 정리(폐기된 토큰 잔류 방지)
    response.cookies.delete('accessToken');
    response.cookies.delete('refreshToken');
    return response;
  }

  // ── 정상 응답 반환 ────────────────────────────────────────────
  const responseData = await backendRes.text();
  return new NextResponse(responseData, {
    status: backendRes.status,
    headers: {
      'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
    },
  });
}

// ─── fetch 실패 (백엔드 다운 등) 래퍼 ───────────────────────
async function handleProxyRequest(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> },
) {
  const start = Date.now();
  try {
    const response = await proxyRequest(request, context);
    const { path } = await context.params;
    const pathStr = path.join('/');
    const duration = Date.now() - start;
    logger.info(
      { method: request.method, path: pathStr, status: response.status, duration },
      `${request.method} /${pathStr} ${response.status} (${duration}ms)`,
    );
    return response;
  } catch (error) {
    const { path } = await context.params;
    const pathStr = path.join('/');
    logger.error(
      { method: request.method, path: pathStr, duration: Date.now() - start, err: error },
      `${request.method} /${pathStr} failed`,
    );
    return NextResponse.json(
      { success: false, message: '백엔드 서버에 연결할 수 없습니다.' },
      { status: 502 },
    );
  }
}

export const GET = handleProxyRequest;
export const POST = handleProxyRequest;
export const PATCH = handleProxyRequest;
export const PUT = handleProxyRequest;
export const DELETE = handleProxyRequest;
