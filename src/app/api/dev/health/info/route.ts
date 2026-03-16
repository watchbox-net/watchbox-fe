import { NextResponse } from 'next/server';

const SERVER_URL = process.env.BACKEND_URL;

export async function GET() {
  try {
    const startTime = Date.now();

    const response = await fetch(`${SERVER_URL}/health/info`, {
      method: 'GET',
    });

    const responseTime = Date.now() - startTime;

    if (!response.ok) {
      return NextResponse.json(
        { success: false, message: `Server Info 조회 실패: ${response.status}` },
        { status: response.status }
      );
    }

    const data = await response.text();
    return NextResponse.json({
      success: true,
      message: 'Server Info 조회 성공',
      serverInfo: data,
      responseTime: `${responseTime}ms`,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: 'Server Info 조회 중 오류 발생' },
      { status: 502 }
    );
  }
}
