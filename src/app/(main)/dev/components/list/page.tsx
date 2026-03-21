'use client';

import Link from 'next/link';
import ListTitle from '@/components/list/ListTitle';

export default function ListComponentsPage() {
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

        {/* 스펙 */}
        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>레이아웃 — flex, justify-between, 패딩 없음 (부모에서 제어)</p>
          <p>제목 — 20px Bold, lh:1, text-white</p>
          <p>아이콘 — heroicons solid 26px, text-white</p>
          <p>variant: none(제목만), arrow(ChevronRight), kebab(EllipsisVertical)</p>
        </div>
      </section>
    </div>
  );
}
