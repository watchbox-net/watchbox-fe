'use client';

import type { ReactNode } from 'react';
import TriplePosterBox from '@/components/box/TriplePosterBox';
import { EllipsisVerticalSolid } from '@/components/icons';
import type { BoxType } from '@/types/box';

interface BoxItemProps {
  /** 박스 타입 */
  type: BoxType;
  /** 박스 이름 */
  name: string;
  /** 마지막 업데이트 시각 (ISO) */
  lastContentAddedAt?: string | null;
  /** 포스터 경로 배열 (최대 3개) */
  posters?: (string | null)[];
  /** 공유 박스 멤버 이름 리스트 */
  memberNames?: string[];
  /** 업데이트 문구 표시 여부 (기본 true) */
  update?: boolean;
  /** 박스 영역 클릭 */
  onClick?: () => void;
  /** 우측 케밥 아이콘 클릭 */
  onMenuClick?: (e: React.MouseEvent) => void;
  /** 케밥 버튼 기준 relative 영역에 배치되는 메뉴 슬롯 */
  menuSlot?: ReactNode;
  className?: string;
}

/**
 * 박스 리스트의 한 행
 * 피그마 BoxItem 컴포넌트 대응 (type: my/shared, update: boolean)
 */
export default function BoxItem({
  type,
  name,
  lastContentAddedAt,
  posters = [],
  memberNames,
  update = true,
  onClick,
  onMenuClick,
  menuSlot,
  className,
}: BoxItemProps) {
  const isShared = type === 'SHARED';

  return (
    <div className={`flex items-start w-full pl-[10px] pr-[5px] ${className ?? ''}`}>
      {/* 왼쪽: 포스터 + 텍스트 */}
      <div
        className={`flex flex-1 gap-[10px] items-start min-w-0 ${onClick ? 'cursor-pointer' : ''}`}
        onClick={onClick}
      >
        <TriplePosterBox posters={posters} />
        <div className={`flex flex-col items-start min-w-0 flex-1 ${isShared ? 'gap-[5px]' : 'gap-[3px]'}`}>
          <p className="w-full text-[16px] font-medium text-white leading-[18px] tracking-[0.15px] line-clamp-2">
            {name}
          </p>
          {update && lastContentAddedAt && (
            <p className="text-[13px] text-wb-grey-04 leading-[17px] tracking-[0.25px]">
              업데이트: {lastContentAddedAt.slice(0, 10)}
            </p>
          )}
          {isShared && memberNames && memberNames.length > 0 && (
            <p className="w-full h-[17px] text-[13px] text-wb-primary leading-[17px] tracking-[0.25px] truncate">
              {memberNames.join(' · ')}
            </p>
          )}
        </div>
      </div>

      {/* 오른쪽: 케밥 아이콘 */}
      <div className="relative shrink-0 w-[24px] flex items-center">
        <button
          type="button"
          onClick={onMenuClick}
          className="cursor-pointer text-white"
        >
          <EllipsisVerticalSolid className="size-[24px]" />
        </button>
        {menuSlot}
      </div>
    </div>
  );
}
