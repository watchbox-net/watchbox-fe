'use client';

import { useState } from 'react';
import Link from 'next/link';
import ListTitle from '@/components/list/ListTitle';
import ContentListItem from '@/components/list/ContentListItem';
import ContentCard from '@/components/content/ContentCard';
import MemberInviteListItem from '@/components/list/MemberInviteListItem';
import TriplePosterBox from '@/components/box/TriplePosterBox';
import HatMedium from '@/components/box/HatMedium';
import HatSmall from '@/components/box/HatSmall';
import BodyMediumEmpty from '@/components/box/BodyMediumEmpty';
import BodySmallEmpty from '@/components/box/BodySmallEmpty';
import Image from 'next/image';

const SAMPLE_POSTER1 = 'https://image.tmdb.org/t/p/w185/o0d6Us9VWOW0nHhoB7ZNIwigARG.jpg'; // 더 립
const SAMPLE_POSTER2 = 'https://image.tmdb.org/t/p/w185/ib6v6qUXzez1x2qIOLN7C0yJNPQ.jpg'; // 주토피아2
const SAMPLE_POSTER3 = 'https://image.tmdb.org/t/p/w185/l18o0AK18KS118tWeROOKYkF0ng.jpg'; // 아바타 불과 재

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
          <p className="text-sm font-semibold text-neutral-600 mb-2">공유 박스 (공유 멤버 표시)</p>
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
              boxMembers={['너구리', '해달']}
              inviterName="너구리"
              onAccept={() => alert('수락')}
              onReject={() => alert('거절')}
            />
            <MemberInviteListItem
              variant="invitation"
              boxName="오리와 해달의 공유 박스"
              boxMembers={['오리', '해달']}
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
      </section>

      {/* ── Hat (TriplePosterBox 모자) ───────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Hat (TriplePosterBox 모자)</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-[40px] items-start flex-wrap">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">medium (156×17)</p>
            <HatMedium />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">small (110×12)</p>
            <HatSmall />
          </div>
        </div>
      </section>

      {/* ── Body (TriplePosterBox 바디) ───────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Body (TriplePosterBox 바디)</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-[40px] items-start flex-wrap">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">medium / empty (138×65)</p>
            <BodyMediumEmpty />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">small / empty (97.95×46.14)</p>
            <BodySmallEmpty />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">medium / contents</p>
            <div className="flex border border-wb-dark-01 rounded-b-[5px] shrink-0 overflow-hidden">
              {[
                SAMPLE_POSTER1,
                SAMPLE_POSTER2,
                SAMPLE_POSTER3,
              ].map((src, i) => (
                <div key={i} className="w-[46px] h-[65px] relative shrink-0">
                  <Image src={src} alt="" width={46} height={65} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">small / contents</p>
            <div className="flex border border-wb-dark-01 rounded-b-[5px] shrink-0 overflow-hidden">
              {[
                SAMPLE_POSTER1,
                SAMPLE_POSTER2,
                SAMPLE_POSTER3,
              ].map((src, i) => (
                <div key={i} className="w-[32.65px] h-[46.14px] relative shrink-0">
                  <Image src={src} alt="" width={32.65} height={46.31} className="absolute inset-0 w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TriplePosterBox ──────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">TriplePosterBox</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-[30px] items-start flex-wrap">
          {/* medium empty */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">medium / empty</p>
            <TriplePosterBox size="medium" />
          </div>
          {/* small empty */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">small / empty</p>
            <TriplePosterBox size="small" />
          </div>
          {/* medium contents */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">medium / contents</p>
            <TriplePosterBox
              size="medium"
              posters={[
                SAMPLE_POSTER1,
                SAMPLE_POSTER2,
                SAMPLE_POSTER3,
              ]}
            />
          </div>
          {/* small contents */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">small / contents</p>
            <TriplePosterBox
              size="small"
              posters={[
                SAMPLE_POSTER1,
                SAMPLE_POSTER2,
                SAMPLE_POSTER3,
              ]}
            />
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>medium — w-156, h-hug, gap-2.5, Hat(156×17) + Body(138×65)</p>
          <p>small — w-110, h-hug, gap-2, Hat(110×12) + Body(97.95×46.14)</p>
          <p>empty — BodyEmpty SVG (필름 아이콘)</p>
          <p>contents — 포스터 3장 (1→AAA, 2→ABA, 3→ABC)</p>
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
      </section>
    </div>
  );
}
