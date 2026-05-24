import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';

const SERVER_DEV_URL = process.env.BACKEND_DEV_URL;

export async function POST(request: NextRequest) {
  try {
    const { accountId } = await request.json();

    const response = await fetch(`${SERVER_DEV_URL}/login/id/${accountId}`, {
      method: 'GET',
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `로그인 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.json();

    const res = NextResponse.json({
      success: true,
      data: {
        memberId: data.memberId,
      },
    });

    res.cookies.set('accessToken', data.accessToken, TOKEN_COOKIE_OPTIONS);
    res.cookies.set('refreshToken', data.refreshToken, TOKEN_COOKIE_OPTIONS);

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '로그인 중 오류 발생' },
      { status: 500 }
    );
  }
}