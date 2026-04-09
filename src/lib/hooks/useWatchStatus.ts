'use client';

import { useCallback } from 'react';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { upsertWatchStatus, deleteWatchRecord } from '@/lib/api/record';
import type { WatchStatus } from '@/types/content';

export const STATUS_LABEL: Record<Exclude<WatchStatus, 'NONE'>, string> = {
  COMPLETED: '시청 완료',
  WATCHING: '시청중',
  PLANNED: '시청 예정',
  PAUSED: '시청 중단',
};

interface UseWatchStatusOptions {
  onStatusChanged?: (status: Exclude<WatchStatus, 'NONE'>) => void;
  onDeleted?: () => void;
  showToast?: (message: string) => void;
}

export function useWatchStatus(options: UseWatchStatusOptions = {}) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const requireAuth = useCallback(() => {
    if (!authLoading && !isAuthenticated) {
      showLoginModal();
      return false;
    }
    return true;
  }, [authLoading, isAuthenticated, showLoginModal]);

  const changeStatus = useCallback(async (
    tmdbId: number,
    mediaType: 'MOVIE' | 'TV',
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    if (!requireAuth()) return false;
    try {
      await upsertWatchStatus({ tmdbId, watchMediaType: mediaType, watchStatus: status });
      options.onStatusChanged?.(status);
      options.showToast?.(`${STATUS_LABEL[status]}로 변경되었습니다.`);
      return true;
    } catch {
      return false;
    }
  }, [requireAuth, options]);

  const deleteStatus = useCallback(async (recordId: number) => {
    if (!requireAuth()) return false;
    try {
      await deleteWatchRecord(recordId);
      options.onDeleted?.();
      options.showToast?.('시청 기록이 삭제되었습니다.');
      return true;
    } catch {
      return false;
    }
  }, [requireAuth, options]);

  return { changeStatus, deleteStatus, requireAuth };
}
