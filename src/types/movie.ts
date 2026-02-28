/** 영화 요약 (ContentSummary → MOVIE) */
export interface MovieSummary {
  contentId: number;
  mediaType: 'MOVIE';
  popularity: number | null;
  posterPath: string | null;
  voteAverage: number | null;
  voteCount: number | null;
  year: number | null;
  title: string;
  titleOriginal: string | null;
}
