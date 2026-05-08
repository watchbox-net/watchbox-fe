'use client';

import { useEffect, useRef, useState } from 'react';
import LikeIcon from '@/components/icons/LikeIcon';
import BoxIcon from '@/components/icons/BoxIcon';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import ContentBoxSheetContainer from '@/components/sheet/ContentBoxSheetContainer';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import { addLike } from '@/lib/api/watch-record';
import { fetchContentDetail } from '@/lib/api/content';
import type { WatchStatus } from '@/types/content-summary';

// ─── WatchStatus → icon status ──────────────────────────────
function toIconStatus(status: WatchStatus | null | undefined) {
  if (!status || status === 'NONE') return 'none' as const;
  return status.toLowerCase() as 'completed' | 'watching' | 'planned' | 'paused';
}

interface ContentActionBarProps {
  /** "MOVIE" | "TV" — PERSON에서는 사용되지 않음 */
  mediaType: 'MOVIE' | 'TV';
  tmdbId: number;
  /** 현재 좋아요 여부 */
  liked: boolean;
  /** 현재 시청 상태 */
  watchStatus: WatchStatus | null;
  /** 박스 시트 표시용 — 컨텐츠 헤더 정보 */
  sheetContent: {
    posterSrc: string | null;
    title: string;
    year: number | null;
    genres: string[] | null;
  };
  /** 좋아요/시청상태/기록 변경 시 페이지에 알림 */
  onLikedChange: (liked: boolean) => void;
  onWatchStatusChange: (status: WatchStatus | null) => void;
  onRecordIdRefresh: (recordId: number | null) => void;
  /** 시청 상태 메뉴 "삭제하기" — recordId 보유 시에만 동작 */
  recordId: number | null;
  /** 박스 보유 여부 (BoxIcon variant 결정) */
  hasAddedInbox: boolean;
  /** hasAddedInbox 변경 시 페이지에 알림 */
  onHasAddedInboxChange: (value: boolean) => void;
  /** 토스트 표시 */
  showToast: (msg: string) => void;
}

/**
 * 컨텐츠 상세 페이지 액션 바 — 좋아요 + 박스에 추가 + 시청 상태 (3개 아이콘)
 *
 * 페이지에서 상태(liked/watchStatus/recordId)는 controlled로 관리하고,
 * 변경 시 콜백으로 알린다.
 */
export default function ContentActionBar({
  mediaType,
  tmdbId,
  liked,
  watchStatus,
  sheetContent,
  recordId,
  hasAddedInbox,
  onLikedChange,
  onWatchStatusChange,
  onRecordIdRefresh,
  onHasAddedInboxChange,
  showToast,
}: ContentActionBarProps) {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [boxSheetVisible, setBoxSheetVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const { changeStatus, deleteStatus, requireAuth } = useWatchStatus({
    onStatusChanged: (status) => onWatchStatusChange(status),
    onDeleted: () => {
      onWatchStatusChange(null);
      onRecordIdRefresh(null);
    },
    showToast,
  });

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setStatusMenuOpen(false);
      }
    };
    if (statusMenuOpen) document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [statusMenuOpen]);

  // ── 좋아요 토글
  const handleLike = async () => {
    if (!requireAuth()) return;
    try {
      const next = !liked;
      await addLike({ tmdbId, mediaType, liked: next });
      onLikedChange(next);
      showToast(next ? '좋아요를 등록했습니다.' : '좋아요를 취소했습니다.');
    } catch {/* 무시 */}
  };

  // ── 시청 상태 변경
  const handleStatusSelect = async (status: Exclude<WatchStatus, 'NONE'>) => {
    setStatusMenuOpen(false);
    const success = await changeStatus(tmdbId, mediaType, status);
    if (success) {
      // recordId 갱신을 위해 상세 재조회 (삭제 시 필요)
      try {
        const res = await fetchContentDetail(mediaType, tmdbId);
        onRecordIdRefresh(res.memberRecord?.recordId ?? null);
      } catch {/* 무시 */}
    }
  };

  // ── 시청 기록 삭제
  const handleStatusDelete = async () => {
    setStatusMenuOpen(false);
    if (!recordId) return;
    await deleteStatus(recordId);
  };

  return (
    <>
      <div className="flex items-start justify-around px-[20px] pt-[17px]">
        {/* 좋아요 */}
        <button
          type="button"
          className="flex flex-col items-center gap-[8px] cursor-pointer"
          onClick={handleLike}
        >
          <LikeIcon size="xl" active={liked} />
          <span className="text-[11px] text-wb-white-02">좋아요</span>
        </button>

        {/* 박스에 추가 */}
        <button
          type="button"
          className="flex flex-col items-center gap-[8px] cursor-pointer"
          onClick={() => {
            if (!authLoading && !isAuthenticated) { showLoginModal(); return; }
            setBoxSheetVisible(true);
          }}
        >
          <BoxIcon size="xl" variant={hasAddedInbox ? 'added' : 'none'} />
          <span className="text-[11px] text-wb-white-02">박스에 추가</span>
        </button>

        {/* 시청 상태 */}
        <div className="relative flex flex-col items-center gap-[8px]">
          <button
            type="button"
            className="cursor-pointer"
            onClick={() => setStatusMenuOpen((v) => !v)}
          >
            <WatchStatusIcon size="xl" status={toIconStatus(watchStatus)} />
          </button>
          <span className="text-[11px] text-wb-white-02">시청 상태</span>

          {statusMenuOpen && (
            <div ref={menuRef} className="absolute top-full mt-1 z-50">
              <WatchStatusMenu
                onSelect={handleStatusSelect}
                onDelete={handleStatusDelete}
              />
            </div>
          )}
        </div>
      </div>

      <ContentBoxSheetContainer
        visible={boxSheetVisible}
        onClose={() => setBoxSheetVisible(false)}
        content={sheetContent}
        mediaType={mediaType}
        tmdbId={tmdbId}
        onCompleted={async ({ added, removed }) => {
          if (added > 0 && removed > 0) showToast('박스 목록을 변경했습니다.');
          else if (added > 0) showToast('박스에 추가했습니다.');
          else if (removed > 0) showToast('박스에서 제거했습니다.');

          // hasAddedInbox 동기화
          // - added > 0, removed === 0: 무조건 어떤 박스에 들어감 → true
          // - 그 외 (제거 발생 시): 다른 박스에 남아있을 수 있으므로 상세 재조회로 정확한 값 사용
          if (added > 0 && removed === 0) {
            onHasAddedInboxChange(true);
          } else {
            try {
              const fresh = await fetchContentDetail(mediaType, tmdbId);
              onHasAddedInboxChange(fresh.hasAddedInbox);
            } catch {/* 무시 */}
          }
        }}
      />
    </>
  );
}
