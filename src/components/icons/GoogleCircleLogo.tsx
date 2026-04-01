'use client';

import Image from 'next/image';

// ─── Types ──────────────────────────────────────────────────
export type GoogleCircleLogoVariant = 'dark' | 'light';

interface GoogleCircleLogoProps {
  variant?: GoogleCircleLogoVariant;
  className?: string;
}

// ─── Asset map ──────────────────────────────────────────────
const LOGO_SRC: Record<GoogleCircleLogoVariant, string> = {
  dark:  '/oauth/google/web_dark_rd_na@2x.png',
  light: '/oauth/google/web_light_rd_na@2x.png',
};

// ─── Component ──────────────────────────────────────────────
export default function GoogleCircleLogo({
  variant = 'dark',
  className,
}: GoogleCircleLogoProps) {
  return (
    <Image
      src={LOGO_SRC[variant]}
      alt="Google"
      width={18}
      height={18}
      className={className ?? 'size-[18px]'}
    />
  );
}
