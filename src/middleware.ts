import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // /dev 경로가 아니면 통과
  if (!pathname.startsWith('/dev')) {
    return NextResponse.next();
  }

  // local 환경이면 통과 (NODE_ENV=development이고 NEXT_PUBLIC_ENV가 없거나 local)
  const appEnv = process.env.NEXT_PUBLIC_ENV ?? 'local';
  if (appEnv === 'local') {
    return NextResponse.next();
  }

  // /dev/login, /dev/auth는 통과 (무한 리다이렉트 방지, 인증 API)
  if (pathname === '/dev/login' || pathname === '/dev/auth') {
    return NextResponse.next();
  }

  // /api/dev/* API 라우트도 통과 (로그인 API 등)
  if (pathname.startsWith('/api/dev')) {
    return NextResponse.next();
  }

  // dev-auth 쿠키 확인
  const devAuth = request.cookies.get('dev-auth')?.value;
  if (devAuth === 'true') {
    return NextResponse.next();
  }

  // 인증 안 됐으면 /dev/login으로 리다이렉트
  return NextResponse.redirect(new URL('/dev/login', request.url));
}

export const config = {
  matcher: ['/dev/:path*', '/api/dev/:path*'],
};
