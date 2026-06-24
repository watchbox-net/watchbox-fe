const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY) || 604800; // 미설정 시 7일(세션쿠키 방지)
const isProduction = process.env.NODE_ENV === 'production';
// 로컬: 미설정(host-only, localhost 포트 무관 공유) / 개발·운영: .watch-box.net (FE·BE가 apex만 공유)
const COOKIE_DOMAIN = process.env.COOKIE_DOMAIN || undefined;

/**
 * 토큰 쿠키 공통 옵션.
 * - 백엔드 OAuth 콜백이 심는 쿠키와 domain/secure 스코프를 일치시켜야 동일이름 쿠키 중복을 막는다.
 * - HTTPS(배포)에서 secure: true 자동 적용.
 */
export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: REFRESH_TOKEN_EXPIRY,
  secure: isProduction,
  domain: COOKIE_DOMAIN,
};
