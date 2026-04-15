import type { ContentSummary } from '@/types/content-summary';

/** TMDB 포스터 이미지 베이스 URL */
export const TMDB_POSTER = {
  sm: 'https://image.tmdb.org/t/p/w185',
  md: 'https://image.tmdb.org/t/p/w342',
  lg: 'https://image.tmdb.org/t/p/w500',
  xl: 'https://image.tmdb.org/t/p/w780',
  original: 'https://image.tmdb.org/t/p/original',
} as const;

/** TMDB 백드롭 이미지 베이스 URL */
export const TMDB_BACKDROP = {
  sm: 'https://image.tmdb.org/t/p/w300',
  md: 'https://image.tmdb.org/t/p/w780',
  lg: 'https://image.tmdb.org/t/p/w1280',
} as const;

/** ContentSummary에서 TMDB 이미지 URL 추출 */
export function getImageUrl(
  summary: ContentSummary,
  size: keyof typeof TMDB_POSTER = 'sm',
): string | null {
  const base = TMDB_POSTER[size];
  switch (summary.mediaType) {
    case 'MOVIE':
    case 'TV':
      return summary.posterPath ? `${base}${summary.posterPath}` : null;
    case 'PERSON':
      return summary.profilePath ? `${base}${summary.profilePath}` : null;
  }
}

/** ContentSummary에서 표시용 제목 추출 */
export function getDisplayTitle(summary: ContentSummary): string {
  switch (summary.mediaType) {
    case 'MOVIE':
      return summary.title;
    case 'TV':
    case 'PERSON':
      return summary.name;
  }
}

/** ContentSummary에서 부제 추출 */
export function getSubText(summary: ContentSummary): string {
  switch (summary.mediaType) {
    case 'MOVIE':
    case 'TV': {
      const genres = summary.genreList?.join(', ') || '';
      return [summary.year, genres].filter(Boolean).join(' · ');
    }
    case 'PERSON':
      return summary.nameOriginal ?? '';
  }
}
