'use client';

import { useEffect, type ReactNode } from 'react';
import ContentBoxSheetHead from '@/components/sheet/ContentBoxSheetHead';

interface ContentRecordSheetProps {
  visible: boolean;
  /** 취소 — 변경사항 버리고 닫기 */
  onCancel: () => void;
  /** 완료 — 변경분 저장 */
  onDone?: () => void;
  /** Content Record Sheet Body */
  children: ReactNode;
}

/**
 * Content Record Sheet — 시청 기록에서 박스에 추가하는 바텀 시트
 *
 * 구조는 {@link ContentBoxSheet}(콘텐츠 하나 → 여러 박스)와 같고, 몸통만 다르다.
 * 이쪽은 박스 하나를 고정해놓고 시청 기록을 넘기며 체크한다.
 */
export default function ContentRecordSheet({
  visible,
  onCancel,
  onDone,
  children,
}: ContentRecordSheetProps) {
  // 시트가 열려있을 때 body 스크롤 잠금
  useEffect(() => {
    if (!visible) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [visible]);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={onCancel}>
      {/* 오버레이 */}
      <div className="absolute inset-0 bg-wb-black/50" aria-hidden />

      {/* 바텀 시트 */}
      <div
        className="relative w-full max-w-[430px] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <ContentBoxSheetHead
          title="시청 기록에서 박스에 추가하기"
          onCancel={onCancel}
          onDone={onDone ?? onCancel}
        />
        {children}
      </div>
    </div>
  );
}
