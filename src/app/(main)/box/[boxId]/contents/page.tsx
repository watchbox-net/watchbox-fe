'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import ListTitle from '@/components/list/ListTitle';
import ContentListItem from '@/components/list/ContentListItem';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import Toast from '@/components/common/Toast';
import { PlusOutline } from '@/components/icons';
import MainContent from '@/components/common/MainContent';
import { fetchBoxContents } from '@/lib/api/box';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';
import type { ContentItem, WatchStatus } from '@/types/content';
import type { BoxType } from '@/types/box';

export default function BoxContentsPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const boxId = Number(params.boxId);
  const boxType = (searchParams.get('type') as BoxType) || 'MY';

  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const isShared = boxType === 'SHARED';
  const headerTitle = isShared ? '공유 박스 컨텐츠' : '마이 박스 컨텐츠';

  // 시청 상태 메뉴
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const menuRef = useRef<HTMLDivElement>(null);

  // 토스트
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (message: string) => setToast({ visible: true, message });

  const { changeStatus } = useWatchStatus({ showToast });

  const { data: items = [], isLoading: loading, isError: error } = useQuery({
    queryKey: ['boxContents', boxId, boxType],
    queryFn: async () => {
      const res = await fetchBoxContents(boxId);
      return res.contentItemList;
    },
  });

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenuId(null);
      }
    };
    if (openMenuId !== null) {
      document.addEventListener('mousedown', handleMouseDown);
    }
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [openMenuId]);

  const handleStatusSelect = async (
    item: ContentItem,
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    setOpenMenuId(null);
    const summary = item.contentSummary;
    if (summary.mediaType !== 'MOVIE' && summary.mediaType !== 'TV') return;
    const success = await changeStatus(summary.tmdbId, summary.mediaType, status);
    if (success) {
      queryClient.setQueryData<ContentItem[]>(['boxContents', boxId, boxType], (prev) =>
        (prev ?? []).map((i) =>
          i.contentSummary.tmdbId === summary.tmdbId
            ? { ...i, memberRecord: { ...i.memberRecord, liked: i.memberRecord?.liked ?? null, watchStatus: status } }
            : i,
        ),
      );
    }
  };

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
    const itemId = item.boxContentId ?? summary.tmdbId;
    const isMenuOpen = openMenuId === itemId;

    const boxMode = isShared
      ? { mode: 'shared' as const, publishers: item.publisherSummaryList?.map((p) => p.nickname) ?? [] }
      : { mode: 'my' as const, liked: item.memberRecord?.liked === true };

    const menu: ReactNode = isMenuOpen ? (
      <div
        ref={menuRef}
        className={`absolute right-0 z-50 ${menuDir === 'down' ? 'top-full mt-1' : 'bottom-full mb-1'}`}
      >
        <WatchStatusMenu
          onSelect={(status) => handleStatusSelect(item, status)}
          onDelete={() => {}}
        />
      </div>
    ) : null;

    return (
      <ContentListItem
        key={itemId}
        posterSrc={imageUrl}
        title={title}
        year={year}
        genres={genres}
        watchStatus={watchStatus}
        boxMode={boxMode}
        showDivider={!isLast}
        onClick={() => router.push(`/content/${summary.mediaType}/${summary.tmdbId}`)}
        onStatusClick={(e) => {
          if (!authLoading && !isAuthenticated) {
            showLoginModal();
            return;
          }
          if (isMenuOpen) { setOpenMenuId(null); return; }
          const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
          setMenuDir(window.innerHeight - rect.bottom < 220 ? 'up' : 'down');
          setOpenMenuId(itemId);
        }}
        statusMenuSlot={menu}
      />
    );
  };

  return (
    <>
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
            {grouped.movies.length > 0 && (
              <section className="mb-4">
                <ListTitle title={`영화 (${grouped.movies.length})`} variant="none" className="mb-1" />
                {grouped.movies.map(renderItem)}
              </section>
            )}
            {grouped.tvs.length > 0 && (
              <section className="mb-4">
                <ListTitle title={`시리즈 (${grouped.tvs.length})`} variant="none" className="mb-1" />
                {grouped.tvs.map(renderItem)}
              </section>
            )}
            {grouped.persons.length > 0 && (
              <section className="mb-4">
                <ListTitle title={`인물 (${grouped.persons.length})`} variant="none" className="mb-1" />
                {grouped.persons.map(renderItem)}
              </section>
            )}
          </>
        )}
      </MainContent>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
