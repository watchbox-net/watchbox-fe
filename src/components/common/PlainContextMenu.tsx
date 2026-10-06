'use client';

import { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────
export type PlainContextMenuSize = 'w120' | 'w135' | 'w140';

export interface PlainContextMenuItem {
  label: string;
  onClick?: () => void;
}

interface PlainContextMenuProps {
  items: PlainContextMenuItem[];
  size?: PlainContextMenuSize;
  className?: string;
}

// ─── Size → width class ─────────────────────────────────────
const SIZE_CLASS: Record<PlainContextMenuSize, string> = {
  w120: 'w-[120px]',
  w135: 'w-[135px]',
  w140: 'w-[140px]',
};

// ─── Component ──────────────────────────────────────────────
export default function PlainContextMenu({
  items,
  size = 'w120',
  className,
}: PlainContextMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`bg-wb-dark-05 rounded-[12px] ${SIZE_CLASS[size]} py-[5px] flex flex-col ${className ?? ''}`}
    >
      {items.map((item, index) => {
        const isHovered = hoveredIndex === index;
        // 라운딩은 hover 상태가 아니라 '위치'에 달린 값이다.
        // hover 와 함께 붙였다 뗐다 하면, transition-colors 로 배경이 사라지는 동안
        // 라운딩만 먼저 없어져 모서리가 잠깐 직각으로 보인다.
        // 배경이 투명할 때 라운딩은 보이지 않으므로 항상 적용해도 된다.
        const positionRounded =
          items.length === 1
            ? 'rounded-[10px]'
            : index === 0
              ? 'rounded-t-[10px]'
              : index === items.length - 1
                ? 'rounded-b-[10px]'
                : '';

        return (
          <button
            key={`${item.label}-${index}`}
            type="button"
            className={`
              relative flex items-center h-[45px] w-full px-[16px]
              cursor-pointer transition-colors text-left
              ${positionRounded} ${isHovered ? 'bg-wb-grey-01' : ''}
            `}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={item.onClick}
          >
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-04 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
