import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';
import type { MovieSummary } from '@/types/movie';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function fetchMovies(
  endpoint: string,
  page: number,
  accessToken?: string,
): Promise<ContentPageResponse<MovieSummary>> {
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
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}

export const fetchPopularMovieList = (token?: string, page = 1) =>
  fetchMovies('popular/movies', page, token);

export const fetchTopRatedMovieList = (token?: string, page = 1) =>
  fetchMovies('top-rated/movies', page, token);

export const fetchNowShowingMovieList = (token?: string, page = 1) =>
  fetchMovies('now-showing/movies', page, token);

export const fetchTrendingMovieList = (token?: string, page = 1) =>
  fetchMovies('trending/movies', page, token);
