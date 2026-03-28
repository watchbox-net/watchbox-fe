'use client';

import Poster from '@/components/content/Poster';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import MemberInfo from '@/components/list/MemberInfo';
import type { WatchStatus as WatchStatusType } from '@/types/content';

// ─── Types ──────────────────────────────────────────────────

/** 마이 박스 → liked 정보 표시 */
interface MyBoxMode {
  mode: 'my';
  liked: boolean;
}

/** 공유 박스 → 게시자 표시 */
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
      <div
        className={`flex items-center justify-between py-[11px] ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        {/* 왼쪽: 포스터 + 텍스트 */}
        <div className="flex items-center gap-[17px] min-w-0">
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
        <div className="shrink-0 ml-[10px]">
          <WatchStatusIcon status={toIconStatus(watchStatus)} size="medium" />
        </div>
      </div>

      {/* 구분선 */}
      {showDivider && (
        <div className="h-[0.5px] bg-wb-dark-05" />
      )}
    </div>
  );
}
