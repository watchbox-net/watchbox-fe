'use client';

import { UserGroupSolid, FilmSolid } from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export type MediaTypeSwitchVariant = 'person' | 'watch-media';

interface MediaTypeSwitchButtonProps {
  /** 'person' = 인물 (UserGroup 아이콘), 'watch-media' = 영화/시리즈 (Film 아이콘) */
  variant: MediaTypeSwitchVariant;
  onClick?: () => void;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
/**
 * 박스 컨텐츠에서 인물 ↔ 영화/시리즈 모드 전환용 pill 버튼.
 * 보더만 있는 다크 스타일 (rounded-20, h-28).
 * 너비: person 65px / watch-media 101px (디자인 토큰).
 */
export default function MediaTypeSwitchButton({
  variant,
  onClick,
  className,
}: MediaTypeSwitchButtonProps) {
  const isPerson = variant === 'person';
  const widthClass = isPerson ? 'w-[65px]' : 'w-[101px]';
  const label = isPerson ? '인물' : '영화/시리즈';
  const Icon = isPerson ? UserGroupSolid : FilmSolid;

  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        h-[28px] flex items-center justify-center gap-[5px]
        px-[18px] py-[10px] rounded-[20px]
        border border-wb-dark-05
        drop-shadow-[0px_1px_1px_rgba(10,13,18,0.05)]
        text-[12px] text-wb-white-02 whitespace-nowrap
        ${widthClass} ${className ?? ''}
      `}
    >
      <Icon className="size-[20px] text-wb-white-02 shrink-0" />
      {label}
    </button>
  );
}
