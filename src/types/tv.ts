export interface TvCard {}
export interface TvDetail {}
export interface TvSummary {
  id: number; // tmdbId
  nameKo: string;
  nameEn: string;
  nameOriginal: string;
  posterPath: string;
  popularity: number;
  voteAverage: number;
  voteCount: number;
  year: number; // 처음 방영 연도
  genres: string[];
  overview: string;
  originCountry: string[];
}

// 영화 목록 응답
export interface TvListResponse {
  page: number;
  totalPages: number;
  totalResults: number;
  tvList: TvSummary[];
}
