import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content';
import type { TvSummary } from '@/types/tv';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

export async function fetchPopularTvList(
  page: number = 1,
): Promise<ContentPageResponse<TvSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/popular/tv?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular tv');
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}

export async function fetchTopRatedTvList(
  page: number = 1,
): Promise<ContentPageResponse<TvSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/top-rated/tv?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch top rated tv');
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}

export async function fetchNowShowingTvList(
  page: number = 1,
): Promise<ContentPageResponse<TvSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/now-showing/tv?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch now showing tv');
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}

export async function fetchTrendingTvList(
  page: number = 1,
): Promise<ContentPageResponse<TvSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/trending/tv?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch trending tv');
  }
  const result: ApiResponse<ContentPageResponse<TvSummary>> = await response.json();
  return result.data;
}
