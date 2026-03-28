import { privateApi } from './client';
import type { ContentPageResponse, WatchStatus } from '@/types/content';
import type { ApiResponse } from '@/types/api';

/** 시청 상태 등록된 기록 리스트 조회 (로그인 필요) */
export async function fetchWatchStatusList(): Promise<ContentPageResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentPageResponse>>(
    '/records/status',
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
  contentId: number;
  watchMediaType: 'MOVIE' | 'TV';
  watchStatus: Exclude<WatchStatus, 'NONE'>;
}): Promise<void> {
  await privateApi.post('/records/status', params);
}

/** 시청 기록 삭제 (로그인 필요) */
export async function deleteWatchRecord(recordId: number): Promise<void> {
  await privateApi.delete(`/records/status/${recordId}`);
}
