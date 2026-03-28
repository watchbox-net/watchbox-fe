import { publicApi } from './client';
import type { ApiResponse } from '@/types/api';
import type { ContentDetailResponse, ContentDetailMediaType } from '@/types/content-detail';

/**
 * 컨텐츠 상세 조회
 * - 로그인 시 BFF 프록시가 자동으로 Authorization 헤더 추가
 * - 백엔드에서 memberId null 여부로 MemberRecord 포함 여부 분기
 */
export async function fetchContentDetail(
  mediaType: ContentDetailMediaType,
  contentId: number,
): Promise<ContentDetailResponse> {
  const { data } = await publicApi.get<ApiResponse<ContentDetailResponse>>(
    `/contents/${mediaType}/${contentId}`,
  );
  return data.data;
}
