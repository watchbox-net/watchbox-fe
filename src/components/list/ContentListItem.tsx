'use client';

import type { ReactNode } from 'react';
import Poster from '@/components/content/Poster';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import MemberInfo from '@/components/list/MemberInfo';
import type { WatchStatus as WatchStatusType } from '@/types/content-summary';

// ─── Types ──────────────────────────────────────────────────

/** 마이 박스 → liked 정보 표시 */
interface MyBoxMode {
  mode: 'my';
  liked: boolean;
}

/** 공유 박스 → 공유 멤버 표시 */
interface SharedBoxMode {
  mode: 'shared';
  publishers: string[];
}

type BoxMode = MyBoxMode | SharedBoxMode;

interface ContentListItemProps {
  /** 포스터 이미지 URL */
  posterSrc?: string | null;
  /** 콘텐츠 제목 */
  title: string;
  /** 연도 */
  year?: number | null;
  /** 장르 목록 */
  genres?: string[] | null;
  /** 시청 상태 */
  watchStatus?: WatchStatusType | null;
  /** 박스 모드에 따른 하단 정보 */
  boxMode?: BoxMode;
  /** 하단 구분선 표시 */
  showDivider?: boolean;
  /** 클릭 시 실행 (상세 페이지 이동 등) */
  onClick?: () => void;
  /** 시청 상태 아이콘 클릭 시 실행 (stopPropagation 처리됨) */
  onStatusClick?: (e: React.MouseEvent) => void;
  /** 아이콘 영역 relative 기준으로 absolute 배치되는 메뉴 슬롯 */
  statusMenuSlot?: ReactNode;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────
function toIconStatus(ws: WatchStatusType | null | undefined) {
  if (!ws || ws === 'NONE') return 'none' as const;
  return ws.toLowerCase() as 'completed' | 'watching' | 'planned' | 'paused';
}

// ─── Component ──────────────────────────────────────────────
/**
 * 박스 컨텐츠 리스트의 한 행
 * 피그마 Content Item 컴포넌트 대응
 */
export default function ContentListItem({
  posterSrc,
  title,
  year,
  genres,
  watchStatus,
  boxMode,
  showDivider = true,
  onClick,
  onStatusClick,
  statusMenuSlot,
  className,
}: ContentListItemProps) {
  // 연도 · 장르1, 장르2
  const infoLine = [year, genres?.join(', ')].filter(Boolean).join(' · ');

  // MemberInfo variant
  const memberVariant = !boxMode
    ? 'none' as const
    : boxMode.mode === 'my'
      ? (boxMode.liked ? 'like' as const : 'none' as const)
      : 'publisher' as const;

  const publishers = boxMode?.mode === 'shared' ? boxMode.publishers : undefined;

  return (
    <div className={`px-[16px] ${className ?? ''}`}>
      <div className="flex items-center justify-between py-[11px]">
        {/* 왼쪽: 포스터 + 텍스트 (클릭 시 상세 이동) */}
        <div
          className={`flex items-center gap-[17px] min-w-0 ${onClick ? 'cursor-pointer' : ''}`}
          onClick={onClick}
        >
          <Poster src={posterSrc} alt={title} size="small" />

          <div className="flex flex-col gap-[5px] min-w-0">
            {/* 제목 + 연도/장르 */}
            <div className="flex flex-col gap-[6px]">
              <p className="text-[16px] font-medium text-white truncate">{title}</p>
              {infoLine && (
                <p className="text-[12px] text-wb-grey-02 truncate">{infoLine}</p>
              )}
            </div>

            {/* 멤버 정보 */}
            <MemberInfo variant={memberVariant} publishers={publishers} />
          </div>
        </div>

        {/* 오른쪽: 시청 상태 아이콘 */}
        <div className="relative shrink-0 ml-[10px]">
          <div
            className={onStatusClick ? 'cursor-pointer' : ''}
            onClick={onStatusClick}
          >
            <WatchStatusIcon status={toIconStatus(watchStatus)} size="medium" />
          </div>
          {statusMenuSlot}
        </div>
      </div>

      {/* 구분선 */}
      {showDivider && (
        <div className="h-[0.5px] bg-wb-dark-05" />
      )}
    </div>
  );
}
