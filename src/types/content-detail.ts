import type { MovieInfo } from './movie';
import type { TvInfo } from './tv';
import type { PersonInfo } from './person';
import type { MemberRecord } from './interaction';

export type { MovieInfo, TvInfo, PersonInfo };

// ─── MediaType ─────────────────────────────────────────────
export type ContentDetailMediaType = 'MOVIE' | 'TV' | 'PERSON';

// ─── ContentInfo (sealed union in BE) ─────────────────────
export type ContentInfo = MovieInfo | TvInfo | PersonInfo;

// ─── API 응답 ───────────────────────────────────────────────
export interface ContentDetailResponse {
  mediaType: ContentDetailMediaType;
  contentInfo: ContentInfo;
  memberRecord: MemberRecord | null;
  /** 사용자가 보유한 박스 중 하나라도 이 콘텐츠를 담고 있는지 */
  hasAddedInbox: boolean;
}
