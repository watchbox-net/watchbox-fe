import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content';
import type { MovieSummary } from '@/types/movie';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function fetchMovies(
  endpoint: string,
  accessToken?: string,
): Promise<ContentPageResponse<MovieSummary>> {
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
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}

export const fetchPopularMovieList = (token?: string) =>
  fetchMovies('popular/movies', token);

export const fetchTopRatedMovieList = (token?: string) =>
  fetchMovies('top-rated/movies', token);

export const fetchNowShowingMovieList = (token?: string) =>
  fetchMovies('now-showing/movies', token);

export const fetchTrendingMovieList = (token?: string) =>
  fetchMovies('trending/movies', token);
