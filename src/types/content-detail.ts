import type { WatchStatus } from './content';

// ─── MediaType ─────────────────────────────────────────────
export type ContentDetailMediaType = 'MOVIE' | 'TV';

// ─── MovieInfo ─────────────────────────────────────────────
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

// ─── TvInfo ────────────────────────────────────────────────
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

export type ContentInfo = MovieInfo | TvInfo;

// ─── 상세 페이지 사용자 기록 (recordId 포함) ────────────────
export interface DetailMemberRecord {
  recordId: number | null;
  liked: boolean | null;
  watchStatus: WatchStatus | null;
}

// ─── API 응답 ───────────────────────────────────────────────
export interface ContentDetailResponse {
  mediaType: ContentDetailMediaType;
  contentInfo: ContentInfo;
  memberRecord: DetailMemberRecord | null;
}
