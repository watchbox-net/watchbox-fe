'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import ContentListItem from '@/components/list/ContentListItem';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import { PlusOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import { fetchWatchStatusList, upsertWatchStatus, deleteWatchRecord } from '@/lib/api/record';
import type { ContentItem, WatchStatus } from '@/types/content';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'movie', label: '영화' },
  { key: 'tv', label: '시리즈' },
] as const;

export default function RecordPage() {
  const router = useRouter();
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchWatchStatusList()
      .then((res) => setAllItems(res.contentItemList))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

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
    try {
      await upsertWatchStatus({
        contentId: summary.contentId,
        watchMediaType: summary.mediaType,
        watchStatus: status,
      });
      setAllItems((prev) =>
        prev.map((i) =>
          (i.contentRecordId ?? i.contentSummary.contentId) ===
          (item.contentRecordId ?? summary.contentId)
            ? { ...i, memberRecord: { ...i.memberRecord, liked: i.memberRecord?.liked ?? null, watchStatus: status } }
            : i,
        ),
      );
    } catch {/* 에러 무시 */}
  };

  const handleDelete = async (item: ContentItem) => {
    setOpenMenuId(null);
    if (!item.contentRecordId) return;
    try {
      await deleteWatchRecord(item.contentRecordId);
      setAllItems((prev) =>
        prev.filter((i) => i.contentRecordId !== item.contentRecordId),
      );
    } catch {/* 에러 무시 */}
  };

  const renderItem = (item: ContentItem, idx: number, arr: ContentItem[]) => {
    const summary = item.contentSummary;
    const year = 'year' in summary ? summary.year : null;
    const genres = 'genreList' in summary ? summary.genreList : null;
    const itemId = item.contentRecordId ?? summary.contentId;
    const isMenuOpen = openMenuId === itemId;

    return (
      <div key={itemId} className="relative">
        <ContentListItem
          posterSrc={getImageUrl(summary)}
          title={getDisplayTitle(summary)}
          year={year}
          genres={genres}
          watchStatus={item.memberRecord?.watchStatus ?? null}
          boxMode={{ mode: 'my', liked: item.memberRecord?.liked === true }}
          showDivider={idx < arr.length - 1}
          onClick={() => router.push(`/content/${summary.mediaType}/${summary.contentId}`)}
          onStatusClick={() => setOpenMenuId(isMenuOpen ? null : itemId)}
        />
        {isMenuOpen && (
          <div
            ref={menuRef}
            className="absolute right-[5px] top-[50%] translate-y-[-50%] z-50"
          >
            <WatchStatusMenu
              onSelect={(status) => handleStatusSelect(item, status)}
              onDelete={() => handleDelete(item)}
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <MobileFrame>
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
        {loading && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}
        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">
            로그인이 필요하거나 오류가 발생했습니다.
          </p>
        )}
        {!loading && !error && filteredItems.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            시청 기록이 없습니다.
          </p>
        )}
        {!loading && !error && filteredItems.length > 0 && (
          <div>{filteredItems.map(renderItem)}</div>
        )}
      </MainContent>

      <BottomMenu />
    </MobileFrame>
  );
}
