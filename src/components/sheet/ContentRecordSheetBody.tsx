'use client';

import { useEffect, useRef, useState, type ReactNode } from 'react';
import MediaTypeButton from '@/components/common/MediaTypeButton';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import SheetContentRecordItem from '@/components/sheet/SheetContentRecordItem';
import { ChevronDownOutline } from '@/components/icons';
import type { ContentItem as ContentItemData } from '@/types/content-summary';
import type { WatchMediaTypeFilter, WatchRecordFilter } from '@/lib/api/watch-record';

// ─── 높이 (피그마 Content Record Sheet Body) ────────────────
/** 6개 리스트가 보이는 높이 */
const MAX_HEIGHT = 635;
/** 결과가 적어도 시트가 찌그러지지 않게 잡아두는 최소 높이 */
const MIN_HEIGHT = 354;

const MEDIA_TABS: { key: WatchMediaTypeFilter; label: string }[] = [
  { key: 'MOVIE_TV', label: '전체' },
  { key: 'MOVIE', label: '영화' },
  { key: 'TV', label: '시리즈' },
];

const STATUS_FILTERS: { key: WatchRecordFilter; label: string }[] = [
  { key: 'ALL', label: '시청 상태' },
  { key: 'COMPLETED', label: '시청 완료' },
  { key: 'WATCHING', label: '시청 중' },
  { key: 'PLANNED', label: '시청 예정' },
  { key: 'PAUSED', label: '시청 중단' },
  { key: 'LIKED', label: '좋아요' },
];

interface ContentRecordSheetBodyProps {
  items: ContentItemData[];
  /** contentId → 체크 여부 (로컬 상태) */
  checked: Map<number, boolean>;
  onToggle: (contentId: number) => void;

  mediaFilter: WatchMediaTypeFilter;
  onMediaFilterChange: (v: WatchMediaTypeFilter) => void;
  statusFilter: WatchRecordFilter;
  onStatusFilterChange: (v: WatchRecordFilter) => void;

  /** 무한스크롤 sentinel */
  sentinelSlot?: ReactNode;
  isLoading?: boolean;
}

/**
 * Content Record Sheet Body — 필터 줄 + 시청 기록 리스트
 *
 * <p>리스트만 스크롤한다. 필터 줄은 위에 고정 — 스크롤 중에도 탭을 바꿀 수 있어야 한다.
 *
 * <p>정렬 드롭다운이 없다. 서버가 최근 기록순으로 고정했다 — 체크 상태를 유지한 채
 * 목록이 재배치되면 무엇을 고르고 있었는지 잃는다.
 */
export default function ContentRecordSheetBody({
  items,
  checked,
  onToggle,
  mediaFilter,
  onMediaFilterChange,
  statusFilter,
  onStatusFilterChange,
  sentinelSlot,
  isLoading,
}: ContentRecordSheetBodyProps) {
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const statusMenuRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 필터 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (statusMenuRef.current && !statusMenuRef.current.contains(e.target as Node)) {
        setStatusMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // 필터가 바뀌면 목록이 통째로 갈리므로 스크롤을 맨 위로 되돌린다
  useEffect(() => {
    listRef.current?.scrollTo({ top: 0 });
  }, [mediaFilter, statusFilter]);

  const statusLabel = STATUS_FILTERS.find((f) => f.key === statusFilter)?.label ?? '시청 상태';

  return (
    <div
      className="bg-wb-dark-02 flex flex-col"
      style={{ minHeight: MIN_HEIGHT, maxHeight: MAX_HEIGHT }}
    >
      {/* ── 필터 줄 (고정) ───────────────────────── */}
      <div className="shrink-0 flex items-center justify-between pl-[16px] pr-[16px] pt-[12px] pb-[8px]">
        <div className="flex items-center gap-[8px]">
          {MEDIA_TABS.map(({ key, label }) => (
            <MediaTypeButton
              key={key}
              selected={mediaFilter === key}
              onClick={() => onMediaFilterChange(key)}
            >
              {label}
            </MediaTypeButton>
          ))}
        </div>

        <div ref={statusMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setStatusMenuOpen((v) => !v)}
            className="flex items-center gap-[2px] text-[14px] text-wb-white-02"
          >
            {statusLabel}
            <ChevronDownOutline className="size-[16px] text-wb-white-02" />
          </button>
          {statusMenuOpen && (
            <div className="absolute right-0 top-full mt-[6px] z-50">
              <PlainContextMenu
                size="w120"
                items={STATUS_FILTERS.map(({ key, label }) => ({
                  label,
                  onClick: () => { onStatusFilterChange(key); setStatusMenuOpen(false); },
                }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 리스트 (스크롤) ──────────────────────── */}
      <div ref={listRef} className="flex-1 overflow-y-auto scrollbar-hide">
        {items.map((item) => {
          const contentId = item.contentSummary.contentId;
          if (contentId == null) return null;
          return (
            <SheetContentRecordItem
              key={contentId}
              summary={item.contentSummary}
              watchStatus={item.memberRecord?.watchStatus}
              liked={item.memberRecord?.liked ?? false}
              checked={checked.get(contentId) ?? item.hasAddedInbox ?? false}
              onToggle={() => onToggle(contentId)}
            />
          );
        })}

        {!isLoading && items.length === 0 && (
          <p className="pt-[60px] text-center text-[14px] text-wb-grey-03">
            시청 기록이 없습니다.
          </p>
        )}

        {sentinelSlot}
      </div>
    </div>
  );
}
