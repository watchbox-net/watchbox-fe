'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import {
  UserPlusOutline,
  PencilOutline,
  TrashOutline,
  PlusOutline,
  QuestionMarkCircleOutline,
  ExclamationCircleOutline,
} from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export type ContextMenuItemType = 'invite' | 'edit' | 'delete' | 'add' | 'help' | 'info';

export interface ContextMenuItemConfig {
  type: ContextMenuItemType;
  label?: string;
  onClick?: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItemConfig[];
  className?: string;
}

// ─── Preset: type → icon, default label ─────────────────────
const PRESETS: Record<ContextMenuItemType, {
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  defaultLabel: string;
}> = {
  invite: { icon: UserPlusOutline, defaultLabel: '초대' },
  edit:   { icon: PencilOutline,   defaultLabel: '수정' },
  delete: { icon: TrashOutline,    defaultLabel: '삭제' },
  add:    { icon: PlusOutline,     defaultLabel: '추가' },
  help:   { icon: QuestionMarkCircleOutline, defaultLabel: '도움말' },
  info:   { icon: ExclamationCircleOutline, defaultLabel: '정보' },
};

// ─── Component ──────────────────────────────────────────────
export default function ContextMenu({ items, className }: ContextMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`bg-wb-dark-05 rounded-[15px] min-w-[110px] py-[5px] flex flex-col ${className ?? ''}`}
    >
      {items.map((item, index) => {
        const preset = PRESETS[item.type];
        const Icon = preset.icon;
        const label = item.label ?? preset.defaultLabel;
        const isHovered = hoveredIndex === index;

        const hoverRounded =
          index === 0
            ? 'rounded-t-[10px]'
            : index === items.length - 1
              ? 'rounded-b-[10px]'
              : '';

        return (
          <button
            key={`${item.type}-${index}`}
            className={`
              relative flex items-center h-[45px] w-full px-[16px] gap-[24px]
              cursor-pointer transition-colors
              ${isHovered ? `bg-wb-grey-01 ${hoverRounded}` : ''}
            `}
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
            onClick={item.onClick}
          >
            <Icon className="size-[24px] text-wb-grey-03 shrink-0" />
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-03 whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
