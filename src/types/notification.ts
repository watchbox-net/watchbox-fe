// ============================================================
// SSE 알림 타입 (백엔드 NotificationResponse / payload 미러)
// ============================================================

/** 알림 종류 */
export type NotificationType =
  | 'BOX_INVITATION_RECEIVED'   // 공유 박스 초대 받음 (초대받은 사람에게)
  | 'BOX_INVITATION_RESPONDED'  // 초대 수락/거절 결과 (초대 보낸 사람에게)
  | 'BOX_CONTENT_ADDED';        // 박스 컨텐츠 추가 (아직 미구현)

/** 초대 응답 상태 */
export type RequestStatus = 'PENDING' | 'ACCEPTED' | 'REJECTED';

/** 박스 타입 */
export type BoxType = 'MY' | 'SHARED';

/** 미디어 타입 */
export type NotificationMediaType = 'MOVIE' | 'TV' | 'PERSON';

// ── payload (type discriminator로 구분되는 판별 유니온) ────────

/** 초대 받음 payload */
export interface BoxInvitationPayload {
  type: 'BOX_INVITATION_RECEIVED';
  requestId: number;
  boxId: number;
  boxName: string;
  senderId: number;
  sender: string;
  senderProfileImage: string | null;
}

/** 초대 응답(수락/거절) payload */
export interface BoxInvitationRespondedPayload {
  type: 'BOX_INVITATION_RESPONDED';
  requestId: number;
  boxId: number;
  boxName: string;
  responderId: number;
  responder: string;
  responderProfileImage: string | null;
  requestStatus: RequestStatus;
}

/** 박스 컨텐츠 추가 payload */
export interface BoxContentAddedPayload {
  type: 'BOX_CONTENT_ADDED';
  boxId: number;
  boxName: string;
  boxType: BoxType;
  contentId: number;
  tmdbId: number;
  mediaType: NotificationMediaType;
  contentName: string;
  posterPath: string | null;
  publisherId: number;
  publisher: string;
  publisherProfileImage: string | null;
}

export type NotificationPayload =
  | BoxInvitationPayload
  | BoxInvitationRespondedPayload
  | BoxContentAddedPayload;

// ── SSE 'notification' 이벤트의 data ───────────────────────────

/** SSE로 수신하는 알림 응답 */
export interface NotificationResponse {
  notificationId: number;
  type: NotificationType;
  payload: NotificationPayload;
  isRead: boolean;
  /** 서버 계산값 — true일 때만 스낵바 노출 */
  showSnackbar: boolean;
  createdAt: string;
}
