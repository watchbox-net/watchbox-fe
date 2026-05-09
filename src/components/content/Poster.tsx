'use client';

import Image from 'next/image';
import EmptyPosterImage from '@/components/content/empty/EmptyPosterImage';
import EmptyProfileImage from '@/components/content/empty/EmptyProfileImage';

// ─── Types ──────────────────────────────────────────────────
export type PosterSize = 'large' | 'medium' | 'small' | 'xsmall';
/**
 * Empty fallback variant
 * - 'poster' (default): 영화/TV — 필름 아이콘
 * - 'profile':           인물    — 사람 아이콘
 */
export type PosterVariant = 'poster' | 'profile';

interface PosterProps {
  /** 이미지 URL (없으면 variant에 맞는 Empty 이미지 사용) */
  src?: string | null;
  alt?: string;
  size?: PosterSize;
  /** 빈 이미지 fallback 종류 (default: 'poster') */
  variant?: PosterVariant;
  className?: string;
}

/** 사이즈별 스펙 (Figma 기준) */
const SIZE_MAP: Record<PosterSize, { width: number; height: number; radius: string }> = {
  large:  { width: 140, height: 199, radius: 'rounded-[10px]' },
  medium: { width: 115, height: 163, radius: 'rounded-[10px]' },
  small:  { width: 60,  height: 85,  radius: 'rounded-[5px]' },
  xsmall: { width: 50,  height: 71,  radius: 'rounded-[5px]' },
};

// ─── Component ──────────────────────────────────────────────
export default function Poster({
  src,
  alt,
  size = 'large',
  variant = 'poster',
  className,
}: PosterProps) {
  const { width, height, radius } = SIZE_MAP[size];

  return (
    <div
      className={`shrink-0 overflow-hidden ${radius} ${className ?? ''}`}
      style={{ width, height }}
    >
      {src ? (
        <Image
          src={src}
          alt={alt ?? 'poster'}
          width={width}
          height={height}
          className="w-full h-full object-cover"
        />
      ) : variant === 'profile' ? (
        <EmptyProfileImage size={size} />
      ) : (
        <EmptyPosterImage size={size} />
      )}
    </div>
  );
}
