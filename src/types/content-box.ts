import type { BoxType } from './box';

/** 백엔드 ContentBoxItem 대응 */
export interface ContentBoxItem {
  boxId: number;
  name: string;
  boxType: BoxType;
  lastContentAddedAt: string | null;
  /** 최대 3개 */
  previewPosterList: string[];
  /** 공유 박스에만 존재 (my 박스는 null) */
  memberNameList: string[] | null;
  /** 해당 콘텐츠가 이 박스에 포함되어 있는지 */
  hasContent: boolean;
}

/** 백엔드 ContentBoxSheetResponse 대응 */
export interface ContentBoxSheetResponse {
  contentBoxItemList: ContentBoxItem[];
  totalCount: number;
}

/** 백엔드 ContentBoxDiffRequest 대응 */
export interface ContentBoxDiffRequest {
  addBoxIds: number[];
  removeBoxIds: number[];
}

/** 백엔드 ContentBoxUpdateResponse 대응 */
export interface ContentBoxUpdateResponse {
  memberId: number;
  contentId: number;
  addedBoxIds: number[];
  removedBoxIds: number[];
}
