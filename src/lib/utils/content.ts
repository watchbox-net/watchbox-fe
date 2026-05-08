import type { ContentSummary } from '@/types/content-summary';
import type { MediaType } from '@/types/content-summary';

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

/** TV 방영 연도 범위 표시 (e.g. 2010-2022, 2024-, 2024) */
function formatTvYearRange(first: number | null, last: number | null): string {
  if (first == null && last == null) return '';
  if (first == null) return String(last);
  if (last == null) return String(first);
  if (first === last) return String(first);
  return `${first}-${last}`;
}

/**
 * ContentSummary에서 부제(2번째 줄) 추출
 * - MOVIE:  releaseYear · 장르1, 장르2
 * - TV:     firstAirYear-lastAirYear · 장르1, 장르2
 * - PERSON: knownForDepartment (대표작은 백엔드 추가 후 반영)
 */
export function getSubText(summary: ContentSummary): string {
  switch (summary.mediaType) {
    case 'MOVIE': {
      const genres = summary.genreList?.join(', ') || '';
      return [summary.releaseYear, genres].filter(Boolean).join(' · ');
    }
    case 'TV': {
      const yearRange = formatTvYearRange(summary.firstAirYear, summary.lastAirYear);
      const genres = summary.genreList?.join(', ') || '';
      return [yearRange, genres].filter(Boolean).join(' · ');
    }
    case 'PERSON':
      return summary.knownForDepartment ?? '';
  }
}

/**
 * ContentSummary에서 단일 연도 추출 (시트/카드 등 단일 값 필요한 곳용)
 * - MOVIE: releaseYear
 * - TV: firstAirYear
 * - PERSON: null
 */
export function getYear(summary: ContentSummary): number | null {
  switch (summary.mediaType) {
    case 'MOVIE':
      return summary.releaseYear;
    case 'TV':
      return summary.firstAirYear;
    case 'PERSON':
      return null;
  }
}

/** 상세 페이지 라우트 경로 — mediaType은 폴더명에 맞춰 lowercase */
export function getContentDetailPath(mediaType: MediaType, tmdbId: number): string {
  return `/content/${mediaType.toLowerCase()}/${tmdbId}`;
}

/** ISO date(YYYY-MM-DD) → "YYYY.MM.DD" */
export function formatIsoDate(iso: string | null | undefined): string | null {
  if (!iso) return null;
  // 안전: "YYYY-MM-DD..." 가정
  const m = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!m) return iso;
  return `${m[1]}.${m[2]}.${m[3]}`;
}

/** TV 방송 기간 표시 (e.g. "2010.10.31 ~ 2022.11.21" / "2024.01.01 ~ 방영중") */
export function formatAirRange(firstAirDate: string | null, lastAirDate: string | null): string {
  const first = formatIsoDate(firstAirDate);
  const last = formatIsoDate(lastAirDate);
  if (!first && !last) return '';
  if (first && !last) return `${first} ~`;
  if (!first && last) return `~ ${last}`;
  if (first === last) return first!;
  return `${first} ~ ${last}`;
}
