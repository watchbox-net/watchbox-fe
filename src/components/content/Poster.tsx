'use client';

import Image from 'next/image';

// ─── Types ──────────────────────────────────────────────────
export type PosterSize = 'large' | 'medium' | 'small';

interface PosterProps {
  /** 포스터 이미지 URL (없으면 placeholder) */
  src?: string | null;
  alt?: string;
  size?: PosterSize;
  className?: string;
}

/** 사이즈별 스펙 (Figma 기준) */
const SIZE_MAP: Record<PosterSize, { width: number; height: number; radius: string }> = {
  large:  { width: 140, height: 199, radius: 'rounded-[10px]' },
  medium: { width: 115, height: 163, radius: 'rounded-[10px]' },
  small:  { width: 60,  height: 90,  radius: 'rounded-[5px]' },
};

// ─── Component ──────────────────────────────────────────────
export default function Poster({
  src,
  alt = '',
  size = 'large',
  className,
}: PosterProps) {
  const { width, height, radius } = SIZE_MAP[size];

  return (
    <div
      className={`shrink-0 ${className ?? ''}`}
      style={{ width, height }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover ${radius}`}
        />
      ) : (
        <div className={`w-full h-full bg-neutral-700 ${radius}`} />
      )}
    </div>
  );
}
