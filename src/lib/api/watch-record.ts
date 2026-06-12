import { privateApi } from './client';
import type {
  ContentCursorPageResponse,
  ContentSummary,
  CountResponse,
  WatchStatus,
} from '@/types/content-summary';
import type { ApiResponse } from '@/types/api';

// ─── 시청 기록 페이지 조회 파라미터 ───────────────────────────
export type WatchMediaTypeFilter = 'MOVIE_TV' | 'MOVIE' | 'TV';
export type RecordSortOrder = 'RECENT_UPDATED' | 'OLDEST_UPDATED' | 'RECENT_YEAR' | 'OLDEST_YEAR';
export type WatchRecordFilter = 'ALL' | 'COMPLETED' | 'WATCHING' | 'PLANNED' | 'PAUSED' | 'LIKED';

export interface ContentRecordQueryParams {
  watchMediaTypeFilter?: WatchMediaTypeFilter;
  sort?: RecordSortOrder;
  watchRecordFilter?: WatchRecordFilter;
}

/**
 * 내 시청 기록 페이지 조회 - 커서 기반 무한스크롤 (로그인 필요)
 * 첫 페이지 요청은 cursor 생략 또는 null. 이후 응답의 nextCursor 그대로 전달.
 * 좋아요만 보고 싶다면 watchRecordFilter='LIKED'로 호출 (이전의 별도 /records/likes 통합).
 */
export async function fetchMyRecordedContentPage(
  params: ContentRecordQueryParams = {},
  cursor: string | null = null,
): Promise<ContentCursorPageResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  if (cursor) queryParams.cursor = cursor;

  const { data } = await privateApi.get<ApiResponse<ContentCursorPageResponse>>(
    '/records/watch',
    { params: queryParams },
  );
  return data.data;
}

/** 내 시청 기록 총 개수 (필터 적용, 로그인 필요) */
export async function fetchMyRecordedContentCount(
  params: ContentRecordQueryParams = {},
): Promise<number> {
  const { data } = await privateApi.get<ApiResponse<CountResponse>>(
    '/records/watch/count',
    { params },
  );
  return data.data.totalCount;
}

/** 시청 상태 등록/변경 (로그인 필요) */
export async function upsertWatchStatus(params: {
  tmdbId: number;
  watchMediaType: 'MOVIE' | 'TV';
  watchStatus: Exclude<WatchStatus, 'NONE'>;
}): Promise<void> {
  await privateApi.post('/records/watch/status', params);
}

/** 시청 기록 삭제 (로그인 필요) */
export async function deleteWatchRecord(recordId: number): Promise<void> {
  await privateApi.delete(`/records/${recordId}/watch/status`);
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
  await privateApi.delete(`/records/${recordId}/likes`);
}

// ─── 시청 기록 히스토리 (본인만, 커서 기반) ───────────────────
export type ContentRecordHistoryEventType =
  | 'WATCH_STATUS_REGISTERED' // 시청 상태 첫 등록 (oldStatus 없음)
  | 'WATCH_STATUS_CHANGED'
  | 'LIKE_ADDED'
  | 'LIKE_REMOVED';
export type ContentRecordHistorySortOrder = 'RECENT' | 'OLDEST';
export type WatchRecordHistoryFilter =
  | 'ALL'
  | 'COMPLETED'
  | 'WATCHING'
  | 'PLANNED'
  | 'PAUSED'
  | 'LIKED';

/** 히스토리 한 건 (백엔드 응답 형태) */
export interface ContentRecordHistoryEntry {
  contentRecordHistoryId: number;
  eventType: ContentRecordHistoryEventType;
  /** WATCH_STATUS_CHANGED 일 때만 (변경 전) */
  oldStatus: WatchStatus | null;
  /** WATCH_STATUS_CHANGED 일 때만 (변경 후, 삭제 시 null) */
  newStatus: WatchStatus | null;
  contentSummary: ContentSummary;
  createdAt: string; // ISO datetime
}

export interface ContentRecordHistoryPageResponse {
  historyList: ContentRecordHistoryEntry[];
  nextCursor: string | null; // 문자열 커서. null이면 끝
  hasNext: boolean;
}

export interface ContentRecordHistoryQueryParams {
  sort?: ContentRecordHistorySortOrder;
  watchRecordHistoryFilter?: WatchRecordHistoryFilter;
}

/**
 * 내 시청 기록 히스토리 조회 - 커서 기반 무한스크롤 (로그인 필요)
 * 시청 상태 변경 + 좋아요 등록/삭제 내역. cursor는 문자열.
 */
export async function fetchMyContentRecordHistory(
  params: ContentRecordHistoryQueryParams = {},
  cursor: string | null = null,
): Promise<ContentRecordHistoryPageResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  if (cursor) queryParams.cursor = cursor;

  const { data } = await privateApi.get<ApiResponse<ContentRecordHistoryPageResponse>>(
    '/records/history',
    { params: queryParams },
  );
  return data.data;
}
