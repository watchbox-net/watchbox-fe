import Link from 'next/link';
import { ChevronRightOutline } from '@/components/icons';
import { EllipsisVerticalIcon } from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';

// ─── Types ──────────────────────────────────────────────────
export type ListTitleVariant = 'none' | 'arrow' | 'kebab' | 'toggle-arrow';

interface ListTitleProps {
  title: string;
  variant?: ListTitleVariant;
  /** arrow variant에서 Link로 이동할 경로 (onAction보다 우선) */
  href?: string;
  onAction?: () => void;
  /** toggle-arrow variant에서 토글 슬롯 */
  toggleSlot?: ReactNode;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
export default function ListTitle({
  title,
  variant = 'none',
  href,
  onAction,
  toggleSlot,
  className,
}: ListTitleProps) {
  const arrowButton = href ? (
    <Link href={href} className="cursor-pointer shrink-0" aria-label={`${title} 더보기`}>
      <ChevronRightOutline className="size-[26px] text-white" />
    </Link>
  ) : (
    <button onClick={onAction} className="cursor-pointer shrink-0" aria-label={`${title} 더보기`}>
      <ChevronRightOutline className="size-[26px] text-white" />
    </button>
  );

  return (
    <div
      className={`flex items-center justify-between w-full pl-[16px] pr-[12px] ${className ?? ''}`}
    >
      {variant === 'toggle-arrow' ? (
        <div className="flex items-center gap-[13px]">
          <p className="text-[20px] font-bold leading-none text-white">{title}</p>
          {toggleSlot}
        </div>
      ) : (
        <p className="text-[20px] font-bold leading-none text-white">{title}</p>
      )}

      {(variant === 'arrow' || variant === 'toggle-arrow') && arrowButton}

      {variant === 'kebab' && (
        <button onClick={onAction} className="cursor-pointer shrink-0">
          <EllipsisVerticalIcon className="size-[26px] text-white" />
        </button>
      )}
    </div>
  );
}
