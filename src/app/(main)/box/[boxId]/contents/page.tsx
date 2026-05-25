'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient, type InfiniteData } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import Spinner from '@/components/common/Loading';
import { Loading } from '@/components/common/Loading';
import ContentItem from '@/components/list/ContentItem';
import ContentList from '@/components/list/ContentList';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import MediaTypeButton from '@/components/common/MediaTypeButton';
import MediaTypeSwitchButton from '@/components/common/MediaTypeSwitchButton';
import Toast from '@/components/common/Toast';
import PreviewOverlay from '@/components/preview/PreviewOverlay';
import { PlusOutline, ChevronDownOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import {
  fetchBoxContents,
  fetchBoxContentCount,
  type ContentMediaTypeFilter,
  type BoxContentSortOrder,
  type BoxWatchStatusFilter,
} from '@/lib/api/box';
import {
  fetchPreviewBoxContents,
  fetchPreviewBoxContentCount,
} from '@/lib/api/preview';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import { getContentDetailPath } from '@/lib/utils/content';
import type {
  ContentItem as ContentItemData,
  WatchStatus,
  ContentCursorPageResponse,
} from '@/types/content-summary';
import type { BoxType } from '@/types/box';

// ── 미디어 타입 (영화/시리즈 모드 내부 탭) ───────────────────
type MediaTab = 'MOVIE_TV' | 'MOVIE' | 'TV';
const MEDIA_TABS: { key: MediaTab; label: string }[] = [
  { key: 'MOVIE_TV', label: '전체' },
  { key: 'MOVIE',    label: '영화' },
  { key: 'TV',       label: '시리즈' },
];

// ── 정렬 라벨 ────────────────────────────────────────────────
const SORT_LABEL: Record<BoxContentSortOrder, string> = {
  RECENT_SAVED: '최근 저장순',
  OLDEST_SAVED: '오래된 저장순',
  RECENT_YEAR:  '최근 연도순',
  OLDEST_YEAR:  '오래된 연도순',
};

// 인물 모드 정렬 옵션 (저장순만)
const PERSON_SORT_KEYS: BoxContentSortOrder[] = ['RECENT_SAVED', 'OLDEST_SAVED'];
const MEDIA_SORT_KEYS: BoxContentSortOrder[] = ['RECENT_SAVED', 'OLDEST_SAVED', 'RECENT_YEAR', 'OLDEST_YEAR'];

// ── 시청상태 필터 라벨 (트리거; ALL은 placeholder) ───────────
const STATUS_FILTER_LABEL: Record<Exclude<BoxWatchStatusFilter, 'ALL'>, string> = {
  COMPLETED: '시청 완료',
  WATCHING:  '시청중',
  PLANNED:   '시청 예정',
  PAUSED:    '시청 중단',
  NONE:      '기록 없음',
};

export default function BoxContentsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const boxId = Number(params.boxId);
  const boxType = (searchParams.get('type') as BoxType) || 'MY';
  const boxName = searchParams.get('name') ?? '';

  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const isPreview = !authLoading && !isAuthenticated;
  const isShared = boxType === 'SHARED';

  // ── 모드 / 필터 / 정렬 상태 ──
  const [viewMode, setViewMode] = useState<'media' | 'people'>('media'); // 영화/시리즈 vs 인물
  const [mediaTab, setMediaTab] = useState<MediaTab>('MOVIE_TV');
  const [sort, setSort] = useState<BoxContentSortOrder>('RECENT_SAVED');
  const [watchStatusFilter, setWatchStatusFilter] = useState<BoxWatchStatusFilter>('ALL');

  // 실제 API에 보낼 contentMediaTypeFilter 값
  const contentMediaTypeFilter: ContentMediaTypeFilter =
    viewMode === 'people' ? 'PERSON' : mediaTab;

  // ── 메뉴 열림 상태 ──
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);

  const menuRef = useRef<HTMLDivElement>(null);
  const sortMenuRef = useRef<HTMLDivElement>(null);
  const filterMenuRef = useRef<HTMLDivElement>(null);

  // 토스트
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (message: string) => setToast({ visible: true, message });

  const { changeStatus } = useWatchStatus({ showToast });

  // ── 쿼리 ──
  const effectiveWatchStatusFilter: BoxWatchStatusFilter =
    viewMode === 'media' ? watchStatusFilter : 'ALL';

  const queryKey = [
    'boxContents',
    boxId,
    boxType,
    contentMediaTypeFilter,
    sort,
    effectiveWatchStatusFilter,
    isPreview ? 'preview' : 'auth',
  ] as const;

  const queryParams = {
    contentMediaTypeFilter,
    sort,
    ...(viewMode === 'media' ? { watchStatusFilter } : {}),
  };

  // ── 박스 컨텐츠 무한 스크롤 (cursor 기반) ──
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
        ? fetchPreviewBoxContents(boxId, queryParams, cursor)
        : fetchBoxContents(boxId, queryParams, cursor),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    getItems: (page) => page.contentItemList,
    // 안전망 dedup — boxContentId가 항상 unique함
    getItemKey: (item) =>
      item.boxContentId ?? `t:${item.contentSummary.mediaType}:${item.contentSummary.tmdbId}`,
    enabled: !authLoading && !Number.isNaN(boxId),
    staleTime: isPreview ? 1000 * 60 * 5 : 0,
  });

  // ── 박스 컨텐츠 총 개수 (필터 적용 — 필터 변경 시 재호출) ──
  const { data: totalCount = 0 } = useQuery({
    queryKey: ['boxContentCount', boxId, contentMediaTypeFilter, sort, effectiveWatchStatusFilter, isPreview ? 'preview' : 'auth'],
    queryFn: () =>
      isPreview
        ? fetchPreviewBoxContentCount(boxId, queryParams)
        : fetchBoxContentCount(boxId, queryParams),
    enabled: !authLoading && !Number.isNaN(boxId),
    staleTime: 1000 * 60 * 5,
  });

  // 외부 클릭 시 모든 드롭다운/메뉴 닫기
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
      queryClient.setQueryData<InfiniteData<ContentCursorPageResponse, string | null>>(
        queryKey,
        (old) => {
          if (!old) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              contentItemList: page.contentItemList.map((i) =>
                i.contentSummary.tmdbId === summary.tmdbId
                  ? {
                      ...i,
                      memberRecord: {
                        recordId: i.memberRecord?.recordId ?? null,
                        liked: i.memberRecord?.liked ?? null,
                        watchStatus: status,
                      },
                    }
                  : i,
              ),
            })),
          };
        },
      );
    }
  };

  // ── 인물/영화시리즈 전환 (스위치 버튼) ──
  const toggleViewMode = () => {
    setViewMode((m) => (m === 'media' ? 'people' : 'media'));
    setSort('RECENT_SAVED');
    setWatchStatusFilter('ALL');
    setSortMenuOpen(false);
    setFilterMenuOpen(false);
  };

  const renderItem = (item: ContentItemData) => {
    const summary = item.contentSummary;
    const watchStatus = item.memberRecord?.watchStatus ?? null;
    const itemId = item.boxContentId ?? summary.tmdbId;
    const isMenuOpen = openMenuId === itemId;
    const isPerson = summary.mediaType === 'PERSON';

    const boxMode = isShared
      ? { mode: 'shared' as const, publishers: item.publisherSummaryList?.map((p) => p.nickname) ?? [] }
      : { mode: 'my' as const, liked: item.memberRecord?.liked === true };

    // PERSON 항목은 ContentItem 내부에서 시청 상태 아이콘 자체가 노출 X
    const menu: ReactNode = !isPerson && isMenuOpen ? (
      <div
        ref={menuRef}
        className={`absolute right-0 z-50 ${menuDir === 'down' ? 'top-full mt-1' : 'bottom-full mb-1'}`}
      >
        <WatchStatusMenu
          onSelect={(status) => handleStatusSelect(item, status)}
          onDelete={() => {}}
        />
      </div>
    ) : null;

    return (
      <ContentItem
        key={itemId}
        summary={summary}
        watchStatus={watchStatus}
        boxMode={boxMode}
        onClick={() => router.push(getContentDetailPath(summary.mediaType, summary.tmdbId))}
        onStatusClick={isPerson ? undefined : (e) => {
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

  const filterTriggerLabel = watchStatusFilter === 'ALL'
    ? '시청 상태'
    : STATUS_FILTER_LABEL[watchStatusFilter];

  const sortKeys = viewMode === 'people' ? PERSON_SORT_KEYS : MEDIA_SORT_KEYS;

  return (
    <>
      <Header
        variant="icon1-back"
        title={boxName}
        rightIcon={<PlusOutline className="size-6 text-wb-white-02" />}
        onRightIconClick={() => {
          if (isPreview) { showLoginModal(); return; }
          /* TODO: 컨텐츠 추가 */
        }}
      />

      {/* ── Content Media Type Line (고정) ───────────── */}
      <div className="flex items-center justify-between pl-[16px] pr-[5px] pt-[12px] pb-[4px]">
        {viewMode === 'media' ? (
          <div className="flex items-center gap-[8px]">
            {MEDIA_TABS.map(({ key, label }) => (
              <MediaTypeButton
                key={key}
                selected={mediaTab === key}
                onClick={() => setMediaTab(key)}
              >
                {label}
              </MediaTypeButton>
            ))}
          </div>
        ) : (
          <MediaTypeButton selected>인물</MediaTypeButton>
        )}
        <MediaTypeSwitchButton
          variant={viewMode === 'media' ? 'person' : 'watch-media'}
          onClick={toggleViewMode}
        />
      </div>

      {/* ── 카운트 + 정렬/필터 드롭다운 행 (고정) ──── */}
      {!loading && !error && (
        <div className="flex items-center justify-between pl-[16px] pr-[6px] pt-[4px] pb-[8px]">
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
                    items={sortKeys.map((key) => ({
                      label: SORT_LABEL[key],
                      onClick: () => { setSort(key); setSortMenuOpen(false); },
                    }))}
                  />
                </div>
              )}
            </div>

            {/* 시청 상태 필터 드롭다운 — 영화/시리즈 모드에서만 */}
            {viewMode === 'media' && (
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
                      variant="box-content"
                      selected={watchStatusFilter === 'ALL' ? undefined : watchStatusFilter}
                      onFilterChange={(f) => {
                        if (f === 'LIKED') return;
                        setWatchStatusFilter(f as BoxWatchStatusFilter);
                        setFilterMenuOpen(false);
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      <MainContent className="relative">
        {loading && <Loading />}
        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">
            컨텐츠를 불러올 수 없습니다.
          </p>
        )}
        {!loading && !error && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            박스에 담긴 컨텐츠가 없습니다.
          </p>
        )}
        {!loading && !error && items.length > 0 && (
          <>
            <ContentList>{items.map(renderItem)}</ContentList>

            {/* 무한 스크롤 sentinel — 바닥 200px 전에 다음 페이지 요청 */}
            {hasNextPage && <div ref={sentinelRef} className="h-px" />}

            {isFetchingNextPage && (
              <div className="flex justify-center py-4">
                <Spinner size={20} />
              </div>
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
