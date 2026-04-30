import { privateApi } from './client';
import type { ContentPageResponse, WatchStatus } from '@/types/content-summary';
import type { ApiResponse } from '@/types/api';

// ─── 시청 기록 페이지 조회 파라미터 ───────────────────────────
export type WatchMediaTypeFilter = 'MOVIE_TV' | 'MOVIE' | 'TV';
export type RecordSortOrder = 'RECENT_SAVED' | 'OLDEST_SAVED' | 'RECENT_YEAR' | 'OLDEST_YEAR';
export type WatchRecordFilter = 'ALL' | 'COMPLETED' | 'WATCHING' | 'PLANNED' | 'PAUSED' | 'LIKED';

export interface ContentRecordQueryParams {
  watchMediaTypeFilter?: WatchMediaTypeFilter;
  sort?: RecordSortOrder;
  watchRecordFilter?: WatchRecordFilter;
}

/** 내 시청 기록 페이지 조회 - 정렬/필터/미디어타입 (로그인 필요) */
export async function fetchMyRecordedContentPage(
  params: ContentRecordQueryParams = {},
): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    '/records',
    { params },
  );
  return data.data;
}

/** 좋아요 표시된 기록 리스트 조회 (로그인 필요) */
export async function fetchLikedList(): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    '/records/likes',
  );
  return data.data;
}

/** 시청 상태 등록/변경 (로그인 필요) */
export async function upsertWatchStatus(params: {
  tmdbId: number;
  watchMediaType: 'MOVIE' | 'TV';
  watchStatus: Exclude<WatchStatus, 'NONE'>;
}): Promise<void> {
  await privateApi.post('/records/status', params);
}

/** 시청 기록 삭제 (로그인 필요) */
export async function deleteWatchRecord(recordId: number): Promise<void> {
  await privateApi.delete(`/records/status/${recordId}`);
}

/** 좋아요 등록 (로그인 필요) */
export async function addLike(params: {
  tmdbId: number;
  mediaType: 'MOVIE' | 'TV';
  liked: boolean;
}): Promise<{ recordId: number }> {
  const { data } = await privateApi.post<ApiResponse<{ recordId: number }>>(
    '/records/likes',
    params,
  );
  return data.data;
}

/** 좋아요 삭제 (로그인 필요) */
export async function deleteLike(recordId: number): Promise<void> {
  await privateApi.delete(`/records/likes/${recordId}`);
}
