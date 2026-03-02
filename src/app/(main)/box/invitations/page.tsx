'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Toast from '@/components/common/Toast';
import {
  fetchReceivedInvitations,
  fetchSentInvitations,
  acceptInvitation,
  rejectInvitation,
  cancelInvitation,
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
      setReceived((prev) =>
        prev.map((inv) =>
          inv.requestId === requestId ? { ...inv, status: 'ACCEPTED' as const } : inv,
        ),
      );
      setToast('초대를 수락했습니다.');
    } catch {
      setToast('수락에 실패했습니다.');
    }
  };

  const handleReject = async (requestId: number) => {
    try {
      await rejectInvitation(requestId);
      setReceived((prev) =>
        prev.map((inv) =>
          inv.requestId === requestId ? { ...inv, status: 'REJECTED' as const } : inv,
        ),
      );
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

  const statusLabel = (status: string) => {
    switch (status) {
      case 'PENDING': return '대기중';
      case 'ACCEPTED': return '수락됨';
      case 'REJECTED': return '거절됨';
      default: return status;
    }
  };

  return (
    <MobileFrame>
      {/* 헤더 */}
      <div className="flex items-center py-4 px-4 relative">
        <button
          onClick={() => router.back()}
          className="text-black text-xl cursor-pointer"
        >
          ‹
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">박스 초대 요청</h1>
        <div className="w-6" />
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {loading && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}

        {!loading && (
          <>
            {/* 받은 초대 요청 */}
            <section className="mb-8">
              <h2 className="text-base font-bold text-black mb-4">받은 초대 요청</h2>
              {received.length === 0 ? (
                <p className="text-sm text-neutral-500">받은 초대가 없습니다.</p>
              ) : (
                <ul className="space-y-4">
                  {received.map((inv) => (
                    <li
                      key={inv.requestId}
                      className="bg-neutral-900 rounded-lg p-4"
                    >
                      <p className="text-sm text-white font-semibold mb-1">
                        {inv.sharedBoxTitle}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center">
                            <span className="text-neutral-400 text-xs">👤</span>
                          </div>
                          <span className="text-sm text-neutral-300">
                            초대자: {inv.sender}
                          </span>
                        </div>

                        {inv.status === 'PENDING' ? (
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleAccept(inv.requestId)}
                              className="px-4 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-semibold cursor-pointer"
                            >
                              수락
                            </button>
                            <button
                              onClick={() => handleReject(inv.requestId)}
                              className="px-4 py-1.5 rounded-lg bg-neutral-700 text-white text-xs font-semibold cursor-pointer"
                            >
                              거절
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-neutral-500">
                            {statusLabel(inv.status)}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* 보낸 초대 요청 */}
            <section>
              <h2 className="text-base font-bold text-black mb-4">보낸 초대 요청</h2>
              {sent.length === 0 ? (
                <p className="text-sm text-neutral-500">보낸 초대가 없습니다.</p>
              ) : (
                <ul className="space-y-4">
                  {sent.map((inv) => (
                    <li
                      key={inv.requestId}
                      className="bg-neutral-900 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full bg-neutral-700 flex items-center justify-center">
                            <span className="text-neutral-400 text-xs">👤</span>
                          </div>
                          <div>
                            <span className="text-sm text-white">
                              {inv.receiver} 님에게 {inv.sharedBoxTitle} 참가 요청
                            </span>
                            <p className="text-xs text-neutral-500 mt-0.5">
                              상태: {statusLabel(inv.status)}
                            </p>
                          </div>
                        </div>

                        {inv.status === 'PENDING' && (
                          <button
                            onClick={() => handleCancel(inv.requestId)}
                            className="px-4 py-1.5 rounded-lg bg-neutral-700 text-white text-xs font-semibold cursor-pointer shrink-0"
                          >
                            취소
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <BottomMenu />
      <Toast message={toast} visible={!!toast} onClose={() => setToast('')} />
    </MobileFrame>
  );
}
