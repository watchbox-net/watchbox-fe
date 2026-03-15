'use client';

import { ChevronRightIcon } from '@heroicons/react/24/solid';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';

// ─── Types ──────────────────────────────────────────────────
export type ListTitleVariant = 'none' | 'arrow' | 'kebab';

interface ListTitleProps {
  title: string;
  variant?: ListTitleVariant;
  onAction?: () => void;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
export default function ListTitle({
  title,
  variant = 'none',
  onAction,
  className,
}: ListTitleProps) {
  return (
    <div
      className={`flex items-center justify-between pl-[17px] pr-[12px] w-full ${className ?? ''}`}
    >
      <p className="text-[20px] font-bold leading-none text-white">{title}</p>

      {variant === 'arrow' && (
        <button onClick={onAction} className="cursor-pointer shrink-0">
          <ChevronRightIcon className="size-[26px] text-white" />
        </button>
      )}

      {variant === 'kebab' && (
        <button onClick={onAction} className="cursor-pointer shrink-0">
          <EllipsisVerticalIcon className="size-[26px] text-white" />
        </button>
      )}
    </div>
  );
}
