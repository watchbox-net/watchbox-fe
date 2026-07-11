'use client';

import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { Suspense, useEffect, useState } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import Header from '@/components/common/Header';
import {
    isReactNativeWebView,
    isIosWebView,
    postNativeGoogleLogin,
    postNativeAppleLogin,
    waitForNativeResult,
    type NativeGoogleLoginResult,
    type NativeAppleLoginResult,
} from '@/lib/native-bridge';
import { authApi } from '@/lib/api/auth';

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const BLOCK_WEBVIEW_OAUTH = true; // true 활성 | false 비활성

// 로컬 웹 ↔ 개발 서버(dev-api) 하이브리드 로그인 여부.
// localhost 는 dev-api 의 Set-Cookie 를 받을 수 없으므로, 켜져 있으면 일반 OAuth 경로 대신
// 진입점(/oauth2/local-entry)을 태워 oneTimeCode 릴레이 방식으로 로그인한다.
const HYBRID_LOGIN = process.env.NEXT_PUBLIC_HYBRID_LOGIN === 'true';

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
    const [nativeLoading, setNativeLoading] = useState(false);
    const [nativeError, setNativeError] = useState<string | null>(null);
    // Apple 로그인 버튼은 iOS WebView 앱에서만 노출 (네이티브 Sign in with Apple 필요)
    const [showAppleLogin, setShowAppleLogin] = useState(false);

    useEffect(() => {
        setShowAppleLogin(isIosWebView());
    }, []);

    const handleAppleLogin = async () => {
        if (!isReactNativeWebView()) return;
        setNativeLoading(true);
        setNativeError(null);
        try {
            postNativeAppleLogin();
            const result = await waitForNativeResult<NativeAppleLoginResult>('NATIVE_APPLE_LOGIN_RESULT');
            if (result.status === 'success') {
                await authApi.nativeAppleLogin(result.identityToken);
                window.location.replace('/');
            } else if (result.status === 'error' || result.status === 'unavailable') {
                setNativeError('Apple 로그인에 실패했습니다. 다시 시도해주세요.');
            }
        } catch {
            setNativeError('Apple 로그인에 실패했습니다. 다시 시도해주세요.');
        } finally {
            setNativeLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        // WebView 앱 — 네이티브 SDK 로그인
        if (isReactNativeWebView()) {
            setNativeLoading(true);
            setNativeError(null);
            try {
                postNativeGoogleLogin();
                const result = await waitForNativeResult<NativeGoogleLoginResult>('NATIVE_GOOGLE_LOGIN_RESULT');
                if (result.status === 'success') {
                    await authApi.nativeGoogleLogin(result.serverAuthCode);
                    window.location.replace('/');
                } else if (result.status === 'error') {
                    setNativeError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
                }
            } catch {
                setNativeError('Google 로그인에 실패했습니다. 다시 시도해주세요.');
            } finally {
                setNativeLoading(false);
            }
            return;
        }

        // 일반 인앱 브라우저(카카오/인스타 등) — 외부 브라우저 유도
        if (BLOCK_WEBVIEW_OAUTH && isInAppBrowser()) {
            setShowWebViewModal(true);
            return;
        }

        // (로컬 환경) 웹 브라우저 — 하이브리드 모드면 진입점, 아니면 기존 OAuth 리다이렉트
        if (HYBRID_LOGIN) {
            const target = `${window.location.origin}/api/auth/callback`;
            window.location.href = `${SPRING_BOOT_URL}/oauth2/local-entry?target=${encodeURIComponent(target)}`;
        } else {
            window.location.href = `${SPRING_BOOT_URL}/oauth2/authorization/google`;
        }
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
                    disabled={nativeLoading}
                    className="mt-[20px] cursor-pointer disabled:opacity-50"
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

                {/* 애플 로그인 버튼 (iOS WebView 앱에서만) */}
                {showAppleLogin && (
                    <button
                        onClick={handleAppleLogin}
                        disabled={nativeLoading}
                        className="mt-[12px] cursor-pointer disabled:opacity-50"
                    >
                        <Image
                            src="/oauth/apple/appleid_button@2x.png"
                            alt="Apple로 계속하기"
                            width={160}
                            height={26}
                            className="h-[26px] w-[160px]"
                            priority
                        />
                    </button>
                )}

                {/* 에러 메시지 */}
                {(error || nativeError) && (
                    <p className="mt-6 text-sm text-red-500">
                        {nativeError ?? '로그인에 실패했습니다. 다시 시도해주세요.'}
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
