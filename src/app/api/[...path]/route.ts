import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';
import { logger } from '@/lib/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

// ─── 리프레시토큰으로 액세스토큰 재발급 ──────────────────────
async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    // 201 Created 반환
    if (!res.ok) return null;

    const data = await res.json();
    return data.accessToken ?? null;
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

  let backendRes = await fetch(backendUrl, { method: request.method, headers, body });

  // ── 401 처리: 리프레시 시도 후 재요청 ────────────────────────
  if (backendRes.status === 401 && !isRefreshEndpoint) {
    const refreshToken = request.cookies.get('refreshToken')?.value;

    if (refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);

      if (newAccessToken) {
        logger.info({ method: request.method, path: pathStr }, 'access token refreshed');

        // 새 토큰으로 재요청
        headers['Authorization'] = `Bearer ${newAccessToken}`;
        backendRes = await fetch(backendUrl, { method: request.method, headers, body });

        // 재요청 성공 → 새 accessToken 쿠키 세팅 후 응답 반환
        const retryData = await backendRes.text();
        const response = new NextResponse(retryData, {
          status: backendRes.status,
          headers: {
            'Content-Type': backendRes.headers.get('Content-Type') || 'application/json',
          },
        });
        response.cookies.set('accessToken', newAccessToken, TOKEN_COOKIE_OPTIONS);
        return response;
      }
    }

    // 리프레시 실패 (refreshToken 없거나 만료) → 쿠키 삭제 후 401 반환
    // 클라이언트 인터셉터가 /login으로 리다이렉트
    logger.warn({ method: request.method, path: pathStr }, 'session expired, token refresh failed');
    const unauthorizedRes = NextResponse.json(
      { message: '인증이 만료되었습니다. 다시 로그인해주세요.' },
      { status: 401 },
    );
    unauthorizedRes.cookies.delete('accessToken');
    unauthorizedRes.cookies.delete('refreshToken');
    return unauthorizedRes;
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
    const duration = Date.now() - start;
    logger.info(
      { method: request.method, path: path.join('/'), status: response.status, duration },
      'BFF proxy',
    );
    return response;
  } catch (error) {
    const { path } = await context.params;
    logger.error(
      { method: request.method, path: path.join('/'), duration: Date.now() - start, err: error },
      'BFF proxy request failed',
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
