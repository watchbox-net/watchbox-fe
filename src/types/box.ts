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

/** 마이 박스 */
export interface MyBoxResponse {
  boxId: number;
  name: string;
  description: string | null;
  boxType: BoxType;
}

/** 공유 박스 */
export interface SharedBoxResponse {
  boxId: number;
  name: string;
  description: string | null;
  boxType: BoxType;
  members: BoxMemberResponse[];
}

/** 마이 박스 리스트 응답 */
export interface MyBoxPageResponse {
  boxList: MyBoxResponse[];
  boxCount: number;
}

/** 공유 박스 리스트 응답 */
export interface SharedBoxPageResponse {
  sharedBoxList: SharedBoxResponse[];
  boxCount: number;
}
