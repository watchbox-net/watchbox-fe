import { NextRequest, NextResponse } from 'next/server';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * 로그인 상태 확인 API Route (BFF 패턴)
 *
 * HttpOnly Cookie에서 accessToken을 읽어 백엔드에 회원 정보 요청
 * 브라우저는 토큰에 직접 접근할 수 없고, 이 Route를 통해 로그인 여부만 확인
 */
export async function GET(request: NextRequest) {
  const accessToken = request.cookies.get('accessToken')?.value;

  if (!accessToken) {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }

  try {
    // 백엔드에 토큰 유효성 확인 (마이 페이지 조회)
    const response = await fetch(`${BACKEND_API_URL}/members/mypage`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

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
