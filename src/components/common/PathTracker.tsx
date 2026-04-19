'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export const LAST_MAIN_PATH_KEY = 'lastMainPath';

/**
 * (main) 그룹 pathname을 sessionStorage에 저장.
 * 상세 페이지 등 (main) 밖 페이지에서 BottomNav 활성 탭을 결정할 때 사용.
 */
export default function PathTracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(LAST_MAIN_PATH_KEY, pathname);
  }, [pathname]);

  return null;
}
