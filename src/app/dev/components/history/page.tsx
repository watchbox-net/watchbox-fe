'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import BoxHistory from '@/components/box/BoxHistory';
import BoxHistoryList from '@/components/box/BoxHistoryList';
import type { BoxHistoryItem } from '@/components/box/BoxHistory';
import ContentRecordHistory from '@/components/content/ContentRecordHistory';
import ContentRecordHistoryList from '@/components/content/ContentRecordHistoryList';
import type { ContentRecordHistoryItem } from '@/components/content/ContentRecordHistory';

const B = ({ children }: { children: ReactNode }) => (
  <span className="font-semibold">{children}</span>
);

const SAMPLE_ITEM: BoxHistoryItem = {
  profileImageUrl: null,
  content: <><B>{'{사용자명}'}</B>님이 <B>{'{콘텐츠명}'}</B>을 박스에 <B>추가</B></>,
  date: '2026-06-01 19:17:51',
};

const SAMPLE_LIST: BoxHistoryItem[] = [
  { profileImageUrl: null, content: <><B>{'{사용자명}'}</B>님이 <B>{'{콘텐츠명}'}</B>을 박스에 <B>추가</B></>, date: '2026-06-01 19:17:51' },
  { profileImageUrl: null, content: <><B>{'{사용자명}'}</B>님이 <B>{'{콘텐츠명}'}</B>을 박스에서 <B>삭제</B></>, date: '2026-06-01 19:17:51' },
  { profileImageUrl: null, content: <><B>{'{사용자명}'}</B>님이 박스 멤버로 <B>합류</B></>, date: '2026-06-01 19:17:51' },
];

// 시청 기록 히스토리 샘플 (시청 상태 변경 / 좋아요 등록 혼합)
const RECORD_LIST: ContentRecordHistoryItem[] = [
  { posterUrl: null, contentTitle: '{콘텐츠명}', type: 'status-registered', watchStatus: 'planned', date: '2026-06-01 19:17:51' },
  { posterUrl: null, contentTitle: '{콘텐츠명}', type: 'status-changed', oldStatus: 'planned', watchStatus: 'watching', date: '2026-06-01 19:17:51' },
  { posterUrl: null, contentTitle: '{콘텐츠명}', type: 'like', date: '2026-06-01 19:17:51' },
  { posterUrl: null, contentTitle: '{콘텐츠명}', type: 'status-changed', oldStatus: 'watching', watchStatus: 'completed', date: '2026-06-01 19:17:51' },
  { posterUrl: null, contentTitle: '{콘텐츠명}', type: 'like-removed', date: '2026-06-01 19:17:51' },
  { posterUrl: null, contentTitle: '{콘텐츠명}', type: 'status-registered', watchStatus: 'completed', date: '2026-06-01 19:17:51' },
];

export default function BoxHistoryComponentsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / History</h1>
      </div>

      {/* ── Box History (단일 항목) ─────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Box History</h2>

        <div className="bg-wb-dark-02 rounded-lg py-4">
          <BoxHistory item={SAMPLE_ITEM} />
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>멤버 이미지(28px) + 내용(14px, white) + 날짜(11px, grey-03)</p>
          <p>좌우 패딩 16px, 이미지-텍스트 간격 10px, 내용-날짜 간격 7px</p>
          <p>profileImageUrl이 없으면 기본 ProfileIcon 표시</p>
        </div>
      </section>

      {/* ── Box History List ───────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Box History List</h2>

        <div className="bg-wb-dark-02 rounded-lg">
          <BoxHistoryList items={SAMPLE_LIST} />
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>항목 간격 25px, 위아래 패딩 15px</p>
        </div>
      </section>

      {/* ── Content Record History (단일 항목) ─────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Content Record History</h2>

        <div className="bg-wb-dark-02 rounded-lg py-4 space-y-4">
          <ContentRecordHistory
            item={{ posterUrl: null, contentTitle: '{콘텐츠명}', type: 'status-registered', watchStatus: 'completed', date: '2026-06-01 19:17:51' }}
          />
          <ContentRecordHistory
            item={{ posterUrl: null, contentTitle: '{콘텐츠명}', type: 'status-changed', oldStatus: 'watching', watchStatus: 'completed', date: '2026-06-01 19:17:51' }}
          />
          <ContentRecordHistory
            item={{ posterUrl: null, contentTitle: '{콘텐츠명}', type: 'like', date: '2026-06-01 19:17:51' }}
          />
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>포스터(small) + 내용(14px, white) + 시청상태/좋아요 아이콘(medium, 24px)</p>
          <p>두 종류: 시청 상태 변경 / 좋아요 등록</p>
          <p>좌우 패딩 16px, 포스터-텍스트 간격 10px, 내용-날짜 간격 7px</p>
        </div>
      </section>

      {/* ── Content Record History List ────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Content Record History List</h2>

        <div className="bg-wb-dark-02 rounded-lg">
          <ContentRecordHistoryList items={RECORD_LIST} />
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>항목 간격 20px, 위아래 패딩 10px</p>
        </div>
      </section>

      {/* ── 모바일 사이즈 미리보기 (MobileFrame) ──────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">모바일 사이즈 미리보기</h2>

        <div className="flex flex-wrap justify-center gap-6">
          {/* 박스 콘텐츠 히스토리 */}
          <div className="relative w-full max-w-[430px] bg-wb-dark-02 rounded-[20px] overflow-hidden shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
            <div className="h-[56px] flex items-center justify-center border-b border-wb-dark-04">
              <span className="text-white text-[16px] font-semibold">박스 콘텐츠 히스토리</span>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              <BoxHistoryList items={SAMPLE_LIST} />
            </div>
          </div>

          {/* 시청 기록 히스토리 */}
          <div className="relative w-full max-w-[430px] bg-wb-dark-02 rounded-[20px] overflow-hidden shadow-[rgba(100,100,111,0.2)_0px_7px_29px_0px]">
            <div className="h-[56px] flex items-center justify-center border-b border-wb-dark-04">
              <span className="text-white text-[16px] font-semibold">시청 기록 히스토리</span>
            </div>
            <div className="overflow-y-auto max-h-[600px]">
              <ContentRecordHistoryList items={RECORD_LIST} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
