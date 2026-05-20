import { NextResponse } from 'next/server';

// 빌드 시점 정적 생성 방지 — 매 요청마다 실행되도록 강제
// (Docker healthcheck/오케스트레이션이 항상 라이브 응답을 받게 함)
export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json({
    success: true,
    status: 'ok',
    timestamp: new Date().toISOString(),
  });
}
