import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
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
