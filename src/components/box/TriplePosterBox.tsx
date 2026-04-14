import Image from 'next/image';
import { TMDB_POSTER } from '@/lib/utils/content';
import HatMedium from './HatMedium';
import HatSmall from './HatSmall';
import BodyMediumEmpty from './BodyMediumEmpty';
import BodySmallEmpty from './BodySmallEmpty';

interface TriplePosterBoxProps {
  /** 포스터 경로 배열 (최대 3개) */
  posters?: (string | null)[];
  /** 사이즈: medium (156px) | small (110px) */
  size?: 'medium' | 'small';
  className?: string;
}

const SIZE_CONFIG = {
  medium: { width: 'w-[156px]', gap: 'gap-[2.5px]' },
  small: { width: 'w-[110px]', gap: 'gap-[2px]' },
} as const;

/**
 * 박스 목록에서 사용하는 3장 포스터 박스 컴포넌트
 * - 상단: 박스 모자 (hat) with 중앙 슬롯
 * - 하단: 포스터 3장 또는 빈 바디
 * - size: medium (156×84.5) / small (110×60.14)
 */
export default function TriplePosterBox({
  posters = [],
  size = 'medium',
  className,
}: TriplePosterBoxProps) {
  const valid = posters
    .filter((p): p is string => !!p)
    .map((p) => (p.startsWith('http') ? p : `${TMDB_POSTER.md}${p}`));

  const isEmpty = valid.length === 0;
  const { width, gap } = SIZE_CONFIG[size];

  // empty → BodyEmpty SVG 사용
  if (isEmpty) {
    return (
      <div className={`flex flex-col items-center ${gap} ${width} ${className ?? ''}`}>
        {size === 'medium' ? (
          <>
            <HatMedium className="shrink-0" />
            <BodyMediumEmpty className="shrink-0" />
          </>
        ) : (
          <>
            <HatSmall className="shrink-0" />
            <BodySmallEmpty className="shrink-0" />
          </>
        )}
      </div>
    );
  }

  // contents → 포스터 이미지 렌더링 (추후 size별 분기 추가 예정)
  // 0개: 전부 빈칸 / 1개: AAA / 2개: ABA / 3개: ABC
  const slots: (string | null)[] =
    valid.length === 1
      ? [valid[0], valid[0], valid[0]]
      : valid.length === 2
        ? [valid[0], valid[1], valid[0]]
        : [valid[0], valid[1], valid[2]];

  return (
    <div className={`flex flex-col items-center ${gap} ${width} ${className ?? ''}`}>
      {size === 'medium' ? (
        <HatMedium className="shrink-0" />
      ) : (
        <HatSmall className="shrink-0" />
      )}

      {/* 포스터 영역 */}
      <div className="flex border border-wb-dark-01 rounded-b-[5px] shrink-0 overflow-hidden">
        {slots.map((src, i) => (
          <div
            key={i}
            className={`${size === 'medium' ? 'w-[46px] h-[65px]' : 'w-[32.65px] h-[46.14px]'} relative shrink-0 ${
              !src ? 'bg-wb-grey-01' : ''
            } ${i === 0 ? 'rounded-bl-[5px]' : ''} ${i === 2 ? 'rounded-br-[5px]' : ''}`}
          >
            {src && (
              <Image
                src={src}
                alt=""
                width={size === 'medium' ? 46 : 32.65}
                height={size === 'medium' ? 65 : 46.31}
                className={`absolute inset-0 w-full h-full object-cover ${i === 0 ? 'rounded-bl-[5px]' : ''} ${i === 2 ? 'rounded-br-[5px]' : ''}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
