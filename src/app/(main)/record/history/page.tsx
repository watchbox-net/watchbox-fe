'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import { Loading } from '@/components/common/Loading';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import ContentRecordHistory, {
  type ContentRecordHistoryItem,
} from '@/components/content/ContentRecordHistory';
import { ChevronDownOutline } from '@/components/icons';
import {
  fetchMyContentRecordHistory,
  type ContentRecordHistoryEntry,
  type ContentRecordHistoryPageResponse,
  type ContentRecordHistorySortOrder,
  type WatchRecordHistoryFilter,
} from '@/lib/api/watch-record';
import { useAuth } from '@/lib/context/AuthContext';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import { getContentDetailPath, getDisplayTitle, getImageUrl } from '@/lib/utils/content';
import type { WatchStatus } from '@/types/content-summary';

// ── 정렬 라벨 (최신순/오래된순) ──────────────────────────────
const SORT_LABEL: Record<ContentRecordHistorySortOrder, string> = {
  RECENT: '최신순',
  OLDEST: '오래된순',
};

// ── 필터 라벨 (트리거 표시용; ALL은 placeholder) ─────────────
const FILTER_LABEL: Record<Exclude<WatchRecordHistoryFilter, 'ALL'>, string> = {
  COMPLETED: '시청 완료',
  WATCHING:  '시청중',
  PLANNED:   '시청 예정',
  PAUSED:    '시청 중단',
  LIKED:     '좋아요',
};

// 백엔드 WatchStatus(대문자) → 아이콘 status(소문자). NONE/null → undefined(해제)
function toIconStatus(ws: WatchStatus | null): ContentRecordHistoryItem['watchStatus'] {
  if (!ws || ws === 'NONE') return undefined;
  return ws.toLowerCase() as ContentRecordHistoryItem['watchStatus'];
}

// 백엔드 히스토리 엔트리 → 표시용 아이템
function toHistoryItem(entry: ContentRecordHistoryEntry): ContentRecordHistoryItem {
  const summary = entry.contentSummary;
  const base = {
    posterUrl: getImageUrl(summary, 'sm'),
    contentTitle: getDisplayTitle(summary),
    date: entry.createdAt.slice(0, 19).replace('T', ' '), // "YYYY-MM-DD HH:MM:SS"
  };
  switch (entry.eventType) {
    case 'LIKE_ADDED':
      return { ...base, type: 'like' };
    case 'LIKE_REMOVED':
      return { ...base, type: 'like-removed' };
    case 'WATCH_STATUS_REGISTERED':
      return { ...base, type: 'status-registered', watchStatus: toIconStatus(entry.newStatus) };
    case 'WATCH_STATUS_CHANGED':
    default:
      return {
        ...base,
        type: 'status-changed',
        oldStatus: toIconStatus(entry.oldStatus),
        watchStatus: toIconStatus(entry.newStatus),
      };
  }
}

export default function RecordHistoryPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [sort, setSort] = useState<ContentRecordHistorySortOrder>('RECENT');
  const [filter, setFilter] = useState<WatchRecordHistoryFilter>('ALL');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (sortMenuRef.current && !sortMenuRef.current.contains(target)) setSortMenuOpen(false);
      if (filterMenuRef.current && !filterMenuRef.current.contains(target)) setFilterMenuOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  const queryParams = { sort, watchRecordHistoryFilter: filter };

  const {
    items,
    sentinelRef,
    isLoading: loading,
    isError: error,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteList<ContentRecordHistoryPageResponse, string | null, ContentRecordHistoryEntry>({
    queryKey: ['contentRecordHistory', sort, filter],
    queryFn: (cursor) => fetchMyContentRecordHistory(queryParams, cursor),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    getItems: (page) => page.historyList,
    getItemKey: (item) => item.contentRecordHistoryId,
    enabled: !authLoading && isAuthenticated,
    staleTime: 0,
  });

  const filterTriggerLabel = filter === 'ALL' ? '시청 상태' : FILTER_LABEL[filter];

  return (
    <>
      <Header variant="back" title="시청 기록 히스토리" onBack={() => router.back()} />

      {/* ── 정렬/필터 라인 (헤더와 gap 10) ──────────────── */}
      <div className="flex items-center justify-end pr-[6px] pt-[10px] gap-[12px]">
        {/* 정렬 드롭다운 (최신순/오래된순) */}
        <div ref={sortMenuRef} className="relative">
          <button
            type="button"
            onClick={() => { setSortMenuOpen((v) => !v); setFilterMenuOpen(false); }}
            className="flex items-center gap-[2px] text-[14px] text-wb-white-02"
          >
            {SORT_LABEL[sort]}
            <ChevronDownOutline className="size-[16px] text-wb-white-02" />
          </button>
          {sortMenuOpen && (
            <div className="absolute right-0 top-full mt-[6px] z-40">
              <PlainContextMenu
                size="w120"
                items={(Object.keys(SORT_LABEL) as ContentRecordHistorySortOrder[]).map((key) => ({
                  label: SORT_LABEL[key],
                  onClick: () => { setSort(key); setSortMenuOpen(false); },
                }))}
              />
            </div>
          )}
        </div>

        {/* 시청 상태 필터 드롭다운 (시청 기록과 동일 값) */}
        <div ref={filterMenuRef} className="relative">
          <button
            type="button"
            onClick={() => { setFilterMenuOpen((v) => !v); setSortMenuOpen(false); }}
            className="flex items-center gap-[2px] text-[14px] text-wb-white-02"
          >
            {filterTriggerLabel}
            <ChevronDownOutline className="size-[16px] text-wb-white-02" />
          </button>
          {filterMenuOpen && (
            <div className="absolute right-0 top-full mt-[6px] z-40">
              <WatchStatusMenu
                variant="content-record"
                selected={filter === 'ALL' ? undefined : filter}
                onFilterChange={(f) => {
                  if (f === 'NONE') return;
                  setFilter(f as WatchRecordHistoryFilter);
                  setFilterMenuOpen(false);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* ── 리스트 (정렬/필터 라인과 gap 10 — 리스트 내부 py-[10px]) ── */}
      <MainContent>
        {!authLoading && !isAuthenticated && (
          <p className="text-center text-wb-grey-03 py-8">로그인 후 이용해 보세요.</p>
        )}
        {loading && <Loading />}
        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">오류가 발생했습니다.</p>
        )}
        {!loading && !error && isAuthenticated && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">히스토리가 없습니다.</p>
        )}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="flex flex-col gap-[20px] py-[10px]">
              {items.map((entry) => {
                const summary = entry.contentSummary;
                return (
                  <ContentRecordHistory
                    key={entry.contentRecordHistoryId}
                    item={toHistoryItem(entry)}
                    onContentClick={() =>
                      router.push(getContentDetailPath(summary.mediaType, summary.tmdbId))
                    }
                  />
                );
              })}
            </div>

            {/* 무한 스크롤 sentinel */}
            {hasNextPage && <div ref={sentinelRef} className="h-px" />}
            {isFetchingNextPage && (
              <p className="text-center text-wb-grey-03 py-4">불러오는 중...</p>
            )}
          </>
        )}
      </MainContent>
    </>
  );
}
