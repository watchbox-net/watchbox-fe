'use client';

import type { ReactNode } from 'react';
import Poster from '@/components/content/Poster';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import MemberInfo from '@/components/list/MemberInfo';
import { getImageUrl, getDisplayTitle, getSubText } from '@/lib/utils/content';
import type { ContentSummary, WatchStatus as WatchStatusType } from '@/types/content-summary';

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

interface ContentItemProps {
  /** 콘텐츠 요약 (mediaType에 따라 표시 분기) */
  summary: ContentSummary;
  /** 시청 상태 (PERSON 변형에서는 무시됨) */
  watchStatus?: WatchStatusType | null;
  /** 박스 모드에 따른 하단 정보 */
  boxMode?: BoxMode;
  /** 클릭 시 실행 (상세 페이지 이동 등) */
  onClick?: () => void;
  /** 시청 상태 아이콘 클릭 시 실행 (PERSON에서는 호출되지 않음) */
  onStatusClick?: (e: React.MouseEvent) => void;
  /** 아이콘 영역 relative 기준으로 absolute 배치되는 메뉴 슬롯 */
  statusMenuSlot?: ReactNode;
  /** 시청 상태 아이콘을 숨길지 여부 */
  hideStatusIcon?: boolean;
  className?: string;
}

// ─── Helpers ────────────────────────────────────────────────
function toIconStatus(ws: WatchStatusType | null | undefined) {
  if (!ws || ws === 'NONE') return 'none' as const;
  return ws.toLowerCase() as 'completed' | 'watching' | 'planned' | 'paused';
}

// ─── Component ──────────────────────────────────────────────
/**
 * 콘텐츠 리스트의 한 행 (Content Item)
 *
 * 피그마 Content Item 컴포넌트 셋 대응 — mediaType에 따라 3가지 variant
 * - MOVIE:  releaseYear · 장르1, 장르2
 * - TV:     firstAirYear-lastAirYear · 장르1, 장르2
 * - PERSON: knownForDepartment (시청 상태 아이콘 없음)
 */
export default function ContentItem({
  summary,
  watchStatus,
  boxMode,
  onClick,
  onStatusClick,
  statusMenuSlot,
  hideStatusIcon,
  className,
}: ContentItemProps) {
  const isPerson = summary.mediaType === 'PERSON';
  const title = getDisplayTitle(summary);
  const posterSrc = getImageUrl(summary);
  const subText = getSubText(summary);

  // MemberInfo variant
  const memberVariant = !boxMode
    ? 'none' as const
    : boxMode.mode === 'my'
      ? (boxMode.liked ? 'like' as const : 'none' as const)
      : 'publisher' as const;

  const publishers = boxMode?.mode === 'shared' ? boxMode.publishers : undefined;

  return (
    <div className={`h-[92px] px-[16px] flex items-center justify-between ${className ?? ''}`}>
      {/* 왼쪽: 포스터 + 텍스트 (클릭 시 상세 이동) */}
      <div
        className={`flex items-center gap-[17px] min-w-0 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <Poster
          src={posterSrc}
          alt={title}
          size="small"
          variant={isPerson ? 'profile' : 'poster'}
        />

        <div className="flex flex-col gap-[5px] min-w-0">
          {/* 제목 + 부제 (variant별로 다른 형식) */}
          <div className="flex flex-col gap-[6px]">
            <p className="text-[16px] font-medium text-white truncate">{title}</p>
            {subText && (
              <p className="text-[12px] text-wb-grey-03 truncate">{subText}</p>
            )}
          </div>

          {/* 멤버 정보 */}
          <MemberInfo variant={memberVariant} publishers={publishers} />
        </div>
      </div>

      {/* 오른쪽: 시청 상태 아이콘 (PERSON은 노출 X) */}
      {!isPerson && !hideStatusIcon && (
        <div className="relative shrink-0 ml-[10px]">
          <div
            className={onStatusClick ? 'cursor-pointer' : ''}
            onClick={onStatusClick}
          >
            <WatchStatusIcon status={toIconStatus(watchStatus)} size="medium" />
          </div>
          {statusMenuSlot}
        </div>
      )}
    </div>
  );
}
