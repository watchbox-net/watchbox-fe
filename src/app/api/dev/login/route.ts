import { NextRequest, NextResponse } from 'next/server';

const SERVER_DEV_URL = process.env.BACKEND_DEV_URL;

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json();

    const response = await fetch(`${SERVER_DEV_URL}/login/${accountId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `로그인 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 토큰은 HttpOnly Cookie에만 저장 (응답 body에 노출하지 않음)
    const res = NextResponse.json({
      success: true,
      data: {
        memberId: data.memberId,
      },
    });

    // accessToken 쿠키
    res.cookies.set('accessToken', data.accessToken, {
      httpOnly: true,
      // secure: process..env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 20, // 20시간 (백엔드 ACCESS_TOKEN_DURATION과 동일)
    });

    // refreshToken 쿠키
    res.cookies.set('refreshToken', data.refreshToken, {
      httpOnly: true,
      // secure: process..env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7일
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '로그인 중 오류 발생' },
      { status: 500 }
    );
  }
}
/*
secure: process..env.NODE_ENV === 'production'
→ 배포 환경에서만 secure: true (HTTPS 필수)
→ 로컬에서는 secure: false (HTTP 허용)
 */