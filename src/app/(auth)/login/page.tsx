'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MobileFrame from '@/components/common/MobileFrame';

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const handleGoogleLogin = () => {
        // 브라우저에서 Spring Boot OAuth 엔드포인트로 직접 이동
        window.location.href = `${SPRING_BOOT_URL}/oauth2/authorization/google`;
    };

    return (
        <MobileFrame>
            <div className="min-h-screen flex flex-col items-center justify-center px-6">

                {/* 로고 / 앱 이름 */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl font-bold text-wb-primary">
                        WatchBox
                    </h1>
                    <p className="mt-2 text-sm text-wb-grey-02">
                        나만의 시청 기록 박스
                    </p>
                </div>

                {/* 소셜 로그인 버튼 */}
                <button
                    onClick={handleGoogleLogin}
                    className="cursor-pointer"
                >
                    <Image
                        src="/oauth/google/web_light_rd_SU@4x.png"
                        alt="Sign up with Google"
                        width={800}
                        height={100}
                        className="h-11 w-auto"
                        priority
                    />
                </button>

                {/* 에러 메시지 */}
                {error && (
                    <p className="mt-6 text-sm text-red-500">
                        로그인에 실패했습니다. 다시 시도해주세요.
                    </p>
                )}
            </div>
        </MobileFrame>
    );
}

export default function LoginPage() {
    return (
        <Suspense>
            <LoginContent />
        </Suspense>
    );
}
