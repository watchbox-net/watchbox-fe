'use client';

import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import ContentRecordSheet from '@/components/sheet/ContentRecordSheet';
import ContentRecordSheetBody from '@/components/sheet/ContentRecordSheetBody';
import { useInfiniteList } from '@/lib/hooks/useInfiniteList';
import { fetchBoxRecordSheet, updateBoxRecords } from '@/lib/api/box';
import type { WatchMediaTypeFilter, WatchRecordFilter } from '@/lib/api/watch-record';
import type { ContentItem as ContentItemData } from '@/types/content-summary';

interface ContentRecordSheetContainerProps {
  visible: boolean;
  /** 닫기 (취소 / 오버레이 / 완료 후) */
  onClose: () => void;
  boxId: number;
  /** 반영 성공 시 호출 (토스트 등) */
  onCompleted?: (summary: { added: number; removed: number }) => void;
}

/**
 * ContentRecordSheet 를 API 와 연결한 컨테이너.
 *
 * - 열려 있을 때만 GET /boxes/{boxId}/record-sheet (커서 무한스크롤)
 * - 행 클릭은 로컬 체크만 토글 — API 호출 없음
 * - 완료: 서버가 준 hasAddedInbox 와 비교해 add/remove 를 산출해 POST
 * - 취소·오버레이: 로컬 변경을 버린다
 */
export default function ContentRecordSheetContainer({
  visible,
  onClose,
  boxId,
  onCompleted,
}: ContentRecordSheetContainerProps) {
  const queryClient = useQueryClient();

  const [mediaFilter, setMediaFilter] = useState<WatchMediaTypeFilter>('MOVIE_TV');
  const [statusFilter, setStatusFilter] = useState<WatchRecordFilter>('ALL');

  // 로컬 체크 상태: contentId → checked
  const [checked, setChecked] = useState<Map<number, boolean>>(new Map());

  // 필터가 바뀌면 커서를 버리고 처음부터 받는다 (queryKey 에 필터가 들어있다)
  const { items, sentinelRef, isLoading } = useInfiniteList<
    Awaited<ReturnType<typeof fetchBoxRecordSheet>>,
    string | null,
    ContentItemData
  >({
    queryKey: ['boxRecordSheet', boxId, mediaFilter, statusFilter],
    queryFn: (cursor) =>
      fetchBoxRecordSheet(
        boxId,
        { watchMediaTypeFilter: mediaFilter, watchRecordFilter: statusFilter },
        cursor,
      ),
    initialPageParam: null,
    getNextPageParam: (last) => last.nextCursor ?? undefined,
    getItems: (page) => page.contentItemList,
    getItemKey: (item) => item.contentSummary.contentId ?? item.contentSummary.tmdbId,
    enabled: visible,
    staleTime: 0,
  });

  // 시트를 닫으면 로컬 변경을 버린다. 다음에 열 때 서버 상태로 다시 시작한다.
  useEffect(() => {
    if (!visible) setChecked(new Map());
  }, [visible]);

  const handleToggle = (contentId: number) => {
    setChecked((prev) => {
      const next = new Map(prev);
      const server = items.find((i) => i.contentSummary.contentId === contentId)?.hasAddedInbox ?? false;
      next.set(contentId, !(next.get(contentId) ?? server));
      return next;
    });
  };

  const handleDone = async () => {
    const addContentIds: number[] = [];
    const removeContentIds: number[] = [];

    // 체크를 만진 것만 순회한다. 안 만진 행은 서버 상태 그대로다.
    checked.forEach((now, contentId) => {
      const before = items.find((i) => i.contentSummary.contentId === contentId)?.hasAddedInbox ?? false;
      if (now && !before) addContentIds.push(contentId);
      else if (!now && before) removeContentIds.push(contentId);
    });

    if (addContentIds.length === 0 && removeContentIds.length === 0) {
      onClose();
      return;
    }

    try {
      // 요청 목록과 응답 목록이 다를 수 있다(이미 담김·내가 안 담음은 서버가 건너뛴다).
      // 반영 결과는 응답 기준으로 알린다.
      const result = await updateBoxRecords(boxId, { addContentIds, removeContentIds });
      // 시트 자신 + 뒤에 깔린 박스 콘텐츠 목록·개수를 모두 새로 받는다.
      // 목록 쿼리키는 필터·정렬이 뒤에 더 붙으므로 접두어로 무효화한다.
      queryClient.invalidateQueries({ queryKey: ['boxRecordSheet', boxId] });
      queryClient.invalidateQueries({ queryKey: ['boxContents', boxId] });
      queryClient.invalidateQueries({ queryKey: ['boxContentCount', boxId] });
      onCompleted?.({
        added: result.addedContentIds.length,
        removed: result.removedContentIds.length,
      });
    } catch {/* 에러 무시 — 시트는 닫는다 */}
    onClose();
  };

  return (
    <ContentRecordSheet visible={visible} onCancel={onClose} onDone={handleDone}>
      <ContentRecordSheetBody
        items={items}
        checked={checked}
        onToggle={handleToggle}
        mediaFilter={mediaFilter}
        onMediaFilterChange={setMediaFilter}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        isLoading={isLoading}
        sentinelSlot={<div ref={sentinelRef} className="h-[1px]" />}
      />
    </ContentRecordSheet>
  );
}
