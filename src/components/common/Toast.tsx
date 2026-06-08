'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

/**
 * 토스트 — 단순 알림 (자동 사라짐, 액션 없음)
 */
export default function Toast({ message, visible, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-[20px] z-50 flex justify-center px-[16px] pointer-events-none">
      <div className="w-[348px] bg-wb-dark-04 rounded-[8px] shadow-[0px_4px_6px_rgba(0,0,0,0.2)] flex items-center px-[18px] py-[11px]">
        <p className="text-[13px] tracking-[0.25px] leading-[18px] text-wb-white-02">
          {message}
        </p>
      </div>
    </div>
  );
}
