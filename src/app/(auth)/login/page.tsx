'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import Header from '@/components/common/Header';
import LogoWide from '@/components/icons/LogoWide';

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SERVER_URL;

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');

    const handleGoogleLogin = () => {
        window.location.href = `${SPRING_BOOT_URL}/oauth2/authorization/google`;
    };

    return (
        <MobileFrame>
            <Header variant="back" />

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* 로고 */}
                <LogoWide />

                {/* 구글 로그인 버튼 */}
                <button
                    onClick={handleGoogleLogin}
                    className="mt-[20px] cursor-pointer"
                >
                    <Image
                        src="/oauth/google/web_light_rd_SU@4x.png"
                        alt="Sign up with Google"
                        width={160}
                        height={36}
                        className="h-[36px] w-[160px]"
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
