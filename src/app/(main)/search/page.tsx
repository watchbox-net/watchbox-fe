'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import MainContent from '@/components/common/MainContent';
import Image from 'next/image';
import { searchMulti, searchMovies, searchTv, searchPerson } from '@/lib/api/search';
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
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 상태 복원
  const urlQuery = searchParams.get('q') ?? '';
  const urlTab = (searchParams.get('tab') as TabKey) || 'multi';

  const [activeTab, setActiveTab] = useState<TabKey>(urlTab);
  const [query, setQuery] = useState(urlQuery);
  const [isSearchActive, setIsSearchActive] = useState(!!urlQuery);

  // React Query로 검색 결과 캐싱
  const { data, isLoading } = useQuery({
    queryKey: ['search', urlTab, urlQuery],
    queryFn: () => searchByTab[urlTab](urlQuery, 1),
    enabled: !!urlQuery,
  });

  const items = data?.contentItemList ?? [];
  const totalCount = data?.totalCount ?? 0;
  const searched = !!urlQuery;

  // URL 파라미터 갱신
  const updateUrl = (tab: TabKey, q: string) => {
    const params = new URLSearchParams();
    if (q.trim()) params.set('q', q.trim());
    if (tab !== 'multi') params.set('tab', tab);
    const qs = params.toString();
    router.replace(`/search${qs ? `?${qs}` : ''}`, { scroll: false });
  };

  const handleSearch = () => {
    if (!query.trim()) return;
    updateUrl(activeTab, query);
  };

  const handleTabChange = (index: number) => {
    const tab = TABS[index].key;
    setActiveTab(tab);
    if (query.trim()) {
      updateUrl(tab, query);
    }
  };

  const handleClear = () => {
    setQuery('');
    router.replace('/search', { scroll: false });
  };

  const handleBack = () => {
    setIsSearchActive(false);
    handleClear();
  };

  return (
    <>
      <Header
        variant={isSearchActive ? 'search-after' : 'search-before'}
        searchValue={query}
        onSearchChange={setQuery}
        onSearchClear={handleClear}
        onSearchSubmit={handleSearch}
        onSearchBarClick={() => setIsSearchActive(true)}
        onBack={searched ? handleBack : undefined}
      />

      <TabNav
        tabs={TABS.map((t) => t.label)}
        activeIndex={TABS.findIndex((t) => t.key === activeTab)}
        onChange={handleTabChange}
      />

      <MainContent>
        {isLoading && (
          <p className="text-center text-neutral-500 py-8">검색 중...</p>
        )}

        {!isLoading && searched && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">검색 결과가 없습니다.</p>
        )}

        {!isLoading && items.length > 0 && (
          <div>
            <p className="px-4 py-2 text-xs text-neutral-500">
              총 {totalCount.toLocaleString()}건
            </p>
            <ul>
              {items.map((item) => (
                <li
                  key={`${item.contentSummary.mediaType}-${item.contentSummary.contentId}`}
                  className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800 cursor-pointer"
                  onClick={() => router.push(`/content/${item.contentSummary.mediaType}/${item.contentSummary.contentId}`)}
                >
                  {getImageUrl(item.contentSummary) ? (
                    <Image
                      src={getImageUrl(item.contentSummary)!}
                      alt={getDisplayTitle(item.contentSummary)}
                      width={64}
                      height={88}
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
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </MainContent>
    </>
  );
}
