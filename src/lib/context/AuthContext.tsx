'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';

interface Member {
  memberId: number;
  nickname: string;
  email: string;
  profileImage: string | null;
}

interface AuthState {
  isAuthenticated: boolean;
  member: Member | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    member: null,
    isLoading: true,
  });

  const checkAuth = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me');

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          isAuthenticated: true,
          member: data.member,
          isLoading: false,
        });
      } else {
        setAuthState({ isAuthenticated: false, member: null, isLoading: false });
      }
    } catch {
      setAuthState({ isAuthenticated: false, member: null, isLoading: false });
    }
  }, []);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setAuthState({ isAuthenticated: false, member: null, isLoading: false });
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ ...authState, logout, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
