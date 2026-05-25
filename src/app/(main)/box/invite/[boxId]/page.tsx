'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Toast from '@/components/common/Toast';
import Modal from '@/components/common/Modal';
import { Loading } from '@/components/common/Loading';
import MainContent from '@/components/common/MainContent';
import Header from '@/components/common/Header';
import ListTitle from '@/components/list/ListTitle';
import MemberInvitationItem from '@/components/invite/MemberInvitationItem';
import SearchedMemberList from '@/components/invite/SearchedMemberList';
import { MagnifyingGlassOutline, XCircleSolid } from '@/components/icons';
import { searchMembers, inviteToBox } from '@/lib/api/member';
import { fetchBox } from '@/lib/api/box';
import type { MemberSearchResponse } from '@/types/member';

export default function BoxInvitePage() {
  const params = useParams();
  const boxId = Number(params.boxId);

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<MemberSearchResponse[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState('');

  const [boxName, setBoxName] = useState('');
  const [confirmTarget, setConfirmTarget] = useState<{ memberId: number; nickname: string } | null>(null);

  useEffect(() => {
    fetchBox(boxId).then((box) => setBoxName(box.name)).catch(() => {});
  }, [boxId]);

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await searchMembers(trimmed, boxId);
      setResults(res.memberSearchList);
    } catch {
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const handleInviteConfirm = async () => {
    if (!confirmTarget) return;
    const { memberId, nickname } = confirmTarget;
    setConfirmTarget(null);
    try {
      await inviteToBox(boxId, memberId);
      setInvitedIds((prev) => new Set(prev).add(memberId));
      setToast(`${nickname}님에게 초대를 보냈습니다.`);
    } catch {
      setToast('초대에 실패했습니다.');
    }
  };

  const isAdded = (member: MemberSearchResponse) => {
    if (invitedIds.has(member.memberId)) return true;
    return member.boxInviteStatus === 'MEMBER' || member.boxInviteStatus === 'PENDING';
  };

  return (
    <>
      <Header variant="back" title="회원 검색하기" />

      {/* 검색바 */}
      <div className="px-4 pb-[27px]">
        <div className="bg-wb-dark-05 flex items-center h-[36px] pl-4 pr-3 rounded-[10px]">
          <MagnifyingGlassOutline className="size-[17px] text-wb-grey-03 shrink-0" />
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            placeholder="초대할 회원을 검색해보세요"
            className="flex-1 ml-[9px] bg-transparent text-wb-white-02 placeholder:text-wb-grey-03 text-[15px] font-normal leading-none outline-none"
          />
          {keyword && (
            <button
              type="button"
              onClick={() => { setKeyword(''); setResults([]); setSearched(false); }}
              className="shrink-0 ml-1 cursor-pointer"
            >
              <XCircleSolid className="size-[15px] text-wb-grey-03" />
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      <MainContent>
        {loading && <Loading text="검색 중" />}

        {!loading && searched && results.length === 0 && (
          <p className="text-center text-wb-grey-03 py-8">검색 결과가 없습니다.</p>
        )}

        {!loading && results.length > 0 && (
          <>
            <ListTitle
              title="회원 검색 결과"
              variant="none"
              className="pl-[16px] pr-[12px] mb-[25px]"
            />
            <SearchedMemberList>
              {results.map((member) => (
                <MemberInvitationItem
                  key={member.memberId}
                  type="searched"
                  name={member.nickname}
                  added={isAdded(member)}
                  onAdd={() => setConfirmTarget({ memberId: member.memberId, nickname: member.nickname })}
                />
              ))}
            </SearchedMemberList>
          </>
        )}
      </MainContent>

      <Toast message={toast} visible={!!toast} onClose={() => setToast('')} />

      <Modal
        visible={!!confirmTarget}
        variant="invite"
        body={`${confirmTarget?.nickname}님에게 ${boxName} 공유 박스로 초대하겠습니까?`}
        confirmLabel="초대"
        onCancel={() => setConfirmTarget(null)}
        onConfirm={handleInviteConfirm}
      />
    </>
  );
}
