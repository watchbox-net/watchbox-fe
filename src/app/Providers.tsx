'use client';

import type { ReactNode } from 'react';
import { AuthProvider } from '@/lib/context/AuthContext';
import { LoginModalProvider } from '@/lib/context/LoginModalContext';

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LoginModalProvider>
        {children}
      </LoginModalProvider>
    </AuthProvider>
  );
}
