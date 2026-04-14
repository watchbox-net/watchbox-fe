/** TV 시리즈 상세 정보 (ContentInfo → TV) */
export interface TvInfo {
  contentId: number | null;
  tmdbId: number;
  nameKo: string;
  nameOriginal: string | null;
  posterPath: string | null;
  popularity: number | null;
  year: number | null;
  genreList: string[] | null;
  overview: string | null;
  backdropPath: string | null;
  originalLanguage: string | null;
  firstAirDate: string | null;
  adult: boolean | null;
  status: string | null;
  type: string | null;
  tagline: string | null;
  homepage: string | null;
  budget: number | null;
  revenue: number | null;
  numberOfEpisodes: number | null;
  numberOfSeasons: number | null;
  lastAirDate: string | null;
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
  year: number | null;
  name: string;
  nameOriginal: string | null;
  genreList: string[] | null;
}
