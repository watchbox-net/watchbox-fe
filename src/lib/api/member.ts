import { privateApi } from './client';
import { tokenManager } from './auth';
import type {
  MemberSearchPageResponse,
  InvitationSentResponse,
  InvitationReceivedResponse,
} from '@/types/member';
import type { ApiResponse } from '@/types/api';

function authHeaders() {
  const token = tokenManager.getAccessToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/** 공유 박스에 회원 초대 */
export async function inviteToBox(boxId: number, memberId: number): Promise<InvitationSentResponse> {
  const { data } = await privateApi.post<ApiResponse<InvitationSentResponse>>(
    `/boxes/shared/invitations/${boxId}/${memberId}`,
    null,
    { headers: authHeaders() },
  );
  return data.data;
}

/** 보낸 초대 목록 조회 */
export async function fetchSentInvitations(): Promise<InvitationSentResponse[]> {
  const { data } = await privateApi.get<ApiResponse<InvitationSentResponse[]>>(
    '/boxes/shared/invitations/sent',
    { headers: authHeaders() },
  );
  return data.data;
}

/** 받은 초대 목록 조회 */
export async function fetchReceivedInvitations(): Promise<InvitationReceivedResponse[]> {
  const { data } = await privateApi.get<ApiResponse<InvitationReceivedResponse[]>>(
    '/boxes/shared/invitations/received',
    { headers: authHeaders() },
  );
  return data.data;
}

/** 초대 수락 */
export async function acceptInvitation(requestId: number): Promise<void> {
  await privateApi.patch(
    `/boxes/shared/invitations/accept/${requestId}`,
    null,
    { headers: authHeaders() },
  );
}

/** 초대 거절 */
export async function rejectInvitation(requestId: number): Promise<void> {
  await privateApi.patch(
    `/boxes/shared/invitations/reject/${requestId}`,
    null,
    { headers: authHeaders() },
  );
}

/** 회원 검색 */
export async function searchMembers(keyword: string): Promise<MemberSearchPageResponse> {
  const { data } = await privateApi.get<ApiResponse<MemberSearchPageResponse>>(
    '/members/search',
    {
      params: { keyword },
      headers: authHeaders(),
    },
  );
  return data.data;
}
