import { publicApi, privateApi } from './client';
import type { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';

/**
 * Discover 카테고리별 콘텐츠 목록 조회 (BFF 프록시 경유, 클라이언트 사이드)
 *
 * @param category   popular | top-rated | now-showing | trending
 * @param type       movie | tv
 * @param page       1부터 시작 (offset 기반)
 * @param withRecord true: 로그인 사용자의 좋아요/시청기록 포함, false: 익명
 */
export async function fetchDiscoverList(
  category: string,
  type: string,
  page: number,
  withRecord: boolean,
): Promise<ContentPageResponse> {
  // 백엔드 endpoint: movies(복수) / tv(단수)
  const endpoint = type === 'movie' ? 'movies' : 'tv';
  const api = withRecord ? privateApi : publicApi;

  const { data } = await api.get<ApiResponse<ContentPageResponse>>(
    `/discover/${category}/${endpoint}`,
    { params: { page, withRecord } },
  );
  return data.data;
}
