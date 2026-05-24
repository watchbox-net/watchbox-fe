'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/context/AuthContext';

const TEST_ACCOUNTS = [-1, -2, -3, -4, -5];

interface LoginResponse {
    memberId: number;
}

export default function DevPage() {
    const { isAuthenticated, member, isLoading: authCheckLoading, logout, checkAuth } = useAuth();

    const [healthCheckResult, setHealthCheckResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Next.js 서버 헬스체크 상태
    const [nextHealthResult, setNextHealthResult] = useState<any>(null);
    const [nextHealthLoading, setNextHealthLoading] = useState(false);
    const [nextHealthError, setNextHealthError] = useState<string | null>(null);

    // API Route 경유 헬스체크 상태
    const [proxyResult, setProxyResult] = useState<any>(null);
    const [proxyLoading, setProxyLoading] = useState(false);
    const [proxyError, setProxyError] = useState<string | null>(null);

    // 테스트 로그인 상태
    const [selectedAccountId, setSelectedAccountId] = useState<number>(-1);
    const [loginData, setLoginData] = useState<LoginResponse | null>(null);
    const [memberInfo, setMemberInfo] = useState<string | null>(null);
    const [authLoading, setAuthLoading] = useState(false);
    const [authError, setAuthError] = useState<string | null>(null);

    // 샘플 로그인 상태
    const SAMPLE_NICKNAMES = ['해달', '수달', '돌고래', 'watchbox', '너구리'];
    const [selectedNickname, setSelectedNickname] = useState<string>(SAMPLE_NICKNAMES[0]);
    const [nicknameInput, setNicknameInput] = useState<string>('');
    const [sampleLoginData, setSampleLoginData] = useState<LoginResponse | null>(null);
    const [sampleLoading, setSampleLoading] = useState(false);
    const [sampleError, setSampleError] = useState<string | null>(null);

    const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SERVER_URL;

    const handleHealthCheck = async () => {
        setIsLoading(true);
        setError(null);
        setHealthCheckResult(null);

        try {
            const startTime = Date.now();
            const response = await fetch(`${SPRING_BOOT_URL}/health`);
            const responseTime = Date.now() - startTime;

            if (!response.ok) {
                throw new Error(`헬스체크 실패: ${response.status}`);
            }

            const data = await response.text();
            setHealthCheckResult({
                message: '브라우저 → Spring Boot 직접 호출 성공',
                backendMessage: data,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString(),
                backendUrl: SPRING_BOOT_URL,
            });
        } catch (err: any) {
            setError(err.message ?? '헬스체크 실패');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHealthInfo = async () => {
        setIsLoading(true);
        setError(null);
        setHealthCheckResult(null);

        try {
            const startTime = Date.now();
            const response = await fetch(`${SPRING_BOOT_URL}/health/info`);
            const responseTime = Date.now() - startTime;

            if (!response.ok) {
                throw new Error(`Server Info 조회 실패: ${response.status}`);
            }

            const data = await response.text();
            setHealthCheckResult({
                message: 'Server Info 조회 성공',
                serverInfo: data,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString(),
            });
        } catch (err: any) {
            setError(err.message ?? 'Server Info 조회 실패');
        } finally {
            setIsLoading(false);
        }
    };

    const handleHealthTime = async () => {
        setIsLoading(true);
        setError(null);
        setHealthCheckResult(null);

        try {
            const startTime = Date.now();
            const response = await fetch(`${SPRING_BOOT_URL}/health/time`);
            const responseTime = Date.now() - startTime;

            if (!response.ok) {
                throw new Error(`Server Time 조회 실패: ${response.status}`);
            }

            const data = await response.text();
            setHealthCheckResult({
                message: 'Server Time 조회 성공',
                serverTime: data,
                responseTime: `${responseTime}ms`,
                timestamp: new Date().toISOString(),
            });
        } catch (err: any) {
            setError(err.message ?? 'Server Time 조회 실패');
        } finally {
            setIsLoading(false);
        }
    };

    // Next.js 서버 헬스체크 (브라우저 → Next.js /api/health)
    const handleNextHealthCheck = async () => {
        setNextHealthLoading(true);
        setNextHealthError(null);
        setNextHealthResult(null);

        try {
            const startTime = Date.now();
            const response = await fetch('/api/health');
            const responseTime = Date.now() - startTime;
            const data = await response.json();

            if (!data.success) {
                throw new Error('Next.js 헬스체크 실패');
            }

            setNextHealthResult({ ...data, clientResponseTime: `${responseTime}ms` });
        } catch (err: any) {
            setNextHealthError(err.message ?? 'Next.js 헬스체크 실패');
        } finally {
            setNextHealthLoading(false);
        }
    };

    // API Route 경유 헬스체크 (브라우저 → Next.js API Route → Spring Boot)
    const handleProxyHealthCheck = async () => {
        setProxyLoading(true);
        setProxyError(null);
        setProxyResult(null);

        try {
            const response = await fetch('/api/dev/health');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '헬스체크 실패');
            }

            setProxyResult(result);
        } catch (err: any) {
            setProxyError(err.message ?? '헬스체크 실패');
        } finally {
            setProxyLoading(false);
        }
    };

    const handleProxyHealthInfo = async () => {
        setProxyLoading(true);
        setProxyError(null);
        setProxyResult(null);

        try {
            const response = await fetch('/api/dev/health/info');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Server Info 조회 실패');
            }

            setProxyResult(result);
        } catch (err: any) {
            setProxyError(err.message ?? 'Server Info 조회 실패');
        } finally {
            setProxyLoading(false);
        }
    };

    const handleProxyHealthTime = async () => {
        setProxyLoading(true);
        setProxyError(null);
        setProxyResult(null);

        try {
            const response = await fetch('/api/dev/health/time');
            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || 'Server Time 조회 실패');
            }

            setProxyResult(result);
        } catch (err: any) {
            setProxyError(err.message ?? 'Server Time 조회 실패');
        } finally {
            setProxyLoading(false);
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

            // 토큰은 HttpOnly Cookie로 관리 (BFF 프록시에서 자동 처리)
            setLoginData(result.data);
            await checkAuth();
        } catch (err: any) {
            setAuthError(err.message ?? '로그인 실패');
            console.error('Dev login error:', err);
        } finally {
            setAuthLoading(false);
        }
    };

    // 샘플 로그인 (닉네임)
    const handleSampleLogin = async (nickname: string) => {
        setSampleLoading(true);
        setSampleError(null);
        setSampleLoginData(null);

        try {
            const response = await fetch('/api/dev/login-nickname', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ nickname }),
            });

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || '로그인 실패');
            }

            setSampleLoginData(result.data);
            await checkAuth();
        } catch (err: any) {
            setSampleError(err.message ?? '로그인 실패');
        } finally {
            setSampleLoading(false);
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
                    <h2 className="font-semibold mb-2">인증 상태</h2>
                    {authCheckLoading ? (
                        <p className="text-sm text-gray-500">확인 중...</p>
                    ) : isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                            <span className="text-sm text-green-700">
                                로그인됨: memberId {member?.memberId} / {member?.nickname} / {member?.email}
                            </span>
                            <button
                                onClick={logout}
                                className="ml-auto bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600 cursor-pointer"
                            >
                                로그아웃
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-3">
                            <span className="inline-block w-2 h-2 rounded-full bg-gray-400" />
                            <span className="text-sm text-gray-500">비로그인</span>
                            <Link
                                href="/login"
                                className="ml-auto bg-amber-500 text-white px-3 py-1 rounded text-sm hover:bg-amber-600"
                            >
                                로그인
                            </Link>
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
                            <h3 className="font-semibold text-orange-800">로그인 성공</h3>
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
                    <h2 className="font-semibold mb-2">샘플 로그인 (닉네임)</h2>
                    <div className="flex flex-wrap gap-2 mb-4 items-center">
                        <select
                            value={selectedNickname}
                            onChange={(e) => setSelectedNickname(e.target.value)}
                            className="border rounded px-3 py-2"
                        >
                            {SAMPLE_NICKNAMES.map((name) => (
                                <option key={name} value={name}>{name}</option>
                            ))}
                        </select>
                        <button
                            onClick={() => handleSampleLogin(selectedNickname)}
                            disabled={sampleLoading}
                            className="bg-amber-500 text-white px-4 py-2 rounded hover:bg-amber-600 disabled:bg-gray-400"
                        >
                            {sampleLoading ? '처리 중...' : '로그인'}
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2 items-center">
                        <input
                            type="text"
                            value={nicknameInput}
                            onChange={(e) => setNicknameInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && nicknameInput.trim() && handleSampleLogin(nicknameInput.trim())}
                            placeholder="닉네임 직접 입력"
                            className="border rounded px-3 py-2 w-[160px]"
                        />
                        <button
                            onClick={() => nicknameInput.trim() && handleSampleLogin(nicknameInput.trim())}
                            disabled={sampleLoading || !nicknameInput.trim()}
                            className="bg-amber-700 text-white px-4 py-2 rounded hover:bg-amber-800 disabled:bg-gray-400"
                        >
                            {sampleLoading ? '처리 중...' : '입력 로그인'}
                        </button>
                    </div>

                    {sampleLoginData && (
                        <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded">
                            <h3 className="font-semibold text-amber-800">로그인 성공</h3>
                        </div>
                    )}

                    {sampleError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <h3 className="font-semibold text-red-800 mb-2">오류</h3>
                            <p className="text-sm text-red-600">{sampleError}</p>
                        </div>
                    )}
                </section>

                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">Next.js 서버 헬스체크</h2>
                    <p className="text-xs text-gray-500 mb-3">브라우저 → Next.js /api/health</p>
                    <button
                        onClick={handleNextHealthCheck}
                        disabled={nextHealthLoading}
                        className="bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700 disabled:bg-gray-400"
                    >
                        {nextHealthLoading ? '테스트 중...' : 'Next.js 헬스체크'}
                    </button>

                    {nextHealthResult && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <h3 className="font-semibold text-green-800 mb-2">✅ Next.js 서버 정상</h3>
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(nextHealthResult, null, 2)}
                            </pre>
                        </div>
                    )}

                    {nextHealthError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <h3 className="font-semibold text-red-800 mb-2">❌ Next.js 서버 응답 없음</h3>
                            <p className="text-sm text-red-600">{nextHealthError}</p>
                        </div>
                    )}
                </section>

                <section className="border p-4 rounded">
                    <h2 className="font-semibold mb-2">API 테스트 (직접 호출)</h2>
                    <p className="text-xs text-gray-500 mb-3">브라우저 → Spring Boot 직접 호출</p>
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
                    <h2 className="font-semibold mb-2">API 테스트 (via Next.js API Route)</h2>
                    <p className="text-xs text-gray-500 mb-3">브라우저 → Next.js API Route → Spring Boot</p>
                    <div className="flex flex-wrap gap-2 mb-4">
                        <button
                            onClick={handleProxyHealthCheck}
                            disabled={proxyLoading}
                            className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 disabled:bg-gray-400"
                        >
                            {proxyLoading ? '테스트 중...' : '헬스체크'}
                        </button>
                        <button
                            onClick={handleProxyHealthInfo}
                            disabled={proxyLoading}
                            className="bg-green-700 text-white px-4 py-2 rounded hover:bg-green-800 disabled:bg-gray-400"
                        >
                            {proxyLoading ? '테스트 중...' : 'Server Info'}
                        </button>
                        <button
                            onClick={handleProxyHealthTime}
                            disabled={proxyLoading}
                            className="bg-purple-700 text-white px-4 py-2 rounded hover:bg-purple-800 disabled:bg-gray-400"
                        >
                            {proxyLoading ? '테스트 중...' : 'Server Time'}
                        </button>
                    </div>

                    {proxyResult && (
                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded">
                            <h3 className="font-semibold text-green-800 mb-2">성공</h3>
                            <pre className="text-sm overflow-auto">
                                {JSON.stringify(proxyResult, null, 2)}
                            </pre>
                        </div>
                    )}

                    {proxyError && (
                        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
                            <h3 className="font-semibold text-red-800 mb-2">실패</h3>
                            <p className="text-sm text-red-600">{proxyError}</p>
                        </div>
                    )}
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
                                <Link href="/dev/components/icons" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Icons</Link>
                                <Link href="/dev/components/list" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">List</Link>
                                <Link href="/dev/components/invite" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Invite</Link>
                                <Link href="/dev/components/sheet" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Sheet</Link>
                                <Link href="/dev/components/logo" className="bg-purple-100 text-purple-800 px-3 py-1 rounded">Logo</Link>
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
 * [Next.js 서버 헬스체크]
 * 흐름: 브라우저 → Next.js API Route (/api/health)
 * - handleNextHealthCheck: Next.js 서버 자체 상태 체크
 *
 * [API 테스트 - 브라우저 직접 호출]
 * 흐름: 브라우저 → Spring Boot (직접)
 * - handleHealthCheck: 헬스체크 (GET http://localhost:9000/health)
 * - handleHealthInfo: 서버 정보 조회 (GET http://localhost:9000/health/info)
 * - handleHealthTime: 서버 시간 조회 (GET http://localhost:9000/health/time)
 *
 * [API 테스트 - Next.js API Route 경유]
 * 흐름: 브라우저 → Next.js API Route → Spring Boot
 * - handleProxyHealthCheck: 헬스체크 (GET /api/dev/health → GET /health)
 * - handleProxyHealthInfo: 서버 정보 조회 (GET /api/dev/health/info → GET /health/info)
 * - handleProxyHealthTime: 서버 시간 조회 (GET /api/dev/health/time → GET /health/time)
 *
 * [테스트 로그인 - BFF 패턴 + HttpOnly Cookie]
 * 흐름: 브라우저 → Next.js API Route → Spring Boot
 * - handleDevLogin: 테스트 계정 로그인 (POST /api/dev/login → GET /dev/login/{accountId})
 *   → 토큰은 HttpOnly Cookie에 저장, 클라이언트는 memberId만 반환받음
 *   → accessToken: 1시간, refreshToken: 7일 만료
 *
 * - handleGetMember: 로그인된 회원 정보 조회 (GET /api/dev/member → GET /dev/member)
 *   → Cookie에서 accessToken 자동 전송, Authorization 헤더 불필요
 */

