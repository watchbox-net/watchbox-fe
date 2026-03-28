'use client';

import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import { XMarkOutline } from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export interface WatchStatusMenuProps {
  onSelect: (status: 'COMPLETED' | 'WATCHING' | 'PLANNED' | 'PAUSED') => void;
  onDelete: () => void;
  className?: string;
}

// ─── 상태 목록 ───────────────────────────────────────────────
const STATUS_ITEMS = [
  { status: 'COMPLETED' as const, label: '시청 완료' },
  { status: 'WATCHING'  as const, label: '시청중'   },
  { status: 'PLANNED'   as const, label: '시청 예정' },
  { status: 'PAUSED'    as const, label: '시청 중단' },
] as const;

// ─── Component ──────────────────────────────────────────────
export default function WatchStatusMenu({
  onSelect,
  onDelete,
  className,
}: WatchStatusMenuProps) {
  return (
    <div
      className={`bg-wb-dark-05 rounded-[15px] w-[135px] py-[5px] flex flex-col ${className ?? ''}`}
    >
      {STATUS_ITEMS.map(({ status, label }, index) => (
        <button
          key={status}
          type="button"
          className={`
            flex items-center h-[45px] w-full px-[16px] gap-[16px]
            cursor-pointer transition-colors hover:bg-wb-grey-01
            ${index === 0 ? 'rounded-t-[10px]' : ''}
          `}
          onClick={() => onSelect(status)}
        >
          <WatchStatusIcon status={status.toLowerCase() as 'completed' | 'watching' | 'planned' | 'paused'} size="medium" />
          <span className="text-[14px] font-medium text-wb-grey-03 whitespace-nowrap">
            {label}
          </span>
        </button>
      ))}

      {/* 기록 삭제 */}
      <button
        type="button"
        className="flex items-center h-[45px] w-full px-[16px] gap-[16px] cursor-pointer transition-colors hover:bg-wb-grey-01 rounded-b-[10px]"
        onClick={onDelete}
      >
        <XMarkOutline className="size-[24px] text-wb-grey-03 shrink-0" />
        <span className="text-[14px] font-medium text-wb-grey-03 whitespace-nowrap">
          기록 삭제
        </span>
      </button>
    </div>
  );
}
