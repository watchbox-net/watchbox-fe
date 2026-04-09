'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/common/Toast';
import MainContent from '@/components/common/MainContent';
import Header from '@/components/common/Header';
import ListTitle from '@/components/list/ListTitle';
import MemberInviteListItem from '@/components/list/MemberInviteListItem';
import {
  fetchReceivedInvitations,
  fetchSentInvitations,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
  deleteInvitation,
} from '@/lib/api/member';
import type { InvitationReceivedResponse, InvitationSentResponse } from '@/types/member';

export default function BoxInvitationsPage() {
  const router = useRouter();
  const [received, setReceived] = useState<InvitationReceivedResponse[]>([]);
  const [sent, setSent] = useState<InvitationSentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState('');

  useEffect(() => {
    Promise.all([fetchReceivedInvitations(), fetchSentInvitations()])
      .then(([r, s]) => {
        setReceived(r);
        setSent(s);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAccept = async (requestId: number) => {
    try {
      await acceptInvitation(requestId);
      setReceived((prev) => prev.filter((inv) => inv.requestId !== requestId));
      setToast('초대를 수락했습니다.');
    } catch {
      setToast('수락에 실패했습니다.');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectInvitation(requestId);
      setReceived((prev) => prev.filter((inv) => inv.requestId !== requestId));
      setToast('초대를 거절했습니다.');
    } catch {
      setToast('거절에 실패했습니다.');
    }
  };

  const handleCancel = async (requestId: number) => {
    try {
      await cancelInvitation(requestId);
      setSent((prev) => prev.filter((inv) => inv.requestId !== requestId));
      setToast('초대를 취소했습니다.');
    } catch {
      setToast('취소에 실패했습니다.');
    }
  };

  const handleDelete = async (requestId: number) => {
    try {
      await deleteInvitation(requestId);
      setSent((prev) => prev.filter((inv) => inv.requestId !== requestId));
      setToast('초대를 삭제했습니다.');
    } catch {
      setToast('삭제에 실패했습니다.');
    }
  };

  // 받은 초대 중 PENDING만 표시
  const pendingReceived = received.filter((inv) => inv.status === 'PENDING');

  return (
    <>
      <Header variant="back" title="박스 초대 요청" onBack={() => router.back()} />

      <MainContent>
        {loading && (
          <p className="text-center text-wb-grey-02 py-8">불러오는 중...</p>
        )}

        {!loading && (
          <>
            {/* ── 받은 초대 요청 ── */}
            <section className="mt-[35px] mb-[40px]">
              <ListTitle
                title="받은 초대 요청"
                variant="none"
                className="pl-[16px] pr-[12px] mb-[25px]"
              />

              {pendingReceived.length === 0 ? (
                <p className="pl-[16px] text-sm text-wb-grey-02">받은 초대가 없습니다.</p>
              ) : (
                <ul className="px-[16px] space-y-[15px]">
                  {pendingReceived.map((inv) => (
                    <MemberInviteListItem
                      key={inv.requestId}
                      variant="invitation"
                      boxName={inv.sharedBox.name}
                      boxMembers={inv.sharedBox.memberList?.map((m) => m.boxMemberName)}
                      posters={inv.sharedBox.previewPosterList}
                      inviterName={inv.sender}
                      onAccept={() => handleAccept(inv.requestId)}
                      onReject={() => handleReject(inv.requestId)}
                    />
                  ))}
                </ul>
              )}
            </section>

            {/* ── 보낸 초대 요청 ── */}
            <section>
              <ListTitle
                title="보낸 초대 요청"
                variant="none"
                className="pl-[16px] pr-[12px] mb-[25px]"
              />

              {sent.length === 0 ? (
                <p className="pl-[16px] text-sm text-wb-grey-02">보낸 초대가 없습니다.</p>
              ) : (
                <ul className="px-[16px]">
                  {sent.map((inv) => (
                    <MemberInviteListItem
                      key={inv.requestId}
                      variant="status"
                      userName={inv.receiver}
                      boxName={inv.sharedBoxTitle}
                      status={inv.status === 'REJECTED' ? 'rejected' : 'pending'}
                      onAction={
                        inv.status === 'PENDING'
                          ? () => handleCancel(inv.requestId)
                          : () => handleDelete(inv.requestId)
                      }
                      className="py-[10px]"
                    />
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </MainContent>

      <Toast message={toast} visible={!!toast} onClose={() => setToast('')} />
    </>
  );
}
