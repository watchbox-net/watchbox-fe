const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY);
const isProduction = process.env.NODE_ENV === 'production';

/** 토큰 쿠키 공통 옵션 — HTTPS(배포) 환경에서 secure: true 자동 적용 */
export const TOKEN_COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  maxAge: REFRESH_TOKEN_EXPIRY,
  secure: isProduction,
};
