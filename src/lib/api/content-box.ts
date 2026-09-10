import { privateApi } from './client';
import type { ApiResponse } from '@/types/api';
import type {
  ContentBoxSheetResponse,
  ContentBoxDiffRequest,
  ContentBoxUpdateResponse,
} from '@/types/content-box';

type ContentMediaType = 'MOVIE' | 'TV' | 'PERSON';

/**
 * 콘텐츠가 사용자의 박스들에 포함되어 있는지 조회
 * GET /api/contents/{mediaType}/{tmdbId}/boxes
 */
export async function fetchContentBoxSheet(
  mediaType: ContentMediaType,
  tmdbId: number,
): Promise<ContentBoxSheetResponse> {
  const { data } = await privateApi.get<ApiResponse<ContentBoxSheetResponse>>(
    `/contents/${mediaType}/${tmdbId}/boxes`,
  );
  return data.data;
}

/**
 * 콘텐츠를 사용자 박스들에 일괄 추가/삭제
 * POST /api/contents/{mediaType}/{tmdbId}/boxes
 */
export async function updateContentBoxes(
  mediaType: ContentMediaType,
  tmdbId: number,
  req: ContentBoxDiffRequest,
): Promise<ContentBoxUpdateResponse> {
  const { data } = await privateApi.post<ApiResponse<ContentBoxUpdateResponse>>(
    `/contents/${mediaType}/${tmdbId}/boxes`,
    req,
  );
  return data.data;
}
