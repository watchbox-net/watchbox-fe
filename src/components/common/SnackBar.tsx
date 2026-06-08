'use client';

import { CircleXIcon } from '@/components/icons';

interface SnackBarProps {
  message: string;
  highlight?: string;
  visible: boolean;
  onClose: () => void;
  actionLabel?: string;
  onAction?: () => void;
}

/**
 * 스낵바 — 사용자 반응이 필요한 알림 (액션 버튼 + 닫기)
 * 자동 사라지지 않음. 사용자가 직접 닫거나 액션을 수행해야 함.
 */
export default function SnackBar({
  message,
  highlight,
  visible,
  onClose,
  actionLabel,
  onAction,
}: SnackBarProps) {
  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-[20px] z-50 flex justify-center px-[16px]">
      <div className="w-[351px] bg-wb-white-02 rounded-[8px] shadow-[0px_4px_6px_rgba(0,0,0,0.35)] flex items-center gap-[16px] px-[18px] py-[10px]">
        <p className="flex-1 text-[13px] tracking-[0.25px] leading-[17px] text-wb-dark-01">
          {highlight && <span className="font-semibold">{highlight}</span>}
          {message}
        </p>

        <div className="flex items-center gap-[16px] shrink-0">
          {actionLabel && onAction && (
            <button
              type="button"
              onClick={onAction}
              className="text-[13px] font-semibold tracking-[0.25px] leading-[20px] text-wb-blue cursor-pointer"
            >
              {actionLabel}
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="size-[20px] cursor-pointer"
          >
            <CircleXIcon size={20} className="text-[#353535]" />
          </button>
        </div>
      </div>
    </div>
  );
}
