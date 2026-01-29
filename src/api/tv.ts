import { ApiResponse } from '@/types/api';
import { TvListResponse, TvSummary } from '@/types/tv';

export async function fetchPopularTvList(): Promise<TvSummary[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/tv/popular`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular tv');
  }
  const result: ApiResponse<TvListResponse> = await response.json();
  return result.data.tvList;
}
