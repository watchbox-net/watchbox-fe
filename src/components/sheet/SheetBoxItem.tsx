'use client';

import TriplePosterBox from '@/components/box/TriplePosterBox';
import BoxIcon from '@/components/icons/BoxIcon';
import type { BoxType } from '@/types/box';

interface SheetBoxItemProps {
  /** 박스 타입 */
  type: BoxType;
  /** 박스 이름 */
  name: string;
  /** 공유 박스 멤버 이름 (type=SHARED일 때 사용) */
  memberNames?: string[];
  /** 포스터 경로 배열 (최대 3개) */
  posters?: (string | null)[];
  /** 이 컨텐츠가 박스에 이미 포함되어 있으면 true */
  included: boolean;
  /** 행 클릭 */
  onClick?: () => void;
  className?: string;
}

/**
 * Content Box Sheet에서 선택 가능한 박스 한 행
 * 피그마 Sheet Box Item 대응
 * - TriplePosterBox (small 110×58)
 * - 텍스트: 박스명 + ("내 박스" 또는 "공유 박스 - 멤버1 · 멤버2")
 * - 우측 BoxIcon: included=true → added / false → outline
 */
export default function SheetBoxItem({
  type,
  name,
  memberNames,
  posters = [],
  included,
  onClick,
  className,
}: SheetBoxItemProps) {
  const isShared = type === 'SHARED';

  return (
    <div
      className={`flex items-center justify-between px-[16px] ${onClick ? 'cursor-pointer' : ''} ${className ?? ''}`}
      onClick={onClick}
    >
      {/* 왼쪽: 포스터 박스 + 텍스트 */}
      <div className="flex items-center gap-[10px] min-w-0">
        <TriplePosterBox posters={posters} size="small" />
        <div className={`flex flex-col items-start min-w-0 ${isShared ? 'gap-[5px]' : 'gap-[3px]'}`}>
          <p className="w-[205px] text-[16px] font-medium text-white leading-[18px] tracking-[0.15px] line-clamp-2">
            {name}
          </p>
          {isShared ? (
            <p className="text-[13px] leading-[17px] tracking-[0.25px] truncate w-[205px]">
              <span className="text-wb-primary">멤버 - {memberNames?.join(' · ')}</span>
            </p>
          ) : (
            <p className="text-[13px] text-wb-grey-04 leading-[17px] tracking-[0.25px]">
              내 박스
            </p>
          )}
        </div>
      </div>

      {/* 오른쪽: 박스 아이콘 (added / outline) */}
      <div className="shrink-0">
        <BoxIcon variant={included ? 'added' : 'outline'} size="medium" />
      </div>
    </div>
  );
}
