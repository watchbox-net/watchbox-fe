import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';
import type { TvSummary } from '@/types/tv';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function fetchTv(
  endpoint: string,
  accessToken?: string,
): Promise<ContentPageResponse<TvSummary>> {
  const withRecord = !!accessToken;
  const headers: Record<string, string> = {};
  if (accessToken) headers['Authorization'] = `Bearer ${accessToken}`;

  const response = await fetch(
    `${BACKEND_API_URL}/discover/${endpoint}?page=1&withRecord=${withRecord}`,
    { headers },
  );
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}

export const fetchPopularTvList = (token?: string) =>
  fetchTv('popular/tv', token);

export const fetchTopRatedTvList = (token?: string) =>
  fetchTv('top-rated/tv', token);

export const fetchNowShowingTvList = (token?: string) =>
  fetchTv('now-showing/tv', token);

export const fetchTrendingTvList = (token?: string) =>
  fetchTv('trending/tv', token);
