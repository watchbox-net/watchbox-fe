'use client';

import { useState } from 'react';

// ─── Types ──────────────────────────────────────────────────
export type PlainContextMenuSize = 'w120' | 'w135';

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
        const hoverRounded =
          index === 0
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
              ${isHovered ? `bg-wb-grey-01 ${hoverRounded}` : ''}
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
