'use client';

import { useEffect, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import ContentBoxSheet, { SheetBox, SheetContent } from '@/components/sheet/ContentBoxSheet';
import { fetchContentBoxSheet, updateContentBoxes } from '@/lib/api/content-box';
import type { ContentBoxItem } from '@/types/content-box';

type ContentMediaType = 'MOVIE' | 'TV' | 'PERSON';

interface ContentBoxSheetContainerProps {
  /** 시트 표시 여부 */
  visible: boolean;
  /** 시트 닫기 (취소/오버레이/완료 모두 호출) */
  onClose: () => void;
  /** 시트 상단에 표시할 컨텐츠 정보 */
  content: SheetContent;
  /** 대상 컨텐츠 media type */
  mediaType: ContentMediaType;
  /** 대상 컨텐츠 tmdbId */
  tmdbId: number;
  /** 완료 후 변경 성공 시 호출 (토스트 등) */
  onCompleted?: (summary: { added: number; removed: number }) => void;
}

/**
 * ContentBoxSheet를 실제 API와 연동한 컨테이너.
 *
 * - visible=true로 열리면 GET /contents/{mediaType}/{tmdbId}/boxes 호출
 * - 박스 행 클릭 시 로컬 상태에서 hasContent 토글 (API 호출 X)
 * - 완료 버튼: 원본과 비교해 addBoxIds / removeBoxIds 산출 후 POST
 * - 취소 / 오버레이 / 시트 재오픈: 로컬 변경 버리고 서버 상태 유지
 */
export default function ContentBoxSheetContainer({
  visible,
  onClose,
  content,
  mediaType,
  tmdbId,
  onCompleted,
}: ContentBoxSheetContainerProps) {
  const queryClient = useQueryClient();

  // 서버 상태 조회 (시트가 열려 있을 때만)
  const { data } = useQuery({
    queryKey: ['contentBoxSheet', mediaType, tmdbId],
    queryFn: () => fetchContentBoxSheet(mediaType, tmdbId),
    enabled: visible,
    staleTime: 0,
  });

  // 로컬 체크 상태: Map<boxId, checked>
  const [checked, setChecked] = useState<Map<number, boolean>>(new Map());

  // 서버 데이터가 바뀌면 로컬 상태 초기화
  useEffect(() => {
    if (!data) return;
    const next = new Map<number, boolean>();
    data.contentBoxItemList.forEach((b) => next.set(b.boxId, b.hasContent));
    setChecked(next);
  }, [data]);

  // 박스 행 클릭: 로컬 토글
  const handleToggle = (boxId: number) => {
    setChecked((prev) => {
      const next = new Map(prev);
      next.set(boxId, !next.get(boxId));
      return next;
    });
  };

  // 완료: diff 산출 → POST
  const handleDone = async () => {
    if (!data) { onClose(); return; }

    const addBoxIds: number[] = [];
    const removeBoxIds: number[] = [];

    data.contentBoxItemList.forEach((b) => {
      const now = checked.get(b.boxId) ?? b.hasContent;
      if (now && !b.hasContent) addBoxIds.push(b.boxId);
      else if (!now && b.hasContent) removeBoxIds.push(b.boxId);
    });

    if (addBoxIds.length === 0 && removeBoxIds.length === 0) {
      onClose();
      return;
    }

    try {
      await updateContentBoxes(mediaType, tmdbId, { addBoxIds, removeBoxIds });
      // 시트 쿼리 무효화 → 다음 오픈 시 최신 상태
      queryClient.invalidateQueries({ queryKey: ['contentBoxSheet', mediaType, tmdbId] });
      onCompleted?.({ added: addBoxIds.length, removed: removeBoxIds.length });
    } catch {/* 에러 무시 */}
    onClose();
  };

  // ContentBoxItem → SheetBox 매핑
  const boxes: SheetBox[] = (data?.contentBoxItemList ?? []).map((b: ContentBoxItem) => ({
    boxId: b.boxId,
    type: b.boxType,
    name: b.name,
    memberNames: b.memberNameList ?? undefined,
    posters: b.previewPosterList,
    included: checked.get(b.boxId) ?? b.hasContent,
  }));

  return (
    <ContentBoxSheet
      visible={visible}
      onCancel={onClose}
      onDone={handleDone}
      content={content}
      boxes={boxes}
      onToggleBox={handleToggle}
    />
  );
}
