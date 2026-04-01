import type { ContentSummary } from '@/types/content';

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

/** ContentSummary에서 TMDB 이미지 URL 추출 */
export function getImageUrl(summary: ContentSummary): string | null {
  switch (summary.mediaType) {
    case 'MOVIE':
    case 'TV':
      return summary.posterPath ? `${TMDB_IMAGE_BASE}${summary.posterPath}` : null;
    case 'PERSON':
      return summary.profilePath ? `${TMDB_IMAGE_BASE}${summary.profilePath}` : null;
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
