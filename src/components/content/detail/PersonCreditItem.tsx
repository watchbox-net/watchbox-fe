'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import EmptyCreditImage from '@/components/content/detail/EmptyCreditImage';
import { TMDB_POSTER, getContentDetailPath } from '@/lib/utils/content';

interface PersonCreditItemProps {
  tmdbId: number;
  profilePath: string | null;
  /** 1줄: 인물 이름 (Korean) */
  name: string;
  /** 2줄: cast=character / crew=departmentList join */
  subText: string | null;
  /** 클릭 시 인물 상세로 이동 (default: true) */
  navigable?: boolean;
}

/**
 * Person Credit Item — 출연/제작 더보기 화면의 한 행
 *
 * 피그마: Person Credit Item
 * - 좌: 프로필 이미지 100×140 (URL 없으면 EmptyCreditImage variant=person)
 * - 우: name(굵게) + subText(보조)
 * - 클릭 시 인물 상세 페이지로 이동
 */
export default function PersonCreditItem({
  tmdbId,
  profilePath,
  name,
  subText,
  navigable = true,
}: PersonCreditItemProps) {
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
      className={`w-full flex items-center gap-[16px] px-[16px] py-[10px] text-left ${navigable ? 'cursor-pointer' : 'cursor-default'}`}
    >
      <div className="w-[100px] h-[140px] shrink-0 rounded-[5px] overflow-hidden">
        {profileUrl ? (
          <Image
            src={profileUrl}
            alt={name}
            width={100}
            height={140}
            className="w-full h-full object-cover"
          />
        ) : (
          <EmptyCreditImage variant="person" />
        )}
      </div>

      <div className="flex flex-col gap-[4px] min-w-0 flex-1">
        <p className="text-[16px] font-semibold text-white truncate leading-[1.4]">
          {name}
        </p>
        {subText && (
          <p className="text-[14px] text-wb-grey-03 truncate leading-[1.4]">
            {subText}
          </p>
        )}
      </div>
    </button>
  );
}
