'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/common/Header';
import TabNav from '@/components/common/TabNav';
import MainContent from '@/components/common/MainContent';
import ContentItem from '@/components/list/ContentItem';
import ContentList from '@/components/list/ContentList';
import { searchMulti, searchMovies, searchTv, searchPerson } from '@/lib/api/search';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import { getContentDetailPath } from '@/lib/utils/content';
import type {
  ContentItem as ContentItemData,
  ContentPageResponse,
} from '@/types/content-summary';

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

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // URL에서 상태 복원
  const urlQuery = searchParams.get('q') ?? '';
  const urlTab = (searchParams.get('tab') as TabKey) || 'multi';

  const [activeTab, setActiveTab] = useState<TabKey>(urlTab);
  const [query, setQuery] = useState(urlQuery);
  const [isSearchActive, setIsSearchActive] = useState(!!urlQuery);

  // 무한 스크롤 (offset 기반) — urlTab/urlQuery 바뀌면 자동 새 캐시
  const {
    items,
    sentinelRef,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    firstPage,
  } = useInfiniteList<ContentPageResponse, number, ContentItemData>({
    queryKey: ['search', urlTab, urlQuery],
    queryFn: (page) => searchByTab[urlTab](urlQuery, page),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.currentPage < lastPage.totalPages
        ? lastPage.currentPage + 1
        : undefined,
    getItems: (page) => page.contentItemList,
    // multi 탭에서 mediaType 다른 동일 tmdbId가 있을 수 있으므로 mediaType 포함
    getItemKey: (item) =>
      `${item.contentSummary.mediaType}-${item.contentSummary.tmdbId}`,
    enabled: !!urlQuery,
  });

  const totalCount = firstPage?.totalCount ?? 0;
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
          <>
            <p className="px-4 py-2 text-xs text-neutral-500">
              총 {totalCount.toLocaleString()}건
            </p>
            <ContentList>
              {items.map((item) => {
                const summary = item.contentSummary;
                return (
                  <ContentItem
                    key={`${summary.mediaType}-${summary.tmdbId}`}
                    summary={summary}
                    hideStatusIcon
                    onClick={() => router.push(getContentDetailPath(summary.mediaType, summary.tmdbId))}
                  />
                );
              })}
            </ContentList>

            {/* 무한 스크롤 sentinel — 바닥 200px 전에 다음 페이지 요청 */}
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

export default function SearchPage() {
  return (
    <Suspense>
      <SearchContent />
    </Suspense>
  );
}
