// lib/api/auth.ts - 토큰 관리 + 인증 API
import { publicApi, privateApi, setupInterceptors } from './client';

// 토큰 관리
export const tokenManager = {
    getAccessToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('accessToken');
    },

    getRefreshToken: () => {
        if (typeof window === 'undefined') return null;
        return localStorage.getItem('refreshToken');
    },

    setTokens: (accessToken: string, refreshToken: string) => {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    },

    clearTokens: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },
};

// 인터셉터 초기화
setupInterceptors(
    tokenManager.getAccessToken,
    tokenManager.getRefreshToken,
    tokenManager.setTokens,
    () => {
        tokenManager.clearTokens();
        if (typeof window !== 'undefined') {
            window.location.href = '/login';
        }
    }
);

// 인증 API
export const authApi = {
    // login: (email: string, password: string) =>
    //     publicApi.post('/auth/login', { email, password }),
    //
    // signup: (data: { email: string; password: string; nickname: string }) =>
    //     publicApi.post('/auth/signup', data),

    logout: () => {
        tokenManager.clearTokens();
        return privateApi.post('/auth/logout');
    },

    refresh: () =>
        publicApi.post('/auth/refresh', {
            refreshToken: tokenManager.getRefreshToken(),
        }),

    // 소셜 로그인
    kakaoLogin: (code: string) =>
        publicApi.post('/auth/kakao', { code }),

    googleLogin: (code: string) =>
        publicApi.post('/auth/google', { code }),
};