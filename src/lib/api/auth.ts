// lib/api/auth.ts - 인증 API
// 토큰은 HttpOnly Cookie로 관리 (BFF 패턴)
// localStorage 기반 tokenManager는 더 이상 사용하지 않음

import { privateApi } from './client';

const SPRING_BOOT_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const authApi = {
    logout: () => privateApi.post('/auth/logout'),

    // 네이티브 앱(WebView)에서 Google SDK로 얻은 serverAuthCode를 BE에 전달.
    // BE가 소셜토큰 검증 후 HttpOnly 쿠키를 설정한다.
    // BFF 프록시를 거치지 않고 BE에 직접 호출해야 Set-Cookie가 브라우저에 전달됨.
    nativeGoogleLogin: async (serverAuthCode: string): Promise<void> => {
        const res = await fetch(`${SPRING_BOOT_URL}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ provider: 'GOOGLE', token: serverAuthCode }),
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`native google login failed: ${res.status}`);
    },
};
