'use client';

import { useState } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import { searchMulti, searchMovies, searchTv, searchPerson } from '@/lib/api/search';
import type { ContentItem, ContentPageResponse } from '@/types/content';
import { getImageUrl, getDisplayTitle, getSubText } from '@/lib/utils/content';

const TABS = [
  { key: 'multi', label: '전체' },
  { key: 'movie', label: '영화' },
  { key: 'tv', label: '시리즈' },
  { key: 'person', label: '인물' },
] as const;

type TabKey = (typeof TABS)[number]['key'];

const searchByTab = {
  multi: searchMulti,
  movie: searchMovies,
  tv: searchTv,
  person: searchPerson,
} as const;

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('multi');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false);

  const executeSearch = async (tab: TabKey, q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;

    setLoading(true);
    setSearched(true);
    try {
      const result: ContentPageResponse = await searchByTab[tab](trimmed, 1);
      setItems(result.contentItemList);
      setTotalCount(result.totalCount);
    } catch (error) {
      console.error('검색 실패:', error);
      setItems([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => executeSearch(activeTab, query);

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (query.trim()) {
      executeSearch(tab, query);
    }
  };

  const handleClear = () => {
    setQuery('');
    setItems([]);
    setSearched(false);
  };

  const handleBack = () => {
    setIsSearchActive(false);
    handleClear();
  };

  return (
    <MobileFrame>
      <Header
        variant={isSearchActive ? 'search-after' : 'search-before'}
        searchValue={query}
        onSearchChange={setQuery}
        onSearchClear={handleClear}
        onSearchSubmit={handleSearch}
        onSearchBarClick={() => setIsSearchActive(true)}
        onBack={searched ? handleBack : undefined}
      />

      {/* 탭 */}
      <div className="flex border-b border-neutral-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 py-3 text-sm font-medium text-center transition-colors
              ${
                activeTab === tab.key
                  ? 'text-black border-b-2 border-white'
                  : 'text-neutral-500'
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 검색 결과 */}
      <main className="flex-1 overflow-y-auto pb-24">
        {loading && (
          <p className="text-center text-neutral-500 py-8">검색 중...</p>
        )}

        {!loading && searched && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">검색 결과가 없습니다.</p>
        )}

        {!loading && items.length > 0 && (
          <div>
            <p className="px-4 py-2 text-xs text-neutral-500">
              총 {totalCount.toLocaleString()}건
            </p>
            <ul>
              {items.map((item) => (
                <li
                  key={`${item.contentSummary.mediaType}-${item.contentSummary.contentId}`}
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
                    <p className="text-sm text-black truncate">
                      {getDisplayTitle(item.contentSummary)}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {getSubText(item.contentSummary)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </main>

      <BottomMenu />
    </MobileFrame>
  );
}
