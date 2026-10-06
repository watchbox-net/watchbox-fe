'use client';

import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { upsertWatchStatus, deleteWatchRecord } from '@/lib/api/watch-record';
import type { WatchStatus } from '@/types/content-summary';

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
  const queryClient = useQueryClient();

  /**
   * 시청 기록 페이지의 캐시를 무효화한다.
   *
   * <p>시청 상태는 홈·탐색·상세·박스 등 어디서나 바꿀 수 있는데, 각 화면은 자기 목록만
   * 로컬로 고치고 끝낸다. 시청 기록 페이지의 목록·개수는 그대로 남아 있다가
   * 다음에 들어갔을 때 옛 숫자를 보여준다(개수는 staleTime 5분이라 특히 눈에 띈다).
   *
   * <p>접두어로 지우는 이유는 뒤에 필터 조합이 붙기 때문이다.
   */
  const invalidateRecordQueries = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['recordedContentPage'] });
    queryClient.invalidateQueries({ queryKey: ['recordedContentCount'] });
    queryClient.invalidateQueries({ queryKey: ['contentRecordHistory'] });
  }, [queryClient]);

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
      invalidateRecordQueries();
      options.onStatusChanged?.(status);
      options.showToast?.(`${STATUS_LABEL[status]}로 변경되었습니다.`);
      return true;
    } catch {
      return false;
    }
  }, [requireAuth, options, invalidateRecordQueries]);

  const deleteStatus = useCallback(async (recordId: number) => {
    if (!requireAuth()) return false;
    try {
      await deleteWatchRecord(recordId);
      invalidateRecordQueries();
      options.onDeleted?.();
      options.showToast?.('시청 기록이 삭제되었습니다.');
      return true;
    } catch {
      return false;
    }
  }, [requireAuth, options, invalidateRecordQueries]);

  return { changeStatus, deleteStatus, requireAuth };
}
