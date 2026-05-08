import type { PersonCredit } from './credit';

/**
 * 영화 상세 정보 (ContentInfo → MOVIE)
 * BE: net.watchbox.domain.content.dto.detail.MovieInfo
 */
export interface MovieInfo {
  contentId: number | null;
  tmdbId: number;

  // 헤더 영역
  backdropPath: string | null;
  posterPath: string | null;
  titleKo: string;
  titleOriginal: string | null;
  year: number | null;
  genreList: string[] | null;
  runtime: number | null;
  overview: string | null;

  // 상세 정보
  /** ISO date string (YYYY-MM-DD) */
  releaseDate: string | null;
  originCountry: string | null;
  // productionCompanyList: string[] | null;  // BE 보류

  // append_to_response
  personCredit: PersonCredit | null;
  watchProviderList: string[] | null;
  backdropPathList: string[] | null;
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
  title: string;          // titleKo
  titleOriginal: string | null;
  releaseYear: number | null;
  genreList: string[] | null;
}
