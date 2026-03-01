'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Toast from '@/components/common/Toast';
import { searchMembers, inviteToBox } from '@/lib/api/member';
import type { MemberResponse } from '@/types/member';

export default function BoxInvitePage() {
  const router = useRouter();
  const params = useParams();
  const boxId = Number(params.boxId);

  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState<MemberResponse[]>([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  // 초대 완료된 memberId 목록
  const [invitedIds, setInvitedIds] = useState<Set<number>>(new Set());
  const [toast, setToast] = useState('');

  const handleSearch = async () => {
    const trimmed = keyword.trim();
    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await searchMembers(trimmed);
      setResults(res.memberList);
    } catch {
      setResults([]);
    } finally {
      setSearched(true);
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleInvite = async (memberId: number, nickname: string) => {
    try {
      await inviteToBox(boxId, memberId);
      setInvitedIds((prev) => new Set(prev).add(memberId));
      setToast(`${nickname}님에게 초대를 보냈습니다.`);
    } catch {
      setToast('초대에 실패했습니다.');
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
        <h1 className="text-lg font-bold flex-1 text-center">회원 검색하기</h1>
        <div className="w-6" />
      </div>

      {/* 검색바 */}
      <div className="px-4 mb-4">
        <div className="flex items-center bg-neutral-800 rounded-lg px-3 py-2.5">
          <span className="text-neutral-500 mr-2 text-sm">🔍</span>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="초대할 회원을 검색해보세요"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-neutral-500"
          />
          {keyword && (
            <button
              onClick={() => { setKeyword(''); setResults([]); setSearched(false); }}
              className="text-neutral-500 text-sm cursor-pointer ml-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 검색 결과 */}
      <main className="flex-1 overflow-y-auto pb-24 px-4">
        {loading && (
          <p className="text-center text-neutral-500 py-8">검색 중...</p>
        )}

        {!loading && searched && results.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            검색 결과가 없습니다.
          </p>
        )}

        {!loading && results.length > 0 && (
          <>
            <h2 className="text-sm font-bold text-black mb-3">
              회원 검색 결과
            </h2>
            <ul className="space-y-1">
              {results.map((member) => {
                const isInvited = invitedIds.has(member.memberId);

                return (
                  <li
                    key={member.memberId}
                    className="flex items-center gap-3 py-3"
                  >
                    {/* 프로필 이미지 */}
                    {member.profileImage ? (
                      <img
                        src={member.profileImage}
                        alt={member.nickname}
                        className="w-9 h-9 rounded-full object-cover shrink-0"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-neutral-700 flex items-center justify-center shrink-0">
                        <span className="text-neutral-400 text-xs">👤</span>
                      </div>
                    )}

                    {/* 닉네임 */}
                    <span className="flex-1 text-sm text-black truncate">
                      {member.nickname}
                    </span>

                    {/* 초대 버튼 */}
                    <button
                      onClick={() => handleInvite(member.memberId, member.nickname)}
                      disabled={isInvited}
                      className="shrink-0 cursor-pointer"
                    >
                      {isInvited ? (
                        <span className="w-7 h-7 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">
                          ✓
                        </span>
                      ) : (
                        <span className="w-7 h-7 rounded-full border border-neutral-500 flex items-center justify-center text-neutral-400 text-xs">
                          +
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </main>

      <BottomMenu />
      <Toast message={toast} visible={!!toast} onClose={() => setToast('')} />
    </MobileFrame>
  );
}
