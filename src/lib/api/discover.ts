import { publicApi } from './client';
import type { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';

/** Discover 카테고리별 컨텐츠 목록 조회 (BFF 프록시 경유) */
export async function fetchDiscoverList(
  category: string,
  type: string,
): Promise<ContentPageResponse> {
  // category: popular, top-rated, now-showing, trending
  // type: movie → movies, tv → tvs (백엔드 endpoint 매핑)
  const endpoint = type === 'movie' ? 'movies' : 'tvs';
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse>>(
    `/discover/${category}/${endpoint}`,
    { params: { page: 1, withRecord: true } },
  );
  return data.data;
}
