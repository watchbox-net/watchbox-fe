'use client';

import { useState, useEffect, useCallback } from 'react';

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

export function useAuth() {
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
                    member: data.member?.data ?? data.member,
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

    return { ...authState, logout, checkAuth };
}
