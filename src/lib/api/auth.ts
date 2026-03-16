// lib/api/auth.ts - 인증 API
// 토큰은 HttpOnly Cookie로 관리 (BFF 패턴)
// localStorage 기반 tokenManager는 더 이상 사용하지 않음

import { privateApi } from './client';

export const authApi = {
    logout: () => privateApi.post('/auth/logout'),

    // 소셜 로그인은 브라우저에서 Spring Boot로 직접 이동 (login 페이지에서 처리)
};
