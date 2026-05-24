import { NextRequest, NextResponse } from 'next/server';
import { TOKEN_COOKIE_OPTIONS } from '@/lib/utils/cookie';

const BACKEND_DEV_URL = process.env.BACKEND_DEV_URL;

export async function POST(request: NextRequest) {
  try {
    const { apiKey } = await request.json();

    const response = await fetch(`${BACKEND_DEV_URL}/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey }),
    });

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: '인증 실패: API Key가 올바르지 않습니다.' },
        { status: 401 }
      );
    }

    const res = NextResponse.json({ success: true });

    res.cookies.set('dev-auth', 'true', {
      ...TOKEN_COOKIE_OPTIONS,
      maxAge: 60 * 60 * 24, // dev-auth는 1일
    });

    return res;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '인증 중 오류 발생' },
      { status: 500 }
    );
  }
}
