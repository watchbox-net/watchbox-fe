import { NextRequest, NextResponse } from 'next/server';

const SERVER_DEV_URL = process.env.NEXT_PUBLIC_SERVER_DEV_URL;

export async function GET(request: NextRequest) {
  try {
    // HttpOnly Cookie에서 토큰 읽기
    const accessToken = request.cookies.get('accessToken')?.value;

    if (!accessToken) {
      return NextResponse.json(
        { success: false, message: '인증 토큰이 없습니다' },
        { status: 401 }
      );
    }

    const response = await fetch(`${SERVER_DEV_URL}/member`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `회원 조회 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '회원 조회 중 오류 발생' },
      { status: 500 }
    );
  }
}
