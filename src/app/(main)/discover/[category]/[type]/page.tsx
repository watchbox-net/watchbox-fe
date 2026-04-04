import Image from 'next/image';
import Link from 'next/link';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import DiscoverTabs from './DiscoverTabs';
import MainContent from '@/components/common/MainContent';
import { fetchPopularMovieList, fetchTopRatedMovieList, fetchNowShowingMovieList, fetchTrendingMovieList } from '@/api/movie';
import { fetchPopularTvList, fetchTopRatedTvList, fetchNowShowingTvList, fetchTrendingTvList } from '@/api/tv';
import { notFound } from 'next/navigation';
import type { ContentItem } from '@/types/content';
import { getImageUrl, getDisplayTitle, getSubText } from '@/lib/utils/content';

interface PageProps {
  params: Promise<{
    category: string;
    type: string;
  }>;
}

const TITLE_MAP: Record<string, Record<string, string>> = {
  'popular': { 'movie': '인기 영화', 'tv': '인기 시리즈' },
  'top-rated': { 'movie': '높은 평점의 영화', 'tv': '높은 평점의 시리즈' },
  'now-showing': { 'movie': '현재 상영중인 영화', 'tv': '현재 방영중인 시리즈' },
  'trending': { 'movie': '이번주 화제 영화', 'tv': '이번주 화제 시리즈' },
};

export default async function DiscoverCategoryPage({ params }: PageProps) {
  const { category, type } = await params;

  const title = TITLE_MAP[category]?.[type];
  if (!title) {
    notFound();
  }

  try {
    const fetchMap: Record<string, Record<string, () => Promise<{ contentItemList: ContentItem[] }>>> = {
      popular: { movie: fetchPopularMovieList, tv: fetchPopularTvList },
      'top-rated': { movie: fetchTopRatedMovieList, tv: fetchTopRatedTvList },
      'now-showing': { movie: fetchNowShowingMovieList, tv: fetchNowShowingTvList },
      trending: { movie: fetchTrendingMovieList, tv: fetchTrendingTvList },
    };

    const fetcher = fetchMap[category]?.[type];
    const response = fetcher ? await fetcher() : { contentItemList: [] };
    const contentItems: ContentItem[] = response.contentItemList;

    return (
      <MobileFrame>
        <Header variant="back" title={title} />
        <DiscoverTabs category={category} type={type} />
        <MainContent>
          <ul>
            {contentItems.map((item) => (
              <li
                key={item.contentSummary.contentId}
                className="border-b border-neutral-800"
              >
                <Link
                  href={`/content/${item.contentSummary.mediaType}/${item.contentSummary.contentId}`}
                  className="flex items-center gap-3 px-4 py-3"
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
                </Link>
              </li>
            ))}
          </ul>
        </MainContent>
        <BottomMenu />
      </MobileFrame>
    );
  } catch (error) {
    console.error(error);
    return (
      <MobileFrame>
        <Header variant="back" title={title} />
        <DiscoverTabs category={category} type={type} />
        <MainContent className="p-4">
          <p className="text-neutral-500">오류가 발생했습니다.</p>
        </MainContent>
        <BottomMenu />
      </MobileFrame>
    );
  }
}
