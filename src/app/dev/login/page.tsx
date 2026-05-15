'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DevLoginPage() {
  const router = useRouter();
  const [apiKey, setApiKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKey.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/dev/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim() }),
      });

      const result = await response.json();

      if (!result.success) {
        setError('인증 실패: API Key가 올바르지 않습니다.');
        return;
      }

      router.replace('/dev');
    } catch {
      setError('인증 중 오류가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-[360px]">
        <h1 className="text-xl font-bold mb-2 text-center">개발자 페이지</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">관리자 인증이 필요합니다</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Admin API Key"
            autoFocus
            className="w-full border rounded-lg px-4 py-3 text-sm outline-none focus:border-amber-500"
          />
          <button
            type="submit"
            disabled={loading || !apiKey.trim()}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-medium hover:bg-amber-600 disabled:bg-gray-300 transition-colors"
          >
            {loading ? '인증 중...' : '인증'}
          </button>
        </form>

        {error && (
          <p className="mt-4 text-sm text-red-500 text-center">{error}</p>
        )}
      </div>
    </div>
  );
}
