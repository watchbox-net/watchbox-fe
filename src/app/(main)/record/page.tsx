'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import ContentItem from '@/components/list/ContentItem';
import ContentList from '@/components/list/ContentList';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import Toast from '@/components/common/Toast';
import MainContent from '@/components/common/MainContent';
import PreviewOverlay from '@/components/preview/PreviewOverlay';
import { ChevronDownOutline } from '@/components/icons';
import {
  fetchMyRecordedContentPage,
  fetchMyRecordedContentCount,
  type WatchMediaTypeFilter,
  type RecordSortOrder,
  type WatchRecordFilter,
} from '@/lib/api/watch-record';
import {
  fetchPreviewRecordedContentPage,
  fetchPreviewRecordedContentCount,
} from '@/lib/api/preview';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import type {
  ContentItem as ContentItemData,
  WatchStatus,
  ContentCursorPageResponse,
} from '@/types/content-summary';
import { getContentDetailPath } from '@/lib/utils/content';

// ── 탭 → 미디어타입 필터 매핑 ────────────────────────────────
const TABS: { key: WatchMediaTypeFilter; label: string }[] = [
  { key: 'MOVIE_TV', label: '전체'   },
  { key: 'MOVIE',    label: '영화'   },
  { key: 'TV',       label: '시리즈' },
];

// ── 정렬 라벨 ────────────────────────────────────────────────
const SORT_LABEL: Record<RecordSortOrder, string> = {
  RECENT_UPDATED: '최근 기록순',
  OLDEST_UPDATED: '오래된 기록순',
  RECENT_YEAR:    '최근 연도순',
  OLDEST_YEAR:    '오래된 연도순',
};

// ── 필터 라벨 (드롭다운 트리거 표시용; ALL은 placeholder) ────
const FILTER_LABEL: Record<Exclude<WatchRecordFilter, 'ALL'>, string> = {
  COMPLETED: '시청 완료',
  WATCHING:  '시청중',
  PLANNED:   '시청 예정',
  PAUSED:    '시청 중단',
  LIKED:     '좋아요',
};

