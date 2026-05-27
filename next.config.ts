import type { NextConfig } from "next";
import pkg from './package.json' with { type: 'json' };

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    // pino : native 바인딩
    // @opentelemetry/* + @vercel/otel : SDK가 module-level patching (global fetch, http) 수행
    //   → bundling 시 패치 대상과 분리돼 instrumentation 미작동
    serverExternalPackages: [
        'pino',
        '@vercel/otel',
        '@opentelemetry/api',
        '@opentelemetry/sdk-trace-node',
        '@opentelemetry/resources',
        '@opentelemetry/exporter-trace-otlp-http',
    ],
    // standalone 빌드에서 instrumentation.ts의 동적 의존성을 file tracer가 놓치므로 강제 포함
    // (현상: /app/node_modules/@vercel/ 폴더 자체가 누락 → registerOTel import 실패)
    outputFileTracingIncludes: {
        '/instrumentation': [
            './node_modules/@vercel/**/*',
            './node_modules/@opentelemetry/**/*',
        ],
        '*': [
            './node_modules/@vercel/**/*',
            './node_modules/@opentelemetry/**/*',
        ],
    },
    // package.json의 version을 빌드 타임에 클라이언트로 인라인 주입
    // → 사용처: process.env.APP_VERSION (클라이언트/서버 모두 접근 가능)
    env: {
        APP_VERSION: pkg.version,
    },
    images: {
        // TMDB CDN이 이미 사이즈별로 최적화된 이미지를 제공하므로
        // Next.js Image Optimization을 우회 (서버 메모리/지연 비용 절감)
        unoptimized: true,
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'image.tmdb.org',
                pathname: '/t/p/**',
            },
        ],
    },
};

export default nextConfig;
