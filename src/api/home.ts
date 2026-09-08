import { ApiResponse } from '@/types/api';
import type { ContentItem } from '@/types/content-summary';
import type { MovieSummary } from '@/types/movie';
import type { TvSummary } from '@/types/tv';
import { serverFetch, type ServerTokens } from '@/api/server-fetch';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

/**
 * 홈 8개 섹션 통합 응답 (백엔드 HomeResponse)
 *
 * 기존에는 discover 엔드포인트 8개를 각각 호출했지만, 백엔드가 TMDB를 병렬로 모아
 * 한 번에 내려준다. 일부 섹션이 실패하면 그 섹션만 빈 배열로 온다(백엔드에서 격리).
 */
export interface HomeResponse {
  trendingMovies: ContentItem<MovieSummary>[];
  trendingTv: ContentItem<TvSummary>[];
  popularMovies: ContentItem<MovieSummary>[];
  popularTv: ContentItem<TvSummary>[];
  nowShowingMovies: ContentItem<MovieSummary>[];
  nowShowingTv: ContentItem<TvSummary>[];
  topRatedMovies: ContentItem<MovieSummary>[];
  topRatedTv: ContentItem<TvSummary>[];
}

export const EMPTY_HOME: HomeResponse = {
  trendingMovies: [],
  trendingTv: [],
  popularMovies: [],
  popularTv: [],
  nowShowingMovies: [],
  nowShowingTv: [],
  topRatedMovies: [],
  topRatedTv: [],
};

export async function fetchHome(tokens: ServerTokens, page = 1): Promise<HomeResponse> {
  const withRecord = !!tokens.accessToken;
  const url = `${BACKEND_API_URL}/discover/home?page=${page}&withRecord=${withRecord}`;
  const { response } = await serverFetch(url, tokens);
  if (!response.ok) {
    throw new Error(`Failed to fetch home: ${response.status}`);
  }
  const result: ApiResponse<HomeResponse> = await response.json();
  return result.data;
}
