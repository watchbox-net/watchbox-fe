import { ApiResponse } from '@/types/api';
import { MovieListResponse, MovieSummary } from '@/types/movie';

export async function fetchPopularMovieList(): Promise<MovieSummary[]> {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_SERVER_URL}/movies/popular`
  );
  if (!response.ok) {
    throw new Error('Failed to fetch popular movies');
  }
  const result: ApiResponse<MovieListResponse> = await response.json();
  return result.data.movieList;
}
