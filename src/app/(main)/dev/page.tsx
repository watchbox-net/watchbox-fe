'use client';

import { useState } from 'react';
import Link from 'next/link';
import { healthCheckAction, healthInfoAction, healthTimeAction } from '@/actions/health-check.action';

export default function DevPage() {
    const [healthCheckResult, setHealthCheckResult] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

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
                    <h2 className="font-semibold mb-2">환경 변수</h2>
                    <pre className="bg-gray-100 p-2 rounded text-sm">
                        {JSON.stringify(
                            {
                                NODE_ENV: process.env.NODE_ENV,
                                // 필요한 환경 변수들 추가
                            },
                            null,
                            2
                        )}
                    </pre>
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

