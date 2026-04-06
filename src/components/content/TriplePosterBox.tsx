import Image from 'next/image';
import { TMDB_POSTER } from '@/lib/utils/content';

interface TriplePosterBoxProps {
  /** 포스터 경로 배열 (최대 3개) */
  posters?: (string | null)[];
  className?: string;
}

/**
 * 박스 목록에서 사용하는 3장 포스터 박스 컴포넌트
 * - 상단: 박스 뚜껑 (hat) with 중앙 슬롯
 * - 하단: 포스터 3장 (비어있으면 grey01 배경)
 * - 전체 너비: 155px
 */
export default function TriplePosterBox({ posters = [], className }: TriplePosterBoxProps) {
  const valid = posters
    .filter((p): p is string => !!p)
    .map((p) => (p.startsWith('http') ? p : `${TMDB_POSTER.md}${p}`));
  // 0개: 전부 빈칸 / 1개: AAA / 2개: ABA / 3개: ABC
  const slots: (string | null)[] =
    valid.length === 0 ? [null, null, null]
    : valid.length === 1 ? [valid[0], valid[0], valid[0]]
    : valid.length === 2 ? [valid[0], valid[1], valid[0]]
    : [valid[0], valid[1], valid[2]];

  return (
    <div className={`flex flex-col items-center gap-[2.5px] w-[155px] ${className ?? ''}`}>
      {/* 박스 뚜껑 (hat) */}
      <svg
        width="155"
        height="16"
        viewBox="0 0 155 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="shrink-0"
      >
        <mask id="hat-mask" fill="white">
          <path d="M155 11C155 13.7614 152.761 16 150 16H5C2.23858 16 0 13.7614 0 11V5C0 2.23858 2.23858 0 5 0H150C152.761 0 155 2.23858 155 5V11ZM62 6C60.8954 6 60 6.89543 60 8C60 9.10456 60.8954 10 62 10H94C95.1046 10 96 9.10456 96 8C96 6.89543 95.1046 6 94 6H62Z" />
        </mask>
        <path d="M155 11C155 13.7614 152.761 16 150 16H5C2.23858 16 0 13.7614 0 11V5C0 2.23858 2.23858 0 5 0H150C152.761 0 155 2.23858 155 5V11ZM62 6C60.8954 6 60 6.89543 60 8C60 9.10456 60.8954 10 62 10H94C95.1046 10 96 9.10456 96 8C96 6.89543 95.1046 6 94 6H62Z" fill="#A3A3A3" />
        <path d="M62 6V5V6ZM60 8H59V8L60 8ZM62 10V11V11V10ZM94 10V11V10ZM96 8L97 8V8H96ZM94 6V5V5V6ZM150 16V15H5V16V17H150V16ZM0 11H1V5H0H-1V11H0ZM5 0V1H150V0V-1H5V0ZM155 5H154V11H155H156V5H155ZM62 6V5C60.3431 5 59 6.34315 59 8H60H61C61 7.44772 61.4477 7 62 7V6ZM60 8L59 8C59 9.65685 60.3431 11 62 11V10V9C61.4477 9 61 8.55228 61 8L60 8ZM62 10V11H94V10V9H62V10ZM94 10V11C95.6569 11 97 9.65685 97 8L96 8L95 8C95 8.55228 94.5523 9 94 9V10ZM96 8H97C97 6.34315 95.6569 5 94 5V6V7C94.5523 7 95 7.44772 95 8H96ZM94 6V5H62V6V7H94V6ZM150 0V1C152.209 1 154 2.79086 154 5H155H156C156 1.68629 153.314 -1 150 -1V0ZM0 5H1C1 2.79086 2.79086 1 5 1V0V-1C1.68629 -1 -1 1.68629 -1 5H0ZM5 16V15C2.79086 15 1 13.2091 1 11H0H-1C-1 14.3137 1.6863 17 5 17V16ZM150 16V17C153.314 17 156 14.3137 156 11H155H154C154 13.2091 152.209 15 150 15V16Z" fill="#101010" mask="url(#hat-mask)" />
      </svg>

      {/* 포스터 영역 */}
      <div className="flex border border-wb-dark-01 rounded-b-[5px] shrink-0 overflow-hidden">
        {slots.map((src, i) => (
          <div
            key={i}
            className={`w-[46px] h-[65px] relative shrink-0 ${
              !src ? 'bg-wb-grey-01' : ''
            } ${i === 0 ? 'rounded-bl-[5px]' : ''} ${i === 2 ? 'rounded-br-[5px]' : ''}`}
          >
            {src && (
              <Image
                src={src}
                alt=""
                width={46}
                height={65}
                className={`absolute inset-0 w-full h-full object-cover ${i === 0 ? 'rounded-bl-[5px]' : ''} ${i === 2 ? 'rounded-br-[5px]' : ''}`}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
