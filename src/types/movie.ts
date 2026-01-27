// export interface MovieCard {}
// export interface MovieDetail {}
export interface MovieSummary {
  id: number;
  title: string;
  titleOriginal: string;
  posterPath: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  year: number;
  genres: string[];
}

// 영화 목록 응답
export interface MovieListResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  movieList: MovieSummary[];
}
