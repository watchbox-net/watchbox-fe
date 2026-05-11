'use client';

import { useState, type ComponentType, type SVGProps } from 'react';
import {
  UserPlusOutline,
  PencilOutline,
  TrashOutline,
  PlusOutline,
  QuestionMarkCircleOutline,
  ExclamationCircleOutline,
  BellAlertOutline,
  MegaphoneOutline,
} from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export type ContextMenuItemType = 'invite' | 'edit' | 'delete' | 'add' | 'help' | 'info' | 'notification' | 'feedback';
export type ContextMenuSize = 'small' | 'medium';

export interface ContextMenuItemConfig {
  type: ContextMenuItemType;
  label?: string;
  onClick?: () => void;
}

export interface PlainContextMenuItemConfig {
  label: string;
  onClick?: () => void;
}

interface ContextMenuProps {
  items: ContextMenuItemConfig[];
  size?: ContextMenuSize;
  className?: string;
}

interface PlainContextMenuProps {
  items: PlainContextMenuItemConfig[];
  activeIndex?: number;
  width?: number;
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
  help:         { icon: QuestionMarkCircleOutline, defaultLabel: '도움말' },
  info:         { icon: ExclamationCircleOutline, defaultLabel: '정보' },
  notification: { icon: BellAlertOutline,          defaultLabel: '알림 설정' },
  feedback:     { icon: MegaphoneOutline,         defaultLabel: '피드백하기' },
};

// ─── Component ──────────────────────────────────────────────
const SIZE_CLASS: Record<ContextMenuSize, string> = {
  small:  'w-[115px]',
  medium: 'w-[137px]',
};

export default function ContextMenu({ items, size = 'small', className }: ContextMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`bg-wb-dark-05 rounded-[12px] ${SIZE_CLASS[size]} py-[5px] flex flex-col ${className ?? ''}`}
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
            <Icon className="size-[24px] text-wb-grey-04 shrink-0" />
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-04 whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}

export function PlainContextMenu({ items, activeIndex, width = 120, className }: PlainContextMenuProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div
      className={`bg-wb-dark-05 rounded-[12px] py-[5px] flex flex-col ${className ?? ''}`}
      style={{ width }}
    >
      {items.map((item, index) => {
        const isActive = hoveredIndex === index || activeIndex === index;

        const hoverRounded =
          index === 0
            ? 'rounded-t-[10px]'
            : index === items.length - 1
              ? 'rounded-b-[10px]'
              : '';

        return (
          <button
            key={index}
            className={`
              relative flex items-center h-[45px] w-full px-[16px]
              cursor-pointer transition-colors
              ${isActive ? `bg-wb-grey-01 ${hoverRounded}` : ''}
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
