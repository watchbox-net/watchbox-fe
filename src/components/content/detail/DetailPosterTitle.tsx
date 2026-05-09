'use client';

import Image from 'next/image';
import EmptyPosterImage from '@/components/content/empty/EmptyPosterImage';
import { TMDB_POSTER } from '@/lib/utils/content';

interface DetailPosterTitleProps {
  posterPath: string | null;
  titleKo: string;
  titleOriginal: string | null;
  /** "2025 · 모험, 애니메이션 · 108분" 형태로 결합되어 들어옴 */
  metaText: string;
}

/**
 * 상세 페이지 포스터 + 제목 블록
 * 좌측: 포스터 (115x163), 우측: 제목 / 원제 / 메타 한 줄
 */
export default function DetailPosterTitle({
  posterPath,
  titleKo,
  titleOriginal,
  metaText,
}: DetailPosterTitleProps) {
  const posterUrl = posterPath ? `${TMDB_POSTER.md}${posterPath}` : null;

  return (
    <div className="flex gap-[14px] px-[17px] mt-[16px]">
      <div className="w-[115px] h-[163px] rounded-[10px] overflow-hidden shrink-0">
        {posterUrl ? (
          <Image src={posterUrl} alt={titleKo} width={115} height={163} className="w-full h-full object-cover" />
        ) : (
          <EmptyPosterImage size="medium" />
        )}
      </div>
      <div className="flex flex-col justify-center gap-[4px] min-w-0 pt-[4px]">
        <h1 className="text-[24px] font-semibold leading-[1.3] text-wb-white-01 break-keep [overflow-wrap:anywhere]">
          {titleKo}
        </h1>
        {titleOriginal && (
          <p className="text-[11px] text-wb-grey-04 truncate">{titleOriginal}</p>
        )}
        {metaText && (
          <p className="text-[12px] text-wb-grey-04">{metaText}</p>
        )}
      </div>
    </div>
  );
}
