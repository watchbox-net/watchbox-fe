'use client';

import { useState } from 'react';
import ListTitle from '@/components/list/ListTitle';
import ContentCard from '@/components/content/ContentCard';
import HorizontalScroll from '@/components/common/HorizontalScroll';
import WatchMediaToggle from '@/components/common/WatchMediaToggle';
import { getDisplayTitle, getYear, getContentDetailPath } from '@/lib/utils/content';
import type { ContentItem } from '@/types/content-summary';
import type { MovieSummary } from '@/types/movie';
import type { TvSummary } from '@/types/tv';

type MediaType = 'movie' | 'tv';

interface HomeSectionsProps {
  data: {
    trendingMovies: ContentItem<MovieSummary>[];
    trendingTv: ContentItem<TvSummary>[];
    popularMovies: ContentItem<MovieSummary>[];
    popularTv: ContentItem<TvSummary>[];
    nowShowingMovies: ContentItem<MovieSummary>[];
    nowShowingTv: ContentItem<TvSummary>[];
    topRatedMovies: ContentItem<MovieSummary>[];
    topRatedTv: ContentItem<TvSummary>[];
  };
}

interface SectionConfig {
  title: string;
  tvTitle?: string;
  movieKey: keyof HomeSectionsProps['data'];
  tvKey: keyof HomeSectionsProps['data'];
  movieHref: string;
  tvHref: string;
}

const SECTIONS: SectionConfig[] = [
  {
    title: '이번주 트렌드',
    movieKey: 'trendingMovies',
    tvKey: 'trendingTv',
    movieHref: '/discover/trending/movie',
    tvHref: '/discover/trending/tv',
  },
  {
    title: '인기 작품',
    movieKey: 'popularMovies',
    tvKey: 'popularTv',
    movieHref: '/discover/popular/movie',
    tvHref: '/discover/popular/tv',
  },
  {
    title: '현재 상영중',
    tvTitle: '현재 방영중',
    movieKey: 'nowShowingMovies',
    tvKey: 'nowShowingTv',
    movieHref: '/discover/now-showing/movie',
    tvHref: '/discover/now-showing/tv',
  },
  {
    title: '높은 평점',
    movieKey: 'topRatedMovies',
    tvKey: 'topRatedTv',
    movieHref: '/discover/top-rated/movie',
    tvHref: '/discover/top-rated/tv',
  },
];

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
          href={getContentDetailPath(item.contentSummary.mediaType, item.contentSummary.tmdbId)}
          tmdbId={item.contentSummary.tmdbId}
          mediaType={item.contentSummary.mediaType as 'MOVIE' | 'TV'}
          recordId={item.memberRecord?.recordId ?? null}
          year={getYear(item.contentSummary)}
          genres={item.contentSummary.genreList}
        />
      ))}
    </HorizontalScroll>
  );
}

function ToggleSection({
  config,
  data,
}: {
  config: SectionConfig;
  data: HomeSectionsProps['data'];
}) {
  const [media, setMedia] = useState<MediaType>('movie');

  const items = data[media === 'movie' ? config.movieKey : config.tvKey];
  const href = media === 'movie' ? config.movieHref : config.tvHref;
  const title = media === 'tv' && config.tvTitle ? config.tvTitle : config.title;
  const scrollKey = `${config.movieKey}-${media}`;

  return (
    <section className="mb-6">
      <ListTitle
        title={title}
        variant="toggle-arrow"
        href={href}
        toggleSlot={<WatchMediaToggle value={media} onChange={setMedia} />}
        className="py-[12px]"
      />
      {items.length > 0 ? (
        <CardScroll items={items} scrollKey={scrollKey} />
      ) : (
        <p className="text-sm text-wb-grey-03 px-[16px]">불러올 수 없습니다</p>
      )}
    </section>
  );
}

export default function HomeSections({ data }: HomeSectionsProps) {
  return (
    <>
      {SECTIONS.map((config) => (
        <ToggleSection key={config.title} config={config} data={data} />
      ))}
    </>
  );
}
