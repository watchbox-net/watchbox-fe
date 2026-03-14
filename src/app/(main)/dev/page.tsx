'use client';

import { useState } from 'react';
import Link from 'next/link';
import { healthCheckAction, healthInfoAction, healthTimeAction } from '@/actions/health-check.action';

const TEST_ACCOUNTS = [-1, -2, -3, -4, -5];

interface LoginResponse {
    memberId: number;
}

export default function DevPage() {
    const [healthCheckResult, setHealthCheckResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 테스트 로그인 상태
    const [selectedAccountId, setSelectedAccountId] = useState<number>(-1);
    const [loginData, setLoginData] = useState<LoginResponse | null>(null);
    const [memberInfo, setMemberInfo] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    const handleHealthCheck = async () => {
        setIsLoading(true);
        setError(null);
        setHealthCheckResult(null);

        try {
            // Server Action 호출
            const result = await healthCheckAction();

            if (!result.success) {
                throw new Error(result.message || '헬스체크 실패');
            }

            setHealthCheckResult(result);
        } catch (err: any) {
            setError(err.message ?? '헬스체크 실패');
            console.error('Health check error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHealthInfo = async () => {
        setIsLoading(true);
        setError(null);
        setHealthCheckResult(null);

        try {
            const result = await healthInfoAction();

            if (!result.success) {
                throw new Error(result.message || 'Server Info 조회 실패');
            }

            setHealthCheckResult(result);
        } catch (err: any) {
            setError(err.message ?? 'Server Info 조회 실패');
            console.error('Health info error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleHealthTime = async () => {
        setIsLoading(true);
        setError(null);
        setHealthCheckResult(null);

        try {
            const result = await healthTimeAction();

            if (!result.success) {
                throw new Error(result.message || 'Server Time 조회 실패');
            }

            setHealthCheckResult(result);
        } catch (err: any) {
            setError(err.message ?? 'Server Time 조회 실패');
            console.error('Health time error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // 테스트 로그인 (BFF 패턴 + HttpOnly Cookie)
    const handleDevLogin = async () => {
        setAuthLoading(true);
        setAuthError(null);
        setLoginData(null);
        setMemberInfo(null);

        try {
            const response = await fetch('/api/dev/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accountId: selectedAccountId }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '로그인 실패');
            }

            // localStorage에도 토큰 저장 (privateApi 인증 헤더용)
            if (result.data.accessToken) {
                localStorage.setItem('accessToken', result.data.accessToken);
            }
            if (result.data.refreshToken) {
                localStorage.setItem('refreshToken', result.data.refreshToken);
            }
            setLoginData(result.data);
        } catch (err: any) {
            setAuthError(err.message ?? '로그인 실패');
            console.error('Dev login error:', err);
        } finally {
            setAuthLoading(false);
        }
    };

    // 회원 정보 조회 (BFF 패턴 + HttpOnly Cookie)
    const handleGetMember = async () => {
        setAuthLoading(true);
        setAuthError(null);
        setMemberInfo(null);

        try {
            // 토큰은 HttpOnly Cookie에서 자동으로 전송됨
            const response = await fetch('/api/dev/member', {
                method: 'GET',
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '회원 조회 실패');
            }

            setMemberInfo(result.data);
        } catch (err: any) {
            setAuthError(err.message ?? '회원 조회 실패');
            console.error('Get member error:', err);
        } finally {
            setAuthLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">🛠️ 개발자 페이지</h1>
            <div className="space-y-4">
                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">API 테스트</h2>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={handleHealthCheck}
                            disabled={isLoading}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
                        >
                            {isLoading ? '테스트 중...' : '헬스체크'}
                        </button>
                        <button
                            onClick={handleHealthInfo}
                            disabled={isLoading}
                            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400"
                        >
                            {isLoading ? '테스트 중...' : 'Server Info'}
                        </button>
                        <button
                            onClick={handleHealthTime}
                            disabled={isLoading}
                            className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:bg-gray-400"
                        >
                            {isLoading ? '테스트 중...' : 'Server Time'}
                        </button>
                    </div>

                    {healthCheckResult && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <h3 className="font-semibold text-green-800 mb-2">✅ 성공</h3>
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(healthCheckResult, null, 2)}
                            </pre>
                        </div>
                    )}

                    {error && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <h3 className="font-semibold text-red-800 mb-2">❌ 실패</h3>
                            <p className="text-sm text-red-600">{error}</p>
                        </div>
                    )}
                </section>

                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">테스트 로그인</h2>
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                        <select
                            value={selectedAccountId}
                            onChange={(e) => setSelectedAccountId(Number(e.target.value))}
                            className="border rounded px-3 py-2"
                        >
                            {TEST_ACCOUNTS.map((id) => (
                                <option key={id} value={id}>
                                    테스터 {id}
                                </option>
                            ))}
                        </select>
                        <button
                            onClick={handleDevLogin}
                            disabled={authLoading}
                            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:bg-gray-400"
                        >
                            {authLoading ? '처리 중...' : '로그인'}
                        </button>
                        <button
                            onClick={handleGetMember}
                            disabled={authLoading}
                            className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:bg-gray-400"
                        >
                            {authLoading ? '처리 중...' : '회원 정보 조회'}
                        </button>
                    </div>

                    {loginData && (
                        <div className="mt-4 p-3 bg-orange-50 border border-orange-200 rounded">
                            <h3 className="font-semibold text-orange-800 mb-2">로그인 성공</h3>
                            <p className="text-sm">memberId: {loginData.memberId}</p>
                            <p className="text-xs text-gray-500 mt-1">토큰은 HttpOnly Cookie에 저장됨 (개발자 도구 → Application → Cookies에서 확인)</p>
                        </div>
                    )}

                    {memberInfo && (
                        <div className="mt-4 p-3 bg-teal-50 border border-teal-200 rounded">
                            <h3 className="font-semibold text-teal-800 mb-2">회원 정보</h3>
                            <pre className="text-sm whitespace-pre-wrap">{memberInfo}</pre>
                        </div>
                    )}

                    {authError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <h3 className="font-semibold text-red-800 mb-2">오류</h3>
                            <p className="text-sm text-red-600">{authError}</p>
                        </div>
                    )}
                </section>

                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">환경 변수</h2>
                    <pre className="bg-gray-100 p-2 rounded text-sm">
                        {JSON.stringify(
                            {
                                NODE_ENV: process.env.NODE_ENV,
                                NEXT_PUBLIC_SERVER_URL: process.env.NEXT_PUBLIC_SERVER_URL,
                                NEXT_PUBLIC_SERVER_API_URL: process.env.NEXT_PUBLIC_SERVER_API_URL,
                                NEXT_PUBLIC_SERVER_DEV_URL: process.env.NEXT_PUBLIC_SERVER_DEV_URL,
                            },
                            null,
                            2
                        )}
                    </pre>
                </section>

                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">디자인 시스템</h2>
                    <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-2">
                            <Link href="/dev/styles" className="bg-blue-100 text-blue-800 px-3 py-1 rounded">Styles</Link>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-1">Components</p>
                            <div className="flex flex-wrap gap-2">
                                <Link href="/dev/components/navigation" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Navigation</Link>
                                <Link href="/dev/components/user-action" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">User Action</Link>
                                <Link href="/dev/components/list" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">List</Link>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">빠른 네비게이션</h2>
                    <div className="flex flex-wrap gap-2">
                        <Link href="/" className="bg-gray-200 px-3 py-1 rounded">홈</Link>
                        <Link href="/search" className="bg-gray-200 px-3 py-1 rounded">검색</Link>
                        <Link href="/box" className="bg-gray-200 px-3 py-1 rounded">박스</Link>
                        <Link href="/record" className="bg-gray-200 px-3 py-1 rounded">시청기록</Link>
                        <Link href="/my" className="bg-gray-200 px-3 py-1 rounded">마이</Link>
                    </div>
                </section>
            </div>
        </div>
    );
}

/*
 * ========================================
 * 함수 요약
 * ========================================
 *
 * [API 테스트 - Server Action 사용]
 * - handleHealthCheck: 백엔드 헬스체크 (GET /health)
 * - handleHealthInfo: 서버 정보 조회 (GET /health/info)
 * - handleHealthTime: 서버 시간 조회 (GET /health/time)
 *
 * [테스트 로그인 - BFF 패턴 + HttpOnly Cookie]
 * - handleDevLogin: 테스트 계정 로그인 (POST /api/dev/login → GET /dev/login/{accountId})
 *   → 토큰은 HttpOnly Cookie에 저장, 클라이언트는 memberId만 반환받음
 *   → accessToken: 1시간, refreshToken: 7일 만료
 *
 * - handleGetMember: 로그인된 회원 정보 조회 (GET /api/dev/member → GET /dev/member)
 *   → Cookie에서 accessToken 자동 전송, Authorization 헤더 불필요
 *
 * [흐름]
 * 브라우저 → Next.js API Route → Spring 백엔드
 * (브라우저가 직접 백엔드 호출하지 않음)
 */

