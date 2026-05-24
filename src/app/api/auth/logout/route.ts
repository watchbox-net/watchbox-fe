import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * 로그아웃 API Route (BFF 패턴)
 *
 * 1. 백엔드 DELETE /auth/logout 호출 (리프레시토큰 무효화)
 * 2. HttpOnly Cookie에서 토큰 삭제
 */
export async function POST(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  // 백엔드 로그아웃 호출 (실패해도 프론트 쿠키는 삭제)
  try {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' };
    if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

    await fetch(`${BACKEND_API_URL}/auth/logout`, {
      method: 'DELETE',
      headers,
    });
  } catch {
    // 백엔드 호출 실패해도 프론트 쿠키는 삭제 진행
  }

  const response = NextResponse.json({ success: true });

  response.cookies.set('accessToken', '', { ...TOKEN_COOKIE_OPTIONS, maxAge: 0 });
  response.cookies.set('refreshToken', '', { ...TOKEN_COOKIE_OPTIONS, maxAge: 0 });

  return response;
}
