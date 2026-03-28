'use client';

import { useEffect } from 'react';

interface ToastProps {
  message: string;
  visible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({ message, visible, onClose, duration = 2000 }: ToastProps) {
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [visible, onClose, duration]);

  if (!visible) return null;

  return (
    <div className="fixed inset-x-0 top-[20px] z-50 flex justify-center pointer-events-none">
      <div className="bg-neutral-800 text-white px-6 py-3 rounded-xl text-sm shadow-lg animate-fade-in">
        {message}
      </div>
    </div>
  );
}
