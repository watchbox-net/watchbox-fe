'use client';

import { useEffect } from 'react';
import ContentBoxSheetHead from '@/components/sheet/ContentBoxSheetHead';
import SheetContentItem from '@/components/sheet/SheetContentItem';
import SheetBoxItem from '@/components/sheet/SheetBoxItem';
import type { BoxType } from '@/types/box';

/** 시트에 표시할 컨텐츠 정보 */
export interface SheetContent {
  posterSrc?: string | null;
  title: string;
  year?: number | null;
  genres?: string[] | null;
}

/** 시트에 표시할 박스 한 개의 정보 */
export interface SheetBox {
  boxId: number;
  type: BoxType;
  name: string;
  memberNames?: string[];
  posters?: (string | null)[];
  /** 현재 컨텐츠가 이 박스에 이미 포함되어 있는지 */
  included: boolean;
}

interface ContentBoxSheetProps {
  /** 시트 표시 여부 */
  visible: boolean;
  /** 시트가 닫힐 때 호출 (완료 또는 배경 탭) */
  onClose: () => void;
  /** 상단에 표시되는 추가 대상 컨텐츠 */
  content: SheetContent;
  /** 박스 리스트 */
  boxes: SheetBox[];
  /** 각 박스 행 클릭 (토글) */
  onToggleBox?: (boxId: number) => void;
}

/**
 * Content Box Sheet — 바텀 시트
 *
 * 피그마 Content Box Sheet 대응.
 * - 뒷배경에 반투명 오버레이, 하단에서 시트 올라옴
 * - 배경 탭 또는 '완료' 버튼 클릭 시 onClose 호출
 * - 박스 리스트는 최대 6개까지 표시되며, 7개 이상이면 내부 스크롤
 */
export default function ContentBoxSheet({
  visible,
  onClose,
  content,
  boxes,
  onToggleBox,
}: ContentBoxSheetProps) {
  // 시트가 열려있을 때 body 스크롤 잠금
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center"
      onClick={onClose}
    >
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-wb-black/50" aria-hidden />

      {/* 바텀 시트 */}
      <div
        className="relative w-full max-w-[430px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <ContentBoxSheetHead onDone={onClose} />

        <div className="bg-wb-dark-02 flex flex-col gap-[12px] pb-[10px]">
          {/* 추가 대상 컨텐츠 정보 */}
          <SheetContentItem
            posterSrc={content.posterSrc}
            title={content.title}
            year={content.year}
            genres={content.genres}
          />

          {/* 박스 리스트 (최소 3개, 최대 6개 표시, 이후 스크롤) */}
          <div
            className="flex flex-col gap-[15px] overflow-y-auto scrollbar-hide"
            style={{
              minHeight: 3 * 58 + 2 * 15,
              maxHeight: 6 * 58 + 5 * 15,
            }}
          >
            {boxes.map((box) => (
              <SheetBoxItem
                key={box.boxId}
                type={box.type}
                name={box.name}
                memberNames={box.memberNames}
                posters={box.posters}
                included={box.included}
                onClick={onToggleBox ? () => onToggleBox(box.boxId) : undefined}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
