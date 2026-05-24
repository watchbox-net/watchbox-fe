import { privateApi } from './client';
import type {
  BoxPageResponse,
  BoxItem,
  BoxCreateRequest,
  BoxCreateResponse,
  BoxUpdateRequest,
  BoxUpdateResponse,
} from '@/types/box';
import type { ContentCursorPageResponse, CountResponse } from '@/types/content-summary';
import type { ApiResponse } from '@/types/api';

/** 박스 리스트 조회 (마이 + 공유 통합) */
export async function fetchBoxList(): Promise<BoxPageResponse> {
  const { data } = await privateApi.get<ApiResponse<BoxPageResponse>>(
    '/boxes',
  );
  return data.data;
}

/** 박스 단일 조회 */
export async function fetchBox(boxId: number): Promise<BoxItem> {
  const { data } = await privateApi.get<ApiResponse<BoxItem>>(
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

// ─── 박스 컨텐츠 페이지 조회 파라미터 ─────────────────────────
export type ContentMediaTypeFilter = 'MOVIE_TV' | 'MOVIE' | 'TV' | 'PERSON';
export type BoxContentSortOrder = 'RECENT_SAVED' | 'OLDEST_SAVED' | 'RECENT_YEAR' | 'OLDEST_YEAR';
export type BoxWatchStatusFilter = 'ALL' | 'COMPLETED' | 'WATCHING' | 'PLANNED' | 'PAUSED' | 'NONE';

export interface BoxContentRecordQueryParams {
  contentMediaTypeFilter?: ContentMediaTypeFilter;
  sort?: BoxContentSortOrder;
  watchStatusFilter?: BoxWatchStatusFilter;
}

/**
 * 박스 컨텐츠 리스트 조회 - 커서 기반 무한스크롤
 * 첫 페이지 요청은 cursor 생략 또는 null. 이후 응답의 nextCursor 그대로 전달.
 */
export async function fetchBoxContents(
  boxId: number,
  params: BoxContentRecordQueryParams = {},
  cursor: string | null = null,
): Promise<ContentCursorPageResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  if (cursor) queryParams.cursor = cursor;

  const { data } = await privateApi.get<ApiResponse<ContentCursorPageResponse>>(
    `/boxes/${boxId}/contents`,
    { params: queryParams },
  );
  return data.data;
}

/** 박스 컨텐츠 총 개수 (필터 적용) */
export async function fetchBoxContentCount(
  boxId: number,
  params: BoxContentRecordQueryParams = {},
): Promise<number> {
  const { data } = await privateApi.get<ApiResponse<CountResponse>>(
    `/boxes/${boxId}/contents/count`,
    { params },
  );
  return data.data.totalCount;
}
