// ─── 프로필 정보 ────────────────────────────────────────────
export interface ProfileResponse {
  memberId: number;
  nickname: string;
  email: string;
  profileImage: string | null;
}

// ─── 회원 통계 ──────────────────────────────────────────────
export interface MemberStatsResponse {
  likeCount: number;
  boxCount: number;
  watchStatusCount: number;
  followerCount: number;
  followingCount: number;
}

// ─── 마이페이지 API 응답 ────────────────────────────────────
export interface MyPageResponse {
  profile: ProfileResponse;
  memberStats: MemberStatsResponse;
}
