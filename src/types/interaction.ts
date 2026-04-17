import type { WatchStatus } from './content-summary';

// ============================================================
// 사용자 상호작용 (백엔드 interaction 패키지)
// ============================================================

/** 사용자의 콘텐츠 기록 (API 응답: memberRecord) */
export interface MemberRecord {
  recordId: number | null;
  liked: boolean | null;
  watchStatus: WatchStatus | null;
}

/** 콘텐츠를 게시한 회원 요약 */
export interface PublisherSummary {
  publisherId: number;
  nickname: string;
  profileImage: string | null;
}
