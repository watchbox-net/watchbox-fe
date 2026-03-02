import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content';
import type { MovieSummary } from '@/types/movie';

const BACKEND_API_URL = process.env.BACKEND_API_URL || 'http://localhost:9000/api';

export async function fetchPopularMovieList(
  page: number = 1,
  region: string = 'KR',
): Promise<ContentPageResponse<MovieSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/popular/movies?page=${page}&region=${region}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}
