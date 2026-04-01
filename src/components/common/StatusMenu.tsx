'use client';

import { useState } from 'react';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import type { WatchStatus } from '@/components/icons/WatchStatusIcon';
import { XMarkIcon } from '@heroicons/react/24/outline';

// ─── Types ──────────────────────────────────────────────────
export type StatusMenuAction = 'completed' | 'watching' | 'planned' | 'paused' | 'delete';

interface StatusMenuProps {
  className?: string;
  onSelect?: (action: StatusMenuAction) => void;
}

// ─── Menu items ─────────────────────────────────────────────
const MENU_ITEMS: { action: StatusMenuAction; label: string; iconStatus?: WatchStatus }[] = [
  { action: 'completed', label: '시청 완료', iconStatus: 'completed' },
  { action: 'watching',  label: '시청중',    iconStatus: 'watching' },
  { action: 'planned',   label: '시청 예정', iconStatus: 'planned' },
  { action: 'paused',    label: '시청 중단', iconStatus: 'paused' },
  { action: 'delete',    label: '기록 삭제' },
];

// ─── Component ──────────────────────────────────────────────
export default function StatusMenu({ className, onSelect }: StatusMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`bg-wb-dark-05 rounded-[15px] w-[135px] py-[5px] flex flex-col ${className ?? ''}`}
    >
      {MENU_ITEMS.map((item, index) => {
        const isHovered = hoveredIndex === index;

        // hover 시 배경 라운딩: 첫번째=top, 마지막=bottom, 나머지=none
        const hoverRounded =
          index === 0
            ? 'rounded-t-[10px]'
            : index === MENU_ITEMS.length - 1
              ? 'rounded-b-[10px]'
              : '';

        return (
          <button
            key={item.action}
            className={`
              relative flex items-center h-[45px] w-full px-[16px] gap-[24px]
              cursor-pointer transition-colors
              ${isHovered ? `bg-wb-grey-01 ${hoverRounded}` : ''}
            `}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={() => onSelect?.(item.action)}
          >
            {item.action === 'delete'
              ? <XMarkIcon className="size-[24px] text-wb-dark-04" strokeWidth={2} />
              : <WatchStatusIcon status={item.iconStatus!} size="medium" />
            }
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-03 whitespace-nowrap">
              {item.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
