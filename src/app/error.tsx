'use client'

import { useEffect } from 'react'

interface ErrorProps {
    error: Error & { digest?: string }
    reset: () => void
}

// ToDo: 현재 Claude 코드
export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // 에러를 로깅 서비스에 전송 (예: Sentry)
        console.error('Error occurred:', error)
    }, [error])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-4">
            <div className="max-w-md text-center">
                <h2 className="mb-4 text-2xl font-bold text-red-600">
                    문제가 발생했습니다
                </h2>
                <p className="mb-6 text-gray-600">
                    {error.message || '알 수 없는 오류가 발생했습니다.'}
                </p>
                {error.digest && (
                    <p className="mb-4 text-sm text-gray-400">
                        오류 ID: {error.digest}
                    </p>
                )}
                <button
                    onClick={reset}
                    className="rounded-md bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
                >
                    다시 시도
                </button>
            </div>
        </div>
    )
}
