'use client';

import { XMarkIcon } from '@heroicons/react/24/outline';

// ─── Types ──────────────────────────────────────────────────
export type DeleteIconVariant = 'light' | 'grey';

interface DeleteIconProps {
  variant?: DeleteIconVariant;
  className?: string;
}

// ─── Variant → Color class ──────────────────────────────────
const VARIANT_COLORS: Record<DeleteIconVariant, string> = {
  light: 'text-wb-grey-04',
  grey:  'text-wb-grey-01',
};

// ─── Component ──────────────────────────────────────────────
export default function DeleteIcon({
  variant = 'light',
  className,
}: DeleteIconProps) {
  return (
    <XMarkIcon className={`size-[24px] ${VARIANT_COLORS[variant]} ${className ?? ''}`} />
  );
}
