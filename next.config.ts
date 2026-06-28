import type { NextConfig } from "next";
import pkg from './package.json' with { type: 'json' };

const nextConfig: NextConfig = {
    output: 'standalone',
    typescript: {
        ignoreBuildErrors: true,
    },
    // 빌드 정적 생성 워커 수 제한
    // → t4g.medium(2 vCPU/4GB)에 prod 스택 전체가 상주한 상태로 온박스 빌드되므로
    //   워커를 1개로 묶어 빌드 중 CPU·메모리 경합으로 BE/MySQL이 OOM·헬스체크 실패하는 것을 방지
    experimental: {
        cpus: 1,
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
