import type { MovieInfo } from './movie';
import type { TvInfo } from './tv';
import type { MemberRecord } from './interaction';

export type { MovieInfo, TvInfo };

// ─── MediaType ─────────────────────────────────────────────
export type ContentDetailMediaType = 'MOVIE' | 'TV';

// ─── ContentInfo (ContentSummary처럼 유니온으로 조합) ────────
export type ContentInfo = MovieInfo | TvInfo;

// ─── API 응답 ───────────────────────────────────────────────
export interface ContentDetailResponse {
  mediaType: ContentDetailMediaType;
  contentInfo: ContentInfo;
  memberRecord: MemberRecord | null;
}
