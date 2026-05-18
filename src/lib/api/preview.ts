import { publicApi } from './client';
import type { BoxPageResponse } from '@/types/box';
import type { ContentPageResponse } from '@/types/content-summary';
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

/** Preview 박스 컨텐츠 조회 */
export async function fetchPreviewBoxContents(
  boxId: number,
  params: {
    contentMediaTypeFilter?: ContentMediaTypeFilter;
    sort?: BoxContentSortOrder;
    watchStatusFilter?: BoxWatchStatusFilter;
  } = {},
): Promise<ContentPageResponse> {
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse>>(
    `/preview/boxes/${boxId}/contents`,
    { params },
  );
  return data.data;
}

/** Preview 시청 기록 조회 */
export async function fetchPreviewRecordedContentPage(
  params: {
    watchMediaTypeFilter?: WatchMediaTypeFilter;
    sort?: RecordSortOrder;
    watchRecordFilter?: WatchRecordFilter;
  } = {},
): Promise<ContentPageResponse> {
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse>>(
    '/preview/records/watch',
    { params },
  );
  return data.data;
}
