import { cookies } from 'next/headers';
import { logger } from '@/lib/logger';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * 서버 컴포넌트용 인증 fetch 유틸
 *
 * 1. accessToken 있으면 붙여서 요청
 * 2. 401 → refreshToken으로 accessToken 재발급 → 새 토큰으로 재요청
 * 3. 리프레시 실패 → 토큰 없이 재요청 (비로그인 fallback)
 * 4. 토큰 없으면 바로 비로그인 요청
 */

async function refreshAccessToken(refreshToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BACKEND_API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.accessToken ?? null;
  } catch (err) {
    logger.error({ err }, 'server-fetch: token refresh request failed');
    return null;
  }
}

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

/** 서버 컴포넌트용 인증 fetch — 401 시 리프레시 후 재시도, 실패 시 비로그인 fallback */
export async function serverFetch(
  url: string,
  tokens: ServerTokens,
): Promise<{ response: Response; authenticated: boolean }> {
  const { accessToken, refreshToken } = tokens;

  // 1. accessToken 있으면 붙여서 요청
  if (accessToken) {
    const response = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    if (response.status !== 401) {
      return { response, authenticated: true };
    }

    // 2. 401 → refreshToken으로 재발급 시도
    if (refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);

      if (newAccessToken) {
        const retryResponse = await fetch(url, {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });
        return { response: retryResponse, authenticated: true };
      }
    }
  }

  // 3. 토큰 없거나 리프레시 실패 → 비로그인 요청
  logger.warn({ url }, 'server-fetch: falling back to unauthenticated request');
  const response = await fetch(url);
  return { response, authenticated: false };
}
