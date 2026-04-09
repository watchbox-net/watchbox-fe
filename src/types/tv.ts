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
