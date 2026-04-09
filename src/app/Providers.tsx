'use client';

import type { ReactNode } from 'react';
import QueryProvider from '@/lib/providers/QueryProvider';
import { AuthProvider } from '@/lib/context/AuthContext';
import { LoginModalProvider } from '@/lib/context/LoginModalContext';

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
