'use client';

import Image from 'next/image';
import { TMDB_BACKDROP } from '@/lib/utils/content';

interface BackdropGalleryProps {
  /** 이미지 path 리스트 (TMDB 상대 경로) */
  paths: string[] | null;
  /** 최대 개수 (default 4 — 2x2 그리드) */
  max?: number;
  className?: string;
}

/**
 * 상세 페이지의 이미지 섹션 — 2x2 그리드로 4장 노출
 * BE backdropPathList에서 처음 4장만 렌더
 */
export default function BackdropGallery({ paths, max = 4, className }: BackdropGalleryProps) {
  if (!paths || paths.length === 0) return null;

  const items = paths.slice(0, max);

  return (
    <div className={`grid grid-cols-2 gap-[7px] px-[16px] py-[12px] ${className ?? ''}`}>
      {items.map((p, idx) => (
        <div
          key={`${p}-${idx}`}
          className="aspect-[16/9] rounded-[8px] overflow-hidden bg-wb-dark-04 relative"
        >
          <Image
            src={`${TMDB_BACKDROP.md}${p}`}
            alt=""
            fill
            sizes="(max-width: 430px) 50vw, 215px"
            className="object-cover"
          />
        </div>
      ))}
    </div>
  );
}
