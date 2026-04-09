'use client';

import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // 5분간 캐시 유지 (뒤로가기 시 즉시 복원)
            staleTime: 5 * 60 * 1000,
            // 캐시 30분 유지
            gcTime: 30 * 60 * 1000,
            // 윈도우 포커스 시 자동 재요청 비활성화
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}
