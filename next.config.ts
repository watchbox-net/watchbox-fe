import type { NextConfig } from "next";
import pkg from './package.json' with { type: 'json' };

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    // pino 트랜스포트는 worker thread에서 문자열로 패키지를 동적 로드하기 때문에
    // Next.js 번들러가 정적 분석으로 추적하지 못함.
    // externals로 지정해야 require()로 남아 런타임에 올바르게 resolve됨.
    serverExternalPackages: ['pino', 'pino-opentelemetry-transport'],
    // standalone 빌드 시 Next.js 파일 트레이서가 동적 문자열 transport를 추적하지 못해
    // node_modules에서 누락됨. transport와 그 의존 패키지들을 강제로 포함시킴.
    outputFileTracingIncludes: {
        '/*': [
            './node_modules/pino-opentelemetry-transport/**/*',
            './node_modules/pino-abstract-transport/**/*',
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
