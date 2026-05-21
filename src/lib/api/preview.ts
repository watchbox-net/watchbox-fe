import { publicApi } from './client';
import type { BoxPageResponse } from '@/types/box';
import type { ContentCursorPageResponse, CountResponse } from '@/types/content-summary';
import type { ApiResponse } from '@/types/api';
import type { ContentMediaTypeFilter, BoxContentSortOrder, BoxWatchStatusFilter } from './box';
import type { WatchMediaTypeFilter, RecordSortOrder, WatchRecordFilter } from './watch-record';

// ─── Preview API (토큰 불필요, 샘플 계정 데이터) ──────────────

/** Preview 박스 목록 조회 */
export async function fetchPreviewBoxList(): Promise<BoxPageResponse> {
  const { data } = await publicApi.get<ApiResponse<BoxPageResponse>>(
    '/preview/boxes',
  );
  return data.data;
}

/** Preview 박스 컨텐츠 조회 (커서 기반) */
export async function fetchPreviewBoxContents(
  boxId: number,
  params: {
    contentMediaTypeFilter?: ContentMediaTypeFilter;
    sort?: BoxContentSortOrder;
    watchStatusFilter?: BoxWatchStatusFilter;
  } = {},
  cursor: string | null = null,
): Promise<ContentCursorPageResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  if (cursor) queryParams.cursor = cursor;

  const { data } = await publicApi.get<ApiResponse<ContentCursorPageResponse>>(
    `/preview/boxes/${boxId}/contents`,
    { params: queryParams },
  );
  return data.data;
}

/** Preview 박스 컨텐츠 총 개수 (필터 적용) */
export async function fetchPreviewBoxContentCount(
  boxId: number,
  params: {
    contentMediaTypeFilter?: ContentMediaTypeFilter;
    sort?: BoxContentSortOrder;
    watchStatusFilter?: BoxWatchStatusFilter;
  } = {},
): Promise<number> {
  const { data } = await publicApi.get<ApiResponse<CountResponse>>(
    `/preview/boxes/${boxId}/contents/count`,
    { params },
  );
  return data.data.totalCount;
}

/** Preview 시청 기록 조회 (커서 기반) */
export async function fetchPreviewRecordedContentPage(
  params: {
    watchMediaTypeFilter?: WatchMediaTypeFilter;
    sort?: RecordSortOrder;
    watchRecordFilter?: WatchRecordFilter;
  } = {},
  cursor: string | null = null,
): Promise<ContentCursorPageResponse> {
  const queryParams: Record<string, unknown> = { ...params };
  if (cursor) queryParams.cursor = cursor;

  const { data } = await publicApi.get<ApiResponse<ContentCursorPageResponse>>(
    '/preview/records/watch',
    { params: queryParams },
  );
  return data.data;
}

/** Preview 시청 기록 총 개수 (필터 적용) */
export async function fetchPreviewRecordedContentCount(
  params: {
    watchMediaTypeFilter?: WatchMediaTypeFilter;
    sort?: RecordSortOrder;
    watchRecordFilter?: WatchRecordFilter;
  } = {},
): Promise<number> {
  const { data } = await publicApi.get<ApiResponse<CountResponse>>(
    '/preview/records/watch/count',
    { params },
  );
  return data.data.totalCount;
}
