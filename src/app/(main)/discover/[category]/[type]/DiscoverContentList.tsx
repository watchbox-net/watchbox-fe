'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient, type InfiniteData } from '@tanstack/react-query';
import ContentItem from '@/components/list/ContentItem';
import ContentList from '@/components/list/ContentList';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import Toast from '@/components/common/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import { fetchDiscoverList } from '@/lib/api/discover';
import { deleteWatchRecord } from '@/lib/api/watch-record';
import { getContentDetailPath } from '@/lib/utils/content';
import type {
  ContentItem as ContentItemData,
  ContentPageResponse,
  WatchStatus,
} from '@/types/content-summary';

interface DiscoverContentListProps {
  category: string;
  type: string;
  initialResponse: ContentPageResponse;
  isAuthenticated: boolean;
}

export default function DiscoverContentList({
  category,
  type,
  initialResponse,
  isAuthenticated,
}: DiscoverContentListProps) {
  const router = useRouter();
  const { isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();
  const queryClient = useQueryClient();

  // ── 무한 스크롤 (offset 기반) ─────────────────────────────
  // queryKey에 isAuthenticated 포함 → 로그인 상태 바뀌면 자동 refetch
  const queryKey = ['discover', category, type, isAuthenticated] as const;

  const {
    items,
    sentinelRef,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteList<ContentPageResponse, number, ContentItemData>({
    queryKey,
    queryFn: (page) => fetchDiscoverList(category, type, page, isAuthenticated),
    initialPageParam: 2, // page 1은 서버에서 받은 initialData로 시작
    initialData: {
      pages: [initialResponse],
      pageParams: [1],
    },
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    getItems: (page) => page.contentItemList,
    // TMDB popular/trending 등은 페이지 간 랭킹 변화로 중복 발생 가능 → tmdbId로 dedup
    getItemKey: (item) => item.contentSummary.tmdbId,
  });

  // ── 메뉴 / 토스트 상태 ───────────────────────────────────
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) =>
    setToast({ visible: true, message });

  const { changeStatus } = useWatchStatus({ showToast });

  // ── memberRecord 낙관적 업데이트 (캐시 직접 조작) ─────────
  const updateItemInCache = (
    tmdbId: number,
    updater: (item: ContentItemData) => ContentItemData,
  ) => {
    queryClient.setQueryData<InfiniteData<ContentPageResponse, number>>(
      queryKey,
      (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            contentItemList: page.contentItemList.map((i) =>
              i.contentSummary.tmdbId === tmdbId ? updater(i) : i,
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
      updateItemInCache(summary.tmdbId, (i) => ({
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
    try {
      await deleteWatchRecord(item.memberRecord.recordId);
      updateItemInCache(item.contentSummary.tmdbId, (i) => ({
        ...i,
        memberRecord: null,
      }));
      showToast('시청 기록이 삭제되었습니다.');
    } catch {/* 에러 무시 */}
  };

  return (
    <>
      <ContentList>
        {items.map((item) => {
          const summary = item.contentSummary;
          const itemId = summary.tmdbId;
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
              boxMode={item.memberRecord?.liked != null ? { mode: 'my', liked: item.memberRecord.liked } : undefined}
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
        })}
      </ContentList>

      {/* 무한 스크롤 sentinel — 바닥 200px 전에 다음 페이지 요청 */}
      {hasNextPage && <div ref={sentinelRef} className="h-px" />}

      {isFetchingNextPage && (
        <p className="text-center text-wb-grey-03 py-4">불러오는 중...</p>
      )}

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
