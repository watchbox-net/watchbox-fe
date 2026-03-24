import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import MobileFrame from '@/components/common/MobileFrame';
import MainContent from '@/components/common/MainContent';
import ListTitle from '@/components/list/ListTitle';
import ContentCard from '@/components/content/ContentCard';
import { fetchPopularMovieList } from '@/api/movie';
import { fetchPopularTvList } from '@/api/tv';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';
import type { ContentItem } from '@/types/content';
import type { MovieSummary } from '@/types/movie';
import type { TvSummary } from '@/types/tv';
import Link from 'next/link';

async function loadSections() {
  const [movieRes, tvRes] = await Promise.allSettled([
    fetchPopularMovieList(),
    fetchPopularTvList(),
  ]);

  const movies = movieRes.status === 'fulfilled' ? movieRes.value.contentItemList : [];
  const tvShows = tvRes.status === 'fulfilled' ? tvRes.value.contentItemList : [];

  return { movies, tvShows };
}

function CardScroll<T extends MovieSummary | TvSummary>({
  items,
}: {
  items: ContentItem<T>[];
}) {
  return (
    <div className="flex gap-[15px] overflow-x-auto pl-[16px] pr-[16px] pb-2 scrollbar-hide">
      {items.map((item) => (
        <ContentCard
          key={item.contentSummary.contentId}
          posterSrc={getImageUrl(item.contentSummary)}
          title={getDisplayTitle(item.contentSummary)}
          rating={item.contentSummary.voteAverage}
        />
      ))}
    </div>
  );
}

export default async function HomePage() {
  const { movies, tvShows } = await loadSections();

  return (
    <MobileFrame>
      <Header variant="center" />
      <MainContent>
        {/* 인기 영화 */}
        <section className="mb-6">
          <Link href="/discover/popular/movie">
            <ListTitle title="인기 영화" variant="arrow" className="py-[12px]" />
          </Link>
          {movies.length > 0 ? (
            <CardScroll items={movies} />
          ) : (
            <p className="text-sm text-wb-grey-02 px-[16px]">불러올 수 없습니다</p>
          )}
        </section>

        {/* 인기 시리즈 */}
        <section className="mb-6">
          <Link href="/discover/popular/tv">
            <ListTitle title="인기 시리즈" variant="arrow" className="py-[12px]" />
          </Link>
          {tvShows.length > 0 ? (
            <CardScroll items={tvShows} />
          ) : (
            <p className="text-sm text-wb-grey-02 px-[16px]">불러올 수 없습니다</p>
          )}
        </section>
      </MainContent>
      <BottomMenu />
    </MobileFrame>
  );
}
