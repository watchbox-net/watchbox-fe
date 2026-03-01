/** 회원 정보 */
export interface MemberResponse {
  memberId: number;
  email: string;
  nickname: string;
  profileImage: string | null;
}

/** 회원 검색 페이지 응답 */
export interface MemberSearchPageResponse {
  memberList: MemberResponse[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

/** 초대 상태 */
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/** 초대 발송 응답 (보낸 초대) */
export interface InvitationSentResponse {
  requestId: number;
  receiverId: number;
  receiver: string;
  sharedBoxTitle: string;
  status: RequestStatus;
}

/** 받은 초대 응답 */
export interface InvitationReceivedResponse {
  requestId: number;
  senderId: number;
  sender: string;
  sharedBoxTitle: string;
  status: RequestStatus;
}
