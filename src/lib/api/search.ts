import { publicApi } from './client';
import type { ContentPageResponse } from '@/types/content-summary';
import type { MovieSummary } from '@/types/movie';
import type { TvSummary } from '@/types/tv';
import type { PersonSummary } from '@/types/person';
import type { ApiResponse } from '@/types/api';

/** 전체 검색 (MULTI) - 영화/TV/인물 혼합 */
export async function searchMulti(
  query: string,
  page: number = 1,
): Promise<ContentPageResponse> {
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse>>(
    '/search/contents/multi',
    { params: { query, page } },
  );
  return data.data;
}

/** 영화 검색 */
export async function searchMovies(
  query: string,
  page: number = 1,
): Promise<ContentPageResponse<MovieSummary>> {
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse<MovieSummary>>>(
    '/search/contents/movie',
    { params: { query, page } },
  );
  return data.data;
}

/** TV 시리즈 검색 */
export async function searchTv(
  query: string,
  page: number = 1,
): Promise<ContentPageResponse<TvSummary>> {
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse<TvSummary>>>(
    '/search/contents/tv',
    { params: { query, page } },
  );
  return data.data;
}

/** 인물 검색 */
export async function searchPerson(
  query: string,
  page: number = 1,
): Promise<ContentPageResponse<PersonSummary>> {
  const { data } = await publicApi.get<ApiResponse<ContentPageResponse<PersonSummary>>>(
    '/search/contents/person',
    { params: { query, page } },
  );
  return data.data;
}
