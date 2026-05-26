export async function register() {
  // Edge Runtime(미들웨어)은 제외, Node.js 서버 프로세스에서만 실행
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;

  const { logger } = await import('@/lib/logger');
  logger.info(
    { version: process.env.APP_VERSION, env: process.env.NEXT_PUBLIC_ENV ?? 'local' },
    'watchbox-next server started',
  );
}
