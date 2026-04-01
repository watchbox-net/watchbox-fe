// API 공통 응답 래퍼
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}
