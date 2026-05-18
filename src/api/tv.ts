import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';
import type { TvSummary } from '@/types/tv';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function fetchTv(
  endpoint: string,
  page: number,
  accessToken?: string,
): Promise<ContentPageResponse<TvSummary>> {
  const withRecord = !!accessToken;
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(
    `${BACKEND_API_URL}/discover/${endpoint}?page=${page}&withRecord=${withRecord}`,
    { headers },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}

export const fetchPopularTvList = (token?: string, page = 1) =>
  fetchTv('popular/tv', page, token);

export const fetchTopRatedTvList = (token?: string, page = 1) =>
  fetchTv('top-rated/tv', page, token);

export const fetchNowShowingTvList = (token?: string, page = 1) =>
  fetchTv('now-showing/tv', page, token);

export const fetchTrendingTvList = (token?: string, page = 1) =>
  fetchTv('trending/tv', page, token);
