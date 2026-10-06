'use client';

import { CheckCircleIcon } from '@heroicons/react/24/solid';

// ─── Types ──────────────────────────────────────────────────
export type AddedStatus2Variant = 'unchecked' | 'checked';

interface AddedStatusIcon2Props {
  variant?: AddedStatus2Variant;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
/**
 * Added Status Icon2 — 시트의 체크 표시
 *
 * 피그마 Added Status Icon2 대응. 박스 포함 여부를 토글하는 용도라
 * {@link AddedStatusIcon}(추가/완료 상태)과 모양·의미가 다르다.
 *
 * - unchecked: 테두리만 있는 빈 원
 * - checked:   꽉 찬 밝은 원 + 체크. 체크는 solid 아이콘의 <b>도려낸 영역</b>이라
 *              뒤 배경이 비쳐 어둡게 보인다 (시트 배경 wb-dark-02)
 */
export default function AddedStatusIcon2({
  variant = 'unchecked',
  className,
}: AddedStatusIcon2Props) {
  if (variant === 'checked') {
    return <CheckCircleIcon className={`size-[24px] text-wb-white-02 ${className ?? ''}`} />;
  }

  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
      className={`size-[24px] text-wb-white-02 ${className ?? ''}`}
    >
      {/* heroicons solid CheckCircle 의 원은 반지름 9.75 (path 가 2.25 에서 시작).
          테두리가 선 중앙에 그려지므로 r = 9.75 - 1.5/2 = 9 이어야 바깥 지름이 같아진다. */}
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}
