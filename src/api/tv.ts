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
