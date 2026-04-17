/** 영화 상세 정보 (ContentInfo → MOVIE) */
export interface MovieInfo {
  contentId: number | null;
  tmdbId: number;
  titleKo: string;
  titleOriginal: string | null;
  posterPath: string | null;
  year: number | null;
  genreList: string[] | null;
  overview: string | null;
  backdropPath: string | null;
  originalLanguage: string | null;
  releaseDate: string | null;
  adult: boolean | null;
  status: string | null;
  runtime: number | null;
  tagline: string | null;
  homepage: string | null;
  budget: number | null;
  revenue: number | null;
}

/** 영화 요약 (ContentSummary → MOVIE) */
export interface MovieSummary {
  contentId: number | null;
  tmdbId: number;
  mediaType: 'MOVIE';
  popularity: number | null;
  posterPath: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  year: number | null;
  title: string;
  titleOriginal: string | null;
  genreList: string[] | null;
}
