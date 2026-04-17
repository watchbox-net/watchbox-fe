'use client';

import { useState } from 'react';
import Link from 'next/link';
import SheetContentItem from '@/components/sheet/SheetContentItem';
import SheetBoxItem from '@/components/sheet/SheetBoxItem';
import ContentBoxSheetHead from '@/components/sheet/ContentBoxSheetHead';
import ContentBoxSheet, { SheetBox } from '@/components/sheet/ContentBoxSheet';

const SAMPLE_POSTER1 = 'https://image.tmdb.org/t/p/w185/o0d6Us9VWOW0nHhoB7ZNIwigARG.jpg';
const SAMPLE_POSTER2 = 'https://image.tmdb.org/t/p/w185/ib6v6qUXzez1x2qIOLN7C0yJNPQ.jpg';
const SAMPLE_POSTER3 = 'https://image.tmdb.org/t/p/w185/l18o0AK18KS118tWeROOKYkF0ng.jpg';

const SAMPLE_CONTENT = {
  posterSrc: SAMPLE_POSTER3,
  title: '아바타: 불과 재',
  year: 2025,
  genres: ['SF', '모험', '판타지'],
};

const SAMPLE_BOXES_3: SheetBox[] = [
  {
    boxId: 1,
    type: 'MY',
    name: '기본 박스',
    posters: [SAMPLE_POSTER1, SAMPLE_POSTER2, SAMPLE_POSTER3],
    included: true,
  },
  {
    boxId: 2,
    type: 'MY',
    name: '액션',
    posters: [SAMPLE_POSTER2, SAMPLE_POSTER3, SAMPLE_POSTER1],
    included: false,
  },
  {
    boxId: 3,
    type: 'SHARED',
    name: '너구리와 해달의 즐겁고 무서운  공유 박스',
    memberNames: ['너구리', '해달'],
    posters: [SAMPLE_POSTER3, SAMPLE_POSTER1, SAMPLE_POSTER2],
    included: false,
  },
];

const SAMPLE_BOXES_1: SheetBox[] = [SAMPLE_BOXES_3[0]];

const SAMPLE_BOXES_7: SheetBox[] = [
  ...SAMPLE_BOXES_3,
  { boxId: 4, type: 'MY', name: '공포', posters: [SAMPLE_POSTER1], included: false },
  { boxId: 5, type: 'MY', name: '코미디', posters: [SAMPLE_POSTER2], included: true },
  { boxId: 6, type: 'SHARED', name: '친구들과 공유', memberNames: ['친구A', '친구B'], posters: [SAMPLE_POSTER3, SAMPLE_POSTER1], included: false },
  { boxId: 7, type: 'MY', name: '즐겨찾기', posters: [SAMPLE_POSTER2, SAMPLE_POSTER3], included: false },
];

export default function SheetComponentsPage() {
  const [sheetVisible, setSheetVisible] = useState(false);
  const [sheetBoxes, setSheetBoxes] = useState<SheetBox[]>(SAMPLE_BOXES_3);

  const openSheet = (boxes: SheetBox[]) => {
    setSheetBoxes(boxes);
    setSheetVisible(true);
  };

  const handleToggleBox = (boxId: number) => {
    setSheetBoxes((prev) =>
      prev.map((b) => (b.boxId === boxId ? { ...b, included: !b.included } : b)),
    );
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / Sheet</h1>
      </div>

      {/* ── Content Box Sheet Head ─────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Content Box Sheet Head</h2>
        <div className="bg-wb-dark-02 rounded-lg overflow-hidden">
          <ContentBoxSheetHead onDone={() => alert('완료')} />
        </div>
      </section>

      {/* ── Sheet Content Item ─────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Sheet Content Item</h2>
        <div className="bg-wb-dark-02 rounded-lg">
          <SheetContentItem
            posterSrc={SAMPLE_POSTER3}
            title="아바타: 불과 재"
            year={2025}
            genres={['SF', '모험', '판타지']}
          />
        </div>
      </section>

      {/* ── Sheet Box Item ─────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Sheet Box Item</h2>
        <div className="bg-wb-dark-02 rounded-lg py-[12px] space-y-[15px]">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2 px-[16px]">type: my, included: true (added)</p>
            <SheetBoxItem
              type="MY"
              name="기본 박스"
              posters={[SAMPLE_POSTER1, SAMPLE_POSTER2, SAMPLE_POSTER3]}
              included={true}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2 px-[16px]">type: my, included: false (outline)</p>
            <SheetBoxItem
              type="MY"
              name="액션"
              posters={[SAMPLE_POSTER2, SAMPLE_POSTER3, SAMPLE_POSTER1]}
              included={false}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2 px-[16px]">type: shared</p>
            <SheetBoxItem
              type="SHARED"
              name="너구리와 해달의 즐겁고 무서운  공유 박스"
              memberNames={['너구리', '해달']}
              posters={[SAMPLE_POSTER3, SAMPLE_POSTER1, SAMPLE_POSTER2]}
              included={false}
            />
          </div>
        </div>
      </section>

      {/* ── Content Box Sheet ──────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Content Box Sheet</h2>
        <div className="flex gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => openSheet(SAMPLE_BOXES_1)}
            className="bg-wb-dark-04 text-white px-4 py-2 rounded-[8px] text-sm cursor-pointer"
          >
            열기 - 박스 1개 (최소 높이)
          </button>
          <button
            type="button"
            onClick={() => openSheet(SAMPLE_BOXES_3)}
            className="bg-wb-dark-04 text-white px-4 py-2 rounded-[8px] text-sm cursor-pointer"
          >
            열기 - 박스 3개
          </button>
          <button
            type="button"
            onClick={() => openSheet(SAMPLE_BOXES_7)}
            className="bg-wb-dark-04 text-white px-4 py-2 rounded-[8px] text-sm cursor-pointer"
          >
            열기 - 박스 7개 (스크롤)
          </button>
        </div>

        <ContentBoxSheet
          visible={sheetVisible}
          onClose={() => setSheetVisible(false)}
          content={SAMPLE_CONTENT}
          boxes={sheetBoxes}
          onToggleBox={handleToggleBox}
        />
      </section>
    </div>
  );
}
