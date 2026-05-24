import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const accessToken = searchParams.get('access_token');
  const refreshToken = searchParams.get('refresh_token');

  if (!accessToken || !refreshToken) {
    return NextResponse.redirect(new URL('/login?error=missing_token', request.url));
  }

  const response = NextResponse.redirect(new URL('/', FRONTEND_URL));

  response.cookies.set('accessToken', accessToken, TOKEN_COOKIE_OPTIONS);
  response.cookies.set('refreshToken', refreshToken, TOKEN_COOKIE_OPTIONS);

  return response;
}
