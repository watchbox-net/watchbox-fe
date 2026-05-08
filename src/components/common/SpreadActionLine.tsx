'use client';

import { ChevronDownOutline, ChevronUpOutline } from '@/components/icons';

interface SpreadActionLineProps {
  /** 펼침 상태 */
  expanded: boolean;
  /** 토글 클릭 시 실행 */
  onToggle: () => void;
  /** 펼침 시 라벨 (default: "접기") */
  collapseLabel?: string;
  /** 접힘 시 라벨 (default: "더보기") */
  expandLabel?: string;
  className?: string;
}

/**
 * Spread Action Line — "더보기 v / 접기 ^" 토글 라인
 * 피그마 Spread Action Line
 *
 * 클릭 영역은 텍스트+아이콘이 들어있는 contents 프레임 한정
 * (외곽 라인은 layout만 잡고 클릭 받지 않음).
 */
export default function SpreadActionLine({
  expanded,
  onToggle,
  collapseLabel = '접기',
  expandLabel = '더보기',
  className,
}: SpreadActionLineProps) {
  return (
    <div
      className={[
        // 하단 간격 제거 — 바로 라인/다음 섹션이 붙도록 pt만 적용
        'w-full flex items-end justify-center pt-[12px]',
        className ?? '',
      ].filter(Boolean).join(' ')}
    >
      <button
        type="button"
        onClick={onToggle}
        className="inline-flex items-center gap-[4px] px-[8px] py-[4px] text-[14px] text-wb-white-01 cursor-pointer"
      >
        <span>{expanded ? collapseLabel : expandLabel}</span>
        {expanded ? (
          <ChevronUpOutline className="size-[16px] text-wb-white-01" />
        ) : (
          <ChevronDownOutline className="size-[16px] text-wb-white-01" />
        )}
      </button>
    </div>
  );
}
