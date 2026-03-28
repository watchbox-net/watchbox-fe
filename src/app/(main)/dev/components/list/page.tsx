'use client';

import { useState } from 'react';
import Link from 'next/link';
import ListTitle from '@/components/list/ListTitle';
import ContentListItem from '@/components/list/ContentListItem';
import ContentCard from '@/components/content/ContentCard';
import MemberInviteListItem from '@/components/list/MemberInviteListItem';

export default function ListComponentsPage() {
  // MemberInviteListItem - search 상태 관리 (1번 인덱스는 초기에 checked)
  const [addedIds, setAddedIds] = useState<Set<number>>(new Set([1]));
  const toggle = (id: number) =>
    setAddedIds((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; });

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / List</h1>
      </div>

      {/* ── ListTitle ─────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">List Title</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 space-y-6">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">none (제목만)</p>
            <ListTitle title="시리즈" />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">arrow (더보기)</p>
            <ListTitle title="인기 영화" variant="arrow" onAction={() => alert('arrow')} />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">kebab (메뉴)</p>
            <ListTitle title="마이 박스" variant="kebab" onAction={() => alert('kebab')} />
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>레이아웃 — flex, justify-between, pl-[16px] pr-[12px]</p>
          <p>제목 — 20px Bold, lh:1, text-white</p>
          <p>아이콘 — heroicons solid 26px, text-white</p>
          <p>variant: none(제목만), arrow(ChevronRight), kebab(EllipsisVertical)</p>
        </div>
      </section>

      {/* ── ContentListItem ─────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Content List Item</h2>

        {/* 마이 박스 예시 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-neutral-600 mb-2">마이 박스 (liked 표시)</p>
          <div className="bg-wb-dark-02 rounded-lg">
            <ContentListItem
              title="더 립"
              year={2025}
              genres={['액션', '스릴러', '범죄']}
              watchStatus="WATCHING"
              boxMode={{ mode: 'my', liked: false }}
            />
            <ContentListItem
              title="주토피아 2"
              year={2025}
              genres={['애니메이션', '코미디', '모험']}
              watchStatus="WATCHING"
              boxMode={{ mode: 'my', liked: true }}
            />
            <ContentListItem
              title="아바타: 불과 재"
              year={2025}
              genres={['SF', '모험', '판타지']}
              watchStatus="PLANNED"
              boxMode={{ mode: 'my', liked: false }}
            />
            <ContentListItem
              title="프레데터: 죽음의 땅"
              year={2025}
              genres={['액션', 'SF', '모험']}
              watchStatus="COMPLETED"
              boxMode={{ mode: 'my', liked: true }}
              showDivider={false}
            />
          </div>
        </div>

        {/* 공유 박스 예시 */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-neutral-600 mb-2">공유 박스 (게시자 표시)</p>
          <div className="bg-wb-dark-02 rounded-lg">
            <ContentListItem
              title="더 립"
              year={2025}
              genres={['액션', '스릴러', '범죄']}
              watchStatus="PLANNED"
              boxMode={{ mode: 'shared', publishers: ['사용자A', '사용자B'] }}
            />
            <ContentListItem
              title="주토피아 2"
              year={2025}
              genres={['애니메이션', '코미디', '모험']}
              watchStatus="WATCHING"
              boxMode={{ mode: 'shared', publishers: ['사용자A', '사용자B'] }}
            />
            <ContentListItem
              title="스폰지밥 무비: 네모바지를 찾아서"
              year={2025}
              genres={['애니메이션', '가족', '코미디']}
              watchStatus="PLANNED"
              boxMode={{ mode: 'shared', publishers: ['사용자A'] }}
              showDivider={false}
            />
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>레이아웃 — flex, items-center, justify-between, px-[16px], py-[11px]</p>
          <p>포스터 — Poster small (60×90, rounded-[5px])</p>
          <p>제목 — 16px Medium, text-white, truncate</p>
          <p>정보 — 12px Regular, text-wb-grey-02, &ldquo;연도 · 장르&rdquo;</p>
          <p>멤버정보 — 10px, my: 좋아요(wb-red), shared: 게시자(wb-primary)</p>
          <p>아이콘 — WatchStatusIcon medium (24px)</p>
          <p>구분선 — 0.5px, bg-wb-dark-05</p>
        </div>
      </section>

      {/* ── MemberInviteListItem ────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Member Invite List Item</h2>

        {/* search */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-neutral-600 mb-2">Searched Member List</p>
          <div className="bg-wb-dark-02 rounded-lg px-[16px]">
            {['너구리 1', '너구리 2', '너구리 3', '너구리 4', '너구리 5'].map((name, i) => (
              <MemberInviteListItem
                key={i}
                variant="search"
                name={name}
                added={addedIds.has(i)}
                onAdd={() => toggle(i)}
              />
            ))}
          </div>
        </div>

        {/* invitation */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-neutral-600 mb-2">Member Invitation List</p>
          <div className="bg-wb-dark-02 rounded-lg px-[16px] space-y-[15px] py-[12px]">
            <MemberInviteListItem
              variant="invitation"
              boxName="너구리와 해달의 공유 박스"
              boxMembers="멤버: 너구리, 해달"
              inviterName="너구리"
              onAccept={() => alert('수락')}
              onReject={() => alert('거절')}
            />
            <MemberInviteListItem
              variant="invitation"
              boxName="오리와 해달의 공유 박스"
              boxMembers="멤버: 오리, 해달"
              inviterName="오리"
              onAccept={() => alert('수락')}
              onReject={() => alert('거절')}
            />
          </div>
        </div>

        {/* status */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-neutral-600 mb-2">Invitation Status List</p>
          <div className="bg-wb-dark-02 rounded-lg px-[16px]">
            <MemberInviteListItem
              variant="status"
              userName="사용자A"
              boxName="공유 박스A"
              status="pending"
              onAction={() => alert('취소')}
              className=""
            />
            <MemberInviteListItem
              variant="status"
              userName="사용자B"
              boxName="공유 박스A"
              status="pending"
              onAction={() => alert('취소')}
              className=""
            />
            <MemberInviteListItem
              variant="status"
              userName="사용자C"
              boxName="공유 박스A"
              status="rejected"
              onAction={() => alert('삭제')}
              className=""
            />
            <MemberInviteListItem
              variant="status"
              userName="사용자A"
              boxName="공유 박스B"
              status="pending"
              onAction={() => alert('취소')}
            />
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>search — ProfileIcon list(28px) + 이름 18px Regular wb-white-02 + AddedStatusIcon(add/checked)</p>
          <p>invitation — 박스 썸네일(148×81) + 박스명 16px Medium + 멤버 12px wb-primary / ProfileIcon + 초대자 14px wb-grey-02 + 수락(green)/거절(dark) 버튼 55×28</p>
          <p>status — ProfileIcon + 메시지 14px white + 상태 11px wb-grey-02 / 취소(dark) or 삭제(red) 버튼 55×28</p>
          <p>버튼 — h-28px w-55px, rounded-8px, 13px Medium, shadow-xs</p>
        </div>
      </section>

      {/* ── ContentCard ────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Content Card</h2>

        <div className="bg-wb-dark-01 rounded-lg p-6">
          <p className="text-xs font-semibold text-neutral-500 mb-3">카드 스크롤 예시</p>
          <div className="flex gap-[15px] overflow-x-auto pb-2">
            <ContentCard title="더 립" rating={7.1} />
            <ContentCard title="주토피아 2" rating={7.6} />
            <ContentCard title="아바타: 불과 재" rating={7.3} />
            <ContentCard title="스폰지밥 무비: 네모바지를 찾아서" rating={6.5} />
            <ContentCard title="프레데터: 죽음의 땅" rating={7.8} />
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>크기 — 140×270 (Poster large 140×199 + 하단 71px)</p>
          <p>하단 배경 — bg-wb-dark-02, rounded-b-[10px]</p>
          <p>제목 — 14px Medium, text-white, text-center, truncate</p>
          <p>평점 — 14px Medium, text-wb-green, tracking-[1.4px]</p>
          <p>아이콘 — BoxIcon small(20px) + WatchStatusIcon small(20px), gap-[8px]</p>
        </div>
      </section>
    </div>
  );
}
