import { ApiResponse } from '@/types/api';
import type { ContentPageResponse } from '@/types/content-summary';
import type { MovieSummary } from '@/types/movie';
import { serverFetch, type ServerTokens } from '@/api/server-fetch';

const BACKEND_API_URL = process.env.BACKEND_API_URL;

async function fetchMovies(
  endpoint: string,
  page: number,
  tokens: ServerTokens,
): Promise<ContentPageResponse<MovieSummary>> {
  const withRecord = !!tokens.accessToken;
  const url = `${BACKEND_API_URL}/discover/${endpoint}?page=${page}&withRecord=${withRecord}`;
  const { response } = await serverFetch(url, tokens);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}`);
  }
  const result: ApiResponse<ContentPageResponse<MovieSummary>> = await response.json();
  return result.data;
}

export const fetchPopularMovieList = (tokens: ServerTokens, page = 1) =>
  fetchMovies('popular/movies', page, tokens);

export const fetchTopRatedMovieList = (tokens: ServerTokens, page = 1) =>
  fetchMovies('top-rated/movies', page, tokens);

export const fetchNowShowingMovieList = (tokens: ServerTokens, page = 1) =>
  fetchMovies('now-showing/movies', page, tokens);

export const fetchTrendingMovieList = (tokens: ServerTokens, page = 1) =>
  fetchMovies('trending/movies', page, tokens);
