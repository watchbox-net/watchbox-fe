'use client';

import { HandThumbUpIcon as ThumbUpSolid } from '@heroicons/react/24/solid';
import { HandThumbUpIcon as ThumbUpOutline } from '@heroicons/react/24/outline';

// ─── Types ──────────────────────────────────────────────────
export type LikeIconSize = 'xl' | 'large' | 'medium' | 'small' | 'tiny';

interface LikeIconProps {
  active?: boolean;
  size?: LikeIconSize;
  className?: string;
}

// ─── Size → Tailwind class ──────────────────────────────────
const SIZE_CLASSES: Record<LikeIconSize, string> = {
  xl:     'size-[48px]',
  large:  'size-[32px]',
  medium: 'size-[24px]',
  small:  'size-[20px]',
  tiny:   'size-[12px]',
};

// ─── Component ──────────────────────────────────────────────
export default function LikeIcon({
  active = false,
  size = 'medium',
  className,
}: LikeIconProps) {
  const sizeClass = SIZE_CLASSES[size];

  if (active) {
    return <ThumbUpSolid className={`${sizeClass} text-wb-red ${className ?? ''}`} />;
  }

  return <ThumbUpSolid className={`${sizeClass} text-wb-grey-01 ${className ?? ''}`} />;
}
