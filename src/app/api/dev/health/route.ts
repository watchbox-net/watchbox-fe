import { NextResponse } from 'next/server';

const SERVER_URL = process.env.BACKEND_URL;

export async function GET() {
  try {
    const startTime = Date.now();

    const response = await fetch(`${SERVER_URL}/health`, {
      method: 'GET',
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `헬스체크 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();
    return NextResponse.json({
      success: true,
      message: 'Next.js API Route → Spring Boot 연결 성공',
      backendMessage: data,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
      backendUrl: SERVER_URL,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: '헬스체크 중 오류 발생' },
      { status: 502 }
    );
  }
}
