'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import ListTitle from '@/components/list/ListTitle';
import { PlusOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import { fetchMyBoxContents, fetchSharedBoxContents } from '@/lib/api/box';
import { getImageUrl, getDisplayTitle, getSubText } from '@/lib/utils/content';
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

  const renderItem = (item: ContentItem) => {
    const summary = item.contentSummary;
    const imageUrl = getImageUrl(summary);
    const title = getDisplayTitle(summary);
    const sub = getSubText(summary);
    const liked = item.memberInteraction?.liked === true;
    const publishers = item.publisherSummaryList;

    return (
      <li
        key={item.boxContentId ?? summary.contentId}
        className="flex items-center gap-3 py-2 border-b border-neutral-800"
      >
        {/* 포스터 */}
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-16 h-22 rounded object-cover shrink-0"
          />
        ) : (
          <div className="w-16 h-22 rounded bg-neutral-800 shrink-0" />
        )}

        {/* 텍스트 정보 */}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-wb-white truncate">{title}</p>
          <p className="text-xs text-neutral-400 truncate mt-0.5">{sub}</p>

          {/* 마이 박스: 좋아요 표시 */}
          {!isShared && liked && (
            <p className="text-xs text-red-500 mt-1">👍 좋아요 누른 컨텐츠</p>
          )}

          {/* 공유 박스: 게시자 표시 */}
          {isShared && publishers && publishers.length > 0 && (
            <p className="text-xs text-yellow-500 mt-1">
              게시자: {publishers.map((p) => p.nickname).join(', ')}
            </p>
          )}
        </div>

        {/* 시청 상태 */}
        {item.memberInteraction?.watchStatus && (
          <span className="text-xs text-neutral-400 shrink-0">
            {item.memberInteraction.watchStatus}
          </span>
        )}
      </li>
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
              <section className="mb-6">
                <ListTitle title={`영화 (${grouped.movies.length})`} variant="none" className="mb-3" />
                <ul className="space-y-3">
                  {grouped.movies.map(renderItem)}
                </ul>
              </section>
            )}

            {/* 시리즈 */}
            {grouped.tvs.length > 0 && (
              <section className="mb-6">
                <ListTitle title={`시리즈 (${grouped.tvs.length})`} variant="none" className="mb-3" />
                <ul className="space-y-3">
                  {grouped.tvs.map(renderItem)}
                </ul>
              </section>
            )}

            {/* 인물 */}
            {grouped.persons.length > 0 && (
              <section className="mb-6">
                <ListTitle title={`인물 (${grouped.persons.length})`} variant="none" className="mb-3" />
                <ul className="space-y-3">
                  {grouped.persons.map(renderItem)}
                </ul>
              </section>
            )}
          </>
        )}
      </MainContent>

      <BottomMenu />
    </MobileFrame>
  );
}
