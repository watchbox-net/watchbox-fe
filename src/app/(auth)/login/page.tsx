'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import Header from '@/components/common/Header';

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const BLOCK_WEBVIEW_OAUTH = true; // true 활성 | false 비활성

function isInAppBrowser(): boolean {
    if (typeof navigator === 'undefined') return false;
    return /KAKAOTALK|NAVER|Instagram|FBAN|FBAV|Line|BAND|GSA|Gmail|Discord|BytedanceWebview|; wv\)/i.test(
        navigator.userAgent,
    );
}

function LoginContent() {
    const searchParams = useSearchParams();
    const error = searchParams.get('error');
    const [showWebViewModal, setShowWebViewModal] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleGoogleLogin = () => {
        if (BLOCK_WEBVIEW_OAUTH && isInAppBrowser()) {
            setShowWebViewModal(true);
            return;
        }
        window.location.href = `${SPRING_BOOT_URL}/oauth2/authorization/google`;
    };

    const handleCopyUrl = async () => {
        try {
            await navigator.clipboard.writeText(window.location.origin);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            const textarea = document.createElement('textarea');
            textarea.value = window.location.origin;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <MobileFrame>
            <Header variant="back" title = "로그인하기" />

            <div className="flex-1 flex flex-col items-center justify-center">
                {/* 로고 */}
                <Image
                    src="/logo-text/LogoTextH2.5.svg"
                    alt="WatchBox"
                    width={206}
                    height={43}
                    priority
                />

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

            {/* WebView 안내 모달 */}
            {showWebViewModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    onClick={() => setShowWebViewModal(false)}
                >
                    <div
                        className="mx-6 w-full max-w-[320px] rounded-2xl bg-white p-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-[16px] font-semibold text-gray-900 text-center">
                            외부 브라우저에서 열어주세요
                        </h3>
                        <p className="mt-3 text-[13px] text-gray-500 text-center leading-relaxed">
                            현재 인앱 브라우저에서는 Google 로그인이{'\n'}
                            지원되지 않습니다.
                        </p>
                        <p className="mt-2 text-[13px] text-gray-500 text-center leading-relaxed">
                            아래 URL을 복사한 뒤{'\n'}
                            <span className="font-medium text-gray-700">Chrome, Safari, Samsung Internet</span> 등{'\n'}
                            모바일 브라우저에서 접속해주세요.
                        </p>

                        <div className="mt-5 flex flex-col gap-2">
                            <button
                                onClick={handleCopyUrl}
                                className="w-full rounded-lg bg-gray-900 py-3 text-[14px] font-medium text-white"
                            >
                                {copied ? '복사 완료!' : 'URL 복사하기'}
                            </button>
                            <button
                                onClick={() => setShowWebViewModal(false)}
                                className="w-full rounded-lg bg-gray-100 py-3 text-[14px] font-medium text-gray-600"
                            >
                                닫기
                            </button>
                        </div>
                    </div>
                </div>
            )}
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
