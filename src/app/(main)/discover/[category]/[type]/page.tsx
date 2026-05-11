import { cookies } from 'next/headers';
import DiscoverHeader from './DiscoverHeader';
import DiscoverTabs from './DiscoverTabs';
import DiscoverContentList from './DiscoverContentList';
import MainContent from '@/components/common/MainContent';
import { fetchPopularMovieList, fetchTopRatedMovieList, fetchNowShowingMovieList, fetchTrendingMovieList } from '@/api/movie';
import { fetchPopularTvList, fetchTopRatedTvList, fetchNowShowingTvList, fetchTrendingTvList } from '@/api/tv';
import { notFound } from 'next/navigation';
import type { ContentItem } from '@/types/content-summary';

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
  'trending': { 'movie': '이번주 트렌드 영화', 'tv': '이번주 트렌드 시리즈' },
};

type Fetcher = (token?: string) => Promise<{ contentItemList: ContentItem[] }>;

const FETCH_MAP: Record<string, Record<string, Fetcher>> = {
  'popular': { 'movie': fetchPopularMovieList, 'tv': fetchPopularTvList },
  'top-rated': { 'movie': fetchTopRatedMovieList, 'tv': fetchTopRatedTvList },
  'now-showing': { 'movie': fetchNowShowingMovieList, 'tv': fetchNowShowingTvList },
  'trending': { 'movie': fetchTrendingMovieList, 'tv': fetchTrendingTvList },
};

export default async function DiscoverCategoryPage({ params }: PageProps) {
  const { category, type } = await params;

  const title = TITLE_MAP[category]?.[type];
  if (!title) {
    notFound();
  }

  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('accessToken')?.value;

    const fetcher = FETCH_MAP[category]?.[type];
    const response = fetcher ? await fetcher(token) : { contentItemList: [] };
    const contentItems: ContentItem[] = response.contentItemList;

    return (
      <>
        <DiscoverHeader title={title} category={category} type={type} />
        <DiscoverTabs category={category} type={type} />
        <MainContent>
          {contentItems.length > 0 ? (
            <DiscoverContentList items={contentItems} />
          ) : (
            <p className="text-center text-neutral-500 py-8">컨텐츠가 없습니다.</p>
          )}
        </MainContent>
      </>
    );
  } catch (error) {
    console.error(error);
    return (
      <>
        <DiscoverHeader title={title} category={category} type={type} />
        <DiscoverTabs category={category} type={type} />
        <MainContent className="p-4">
          <p className="text-neutral-500">오류가 발생했습니다.</p>
        </MainContent>
      </>
    );
  }
}
