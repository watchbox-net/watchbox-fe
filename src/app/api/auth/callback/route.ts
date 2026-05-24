import { NextRequest, NextResponse } from 'next/server';

/**
 * OAuth 콜백 API Route (BFF 패턴)
 *
 * Spring Boot OAuth2SuccessHandler가 리다이렉트:
 *   http://localhost:3000/api/auth/callback?access_token=...&refresh_token=...
 *
 * 이 Route에서:
 * 1. 쿼리 파라미터에서 토큰 추출
 * 2. HttpOnly Cookie에 저장
 * 3. 프론트엔드 페이지로 리다이렉트
 */

const FRONTEND_URL = process.env.FRONTEND_URL;
const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY);

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    // 토큰이 없으면 로그인 페이지로 리다이렉트
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }

  // 홈으로 리다이렉트하면서 HttpOnly Cookie에 토큰 저장
  const response = NextResponse.redirect(new URL('/', FRONTEND_URL));

  response.cookies.set('accessToken', accessToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRY,
  });

  response.cookies.set('refreshToken', refreshToken, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: REFRESH_TOKEN_EXPIRY,
  });

  return response;
}
