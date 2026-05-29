'use client';

import type { ReactNode } from 'react';
import QueryProvider from '@/lib/providers/QueryProvider';
import { AuthProvider } from '@/lib/context/AuthContext';
import { LoginModalProvider } from '@/lib/context/LoginModalContext';

// 브라우저 OTel 부트스트랩 — 모듈 import 시점에 1회 초기화 (side-effect)
// 다른 fetch들보다 먼저 로드되도록 import 순서 유지
import '@/lib/otel-browser';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryProvider>
      <AuthProvider>
        <LoginModalProvider>
          {children}
        </LoginModalProvider>
      </AuthProvider>
    </QueryProvider>
  );
}
