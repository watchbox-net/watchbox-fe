import { NextResponse } from 'next/server';

/**
 * 로그아웃 API Route (BFF 패턴)
 *
 * HttpOnly Cookie에서 토큰 삭제
 */
export async function POST() {
  const response = NextResponse.json({ success: true });

  response.cookies.set('accessToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  response.cookies.set('refreshToken', '', {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
  });

  return response;
}
