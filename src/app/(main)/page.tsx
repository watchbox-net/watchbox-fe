export const dynamic = 'force-dynamic';

import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import ListTitle from '@/components/list/ListTitle';
import ContentCard from '@/components/content/ContentCard';
import HorizontalScroll from '@/components/common/HorizontalScroll';
import { fetchPopularMovieList, fetchTopRatedMovieList, fetchNowShowingMovieList, fetchTrendingMovieList } from '@/api/movie';
import { fetchPopularTvList, fetchTopRatedTvList, fetchNowShowingTvList, fetchTrendingTvList } from '@/api/tv';
import { getDisplayTitle } from '@/lib/utils/content';
import type { ContentItem, ContentPageResponse, ContentSummary } from '@/types/content';
import type { MovieSummary } from '@/types/movie';
import type { TvSummary } from '@/types/tv';
import Link from 'next/link';
import { cookies } from 'next/headers';

async function loadSections() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  const [
    popularMovieRes, popularTvRes,
    topRatedMovieRes, topRatedTvRes,
    nowShowingMovieRes, nowShowingTvRes,
    trendingMovieRes, trendingTvRes,
  ] = await Promise.allSettled([
    fetchPopularMovieList(token),
    fetchPopularTvList(token),
    fetchTopRatedMovieList(token),
    fetchTopRatedTvList(token),
    fetchNowShowingMovieList(token),
    fetchNowShowingTvList(token),
    fetchTrendingMovieList(token),
    fetchTrendingTvList(token),
  ]);

  const get = <T extends ContentSummary,>(res: PromiseSettledResult<ContentPageResponse<T>>) =>
    res.status === 'fulfilled' ? res.value.contentItemList : [];

  return {
    popularMovies: get(popularMovieRes),
    popularTv: get(popularTvRes),
    topRatedMovies: get(topRatedMovieRes),
    topRatedTv: get(topRatedTvRes),
    nowShowingMovies: get(nowShowingMovieRes),
    nowShowingTv: get(nowShowingTvRes),
    trendingMovies: get(trendingMovieRes),
    trendingTv: get(trendingTvRes),
  };
}

function CardScroll<T extends MovieSummary | TvSummary>({
  items,
  scrollKey,
}: {
  items: ContentItem<T>[];
  scrollKey: string;
}) {
  return (
    <HorizontalScroll scrollKey={scrollKey} className="flex gap-[15px] pl-[16px] pr-[16px] pb-2">
      {items.map((item) => (
        <ContentCard
          key={item.contentSummary.tmdbId}
          posterPath={item.contentSummary.posterPath}
          title={getDisplayTitle(item.contentSummary)}
          rating={item.contentSummary.voteAverage}
          watchStatus={item.memberRecord?.watchStatus}
          href={`/content/${item.contentSummary.mediaType}/${item.contentSummary.tmdbId}`}
          tmdbId={item.contentSummary.tmdbId}
          mediaType={item.contentSummary.mediaType as 'MOVIE' | 'TV'}
          recordId={item.contentRecordId}
        />
      ))}
    </HorizontalScroll>
  );
}

function Section<T extends MovieSummary | TvSummary>({
  title,
  href,
  items,
}: {
  title: string;
  href: string;
  items: ContentItem<T>[];
}) {
  return (
    <section className="mb-6">
      <Link href={href}>
        <ListTitle title={title} variant="arrow" className="py-[12px]" />
      </Link>
      {items.length > 0 ? (
        <CardScroll items={items} scrollKey={href} />
      ) : (
        <p className="text-sm text-wb-grey-02 px-[16px]">불러올 수 없습니다</p>
      )}
    </section>
  );
}

export default async function HomePage() {
  const {
    popularMovies, popularTv,
    topRatedMovies, topRatedTv,
    nowShowingMovies, nowShowingTv,
    trendingMovies, trendingTv,
  } = await loadSections();

  return (
    <>
      <Header variant="center" />
      <MainContent>
        <Section title="인기 영화" href="/discover/popular/movie" items={popularMovies} />
        <Section title="인기 시리즈" href="/discover/popular/tv" items={popularTv} />
        <Section title="높은 평점의 영화" href="/discover/top-rated/movie" items={topRatedMovies} />
        <Section title="높은 평점의 시리즈" href="/discover/top-rated/tv" items={topRatedTv} />
        <Section title="현재 상영중인 영화" href="/discover/now-showing/movie" items={nowShowingMovies} />
        <Section title="현재 방영중인 시리즈" href="/discover/now-showing/tv" items={nowShowingTv} />
        <Section title="이번주 화제 영화" href="/discover/trending/movie" items={trendingMovies} />
        <Section title="이번주 화제 시리즈" href="/discover/trending/tv" items={trendingTv} />
      </MainContent>
    </>
  );
}
