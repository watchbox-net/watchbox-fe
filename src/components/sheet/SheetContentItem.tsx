'use client';

import Poster, { type PosterVariant } from '@/components/content/Poster';

interface SheetContentItemProps {
  /** 포스터 이미지 URL */
  posterSrc?: string | null;
  /** 컨텐츠 제목 */
  title: string;
  /** 연도 */
  year?: number | null;
  /** 장르 목록 */
  genres?: string[] | null;
  /** 빈 이미지 fallback 종류 (default: 'poster' — 영화/TV; 인물이면 'profile') */
  variant?: PosterVariant;
  className?: string;
}

/**
 * 박스 시트 상단의 "어떤 컨텐츠를 박스에 추가하는지" 표시하는 행
 * 피그마 Sheet Content Item 대응
 * - Poster(xsmall 50x71) + 제목 + (연도·장르)
 * - 하단 1.5px stroke (wb-dark-03)
 * - 아이콘 없음
 */
export default function SheetContentItem({
  posterSrc,
  title,
  year,
  genres,
  variant = 'poster',
  className,
}: SheetContentItemProps) {
  const infoLine = [year, genres?.join(', ')].filter(Boolean).join(' · ');

  return (
    <div className={`h-[90px] px-[16px] flex items-center border-b-[1.5px] border-wb-dark-03 ${className ?? ''}`}>
      <div className="flex items-center gap-[17px] min-w-0">
        <Poster src={posterSrc} alt={title} size="xsmall" variant={variant} />
        <div className="flex flex-col gap-[6px] min-w-0">
          <p className="text-[16px] font-medium text-white truncate">{title}</p>
          {infoLine && (
            <p className="text-[12px] text-wb-grey-03 truncate">{infoLine}</p>
          )}
        </div>
      </div>
    </div>
  );
}
