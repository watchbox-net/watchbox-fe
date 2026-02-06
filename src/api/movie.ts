import { ApiResponse } from '@/types/api';
import { MovieListResponse, MovieSummary } from '@/types/movie';

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;
const SERVER_API_URL = process.env.NEXT_PUBLIC_SERVER_API_URL;

export async function fetchPopularMovieList(): Promise<MovieSummary[]> {
  const response = await fetch(
    `${SERVER_API_URL}/movies/popular`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  const result: ApiResponse<MovieListResponse> = await response.json();
  return result.data.movieList;
}
