'use client';

import { useEffect, useState } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import { PlusOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import { fetchWatchStatusList } from '@/lib/api/record';
import type { ContentItem, WatchStatus } from '@/types/content';
import { getImageUrl, getDisplayTitle, getSubText } from '@/lib/utils/content';

const TABS = [
  { key: 'all', label: '전체' },
  { key: 'movie', label: '영화' },
  { key: 'tv', label: '시리즈' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const WATCH_STATUS_LABEL: Record<WatchStatus, string> = {
  COMPLETED: 'COMPLETED',
  WATCHING: 'WATCHING',
  PLANNED: 'PLANNED',
  PAUSED: 'PAUSED',
};

export default function RecordPage() {
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  const [allItems, setAllItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchWatchStatusList()
      .then((res) => setAllItems(res.contentItemList))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const activeTab = TABS[activeTabIndex].key;
  const filteredItems =
    activeTab === 'all'
      ? allItems
      : allItems.filter(
          (item) =>
            item.contentSummary.mediaType === activeTab.toUpperCase(),
        );

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

      {/* 리스트 */}
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
          <ul>
            {filteredItems.map((item) => (
              <li
                key={item.contentRecordId ?? item.contentSummary.contentId}
                className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800"
              >
                {getImageUrl(item.contentSummary) ? (
                  <img
                    src={getImageUrl(item.contentSummary)!}
                    alt={getDisplayTitle(item.contentSummary)}
                    className="w-16 h-22 rounded object-cover shrink-0 bg-neutral-800"
                  />
                ) : (
                  <div className="w-16 h-22 rounded bg-neutral-800 shrink-0 flex items-center justify-center text-neutral-600 text-xs">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-wb-white truncate">
                    {getDisplayTitle(item.contentSummary)}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {getSubText(item.contentSummary)}
                  </p>
                  {item.memberInteraction?.liked && (
                    <p className="text-xs text-red-400 mt-0.5">
                      좋아요 누른 컨텐츠
                    </p>
                  )}
                </div>
                {item.memberInteraction?.watchStatus && (
                  <span className="text-xs text-neutral-400 shrink-0 whitespace-nowrap">
                    {WATCH_STATUS_LABEL[item.memberInteraction.watchStatus]}
                  </span>
                )}
              </li>
            ))}
          </ul>
        )}
      </MainContent>

      <BottomMenu />
    </MobileFrame>
  );
}
