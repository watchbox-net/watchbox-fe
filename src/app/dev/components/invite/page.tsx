'use client';

import { useState } from 'react';
import Link from 'next/link';
import MemberInvitationItem from '@/components/invite/MemberInvitationItem';
import SearchedMemberList from '@/components/invite/SearchedMemberList';
import BoxInvitationReceivedItem from '@/components/invite/BoxInvitationReceivedItem';
import BoxInvitationReceivedList from '@/components/invite/BoxInvitationReceivedList';
import BoxInvitationSendedList from '@/components/invite/BoxInvitationSendedList';

const SAMPLE_POSTER1 = 'https://image.tmdb.org/t/p/w185/o0d6Us9VWOW0nHhoB7ZNIwigARG.jpg';
const SAMPLE_POSTER2 = 'https://image.tmdb.org/t/p/w185/ib6v6qUXzez1x2qIOLN7C0yJNPQ.jpg';
const SAMPLE_POSTER3 = 'https://image.tmdb.org/t/p/w185/l18o0AK18KS118tWeROOKYkF0ng.jpg';

export default function InviteComponentsPage() {
  // Searched Member List — 1, 3 인덱스는 초기에 added
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set([1, 3]));
  const toggle = (id: number) =>
    setAddedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / Invite</h1>
      </div>

      {/* ── MemberInvitationItem (3 types) ───────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Member Invitation Item</h2>
        <div className="bg-wb-dark-02 rounded-lg py-[12px] space-y-[20px]">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2 px-[16px]">type: searched</p>
            <MemberInvitationItem
              type="searched"
              name="너구리 1"
              added={false}
              onAdd={() => alert('add')}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2 px-[16px]">type: received (Box Invitation Received Action Line)</p>
            <MemberInvitationItem
              type="received"
              inviterName="너구리"
              onAccept={() => alert('수락')}
              onReject={() => alert('거절')}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2 px-[16px]">type: sended (Box Invitation Sended Action Line)</p>
            <MemberInvitationItem
              type="sended"
              receiverName="사용자A"
              boxName="공유 박스A"
              status="pending"
              onAction={() => alert('취소')}
            />
          </div>
        </div>
      </section>

      {/* ── Searched Member List ───────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Searched Member List</h2>
        <div className="bg-wb-dark-02 rounded-lg py-[12px]">
          <SearchedMemberList>
            {['너구리 1', '너구리 2', '너구리 3', '너구리 4', '너구리 5'].map((name, i) => (
              <MemberInvitationItem
                key={i}
                type="searched"
                name={name}
                added={addedIds.has(i)}
                onAdd={() => toggle(i)}
              />
            ))}
          </SearchedMemberList>
        </div>
      </section>

      {/* ── Box Invitation Received Item ──────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Box Invitation Received Item</h2>
        <div className="bg-wb-dark-02 rounded-lg py-[12px]">
          <BoxInvitationReceivedItem
            boxName="너구리와 해달의 즐겁고 무서운 공유 박스"
            memberNames={['너구리', '해달']}
            posters={[SAMPLE_POSTER1, SAMPLE_POSTER2, SAMPLE_POSTER3]}
            inviterName="너구리"
            onAccept={() => alert('수락')}
            onReject={() => alert('거절')}
          />
        </div>
      </section>

      {/* ── Box Invitation Received List ──────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Box Invitation Received List</h2>
        <div className="bg-wb-dark-02 rounded-lg py-[12px]">
          <BoxInvitationReceivedList>
            <BoxInvitationReceivedItem
              boxName="너구리와 해달의 즐겁고 무서운 공유 박스"
              memberNames={['너구리', '해달']}
              posters={[SAMPLE_POSTER1, SAMPLE_POSTER2, SAMPLE_POSTER3]}
              inviterName="너구리"
              onAccept={() => alert('수락')}
              onReject={() => alert('거절')}
            />
            <BoxInvitationReceivedItem
              boxName="돌고래와 바다사자의 아찔하고 스릴 있는 공유 박스"
              memberNames={['돌고래', '바다사자']}
              posters={[SAMPLE_POSTER1, SAMPLE_POSTER2, SAMPLE_POSTER3]}
              inviterName="돌고래"
              onAccept={() => alert('수락')}
              onReject={() => alert('거절')}
            />
          </BoxInvitationReceivedList>
        </div>
      </section>

      {/* ── Box Invitation Sended List ────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Box Invitation Sended List</h2>
        <div className="bg-wb-dark-02 rounded-lg py-[12px]">
          <BoxInvitationSendedList>
            <MemberInvitationItem
              type="sended"
              receiverName="사용자A"
              boxName="공유 박스A"
              status="pending"
              onAction={() => alert('취소')}
            />
            <MemberInvitationItem
              type="sended"
              receiverName="사용자B"
              boxName="공유 박스A"
              status="pending"
              onAction={() => alert('취소')}
            />
            <MemberInvitationItem
              type="sended"
              receiverName="사용자C"
              boxName="공유 박스A"
              status="rejected"
              onAction={() => alert('삭제')}
            />
            <MemberInvitationItem
              type="sended"
              receiverName="사용자A"
              boxName="공유 박스B"
              status="pending"
              onAction={() => alert('취소')}
            />
          </BoxInvitationSendedList>
        </div>
      </section>
    </div>
  );
}
