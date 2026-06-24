import { NextResponse } from 'next/server';

/**
 * OAuth 콜백 API Route (BFF 패턴)
 *
 * Spring Boot OAuth2SuccessHandler가 토큰을 HttpOnly 쿠키(Domain=.watch-box.net)로 직접 심고
 * 이 경로로 리다이렉트한다. 토큰은 더 이상 URL에 노출되지 않으므로 여기서는 홈으로 이동만 시킨다.
 */

const FRONTEND_URL = process.env.FRONTEND_URL;

export function GET() {
  return NextResponse.redirect(new URL('/', FRONTEND_URL));
}
