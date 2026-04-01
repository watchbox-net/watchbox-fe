import axios, { AxiosInstance, AxiosError } from 'axios';

// 공통 인스턴스 (로그인 불필요) - Next.js BFF 프록시 경유
export const publicApi: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 개인별 인스턴스 (로그인 필요) - Next.js BFF 프록시 경유
// 토큰은 HttpOnly Cookie로 자동 전송 → BFF 프록시에서 Authorization 헤더로 변환
export const privateApi: AxiosInstance = axios.create({
    baseURL: '/api',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 응답 인터셉터 - 401 에러 시 로그인 페이지로 이동
privateApi.interceptors.response.use(
    (response) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    },
);

// 공통 에러 핸들링
const handleApiError = (error: AxiosError) => {
    if (error.response) {
        const status = error.response.status;
        const message = (error.response.data as { message?: string })?.message;

        switch (status) {
            case 400:
                console.error('잘못된 요청입니다:', message);
                break;
            case 403:
                console.error('접근 권한이 없습니다:', message);
                break;
            case 404:
                console.error('요청한 리소스를 찾을 수 없습니다:', message);
                break;
            case 500:
                console.error('서버 오류가 발생했습니다:', message);
                break;
            default:
                console.error('오류가 발생했습니다:', message);
        }
    } else if (error.request) {
        console.error('네트워크 연결을 확인해주세요');
    }

    return Promise.reject(error);
};

publicApi.interceptors.response.use((response) => response, handleApiError);
