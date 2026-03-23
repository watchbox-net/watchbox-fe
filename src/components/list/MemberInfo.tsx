'use client';

import { HandThumbUpIcon } from '@heroicons/react/24/solid';

// ─── Types ──────────────────────────────────────────────────
export type MemberInfoVariant = 'like' | 'publisher' | 'none';

interface MemberInfoProps {
  variant: MemberInfoVariant;
  /** publisher variant일 때 게시자 닉네임 목록 */
  publishers?: string[];
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
/**
 * 콘텐츠 리스트 아이템 하단 멤버 정보
 * - like: "좋아요 누른 컨텐츠" (마이 박스)
 * - publisher: "게시자: 사용자A, 사용자B" (공유 박스)
 * - none: 표시 안 함
 *
 * 피그마 Member Interaction 컴포넌트 대응
 */
export default function MemberInfo({ variant, publishers, className }: MemberInfoProps) {
  if (variant === 'none') return null;

  if (variant === 'like') {
    return (
      <div className={`flex items-center gap-[5px] ${className ?? ''}`}>
        <HandThumbUpIcon className="size-[12px] text-wb-red" />
        <span className="text-[10px] text-wb-red whitespace-nowrap">좋아요 누른 컨텐츠</span>
      </div>
    );
  }

  // publisher
  return (
    <p className={`text-[10px] text-wb-primary whitespace-nowrap ${className ?? ''}`}>
      게시자: {publishers?.join(', ') ?? ''}
    </p>
  );
}
