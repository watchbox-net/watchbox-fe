'use client';

import { useSyncExternalStore } from 'react';
import { LAST_MAIN_PATH_KEY } from '@/components/common/PathTracker';

/**
 * sessionStorage는 별도 구독 메커니즘이 없으므로 no-op subscribe.
 * 같은 탭/같은 페이지 내에서 sessionStorage 변경을 즉시 반영할 필요 없음.
 */
function subscribe() {
  return () => {};
}

function getSnapshot(): string {
  return sessionStorage.getItem(LAST_MAIN_PATH_KEY) ?? '/';
}

function getServerSnapshot(): string {
  return '/';
}

/**
 * (main) 그룹에서 마지막에 머문 경로를 sessionStorage에서 읽어온다.
 * 상세 페이지 등 (main) 밖에서 BottomNav 활성 탭을 결정할 때 사용.
 *
 * useSyncExternalStore를 사용해 SSR/하이드레이션 mismatch 없이 안전하게 처리.
 */
export function useLastMainPath(): string {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
