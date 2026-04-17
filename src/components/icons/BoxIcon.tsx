'use client';

import { ArchiveBoxIcon as ArchiveBoxSolid } from '@heroicons/react/24/solid';
import { ArchiveBoxIcon as ArchiveBoxOutline } from '@heroicons/react/24/outline';

// ─── Types ──────────────────────────────────────────────────
export type BoxIconVariant = 'added' | 'none' | 'outline';
export type BoxIconSize = 'xl' | 'large' | 'medium' | 'small' | 'tiny';

interface BoxIconProps {
  variant?: BoxIconVariant;
  size?: BoxIconSize;
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

// ─── Size → Tailwind class ──────────────────────────────────
const SIZE_CLASSES: Record<BoxIconSize, string> = {
  xl:     'size-[48px]',
  large:  'size-[32px]',
  medium: 'size-[24px]',
  small:  'size-[20px]',
  tiny:   'size-[12px]',
};

// ─── Variant → Color class ──────────────────────────────────
const VARIANT_COLORS: Record<BoxIconVariant, string> = {
  added:   'text-wb-grey-03',
  none:    'text-wb-grey-01',
  outline: 'text-wb-grey-01',
};

// ─── Component ──────────────────────────────────────────────
export default function BoxIcon({
  variant = 'added',
  size = 'medium',
  className,
  onClick,
}: BoxIconProps) {
  const sizeClass = SIZE_CLASSES[size];
  const colorClass = VARIANT_COLORS[variant];
  const combined = `${sizeClass} ${colorClass} ${className ?? ''}`;

  if (variant === 'outline') {
    return <ArchiveBoxOutline className={combined} onClick={onClick} />;
  }

  return <ArchiveBoxSolid className={combined} onClick={onClick} />;
}
