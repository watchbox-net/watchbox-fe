'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * 메인 컨텐츠 영역 레이아웃 컴포넌트
 * MobileFrame 내부에서 Header 아래, BottomNav 위 영역으로 사용
 * 좌우 패딩은 각 컴포넌트 내부에서 관리
 * 스크롤 위치를 sessionStorage에 저장/복원
 */
export default function MainContent({ children, className = '' }: MainContentProps) {
  const ref = useRef<HTMLElement>(null);
  const pathname = usePathname();
  const storageKey = `scroll:${pathname}`;

  // 스크롤 위치 복원
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const saved = sessionStorage.getItem(storageKey);
    if (saved) {
      el.scrollTop = Number(saved);
    }
  }, [storageKey]);

  // 스크롤 위치 저장
  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const handleScroll = () => {
      sessionStorage.setItem(storageKey, String(el.scrollTop));
    };

    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [storageKey]);

  return (
    <main ref={ref} className={`flex-1 overflow-y-auto scrollbar-hide ${className}`.trim()}>
      {children}
    </main>
  );
}
