'use client';

import { UserCircleIcon } from '@heroicons/react/24/solid';

// ─── Types ──────────────────────────────────────────────────
export type ProfileIconVariant = 'edit' | 'mypage' | 'list';

interface ProfileIconProps {
  variant?: ProfileIconVariant;
  className?: string;
}

// ─── Variant config ─────────────────────────────────────────
const VARIANT_STYLES: Record<ProfileIconVariant, string> = {
  edit:   'size-[96px] text-wb-grey-04',
  mypage: 'size-[72px] text-wb-grey-04',
  list:   'size-[28px] text-wb-grey-04',
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
