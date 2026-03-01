import { privateApi } from './client';
import { tokenManager } from './auth';
import type { ContentPageResponse } from '@/types/content';
import type { ApiResponse } from '@/types/api';

function authHeaders() {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 시청 상태 등록된 기록 리스트 조회 (로그인 필요) */
export async function fetchWatchStatusList(): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    '/records/status',
    { headers: authHeaders() },
  );
  return data.data;
}

/** 좋아요 표시된 기록 리스트 조회 (로그인 필요) */
export async function fetchLikedList(): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    '/records/likes',
    { headers: authHeaders() },
  );
  return data.data;
}
