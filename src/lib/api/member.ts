import { privateApi } from './client';
import type {
  MemberSearchPageResponse,
  InvitationSentResponse,
  InvitationReceivedResponse,
} from '@/types/member';
import type { ApiResponse } from '@/types/api';

/** 공유 박스에 회원 초대 */
export async function inviteToBox(boxId: number, memberId: number): Promise<InvitationSentResponse> {
  const { data } = await privateApi.post<ApiResponse<InvitationSentResponse>>(
    `/boxes/shared/invitations/${boxId}/${memberId}`,
  );
  return data.data;
}

/** 보낸 초대 목록 조회 */
export async function fetchSentInvitations(): Promise<InvitationSentResponse[]> {
  const { data } = await privateApi.get<ApiResponse<InvitationSentResponse[]>>(
    '/boxes/shared/invitations/sent',
  );
  return data.data;
}

/** 받은 초대 목록 조회 */
export async function fetchReceivedInvitations(): Promise<InvitationReceivedResponse[]> {
  const { data } = await privateApi.get<ApiResponse<InvitationReceivedResponse[]>>(
    '/boxes/shared/invitations/received',
  );
  return data.data;
}

/** 초대 수락 */
export async function acceptInvitation(requestId: number): Promise<void> {
  await privateApi.patch(
    `/boxes/shared/invitations/${requestId}/accept`,
  );
}

/** 초대 거절 */
export async function rejectInvitation(requestId: number): Promise<void> {
  await privateApi.patch(
    `/boxes/shared/invitations/${requestId}/reject`,
  );
}

/** 보낸 초대 취소 */
export async function cancelInvitation(requestId: number): Promise<void> {
  await privateApi.delete(
    `/boxes/shared/invitations/${requestId}/cancel`,
  );
}

/** 회원 검색 (boxId 기준 초대 상태 포함) */
export async function searchMembers(keyword: string, boxId: number): Promise<MemberSearchPageResponse> {
  const { data } = await privateApi.get<ApiResponse<MemberSearchPageResponse>>(
    '/members/search',
    { params: { keyword, boxId } },
  );
  return data.data;
}
