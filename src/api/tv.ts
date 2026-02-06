import { ApiResponse } from '@/types/api';
import { TvListResponse, TvSummary } from '@/types/tv';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export async function fetchPopularTvList(): Promise<TvSummary[]> {
  const response = await fetch(
    `${SERVER_API_URL}/tv/popular`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular tv');
  }
  const result: ApiResponse<TvListResponse> = await response.json();
  return result.data.tvList;
}
