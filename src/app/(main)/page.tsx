export const dynamic = 'force-dynamic';

import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import { fetchPopularMovieList, fetchTopRatedMovieList, fetchNowShowingMovieList, fetchTrendingMovieList } from '@/api/movie';
import { fetchPopularTvList, fetchTopRatedTvList, fetchNowShowingTvList, fetchTrendingTvList } from '@/api/tv';
import { getServerTokens } from '@/api/server-fetch';
import type { ContentPageResponse, ContentSummary } from '@/types/content-summary';
import HomeSections from '@/components/home/HomeSections';

async function loadSections() {
  const tokens = await getServerTokens();

  const [
    popularMovieRes, popularTvRes,
    topRatedMovieRes, topRatedTvRes,
    nowShowingMovieRes, nowShowingTvRes,
    trendingMovieRes, trendingTvRes,
  ] = await Promise.allSettled([
    fetchPopularMovieList(tokens),
    fetchPopularTvList(tokens),
    fetchTopRatedMovieList(tokens),
    fetchTopRatedTvList(tokens),
    fetchNowShowingMovieList(tokens),
    fetchNowShowingTvList(tokens),
    fetchTrendingMovieList(tokens),
    fetchTrendingTvList(tokens),
  ]);

  const get = <T extends ContentSummary,>(res: PromiseSettledResult<ContentPageResponse<T>>) =>
    res.status === 'fulfilled' ? res.value.contentItemList : [];

  return {
    trendingMovies: get(trendingMovieRes),
    trendingTv: get(trendingTvRes),
    popularMovies: get(popularMovieRes),
    popularTv: get(popularTvRes),
    nowShowingMovies: get(nowShowingMovieRes),
    nowShowingTv: get(nowShowingTvRes),
    topRatedMovies: get(topRatedMovieRes),
    topRatedTv: get(topRatedTvRes),
  };
}

export default async function HomePage() {
  const data = await loadSections();

  return (
    <>
      <Header variant="center" />
      <MainContent>
        <HomeSections data={data} />
      </MainContent>
    </>
  );
}
