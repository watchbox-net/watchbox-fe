'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Poster from '@/components/content/Poster';
import BoxIcon from '@/components/icons/BoxIcon';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import Modal from '@/components/common/Modal';
import Toast from '@/components/common/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { upsertWatchStatus, deleteWatchRecord } from '@/lib/api/record';
import { TMDB_POSTER } from '@/lib/utils/content';
import type { WatchStatus } from '@/types/content';
import type { WatchStatus as IconWatchStatus } from '@/components/icons/WatchStatusIcon';

const WATCH_STATUS_MAP: Record<string, IconWatchStatus> = {
  COMPLETED: 'completed',
  WATCHING: 'watching',
  PLANNED: 'planned',
  PAUSED: 'paused',
};

const STATUS_LABEL: Record<Exclude<WatchStatus, 'NONE'>, string> = {
  COMPLETED: '시청 완료',
  WATCHING: '시청중',
  PLANNED: '시청 예정',
  PAUSED: '시청 중단',
};

// ─── Types ──────────────────────────────────────────────────
interface ContentCardProps {
  /** 포스터 상대 경로 (e.g. /abc123.jpg) */
  posterPath?: string | null;
  /** 콘텐츠 제목 */
  title: string;
  /** 평점 (voteAverage) */
  rating?: number | null;
  /** 시청 상태 */
  watchStatus?: WatchStatus | null;
  /** 상세 페이지 링크 (포스터+제목 영역에만 적용) */
  href?: string;
  /** 컨텐츠 ID (시청 상태 변경 시 필요) */
  contentId?: number;
  /** 미디어 타입 (시청 상태 변경 시 필요) */
  mediaType?: 'MOVIE' | 'TV';
  /** 시청 기록 ID (기록 삭제 시 필요) */
  recordId?: number | null;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
export default function ContentCard({
  posterPath,
  title,
  rating,
  watchStatus: initialWatchStatus,
  href,
  contentId,
  mediaType,
  recordId: initialRecordId,
  className,
}: ContentCardProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const posterSrc = posterPath ? `${TMDB_POSTER.md}${posterPath}` : null;

  const [watchStatus, setWatchStatus] = useState(initialWatchStatus);
  const [recordId, setRecordId] = useState(initialRecordId ?? null);
  const iconStatus: IconWatchStatus = (watchStatus && WATCH_STATUS_MAP[watchStatus]) ?? 'none';

  // 메뉴 & 모달 상태
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState({ top: 0, right: 0, dir: 'down' as 'down' | 'up' });
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [preparingModalVisible, setPreparingModalVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);
  const statusIconRef = useRef<HTMLDivElement>(null);

  const showToast = (msg: string) => setToast({ visible: true, message: msg });

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

  // 시청 상태 선택
  const handleStatusSelect = async (status: Exclude<WatchStatus, 'NONE'>) => {
    setStatusMenuOpen(false);
    if (!authLoading && !isAuthenticated) { setLoginModalVisible(true); return; }
    if (!contentId || !mediaType) return;
    try {
      await upsertWatchStatus({ contentId, watchMediaType: mediaType, watchStatus: status });
      setWatchStatus(status);
      showToast(`${STATUS_LABEL[status]}로 변경되었습니다.`);
    } catch {/* 에러 무시 */}
  };

  // 기록 삭제
  const handleDelete = async () => {
    setStatusMenuOpen(false);
    if (!authLoading && !isAuthenticated) { setLoginModalVisible(true); return; }
    if (!recordId) return;
    try {
      await deleteWatchRecord(recordId);
      setWatchStatus(null);
      setRecordId(null);
      showToast('시청 기록이 삭제되었습니다.');
    } catch {/* 에러 무시 */}
  };

  const poster = <Poster src={posterSrc} alt={title} size="large" />;

  return (
    <div className={`w-[140px] shrink-0 bg-wb-dark-03 rounded-[10px] ${className ?? ''}`}>
      {/* 포스터: 링크 영역 */}
      {href ? <Link href={href}>{poster}</Link> : poster}

      {/* 하단 정보 영역 */}
      <div className="px-[7px] pb-[11px]">
        {/* 제목 */}
        <p className="text-[14px] font-medium text-white text-center truncate pt-[8px] pb-[10px]">
          {href ? <Link href={href}>{title}</Link> : title}
        </p>

        {/* 평점 + 아이콘 */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-wb-green tracking-[1.4px]">
            {rating != null ? rating.toFixed(1) : '-'}
          </span>
          <div className="flex items-center gap-[8px]">
            <BoxIcon variant="none" size="small" className="cursor-pointer" onClick={() => setPreparingModalVisible(true)} />
            <div ref={statusIconRef}>
              <WatchStatusIcon status={iconStatus} size="small" className="cursor-pointer" onClick={() => {
                if (statusIconRef.current) {
                  const rect = statusIconRef.current.getBoundingClientRect();
                  const spaceBelow = window.innerHeight - rect.bottom;
                  if (spaceBelow < 200) {
                    setMenuPos({ top: rect.top - 4, right: window.innerWidth - rect.right, dir: 'up' });
                  } else {
                    setMenuPos({ top: rect.bottom + 4, right: window.innerWidth - rect.right, dir: 'down' });
                  }
                }
                setStatusMenuOpen((v) => !v);
              }} />
            </div>
          </div>
        </div>
      </div>

      {/* 시청 상태 메뉴 (fixed로 overflow 영향 안 받음) */}
      {statusMenuOpen && (
        <div ref={menuRef} className="fixed z-50" style={{
          ...(menuPos.dir === 'down' ? { top: menuPos.top } : { bottom: window.innerHeight - menuPos.top }),
          right: menuPos.right - 4,
        }}>
          <WatchStatusMenu
            onSelect={handleStatusSelect}
            onDelete={handleDelete}
          />
        </div>
      )}

      {/* 로그인 모달 */}
      <Modal
        visible={loginModalVisible}
        variant="login"
        onCancel={() => setLoginModalVisible(false)}
        onConfirm={() => { setLoginModalVisible(false); router.push('/login'); }}
      />

      {/* 준비중 모달 */}
      <Modal
        visible={preparingModalVisible}
        variant="preparing"
        onConfirm={() => setPreparingModalVisible(false)}
      />

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </div>
  );
}
