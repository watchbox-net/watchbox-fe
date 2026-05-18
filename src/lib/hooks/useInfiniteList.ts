'use client';

import { useEffect } from 'react';
import {
  useInfiniteQuery,
  type QueryKey,
  type InfiniteData,
} from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';

/**
 * 무한 스크롤 공통 hook
 *
 * - TanStack `useInfiniteQuery` + `react-intersection-observer`(useInView) 조합
 * - offset 기반(page=1,2,3...) / cursor 기반(nextCursor) 모두 호환
 *   → `initialPageParam`과 `getNextPageParam` 만 다르게 지정하면 됨
 *
 * @example offset 기반
 *   useInfiniteList({
 *     queryKey: ['discover', category, type, withRecord],
 *     queryFn: (page) => fetchDiscoverList(category, type, page, withRecord),
 *     initialPageParam: 2,
 *     initialData: { pages: [serverPage1], pageParams: [1] },
 *     getNextPageParam: (last) =>
 *       last.currentPage < last.totalPages ? last.currentPage + 1 : undefined,
 *     getItems: (page) => page.contentItemList,
 *   });
 *
 * @example cursor 기반
 *   useInfiniteList({
 *     queryKey: ['box-contents', boxId],
 *     queryFn: (cursor) => fetchBoxContents(boxId, cursor),
 *     initialPageParam: null as string | null,
 *     getNextPageParam: (last) => last.nextCursor ?? undefined,
 *     getItems: (page) => page.contents,
 *   });
 */
export function useInfiniteList<TResponse, TPageParam, TItem>(options: {
  queryKey: QueryKey;
  queryFn: (pageParam: TPageParam) => Promise<TResponse>;
  initialPageParam: TPageParam;
  initialData?: InfiniteData<TResponse, TPageParam>;
  getNextPageParam: (
    lastPage: TResponse,
    allPages: TResponse[],
  ) => TPageParam | undefined;
  getItems: (page: TResponse) => TItem[];
  /**
   * 중복 제거 키 추출 함수.
   * 지정 시 페이지 간 같은 키를 가진 아이템은 첫 등장만 유지.
   * (예: TMDB popular/trending은 페이지 사이 랭킹이 바뀌어 중복 발생 가능)
   */
  getItemKey?: (item: TItem) => string | number;
  enabled?: boolean;
  /** sentinel이 뷰포트 N px 이내로 들어오면 다음 페이지 요청 (기본 200px) */
  rootMargin?: string;
  staleTime?: number;
}) {
  const {
    queryKey,
    queryFn,
    initialPageParam,
    initialData,
    getNextPageParam,
    getItems,
    getItemKey,
    enabled = true,
    rootMargin = '200px',
    staleTime,
  } = options;

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => queryFn(pageParam as TPageParam),
    initialPageParam,
    initialData,
    getNextPageParam,
    enabled,
    staleTime,
  });

  const { ref: sentinelRef, inView } = useInView({ rootMargin });

  useEffect(() => {
    if (inView && query.hasNextPage && !query.isFetchingNextPage) {
      query.fetchNextPage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, query.hasNextPage, query.isFetchingNextPage]);

  const rawItems: TItem[] =
    query.data?.pages.flatMap((page) => getItems(page)) ?? [];

  // 페이지 간 중복 제거 (getItemKey 지정 시)
  const items: TItem[] = getItemKey
    ? (() => {
        const seen = new Set<string | number>();
        const result: TItem[] = [];
        for (const item of rawItems) {
          const key = getItemKey(item);
          if (!seen.has(key)) {
            seen.add(key);
            result.push(item);
          }
        }
        return result;
      })()
    : rawItems;

  return {
    items,
    sentinelRef,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    isFetchingNextPage: query.isFetchingNextPage,
    hasNextPage: query.hasNextPage,
    refetch: query.refetch,
    /** 첫 페이지 응답 (totalCount 등 메타 표시용) */
    firstPage: query.data?.pages[0],
    /** 마지막 페이지 응답 */
    lastPage: query.data?.pages[query.data.pages.length - 1],
    /** items 직접 조작이 필요할 때를 위한 query client setData 접근용 */
    queryKey,
  };
}
