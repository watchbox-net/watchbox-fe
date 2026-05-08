import type { AggregatePersonCredit } from './credit';

/**
 * TV 시리즈 상세 정보 (ContentInfo → TV)
 * BE: net.watchbox.domain.content.dto.detail.TvInfo
 */
export interface TvInfo {
  contentId: number | null;
  tmdbId: number;

  // 헤더 영역
  backdropPath: string | null;
  posterPath: string | null;
  nameKo: string;
  nameOriginal: string | null;
  firstYear: number | null;
  lastYear: number | null;
  genreList: string[] | null;
  overview: string | null;

  // 상세 정보
  /** ISO date string (YYYY-MM-DD) */
  firstAirDate: string | null;
  /** ISO date string (YYYY-MM-DD) */
  lastAirDate: string | null;
  numberOfSeasons: number | null;
  originCountry: string | null;
  // productionCompanyList: string[] | null;  // BE 보류

  // append_to_response
  watchProviderList: string[] | null;
  personCredit: AggregatePersonCredit | null;
  backdropPathList: string[] | null;
}

/** TV 시리즈 요약 (ContentSummary → TV) */
export interface TvSummary {
  contentId: number | null;
  tmdbId: number;
  mediaType: 'TV';
  popularity: number | null;
  posterPath: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  name: string;           // nameKo
  nameOriginal: string | null;
  firstAirYear: number | null;
  lastAirYear: number | null;
  genreList: string[] | null;
}
