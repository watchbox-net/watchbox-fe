'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
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

  return (
    <MobileFrame>
      {/* 헤더 */}
      <div className="flex items-center py-4 px-4 relative">
        <button
          onClick={() => router.back()}
          className="text-black text-xl cursor-pointer"
        >
          ‹
        </button>
        <h1 className="text-lg font-bold flex-1 text-center truncate px-8">
          {isShared ? '공유 박스 컨텐츠' : '마이 박스 컨텐츠'}
        </h1>
        <button className="text-black text-xl cursor-pointer">+</button>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-4">
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
          <ul className="space-y-3">
            {items.map((item) => {
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
                    <p className="text-sm text-black truncate">{title}</p>
                    <p className="text-xs text-neutral-400 truncate mt-0.5">
                      {sub}
                    </p>

                    {/* 마이 박스: 좋아요 표시 */}
                    {!isShared && liked && (
                      <p className="text-xs text-red-500 mt-1">
                        👍 좋아요 누른 컨텐츠
                      </p>
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
            })}
          </ul>
        )}
      </main>

      <BottomMenu />
    </MobileFrame>
  );
}
