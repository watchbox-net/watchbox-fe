'use client';

import Poster from '@/components/content/Poster';
import BoxIcon from '@/components/icons/BoxIcon';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import { TMDB_POSTER } from '@/lib/utils/content';
import type { WatchStatus } from '@/types/content';
import type { WatchStatus as IconWatchStatus } from '@/components/icons/WatchStatusIcon';

const WATCH_STATUS_MAP: Record<string, IconWatchStatus> = {
  COMPLETED: 'completed',
  WATCHING: 'watching',
  PLANNED: 'planned',
  PAUSED: 'paused',
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
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
/**
 * 홈 카드 스크롤에 사용되는 콘텐츠 카드
 * 피그마 Content Card 컴포넌트 대응
 *
 * 구조: Poster(large) + 하단 정보 영역(제목, 평점, 아이콘)
 */
export default function ContentCard({
  posterPath,
  title,
  rating,
  watchStatus,
  className,
}: ContentCardProps) {
  const posterSrc = posterPath ? `${TMDB_POSTER.md}${posterPath}` : null;
  const iconStatus: IconWatchStatus = (watchStatus && WATCH_STATUS_MAP[watchStatus]) ?? 'none';

  return (
    <div className={`w-[140px] shrink-0 ${className ?? ''}`}>
      {/* 포스터 */}
      <Poster src={posterSrc} alt={title} size="large" />

      {/* 하단 정보 영역 */}
      <div className="bg-wb-dark-03 rounded-b-[10px] -mt-[1px] px-[7px] pb-[11px]">
        {/* 제목 */}
        <p className="text-[14px] font-medium text-white text-center truncate pt-[8px] pb-[6px]">
          {title}
        </p>

        {/* 평점 + 아이콘 */}
        <div className="flex items-center justify-between">
          <span className="text-[14px] font-medium text-wb-green tracking-[1.4px]">
            {rating != null ? rating.toFixed(1) : '-'}
          </span>
          <div className="flex items-center gap-[8px]">
            <BoxIcon variant="none" size="small" />
            <WatchStatusIcon status={iconStatus} size="small" />
          </div>
        </div>
      </div>
    </div>
  );
}
