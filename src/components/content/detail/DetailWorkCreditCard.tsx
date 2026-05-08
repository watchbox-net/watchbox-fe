'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import BaseCreditImage from '@/components/content/detail/BaseCreditImage';
import TruncatedText from '@/components/common/TruncatedText';
import {
  TMDB_POSTER,
  formatIsoDate,
  getContentDetailPath,
} from '@/lib/utils/content';
import type { CombinedCredit } from '@/types/credit';

interface DetailWorkCreditCardProps {
  /** 인물의 작품 한 건 (MovieCredit | TvCredit) */
  credit: CombinedCredit;
  /** 클릭 시 작품 상세 이동 (default: true) */
  navigable?: boolean;
}

/**
 * Detail Work Credit Card — 인물 상세 페이지의 작품 카드
 *
 * 피그마: Detail Work Credit Card
 * - 포스터 (URL 없으면 BaseCreditImage variant="work")
 * - 1줄 title (Movie: title / TV: name)
 * - 2줄 subtitle: CAST → character / CREW → department
 * - 3줄 date (Movie: releaseDate / TV: firstAirDate, "YYYY.MM.DD")
 */
export default function DetailWorkCreditCard({
  credit,
  navigable = true,
}: DetailWorkCreditCardProps) {
  const router = useRouter();

  const isMovie = credit.watchMediaType === 'MOVIE';
  const title = isMovie ? credit.title : credit.name;
  const date = formatIsoDate(isMovie ? credit.releaseDate : credit.firstAirDate);
  const subText =
    credit.creditRole === 'CAST' ? credit.character : credit.department;
  const posterUrl = credit.posterPath
    ? `${TMDB_POSTER.md}${credit.posterPath}`
    : null;

  const handleClick = () => {
    if (!navigable) return;
    router.push(getContentDetailPath(credit.watchMediaType, credit.tmdbId));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-full flex flex-col items-center ${navigable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* 포스터 — 가로 폭 100%, 비율 110:156 (BaseCreditImage native) */}
      <div className="w-full aspect-[110/156] mb-[8px] rounded-[5px] overflow-hidden">
        {posterUrl ? (
          <Image
            src={posterUrl}
            alt={title}
            width={110}
            height={156}
            className="w-full h-full object-cover"
          />
        ) : (
          <BaseCreditImage variant="work" />
        )}
      </div>

      {/* 1줄: 제목 — 커스텀 ".." ellipsis */}
      <TruncatedText
        text={title}
        ellipsis=".."
        className="w-full text-[13px] font-semibold text-white text-center leading-[1.5]"
      />

      {/* 2줄: 캐스트=캐릭터 / 크루=역할 */}
      {subText && (
        <p className="w-full text-[11px] text-wb-grey-03 text-center truncate leading-[1.5]">
          {subText}
        </p>
      )}

      {/* 3줄: 날짜 */}
      {date && (
        <p className="w-full text-[11px] text-wb-grey-03 text-center leading-[1.5]">
          {date}
        </p>
      )}
    </button>
  );
}
