import { privateApi } from './client';
import { tokenManager } from './auth';
import type {
  MyBoxPageResponse,
  SharedBoxPageResponse,
  MyBoxResponse,
  SharedBoxResponse,
  BoxCreateRequest,
  BoxCreateResponse,
  BoxUpdateRequest,
  BoxUpdateResponse,
} from '@/types/box';
import type { ContentPageResponse } from '@/types/content';
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

/** 마이 박스 생성 */
export async function createMyBox(req: BoxCreateRequest): Promise<BoxCreateResponse> {
  const { data } = await privateApi.post<ApiResponse<BoxCreateResponse>>(
    '/boxes/my',
    req,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 공유 박스 생성 */
export async function createSharedBox(req: BoxCreateRequest): Promise<BoxCreateResponse> {
  const { data } = await privateApi.post<ApiResponse<BoxCreateResponse>>(
    '/boxes/shared',
    req,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 마이 박스 단건 조회 */
export async function fetchMyBox(boxId: number): Promise<MyBoxResponse> {
  const { data } = await privateApi.get<ApiResponse<MyBoxResponse>>(
    `/boxes/my/${boxId}`,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 공유 박스 단건 조회 */
export async function fetchSharedBox(boxId: number): Promise<SharedBoxResponse> {
  const { data } = await privateApi.get<ApiResponse<SharedBoxResponse>>(
    `/boxes/shared/${boxId}`,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 마이 박스 수정 */
export async function updateMyBox(boxId: number, req: BoxUpdateRequest): Promise<BoxUpdateResponse> {
  const { data } = await privateApi.patch<ApiResponse<BoxUpdateResponse>>(
    `/boxes/my/${boxId}`,
    req,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 공유 박스 수정 */
export async function updateSharedBox(boxId: number, req: BoxUpdateRequest): Promise<BoxUpdateResponse> {
  const { data } = await privateApi.patch<ApiResponse<BoxUpdateResponse>>(
    `/boxes/shared/${boxId}`,
    req,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 마이 박스 컨텐츠 리스트 조회 */
export async function fetchMyBoxContents(boxId: number): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    `/boxes/my/${boxId}/contents`,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 공유 박스 컨텐츠 리스트 조회 */
export async function fetchSharedBoxContents(boxId: number): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    `/boxes/shared/${boxId}/contents`,
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
