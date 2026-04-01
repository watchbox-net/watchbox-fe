'use client';

import { EyeIcon as EyeSolid, EyeSlashIcon as EyeSlashSolid } from '@heroicons/react/24/solid';
import { EyeIcon as EyeOutlineIcon } from '@heroicons/react/24/outline';

// ─── Types ──────────────────────────────────────────────────
export type WatchStatus = 'completed' | 'watching' | 'planned' | 'paused' | 'none' | 'outline';
export type WatchStatusSize = 'xl' | 'large' | 'medium' | 'small' | 'tiny';

interface WatchStatusIconProps {
  status?: WatchStatus;
  size?: WatchStatusSize;
  className?: string;
}

// ─── Size → Tailwind class ──────────────────────────────────
const SIZE_CLASSES: Record<WatchStatusSize, string> = {
  xl:     'size-[48px]',
  large:  'size-[32px]',
  medium: 'size-[24px]',
  small:  'size-[20px]',
  tiny:   'size-[12px]',
};

// ─── Status → Color class ───────────────────────────────────
const STATUS_COLORS: Record<WatchStatus, string> = {
  completed: 'text-wb-green',
  watching:  'text-wb-orange',
  planned:   'text-wb-purple',
  paused:    'text-wb-dark-04',
  none:      'text-wb-grey-01',
  outline:   'text-wb-grey-03',
};

// ─── Component ──────────────────────────────────────────────
export default function WatchStatusIcon({
  status = 'completed',
  size = 'medium',
  className,
}: WatchStatusIconProps) {
  const sizeClass = SIZE_CLASSES[size];
  const colorClass = STATUS_COLORS[status];
  const combined = `${sizeClass} ${colorClass} ${className ?? ''}`;

  if (status === 'outline') {
    return <EyeOutlineIcon className={combined} />;
  }

  if (status === 'paused') {
    return <EyeSlashSolid className={combined} />;
  }

  return <EyeSolid className={combined} />;
}
