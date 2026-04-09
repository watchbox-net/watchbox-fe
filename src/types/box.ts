/** 박스 타입 */
export type BoxType = 'MY' | 'SHARED';

/** 박스 멤버 역할 */
export type BoxMemberRole = 'OWNER' | 'EDITOR' | 'VIEWER';

/** 박스 멤버 */
export interface BoxMemberResponse {
  boxMemberId: number;
  boxMemberName: string;
  role: BoxMemberRole;
}

/** 통합 박스 응답 */
export interface BoxResponse {
  boxId: number;
  name: string;
  description: string | null;
  boxType: BoxType;
  lastContentAddedAt: string | null;
  previewPosterList: string[];
  memberList: BoxMemberResponse[] | null;
}

/** 공개 타입 */
export type VisibleType = 'PRIVATE' | 'PUBLIC';

/** 박스 생성 요청 */
export interface BoxCreateRequest {
  name: string;
  description?: string;
  visibleType?: VisibleType;
  boxType: BoxType;
}

/** 박스 수정 요청 */
export interface BoxUpdateRequest {
  name: string;
  description?: string;
  visibleType?: VisibleType;
}

/** 박스 생성 응답 */
export interface BoxCreateResponse {
  boxId: number;
  name: string;
  description: string | null;
  boxType: BoxType;
  visibleType: VisibleType;
  ownerId: number;
}

/** 박스 수정 응답 (생성 응답과 동일 구조) */
export type BoxUpdateResponse = BoxCreateResponse;

/** 박스 리스트 응답 (마이 + 공유 통합) */
export interface BoxPageResponse {
  boxList: BoxResponse[];
  boxCount: number;
}
