'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import ListTitle from '@/components/list/ListTitle';
import ContentListItem from '@/components/list/ContentListItem';
import { PlusOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import { fetchMyBoxContents, fetchSharedBoxContents } from '@/lib/api/box';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';
import type { ContentItem } from '@/types/content';
import type { BoxType } from '@/types/box';

export default function BoxContentsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const boxId = Number(params.boxId);
  const boxType = (searchParams.get('type') as BoxType) || 'MY';
  const boxName = searchParams.get('name') || '박스 컨텐츠';

  const [items, setItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const isShared = boxType === 'SHARED';
  const headerTitle = isShared ? '공유 박스 컨텐츠' : '마이 박스 컨텐츠';

  useEffect(() => {
    const load = async () => {
      try {
        const res = isShared
          ? await fetchSharedBoxContents(boxId)
          : await fetchMyBoxContents(boxId);
        setItems(res.contentItemList);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [boxId, isShared]);

  // mediaType 별 그룹핑
  const grouped = useMemo(() => {
    const movies = items.filter((i) => i.contentSummary.mediaType === 'MOVIE');
    const tvs = items.filter((i) => i.contentSummary.mediaType === 'TV');
    const persons = items.filter((i) => i.contentSummary.mediaType === 'PERSON');
    return { movies, tvs, persons };
  }, [items]);

  const renderItem = (item: ContentItem, idx: number, arr: ContentItem[]) => {
    const summary = item.contentSummary;
    const imageUrl = getImageUrl(summary);
    const title = getDisplayTitle(summary);
    const year = 'year' in summary ? summary.year : null;
    const genres = 'genreList' in summary ? summary.genreList : null;
    const watchStatus = item.memberRecord?.watchStatus ?? null;
    const isLast = idx === arr.length - 1;

    const boxMode = isShared
      ? {
          mode: 'shared' as const,
          publishers: item.publisherSummaryList?.map((p) => p.nickname) ?? [],
        }
      : {
          mode: 'my' as const,
          liked: item.memberRecord?.liked === true,
        };

    return (
      <ContentListItem
        key={item.boxContentId ?? summary.contentId}
        posterSrc={imageUrl}
        title={title}
        year={year}
        genres={genres}
        watchStatus={watchStatus}
        boxMode={boxMode}
        showDivider={!isLast}
      />
    );
  };

  return (
    <MobileFrame>
      <Header
        variant="icon1-back"
        title={headerTitle}
        rightIcon={<PlusOutline className="size-6 text-wb-grey-04" />}
        onRightIconClick={() => {/* TODO: 컨텐츠 추가 */}}
      />

      <MainContent>
        {loading && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}

        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">
            컨텐츠를 불러올 수 없습니다.
          </p>
        )}

        {!loading && !error && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">
            박스에 담긴 컨텐츠가 없습니다.
          </p>
        )}

        {!loading && !error && items.length > 0 && (
          <>
            {/* 영화 */}
            {grouped.movies.length > 0 && (
              <section className="mb-4">
                <ListTitle title={`영화 (${grouped.movies.length})`} variant="none" className="mb-1" />
                {grouped.movies.map(renderItem)}
              </section>
            )}

            {/* 시리즈 */}
            {grouped.tvs.length > 0 && (
              <section className="mb-4">
                <ListTitle title={`시리즈 (${grouped.tvs.length})`} variant="none" className="mb-1" />
                {grouped.tvs.map(renderItem)}
              </section>
            )}

            {/* 인물 */}
            {grouped.persons.length > 0 && (
              <section className="mb-4">
                <ListTitle title={`인물 (${grouped.persons.length})`} variant="none" className="mb-1" />
                {grouped.persons.map(renderItem)}
              </section>
            )}
          </>
        )}
      </MainContent>

      <BottomMenu />
    </MobileFrame>
  );
}