export default function RecordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const isPreview = !authLoading && !isAuthenticated;

  // ── 쿼리 파라미터 상태 ──
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [sort, setSort] = useState<RecordSortOrder>('RECENT_UPDATED');
  const [watchRecordFilter, setWatchRecordFilter] = useState<WatchRecordFilter>('ALL');

  // ── 메뉴 열림 상태 ──
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const [toast, setToast] = useState({ visible: false, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) => setToast({ visible: true, message });

  const { changeStatus, deleteStatus } = useWatchStatus({ showToast });

  const watchMediaTypeFilter = TABS[activeTabIndex].key;
  const queryParams = { watchMediaTypeFilter, sort, watchRecordFilter };

  const queryKey = [
    'recordedContentPage',
    watchMediaTypeFilter,
    sort,
    watchRecordFilter,
    isPreview ? 'preview' : 'auth',
  ] as const;

  // ── 시청 기록 무한 스크롤 (cursor 기반) ──
  const {
    items,
    sentinelRef,
    isLoading: loading,
    isError: error,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteList<ContentCursorPageResponse, string | null, ContentItemData>({
    queryKey,
    queryFn: (cursor) =>
      isPreview
        ? fetchPreviewRecordedContentPage(queryParams, cursor)
        : fetchMyRecordedContentPage(queryParams, cursor),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    getItems: (page) => page.contentItemList,
    // 안전망 dedup — recordId가 있으면 그걸로, 없으면 mediaType+tmdbId
    getItemKey: (item) =>
      item.memberRecord?.recordId != null
        ? `r:${item.memberRecord.recordId}`
        : `t:${item.contentSummary.mediaType}:${item.contentSummary.tmdbId}`,
    enabled: !authLoading,
    staleTime: isPreview ? 1000 * 60 * 5 : 0,
  });

  // ── 시청 기록 총 개수 (필터 적용 — 필터 변경 시 재호출) ──
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['recordedContentCount', watchMediaTypeFilter, sort, watchRecordFilter, isPreview ? 'preview' : 'auth'],
    queryFn: () =>
      isPreview
        ? fetchPreviewRecordedContentCount(queryParams)
        : fetchMyRecordedContentCount(queryParams),
    enabled: !authLoading,
    staleTime: 1000 * 60 * 5,
  });

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      const target = e.target as Node;
      if (menuRef.current && !menuRef.current.contains(target)) setOpenMenuId(null);
      if (sortMenuRef.current && !sortMenuRef.current.contains(target)) setSortMenuOpen(false);
      if (filterMenuRef.current && !filterMenuRef.current.contains(target)) setFilterMenuOpen(false);
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // 낙관적 업데이트: InfiniteData 구조의 각 page를 순회하며 항목 갱신
  const updateItemInCache = (
    matchId: number,
    updater: (item: ContentItemData) => ContentItemData,
  ) => {
    queryClient.setQueryData<InfiniteData<ContentCursorPageResponse, string | null>>(
      queryKey,
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            contentItemList: page.contentItemList.map((i) =>
              (i.memberRecord?.recordId ?? i.contentSummary.tmdbId) === matchId
                ? updater(i)
                : i,
            ),
          })),
        };
      },
    );
  };

  const removeItemFromCache = (recordId: number) => {
    queryClient.setQueryData<InfiniteData<ContentCursorPageResponse, string | null>>(
      queryKey,
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            contentItemList: page.contentItemList.filter(
              (i) => i.memberRecord?.recordId !== recordId,
            ),
          })),
        };
      },
    );
  };

  const handleStatusSelect = async (
    item: ContentItemData,
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    setOpenMenuId(null);
    const summary = item.contentSummary;
    if (summary.mediaType !== 'MOVIE' && summary.mediaType !== 'TV') return;
    const success = await changeStatus(summary.tmdbId, summary.mediaType, status);
    if (success) {
      const matchId = item.memberRecord?.recordId ?? summary.tmdbId;
      updateItemInCache(matchId, (i) => ({
        ...i,
        memberRecord: {
          recordId: i.memberRecord?.recordId ?? null,
          liked: i.memberRecord?.liked ?? null,
          watchStatus: status,
        },
      }));
    }
  };

  const handleDelete = async (item: ContentItemData) => {
    setOpenMenuId(null);
    if (!item.memberRecord?.recordId) return;
    const success = await deleteStatus(item.memberRecord.recordId);
    if (success) {
      removeItemFromCache(item.memberRecord.recordId);
      // 총 개수도 감소 (별도 캐시이므로 직접 갱신)
      queryClient.setQueryData<number>(
        ['recordedContentCount', isPreview ? 'preview' : 'auth'],
        (prev) => (typeof prev === 'number' ? Math.max(0, prev - 1) : prev),
      );
    }
  };

  const renderItem = (item: ContentItemData) => {
    const summary = item.contentSummary;
    const itemId = item.memberRecord?.recordId ?? summary.tmdbId;
    const isMenuOpen = openMenuId === itemId;

    const menu: ReactNode = isMenuOpen ? (
      <div
        ref={menuRef}
        className={`absolute right-0 z-50 ${menuDir === 'down' ? 'top-full mt-1' : 'bottom-full mb-1'}`}
      >
        <WatchStatusMenu
          onSelect={(status) => handleStatusSelect(item, status)}
          onDelete={() => handleDelete(item)}
        />
      </div>
    ) : null;

    return (
      <ContentItem
        key={itemId}
        summary={summary}
        watchStatus={item.memberRecord?.watchStatus ?? null}
        boxMode={{ mode: 'my', liked: item.memberRecord?.liked === true }}
        onClick={() => router.push(getContentDetailPath(summary.mediaType, summary.tmdbId))}
        onStatusClick={(e) => {
          // Preview 모드: 시청 상태 변경 차단 → 로그인 모달
          if (isPreview) { showLoginModal(); return; }
          if (!authLoading && !isAuthenticated) { showLoginModal(); return; }
          if (isMenuOpen) { setOpenMenuId(null); return; }
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setMenuDir(window.innerHeight - rect.bottom < 220 ? 'up' : 'down');
          setOpenMenuId(itemId);
        }}
        statusMenuSlot={menu}
      />
    );
  };

  const filterTriggerLabel = watchRecordFilter === 'ALL'
    ? '시청 상태'
    : FILTER_LABEL[watchRecordFilter];

  return (
    <>
      <Header variant="center" title="시청 기록" />
      <TabNav
        tabs={TABS.map((t) => t.label)}
        activeIndex={activeTabIndex}
        onChange={setActiveTabIndex}
      />

      <MainContent className="relative">
        {/* ── 카운트 + 정렬/필터 드롭다운 행 ───────── */}
        {!loading && !error && (
          <div className="flex items-center justify-between pl-[16px] pr-[6px] pt-[13px]">
            <span className="text-[14px] text-wb-grey-04">{totalCount}개</span>

            <div className="flex items-center gap-[12px]">
              {/* 정렬 드롭다운 */}
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
                      items={(Object.keys(SORT_LABEL) as RecordSortOrder[]).map((key) => ({
                        label: SORT_LABEL[key],
                        onClick: () => { setSort(key); setSortMenuOpen(false); },
                      }))}
                    />
                  </div>
                )}
              </div>

              {/* 시청 상태 필터 드롭다운 */}
              <div ref={filterMenuRef} className="relative">
                <button
                  type="button"
                  onClick={() => { setFilterMenuOpen((v) => !v); setSortMenuOpen(false); }}
                  className="flex items-center gap-[2px] text-[14px] text-wb-white-02"
                >
                  {filterTriggerLabel}
                  <ChevronDownOutline className="size-[16px] text-wb-white-02"/>
                </button>
                {filterMenuOpen && (
                  <div className="absolute right-0 top-full mt-[6px] z-40">
                    <WatchStatusMenu
                      variant="content-record"
                      selected={watchRecordFilter === 'ALL' ? undefined : watchRecordFilter}
                      onFilterChange={(f) => {
                        if (f === 'NONE') return;
                        setWatchRecordFilter(f as WatchRecordFilter);
                        setFilterMenuOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {loading && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}
        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">
            오류가 발생했습니다.
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            시청 기록이 없습니다.
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <>
            <ContentList>{items.map(renderItem)}</ContentList>

            {/* 무한 스크롤 sentinel — 바닥 200px 전에 다음 페이지 요청 */}
            {hasNextPage && <div ref={sentinelRef} className="h-px" />}

            {isFetchingNextPage && (
              <p className="text-center text-wb-grey-03 py-4">불러오는 중...</p>
            )}
          </>
        )}

        {/* Preview 오버레이 */}
        {isPreview && !loading && items.length > 0 && <PreviewOverlay />}
      </MainContent>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
