'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Fragment } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import { Loading } from '@/components/common/Loading';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import BoxHistory from '@/components/box/BoxHistory';
import BoxItem from '@/components/box/BoxItem';
import { ChevronDownOutline } from '@/components/icons';
import {
  fetchBox,
  fetchBoxHistory,
  type BoxHistoryEntry,
  type BoxHistoryPageResponse,
  type BoxHistorySortOrder,
} from '@/lib/api/box';
import { useAuth } from '@/lib/context/AuthContext';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import { getDisplayTitle } from '@/lib/utils/content';

// ── 정렬 라벨 (최신순/오래된순) ──────────────────────────────
const SORT_LABEL: Record<BoxHistorySortOrder, string> = {
  RECENT: '최신순',
  OLDEST: '오래된순',
};

/** 굵게 강조 (사용자명/컨텐츠명) */
function Bold({ children }: { children: ReactNode }) {
  return <span className="font-semibold">{children}</span>;
}

/** 받침 유무로 목적격 조사(을/를) 선택. 비한글은 '을'로 폴백 */
function objectParticle(word: string): '을' | '를' {
  const code = word.charCodeAt(word.length - 1);
  if (code < 0xac00 || code > 0xd7a3) return '을';
  return (code - 0xac00) % 28 > 0 ? '을' : '를';
}

const REMOVED_MEMBER = '탈퇴한 사용자';

/** 박스 히스토리 엔트리 → 표시 내용 (사용자명/컨텐츠명 semibold) */
function buildContent(entry: BoxHistoryEntry): ReactNode {
  const actor = entry.actor?.nickname ?? REMOVED_MEMBER;
  const contentName = entry.content ? getDisplayTitle(entry.content) : '';

  switch (entry.eventType) {
    case 'CONTENT_ADDED':
      return (
        <Fragment>
          <Bold>{actor}</Bold>님이 <Bold>{contentName}</Bold>
          {objectParticle(contentName)} 박스에 <Bold>추가</Bold>
        </Fragment>
      );
    case 'CONTENT_DELETED':
      return (
        <Fragment>
          <Bold>{actor}</Bold>님이 <Bold>{contentName}</Bold>
          {objectParticle(contentName)} 박스에서 <Bold>삭제</Bold>
        </Fragment>
      );
    case 'MEMBER_JOINED': {
      const target = entry.targetMember?.nickname ?? REMOVED_MEMBER;
      return (
        <Fragment>
          <Bold>{target}</Bold>님이 박스 멤버로 <Bold>합류</Bold>
        </Fragment>
      );
    }
    default:
      // 미구현 이벤트 — 안전하게 빈 내용
      return null;
  }
}

export default function BoxHistoryPage() {
  const router = useRouter();
  const params = useParams();
  const boxId = Number(params.boxId);
  const { isAuthenticated, isLoading: authLoading } = useAuth();

  const [sort, setSort] = useState<BoxHistorySortOrder>('RECENT');
  const [sortMenuOpen, setSortMenuOpen] = useState(false);
  const sortMenuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (sortMenuRef.current && !sortMenuRef.current.contains(e.target as Node)) {
        setSortMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, []);

  // 상단 박스 정보 (날짜·메뉴 숨김)
  const { data: box } = useQuery({
    queryKey: ['box', boxId],
    queryFn: () => fetchBox(boxId),
    enabled: !authLoading && isAuthenticated && !Number.isNaN(boxId),
    staleTime: 1000 * 60,
  });

  const {
    items,
    sentinelRef,
    isLoading: loading,
    isError: error,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteList<BoxHistoryPageResponse, number | null, BoxHistoryEntry>({
    queryKey: ['boxHistory', boxId, sort],
    queryFn: (cursorId) => fetchBoxHistory(boxId, sort, cursorId),
    initialPageParam: null,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? lastPage.nextCursor : undefined,
    getItems: (page) => page.historyList,
    getItemKey: (item) => item.boxHistoryId,
    enabled: !authLoading && isAuthenticated && !Number.isNaN(boxId),
    staleTime: 0,
  });

  return (
    <>
      <Header variant="back" title="박스 히스토리" onBack={() => router.back()} />

      {/* ── 박스 정보 (날짜·케밥 숨김, 헤더와 gap 10) ──────── */}
      {box && (
        <div className="pt-[10px]">
          <BoxItem
            type={box.boxType}
            name={box.name}
            posters={box.previewPosterList}
            memberNames={box.memberList?.map((m) => m.boxMemberName)}
            update={false}
            menu={false}
            myLabel
          />
        </div>
      )}

      {/* ── 정렬 라인 (필터 없음, 박스 정보와 gap 10) ──────── */}
      <div className="flex items-center justify-end pr-[6px] pt-[10px]">
        <div ref={sortMenuRef} className="relative">
          <button
            type="button"
            onClick={() => setSortMenuOpen((v) => !v)}
            className="flex items-center gap-[2px] text-[14px] text-wb-white-02"
          >
            {SORT_LABEL[sort]}
            <ChevronDownOutline className="size-[16px] text-wb-white-02" />
          </button>
          {sortMenuOpen && (
            <div className="absolute right-0 top-full mt-[6px] z-40">
              <PlainContextMenu
                size="w120"
                items={(Object.keys(SORT_LABEL) as BoxHistorySortOrder[]).map((key) => ({
                  label: SORT_LABEL[key],
                  onClick: () => { setSort(key); setSortMenuOpen(false); },
                }))}
              />
            </div>
          )}
        </div>
      </div>

      <MainContent>
        {!authLoading && !isAuthenticated && (
          <p className="text-center text-wb-grey-03 py-8">로그인 후 이용해 보세요.</p>
        )}
        {loading && <Loading />}
        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">오류가 발생했습니다.</p>
        )}
        {!loading && !error && isAuthenticated && items.length === 0 && (
          <p className="text-center text-neutral-500 py-8">히스토리가 없습니다.</p>
        )}
        {!loading && !error && items.length > 0 && (
          <>
            <div className="flex flex-col gap-[25px] pt-[10px] pb-[15px]">
              {items.map((entry) => (
                <BoxHistory
                  key={entry.boxHistoryId}
                  item={{
                    profileImageUrl: null,
                    content: buildContent(entry),
                    date: entry.createdAt.slice(0, 19).replace('T', ' '),
                  }}
                />
              ))}
            </div>

            {/* 무한 스크롤 sentinel */}
            {hasNextPage && <div ref={sentinelRef} className="h-px" />}
            {isFetchingNextPage && (
              <p className="text-center text-wb-grey-03 py-4">불러오는 중...</p>
            )}
          </>
        )}
      </MainContent>
    </>
  );
}
