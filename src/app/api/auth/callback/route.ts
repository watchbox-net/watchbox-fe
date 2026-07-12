import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';
import { logger } from '@/lib/logger';

/**
 * OAuth 콜백 API Route (BFF 패턴)
 *
 * 두 경로를 처리한다:
 *
 * 1) 일반(운영·개발 웹): Spring Boot OAuth2SuccessHandler가 토큰을 HttpOnly 쿠키
 *    (Domain=.watch-box.net)로 직접 심고 이 경로로 리다이렉트한다. 여기서는 홈으로만 이동.
 *
 * 2) 하이브리드(로컬 웹 ↔ 개발 서버): localhost는 dev-api의 Set-Cookie를 받을 수 없으므로,
 *    백엔드가 토큰 대신 1회용 oneTimeCode(?oneTimeCode=)만 넘긴다. Google 자체 authorization
 *    code와 구분하기 위해 "code"가 아닌 "oneTimeCode"로 명명. 이 Route가 oneTimeCode를
 *    /oauth2/local/exchange로 교환해 토큰을 받아, localhost 도메인 쿠키를 직접 심는다.
 */

const FRONTEND_URL = process.env.FRONTEND_URL;
const BACKEND_URL = process.env.BACKEND_URL;

export async function GET(request: NextRequest) {
  const oneTimeCode = request.nextUrl.searchParams.get('oneTimeCode');
  const response = NextResponse.redirect(new URL('/', FRONTEND_URL));

  // 일반 경로: oneTimeCode 없음 → 쿠키는 이미 백엔드가 심었으므로 홈 이동만
  if (!oneTimeCode) {
    return response;
  }

  // 하이브리드 경로: oneTimeCode → 토큰 교환 후 localhost 쿠키 심기
  try {
    const res = await fetch(`${BACKEND_URL}/oauth2/local/exchange`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ oneTimeCode }),
    });

    if (res.ok) {
      const { data } = await res.json();
      response.cookies.set('accessToken', data.accessToken, TOKEN_COOKIE_OPTIONS);
      response.cookies.set('refreshToken', data.refreshToken, TOKEN_COOKIE_OPTIONS);
    } else {
      logger.warn({ status: res.status }, 'oauth callback: oneTimeCode exchange failed');
    }
  } catch (error) {
    logger.error({ err: error }, 'oauth callback: oneTimeCode exchange error');
  }

  return response;
}
