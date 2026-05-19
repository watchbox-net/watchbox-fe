import type { NextConfig } from "next";
import pkg from './package.json' with { type: 'json' };

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
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
