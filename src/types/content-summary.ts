import type { MovieSummary } from './movie';
import type { TvSummary } from './tv';
import type { PersonSummary } from './person';
import type { MemberRecord, PublisherSummary } from './interaction';

export type { MemberRecord, PublisherSummary };

// ============================================================
// Enums
// ============================================================

/** 콘텐츠 타입 (검색/응답 구분용) */
export type ContentType = 'MOVIE' | 'TV' | 'PERSON' | 'MULTI';

/** 미디어 타입 (개별 콘텐츠 구분용) */
export type MediaType = 'MOVIE' | 'TV' | 'PERSON';

/** 데이터 소스 */
export type DataSource = 'DB' | 'CACHE' | 'TMDB';

/** 응답에 포함된 선택적 필드 */
export type ContentItemField =
  | 'MEMBER_INTERACTION'
  | 'PUBLISHER_SUMMARY'
  | 'BOX_CONTENT_ID'
  | 'WATCH_RECORD_ID';

/** 시청 상태 */
export type WatchStatus = 'COMPLETED' | 'WATCHING' | 'PLANNED' | 'PAUSED' | 'NONE';

// ============================================================
// 응답 메타 정보
// ============================================================

/** 응답 메타데이터 */
export interface ResponseMeta {
  contentType: ContentType;
  dataSource: DataSource;
  contentItemIncluded: ContentItemField[];
}

// ============================================================
// 콘텐츠 요약 (Discriminated Union)
// ============================================================

/** 콘텐츠 요약 - mediaType으로 구분되는 판별 유니온 */
export type ContentSummary = MovieSummary | TvSummary | PersonSummary;

// ============================================================
// 콘텐츠 아이템
// ============================================================

/** 콘텐츠 아이템 (목록의 한 행) - 제네릭으로 Summary 타입 확정 가능 */
export interface ContentItem<T extends ContentSummary = ContentSummary> {
  contentSummary: T;
  memberRecord: MemberRecord | null;
  publisherSummaryList: PublisherSummary[] | null;
  boxContentId: number | null;
}

// ============================================================
// 페이지 응답
// ============================================================

/** 콘텐츠 페이지 응답 - responseMeta.contentType으로 타입이 결정되므로 제네릭으로 한번에 확정 */
export interface ContentPageResponse<T extends ContentSummary = ContentSummary> {
  contentItemList: ContentItem<T>[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
  responseMeta: ResponseMeta;
}
