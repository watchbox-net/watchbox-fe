import axios, {
    AxiosInstance,
    AxiosError,
    InternalAxiosRequestConfig,
} from 'axios';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

// 공통 인스턴스 (로그인 불필요)
export const publicApi: AxiosInstance = axios.create({
    baseURL: SERVER_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 개인별 인스턴스 (로그인 필요)
export const privateApi: AxiosInstance = axios.create({
    baseURL: SERVER_API_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 토큰 갱신 중복 방지
let isRefreshing = false;
let refreshSubscribers: ((token: string) => void)[] = [];

const onRefreshed = (token: string) => {
    refreshSubscribers.forEach((callback) => callback(token));
    refreshSubscribers = [];
};

const addRefreshSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
};

// 인터셉터 설정 함수 (auth.ts에서 호출)
export const setupInterceptors = (
    getAccessToken: () => string | null,
    getRefreshToken: () => string | null,
    setTokens: (accessToken: string, refreshToken: string) => void,
    onRefreshFail: () => void
) => {
    // 요청 인터셉터 - 토큰 자동 첨부
    privateApi.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            const token = getAccessToken();
            if (token && config.headers) {
                config.headers.Authorization = `Bearer ${token}`;
            }
            return config;
        },
        (error: AxiosError) => Promise.reject(error)
    );

    // 응답 인터셉터 - 401 에러 시 토큰 갱신
    privateApi.interceptors.response.use(
        (response) => response,
        async (error: AxiosError) => {
            const originalRequest = error.config as InternalAxiosRequestConfig & {
                _retry?: boolean;
            };

            if (error.response?.status === 401 && !originalRequest._retry) {
                if (isRefreshing) {
                    return new Promise((resolve) => {
                        addRefreshSubscriber((token: string) => {
                            if (originalRequest.headers) {
                                originalRequest.headers.Authorization = `Bearer ${token}`;
                            }
                            resolve(privateApi(originalRequest));
                        });
                    });
                }

                originalRequest._retry = true;
                isRefreshing = true;

                try {
                    const refreshToken = getRefreshToken();

                    if (!refreshToken) {
                        throw new Error('No refresh token');
                    }

                    const { data } = await publicApi.post('/auth/refresh', {
                        refreshToken,
                    });

                    setTokens(data.accessToken, data.refreshToken);
                    onRefreshed(data.accessToken);

                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
                    }
                    return privateApi(originalRequest);
                } catch (refreshError) {
                    refreshSubscribers = [];
                    onRefreshFail();
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }

            return Promise.reject(error);
        }
    );
};

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

// 헬스체크
export const healthCheck = () => axios.get(`${SERVER_URL}/health`);