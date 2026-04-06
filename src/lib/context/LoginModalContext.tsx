'use client';

import { createContext, useContext, useState, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/common/Modal';

interface LoginModalContextValue {
  showLoginModal: () => void;
}

const LoginModalContext = createContext<LoginModalContextValue | null>(null);

export function LoginModalProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  const showLoginModal = useCallback(() => setVisible(true), []);

  return (
    <LoginModalContext.Provider value={{ showLoginModal }}>
      {children}
      <Modal
        visible={visible}
        variant="login"
        onCancel={() => setVisible(false)}
        onConfirm={() => {
          setVisible(false);
          router.push('/login');
        }}
      />
    </LoginModalContext.Provider>
  );
}

export function useLoginModal() {
  const context = useContext(LoginModalContext);
  if (!context) {
    throw new Error('useLoginModal must be used within a LoginModalProvider');
  }
  return context;
}
