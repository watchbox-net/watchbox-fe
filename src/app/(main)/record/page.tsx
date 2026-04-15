'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import ContentListItem from '@/components/list/ContentListItem';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import Toast from '@/components/common/Toast';
import { PlusOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import { fetchWatchStatusList } from '@/lib/api/record';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import type { ContentItem, WatchStatus } from '@/types/content-summary';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'movie', label: '영화' },
  { key: 'tv', label: '시리즈' },
] as const;

export default function RecordPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) =>
    setToast({ visible: true, message });

  const { changeStatus, deleteStatus } = useWatchStatus({ showToast });

  const { data: allItems = [], isLoading: loading, isError: error } = useQuery({
    queryKey: ['watchStatusList'],
    queryFn: async () => {
      const res = await fetchWatchStatusList();
      return res.contentItemList;
    },
    enabled: !authLoading && isAuthenticated,
    staleTime: 0, // 항상 최신 데이터 요청
  });

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [openMenuId]);

  const activeTab = TABS[activeTabIndex].key;
  const filteredItems =
    activeTab === 'all'
      ? allItems
      : allItems.filter(
          (item) => item.contentSummary.mediaType === activeTab.toUpperCase(),
        );

  const handleStatusSelect = async (
    item: ContentItem,
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    setOpenMenuId(null);
    const summary = item.contentSummary;
    if (summary.mediaType !== 'MOVIE' && summary.mediaType !== 'TV') return;
    const success = await changeStatus(summary.tmdbId, summary.mediaType, status);
    if (success) {
      queryClient.setQueryData<ContentItem[]>(['watchStatusList'], (prev) =>
        (prev ?? []).map((i) =>
          (i.memberRecord?.recordId ?? i.contentSummary.tmdbId) ===
          (item.memberRecord?.recordId ?? summary.tmdbId)
            ? { ...i, memberRecord: { recordId: i.memberRecord?.recordId ?? null, liked: i.memberRecord?.liked ?? null, watchStatus: status } }
            : i,
        ),
      );
    }
  };

  const handleDelete = async (item: ContentItem) => {
    setOpenMenuId(null);
    if (!item.memberRecord?.recordId) return;
    const success = await deleteStatus(item.memberRecord.recordId);
    if (success) {
      queryClient.setQueryData<ContentItem[]>(['watchStatusList'], (prev) =>
        (prev ?? []).filter((i) => i.memberRecord?.recordId !== item.memberRecord?.recordId),
      );
    }
  };

  const renderItem = (item: ContentItem, idx: number, arr: ContentItem[]) => {
    const summary = item.contentSummary;
    const year = 'year' in summary ? summary.year : null;
    const genres = 'genreList' in summary ? summary.genreList : null;
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
      <ContentListItem
        key={itemId}
        posterSrc={getImageUrl(summary)}
        title={getDisplayTitle(summary)}
        year={year}
        genres={genres}
        watchStatus={item.memberRecord?.watchStatus ?? null}
        boxMode={{ mode: 'my', liked: item.memberRecord?.liked === true }}
        showDivider={idx < arr.length - 1}
        onClick={() => router.push(`/content/${summary.mediaType}/${summary.tmdbId}`)}
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

  return (
    <>
      <Header
        variant="icon1"
        title="시청 기록"
        rightIcon={<PlusOutline className="size-6 text-wb-grey-04" />}
        onRightIconClick={() => {/* TODO: 추가 기능 */}}
      />
      <TabNav
        tabs={TABS.map((t) => t.label)}
        activeIndex={activeTabIndex}
        onChange={setActiveTabIndex}
      />

      <MainContent>
        {(authLoading || loading) && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}
        {!authLoading && !loading && !isAuthenticated && (
          <div className="flex flex-col items-center gap-[16px] py-[60px]">
            <p className="text-[16px] text-wb-grey-02">로그인이 필요한 페이지입니다.</p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="h-[40px] px-[24px] bg-wb-primary rounded-[8px] text-[14px] font-bold text-wb-white-01"
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
        {!loading && isAuthenticated && !error && filteredItems.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            시청 기록이 없습니다.
          </p>
        )}
        {!loading && isAuthenticated && !error && filteredItems.length > 0 && (
          <div>{filteredItems.map(renderItem)}</div>
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
