'use client';

import type { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────
interface MediaTypeButtonProps {
  /** 선택 여부 — true: bg-wb-grey-01, false: bg-wb-dark-04 */
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

// ─── Component ──────────────────────────────────────────────
/**
 * 박스 콘텐츠 / 시청기록 등에서 미디어 타입 (전체/영화/시리즈/인물) 선택용 작은 버튼.
 * 선택된 항목은 어두운 그레이(grey-01), 비선택은 더 어두운(dark-04) 배경.
 */
export default function MediaTypeButton({
  selected = false,
  onClick,
  className,
  children,
}: MediaTypeButtonProps) {
  const bg = selected ? 'bg-wb-grey-01' : 'bg-wb-dark-04';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-[28px] flex items-center justify-center
        px-[13px] py-[10px] rounded-[8px]
        shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)]
        text-[12px] text-wb-white-02 whitespace-nowrap
        ${bg} ${className ?? ''}
      `}
    >
      {children}
    </button>
  );
}
