import { privateApi } from './client';
import { tokenManager } from './auth';
import type { MyBoxPageResponse, SharedBoxPageResponse } from '@/types/box';
import type { ApiResponse } from '@/types/api';

function authHeaders() {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 마이 박스 리스트 조회 */
export async function fetchMyBoxList(): Promise<MyBoxPageResponse> {
  const { data } = await privateApi.get<ApiResponse<MyBoxPageResponse>>(
    '/boxes/my',
    { headers: authHeaders() },
  );
  return data.data;
}

/** 공유 박스 리스트 조회 */
export async function fetchSharedBoxList(): Promise<SharedBoxPageResponse> {
  const { data } = await privateApi.get<ApiResponse<SharedBoxPageResponse>>(
    '/boxes/shared',
    { headers: authHeaders() },
  );
  return data.data;
}
