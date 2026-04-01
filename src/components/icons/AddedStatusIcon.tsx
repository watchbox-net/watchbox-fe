'use client';

import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

// ─── Types ──────────────────────────────────────────────────
export type AddedStatusVariant = 'add' | 'checked';

interface AddedStatusIconProps {
  variant?: AddedStatusVariant;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
export default function AddedStatusIcon({
  variant = 'add',
  className,
}: AddedStatusIconProps) {
  if (variant === 'checked') {
    return <CheckCircleIcon className={`size-[24px] text-wb-green ${className ?? ''}`} />;
  }

  return <PlusCircleIcon className={`size-[24px] text-wb-white-01 ${className ?? ''}`} />;
}
