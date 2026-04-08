'use client';

import { ReactNode, useEffect, useRef } from 'react';

interface HorizontalScrollProps {
  scrollKey: string;
  children: ReactNode;
  className?: string;
}

/**
 * 가로 스크롤 컨테이너 (스크롤 위치 sessionStorage 저장/복원)
 */
export default function HorizontalScroll({ scrollKey, children, className = '' }: HorizontalScrollProps) {
  const ref = useRef<HTMLDivElement>(null);
  const storageKey = `scroll-x:${scrollKey}`;

  // 스크롤 위치 복원
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      el.scrollLeft = Number(saved);
    }
  }, [storageKey]);

  // 스크롤 위치 저장
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const handleScroll = () => {
      sessionStorage.setItem(storageKey, String(el.scrollLeft));
    };
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [storageKey]);

  return (
    <div ref={ref} className={`overflow-x-auto scrollbar-hide ${className}`.trim()}>
      {children}
    </div>
  );
}
