import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';
import type { TvSummary } from '@/types/tv';
import { serverFetch, type ServerTokens } from '@/api/server-fetch';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function fetchTv(
  endpoint: string,
  page: number,
  tokens: ServerTokens,
): Promise<ContentPageResponse<TvSummary>> {
  const withRecord = !!tokens.accessToken;
  const url = `${BACKEND_API_URL}/discover/${endpoint}?page=${page}&withRecord=${withRecord}`;
  const { response } = await serverFetch(url, tokens);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}

export const fetchPopularTvList = (tokens: ServerTokens, page = 1) =>
  fetchTv('popular/tv', page, tokens);

export const fetchTopRatedTvList = (tokens: ServerTokens, page = 1) =>
  fetchTv('top-rated/tv', page, tokens);

export const fetchNowShowingTvList = (tokens: ServerTokens, page = 1) =>
  fetchTv('now-showing/tv', page, tokens);

export const fetchTrendingTvList = (tokens: ServerTokens, page = 1) =>
  fetchTv('trending/tv', page, tokens);
