'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import ContentItem from '@/components/list/ContentItem';
import ContentList from '@/components/list/ContentList';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import Toast from '@/components/common/Toast';
import MainContent from '@/components/common/MainContent';
import { ChevronDownOutline } from '@/components/icons';
import {
  fetchMyRecordedContentPage,
  type WatchMediaTypeFilter,
  type RecordSortOrder,
  type WatchRecordFilter,
} from '@/lib/api/watch-record';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import type { ContentItem as ContentItemData, WatchStatus, ContentPageResponse } from '@/types/content-summary';
import { getContentDetailPath } from '@/lib/utils/content';

// ── 탭 → 미디어타입 필터 매핑 ────────────────────────────────
const TABS: { key: WatchMediaTypeFilter; label: string }[] = [
  { key: 'MOVIE_TV', label: '전체'   },
  { key: 'MOVIE',    label: '영화'   },
  { key: 'TV',       label: '시리즈' },
];

// ── 정렬 라벨 ────────────────────────────────────────────────
const SORT_LABEL: Record<RecordSortOrder, string> = {
  RECENT_SAVED: '최근 저장순',
  OLDEST_SAVED: '오래된 저장순',
  RECENT_YEAR:  '최근 연도순',
  OLDEST_YEAR:  '오래된 연도순',
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

  // ── 쿼리 파라미터 상태 ──
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [sort, setSort] = useState<RecordSortOrder>('RECENT_SAVED');
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
  const queryKey = ['recordedContentPage', watchMediaTypeFilter, sort, watchRecordFilter] as const;

  const {
    data: pageData,
    isLoading: loading,
    isError: error,
  } = useQuery({
    queryKey,
    queryFn: () => fetchMyRecordedContentPage({ watchMediaTypeFilter, sort, watchRecordFilter }),
    enabled: !authLoading && isAuthenticated,
    staleTime: 0,
    refetchOnMount: 'always',
    // 정렬/필터/탭 전환 시 새 데이터 도착 전까지 이전 결과 유지 → 0개 플래시 방지
    placeholderData: keepPreviousData,
  });

  const items = pageData?.contentItemList ?? [];
  const totalCount = pageData?.totalCount ?? 0;

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

  const handleStatusSelect = async (
    item: ContentItemData,
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    setOpenMenuId(null);
    const summary = item.contentSummary;
    if (summary.mediaType !== 'MOVIE' && summary.mediaType !== 'TV') return;
    const success = await changeStatus(summary.tmdbId, summary.mediaType, status);
    if (success) {
      queryClient.setQueryData<ContentPageResponse>(queryKey, (prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          contentItemList: prev.contentItemList.map((i) =>
            (i.memberRecord?.recordId ?? i.contentSummary.tmdbId) ===
            (item.memberRecord?.recordId ?? summary.tmdbId)
              ? { ...i, memberRecord: { recordId: i.memberRecord?.recordId ?? null, liked: i.memberRecord?.liked ?? null, watchStatus: status } }
              : i,
          ),
        };
      });
    }
  };

  const handleDelete = async (item: ContentItemData) => {
    setOpenMenuId(null);
    if (!item.memberRecord?.recordId) return;
    const success = await deleteStatus(item.memberRecord.recordId);
    if (success) {
      queryClient.setQueryData<ContentPageResponse>(queryKey, (prev) => {
        if (!prev) return prev;
        const filtered = prev.contentItemList.filter(
          (i) => i.memberRecord?.recordId !== item.memberRecord?.recordId,
        );
        return { ...prev, contentItemList: filtered, totalCount: prev.totalCount - 1 };
      });
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

      <MainContent>
        {/* ── 카운트 + 정렬/필터 드롭다운 행 ───────── */}
        {!authLoading && isAuthenticated && !error && (
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
                        // WatchStatusFilter('NONE' 포함) → WatchRecordFilter 매핑
                        if (f === 'NONE') return; // content-record variant에는 NONE 없음
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

        {(authLoading || loading) && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}
        {!authLoading && !loading && !isAuthenticated && (
          <div className="flex flex-col items-center gap-[16px] py-[60px]">
            <p className="text-[16px] text-wb-grey-03">로그인 후 이용해 보세요.</p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="h-[40px] px-[24px] bg-wb-green rounded-[8px] text-[14px] font-bold text-wb-white-01"
            >
              로그인
            </button>
          </div>
        )}
        {!loading && isAuthenticated && error && (
          <p className="text-center text-neutral-500 py-8">
            오류가 발생했습니다.
          </p>
        )}
        {!loading && isAuthenticated && !error && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            시청 기록이 없습니다.
          </p>
        )}
        {!loading && isAuthenticated && !error && items.length > 0 && (
          <ContentList>{items.map(renderItem)}</ContentList>
        )}
      </MainContent>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
