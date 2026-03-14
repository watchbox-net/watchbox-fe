'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';

// ─── Types ──────────────────────────────────────────────────
export type ProfileIconVariant = 'mypage' | 'list';

interface ProfileIconProps {
  variant?: ProfileIconVariant;
  className?: string;
}

// ─── Variant config ─────────────────────────────────────────
const VARIANT_STYLES: Record<ProfileIconVariant, string> = {
  mypage: 'size-[72px] text-wb-grey-03',
  list:   'size-[28px] text-wb-grey-03',
};

// ─── Component ──────────────────────────────────────────────
export default function ProfileIcon({
  variant = 'mypage',
  className,
}: ProfileIconProps) {
  return (
    <UserCircleIcon className={`${VARIANT_STYLES[variant]} ${className ?? ''}`} />
  );
}
