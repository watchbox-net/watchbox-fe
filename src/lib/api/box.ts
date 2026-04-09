import { privateApi } from './client';
import type {
  BoxPageResponse,
  BoxResponse,
  BoxCreateRequest,
  BoxCreateResponse,
  BoxUpdateRequest,
  BoxUpdateResponse,
} from '@/types/box';
import type { ContentPageResponse } from '@/types/content';
import type { ApiResponse } from '@/types/api';

/** 박스 리스트 조회 (마이 + 공유 통합) */
export async function fetchBoxList(): Promise<BoxPageResponse> {
  const { data } = await privateApi.get<ApiResponse<BoxPageResponse>>(
    '/boxes',
  );
  return data.data;
}

/** 박스 단일 조회 */
export async function fetchBox(boxId: number): Promise<BoxResponse> {
  const { data } = await privateApi.get<ApiResponse<BoxResponse>>(
    `/boxes/${boxId}`,
  );
  return data.data;
}

/** 박스 생성 */
export async function createBox(req: BoxCreateRequest): Promise<BoxCreateResponse> {
  const { data } = await privateApi.post<ApiResponse<BoxCreateResponse>>(
    '/boxes',
    req,
  );
  return data.data;
}

/** 박스 수정 */
export async function updateBox(boxId: number, req: BoxUpdateRequest): Promise<BoxUpdateResponse> {
  const { data } = await privateApi.patch<ApiResponse<BoxUpdateResponse>>(
    `/boxes/${boxId}`,
    req,
  );
  return data.data;
}

/** 박스 삭제 */
export async function deleteBox(boxId: number): Promise<void> {
  await privateApi.delete(`/boxes/${boxId}`);
}

/** 박스 컨텐츠 리스트 조회 */
export async function fetchBoxContents(boxId: number): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    `/boxes/${boxId}/contents`,
  );
  return data.data;
}
