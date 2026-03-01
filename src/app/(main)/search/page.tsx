'use client';

import { useState } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import { searchMulti, searchMovies, searchTv, searchPerson } from '@/lib/api/search';
import type { ContentItem, ContentPageResponse, ContentSummary } from '@/types/content';

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

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w185';

/** ContentSummary에서 이미지 경로 추출 */
function getImageUrl(summary: ContentSummary): string | null {
  switch (summary.mediaType) {
    case 'MOVIE':
    case 'TV':
      return summary.posterPath ? `${TMDB_IMAGE_BASE}${summary.posterPath}` : null;
    case 'PERSON':
      return summary.profilePath ? `${TMDB_IMAGE_BASE}${summary.profilePath}` : null;
  }
}

/** ContentSummary에서 표시용 제목 추출 */
function getDisplayTitle(summary: ContentSummary): string {
  switch (summary.mediaType) {
    case 'MOVIE':
      return summary.title;
    case 'TV':
    case 'PERSON':
      return summary.name;
  }
}

/** ContentSummary에서 부제 추출 */
function getSubText(summary: ContentSummary): string {
  switch (summary.mediaType) {
    case 'MOVIE':
      return [summary.year, summary.titleOriginal].filter(Boolean).join(' · ');
    case 'TV':
      return [summary.year, summary.nameOriginal].filter(Boolean).join(' · ');
    case 'PERSON':
      return summary.nameOriginal ?? '';
  }
}

export default function SearchPage() {
  const [activeTab, setActiveTab] = useState<TabKey>('multi');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSearch();
  };

  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    if (query.trim()) {
      executeSearch(tab, query);
    }
  };

  return (
    <MobileFrame>
      {/* 검색바 */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center gap-2 bg-neutral-800 rounded-full px-4 py-3">
          <svg
            className="w-5 h-5 text-neutral-400 shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="영화, 시리즈, 인물을 검색해보세요"
            className="flex-1 bg-transparent text-white text-sm placeholder-neutral-400 outline-none"
          />
          {query && (
            <button
              onClick={() => {
                setQuery('');
                setItems([]);
                setSearched(false);
              }}
              className="text-neutral-400 cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* 탭 */}
      <div className="flex border-b border-neutral-800">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            className={`flex-1 py-3 text-sm font-medium text-center cursor-pointer transition-colors
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
