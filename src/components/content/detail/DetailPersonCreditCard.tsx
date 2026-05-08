'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { TMDB_POSTER, getContentDetailPath } from '@/lib/utils/content';
import BaseCreditImage from '@/components/content/detail/BaseCreditImage';
import TruncatedText from '@/components/common/TruncatedText';

interface DetailPersonCreditCardProps {
  tmdbId: number;
  profilePath: string | null;
  /** 1번째 라인 — 인물 이름 (Korean nameKo) */
  name: string;
  /**
   * 2번째 라인 보조 텍스트
   * - cast: character (캐릭터명)
   * - crew: departmentList (역할 리스트)
   */
  subText: string | null;
  /** 클릭 시 인물 상세 이동 (default: true) */
  navigable?: boolean;
}

/**
 * Detail Person Credit Card — 상세 페이지의 출연/제작 카드
 *
 * 피그마: Detail Person Credit Card
 * - 세로형 프로필 이미지 100x140 (포스터형)
 * - 이름 영역: nameKo + nameOriginal (타이트한 라인 간격)
 * - 캐릭터/역할 라인은 이름 영역과 약간의 간격
 */
export default function DetailPersonCreditCard({
  tmdbId,
  profilePath,
  name,
  subText,
  navigable = true,
}: DetailPersonCreditCardProps) {
  const router = useRouter();
  const profileUrl = profilePath ? `${TMDB_POSTER.md}${profilePath}` : null;

  const handleClick = () => {
    if (!navigable) return;
    router.push(getContentDetailPath('PERSON', tmdbId));
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={`w-[100px] shrink-0 flex flex-col items-center ${navigable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      {/* 프로필 이미지 — 100 x 140 (포스터형). URL 없으면 Base Credit Image (person) */}
      <div className="w-[100px] h-[140px] mb-[8px] rounded-[5px] overflow-hidden">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={name}
            width={100}
            height={140}
            className="w-full h-full object-cover"
          />
        ) : (
          <BaseCreditImage variant="person" />
        )}
      </div>

      {/* 1번째 라인 — name (커스텀 ellipsis "..": 점 두개, 이름 바로 뒤에 붙음) */}
      <TruncatedText
        text={name}
        ellipsis=".."
        className="w-full text-[13px] font-semibold text-white text-center leading-[1.5]"
      />
      {/* 2번째 라인 — cast: character / crew: departmentList */}
      {subText && (
        <p className="w-full text-[11px] text-wb-grey-03 text-center line-clamp-2 leading-[1.5]">
          {subText}
        </p>
      )}
    </button>
  );
}
