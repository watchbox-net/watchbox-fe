import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

/**
 * 서버 컴포넌트용 인증 fetch 유틸
 *
 * 1. accessToken 있으면 붙여서 요청 → 성공 시 인증 응답
 * 2. accessToken 만료(401)거나 없으면 → 비로그인 fallback 요청
 *
 * 주의: 여기서는 refresh를 하지 않는다.
 * 서버 컴포넌트 렌더 단계는 응답 쿠키를 set할 수 없어, 회전된 refreshToken을
 * 영속화하지 못한다. SSR에서 회전을 일으키면 폐기된 토큰이 쿠키에 남아 강제 로그아웃으로 이어진다.
 * 토큰 갱신은 쿠키 저장이 가능한 BFF 라우트(/api/auth/me, /api/[...path])가 담당한다.
 * (클라이언트 하이드레이션 직후 AuthContext.checkAuth가 /api/auth/me로 갱신)
 */

export interface ServerTokens {
  accessToken?: string;
  refreshToken?: string;
}

/** cookies()에서 토큰 읽기 */
export async function getServerTokens(): Promise<ServerTokens> {
  const cookieStore = await cookies();
  return {
    accessToken: cookieStore.get('accessToken')?.value,
    refreshToken: cookieStore.get('refreshToken')?.value,
  };
}

/** 서버 컴포넌트용 인증 fetch — accessToken 유효하면 인증 요청, 만료/없으면 비로그인 fallback */
export async function serverFetch(
  url: string,
  tokens: ServerTokens,
): Promise<{ response: Response; authenticated: boolean }> {
  const { accessToken } = tokens;

  // 1. accessToken 있으면 붙여서 요청
  //    traceparent는 @vercel/otel의 fetch 계측이 주입한다 (instrumentation.ts의 propagateContextUrls).
  //    직접 inject하면 fetch CLIENT span이 아직 없어 부모가 어긋난다.
  if (accessToken) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 만료(401)가 아니면 인증 응답으로 반환
    if (response.status !== 401) {
      return { response, authenticated: true };
    }
    // 401(만료) → SSR에서는 refresh하지 않고 비로그인 fallback (사유는 파일 상단 주석)
  }

  // 2. 토큰 없거나 만료 → 비로그인 요청
  logger.warn({ url }, 'server-fetch: falling back to unauthenticated request');
  const response = await fetch(url);
  return { response, authenticated: false };
}
