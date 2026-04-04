import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content';
import type { MovieSummary } from '@/types/movie';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

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

export async function fetchTopRatedMovieList(
  page: number = 1,
): Promise<ContentPageResponse<MovieSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/top-rated/movies?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch top rated movies');
  }
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}

export async function fetchNowShowingMovieList(
  page: number = 1,
): Promise<ContentPageResponse<MovieSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/now-showing/movies?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch now showing movies');
  }
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}

export async function fetchTrendingMovieList(
  page: number = 1,
): Promise<ContentPageResponse<MovieSummary>> {
  const response = await fetch(
    `${BACKEND_API_URL}/discover/trending/movies?page=${page}`,
  );
  if (!response.ok) {
    throw new Error('Failed to fetch trending movies');
  }
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}
