import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * catch-all BFF 프록시
 * 클라이언트 → /api/xxx → 이 라우트 → http://localhost:9000/api/xxx
 */
async function proxyRequest(request: NextRequest, { params }: { params: Promise<{ path: string[] }> }) {
  const { path } = await params;
  const pathStr = path.join('/');

  // 쿼리 파라미터 유지
  const { searchParams } = new URL(request.url);
  const queryString = searchParams.toString();
  const backendUrl = `${BACKEND_API_URL}/${pathStr}${queryString ? `?${queryString}` : ''}`;

  // 전달할 헤더 구성
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Authorization 헤더 전달
  const authorization = request.headers.get('Authorization');
  if (authorization) {
    headers['Authorization'] = authorization;
  }

  // 요청 body 처리 (GET, HEAD는 body 없음)
  let body: string | null = null;
  if (!['GET', 'HEAD'].includes(request.method)) {
    try {
      body = await request.text();
    } catch {
      body = null;
    }
  }

  try {
    const backendResponse = await fetch(backendUrl, {
      method: request.method,
      headers,
      body,
    });

    const responseData = await backendResponse.text();

    return new NextResponse(responseData, {
      status: backendResponse.status,
      headers: {
        'Content-Type': backendResponse.headers.get('Content-Type') || 'application/json',
      },
    });
  } catch (error) {
    console.error(`[BFF Proxy] ${request.method} ${backendUrl} 실패:`, error);
    return NextResponse.json(
      { success: false, message: '백엔드 서버에 연결할 수 없습니다.' },
      { status: 502 },
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PATCH = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
