import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;
const REFRESH_TOKEN_EXPIRY = Number(process.env.REFRESH_TOKEN_EXPIRY);

/**
 * 로그인 상태 확인 API Route (BFF 패턴)
 *
 * HttpOnly Cookie에서 accessToken을 읽어 백엔드에 회원 정보 요청
 * 브라우저는 토큰에 직접 접근할 수 없고, 이 Route를 통해 로그인 여부만 확인
 * accessToken 만료 시 refreshToken으로 갱신 후 재시도
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
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;
  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // 백엔드에 토큰 유효성 확인 (마이 페이지 조회)
    let response = await fetch(`${BACKEND_API_URL}/members/mypage`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    // 401 → refreshToken으로 accessToken 갱신 후 재시도
    if (response.status === 401 && refreshToken) {
      const newAccessToken = await refreshAccessToken(refreshToken);
      if (newAccessToken) {
        response = await fetch(`${BACKEND_API_URL}/members/mypage`, {
          headers: { Authorization: `Bearer ${newAccessToken}` },
        });

        if (response.ok) {
          const result = await response.json();
          const profile = result.data?.profile ?? result.profile;
          const res = NextResponse.json({ authenticated: true, member: profile });
          res.cookies.set('accessToken', newAccessToken, {
            httpOnly: true,
            sameSite: 'lax',
            path: '/',
            maxAge: REFRESH_TOKEN_EXPIRY,
          });
          return res;
        }
      }
    }

    if (!response.ok) {
      return NextResponse.json({ authenticated: false }, { status: 401 });
    }

    const result = await response.json();
    const profile = result.data?.profile ?? result.profile;
    return NextResponse.json({ authenticated: true, member: profile });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }
}
