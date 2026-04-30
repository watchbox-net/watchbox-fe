'use client';

import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import { XMarkOutline, EyeSolid } from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export type WatchStatusMenuVariant = 'upsert' | 'box-content' | 'content-record';

/** upsert variant: 시청 상태 선택용 */
export type WatchStatus = 'COMPLETED' | 'WATCHING' | 'PLANNED' | 'PAUSED';

/** filter variants (box-content / content-record): 필터 선택용 */
export type WatchStatusFilter =
  | 'ALL'
  | 'COMPLETED'
  | 'WATCHING'
  | 'PLANNED'
  | 'PAUSED'
  | 'NONE'
  | 'LIKED';

export interface WatchStatusMenuProps {
  variant?: WatchStatusMenuVariant;
  /** upsert variant — 상태 선택 콜백 */
  onSelect?: (status: WatchStatus) => void;
  /** upsert variant — 기록 삭제 콜백 (있으면 항목 표시) */
  onDelete?: () => void;
  /** filter variants — 필터 선택 콜백 */
  onFilterChange?: (filter: WatchStatusFilter) => void;
  /** filter variants — 현재 선택된 필터 (배경 활성화 표시) */
  selected?: WatchStatusFilter;
  className?: string;
}

// ─── 항목 정의 ───────────────────────────────────────────────
type FilterItem = { filter: WatchStatusFilter; label: string };

const BOX_CONTENT_ITEMS: FilterItem[] = [
  { filter: 'ALL',       label: '전체'      },
  { filter: 'COMPLETED', label: '시청 완료' },
  { filter: 'WATCHING',  label: '시청중'    },
  { filter: 'PLANNED',   label: '시청 예정' },
  { filter: 'PAUSED',    label: '시청 중단' },
  { filter: 'NONE',      label: '기록 없음' },
];

const CONTENT_RECORD_ITEMS: FilterItem[] = [
  { filter: 'ALL',       label: '전체'      },
  { filter: 'COMPLETED', label: '시청 완료' },
  { filter: 'WATCHING',  label: '시청중'    },
  { filter: 'PLANNED',   label: '시청 예정' },
  { filter: 'PAUSED',    label: '시청 중단' },
  { filter: 'LIKED',      label: '좋아요'    },
];

const STATUS_ITEMS: { status: WatchStatus; label: string }[] = [
  { status: 'COMPLETED', label: '시청 완료' },
  { status: 'WATCHING',  label: '시청중'    },
  { status: 'PLANNED',   label: '시청 예정' },
  { status: 'PAUSED',    label: '시청 중단' },
];

// ─── 아이콘 렌더 헬퍼 ────────────────────────────────────────
function FilterIcon({ filter }: { filter: WatchStatusFilter }) {
  switch (filter) {
    case 'ALL':
      return <EyeSolid className="size-[24px] text-wb-white-02 shrink-0" />;
    case 'LIKED':
      return <LikeIcon active size="medium" />;
    case 'NONE':
      return <WatchStatusIcon status="none" size="medium" />;
    case 'COMPLETED':
      return <WatchStatusIcon status="completed" size="medium" />;
    case 'WATCHING':
      return <WatchStatusIcon status="watching" size="medium" />;
    case 'PLANNED':
      return <WatchStatusIcon status="planned" size="medium" />;
    case 'PAUSED':
      return <WatchStatusIcon status="paused" size="medium" />;
  }
}

// ─── 행 클래스 헬퍼 ──────────────────────────────────────────
// 첫/마지막 행은 라운딩이 항상 적용되고, 배경(active/hover)이 그 모양 그대로 채움.
// 중간 행은 라운딩 없는 풀 사각형으로 채워짐. (Figma 일치)
function rowClass(isActive: boolean, index: number, total: number) {
  const rounded =
    index === 0
      ? 'rounded-t-[10px]'
      : index === total - 1
        ? 'rounded-b-[10px]'
        : '';
  const base = 'flex items-center h-[45px] w-full px-[16px] gap-[24px] cursor-pointer transition-colors';
  const bg = isActive ? 'bg-wb-grey-01' : 'hover:bg-wb-grey-01';
  return `${base} ${rounded} ${bg}`;
}

// ─── Component ──────────────────────────────────────────────
export default function WatchStatusMenu({
  variant = 'upsert',
  onSelect,
  onDelete,
  onFilterChange,
  selected,
  className,
}: WatchStatusMenuProps) {
  const containerClass = `bg-wb-dark-05 rounded-[12px] w-[135px] py-[5px] flex flex-col ${className ?? ''}`;

  // ── upsert (기존 동작 유지) ──
  if (variant === 'upsert') {
    const total = STATUS_ITEMS.length + (onDelete ? 1 : 0);

    return (
      <div className={containerClass}>
        {STATUS_ITEMS.map(({ status, label }, index) => (
          <button
            key={status}
            type="button"
            className={rowClass(false, index, total)}
            onClick={() => onSelect?.(status)}
          >
            <FilterIcon filter={status} />
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-04 whitespace-nowrap">
              {label}
            </span>
          </button>
        ))}

        {onDelete && (
          <button
            type="button"
            className={rowClass(false, total - 1, total)}
            onClick={onDelete}
          >
            <XMarkOutline className="size-[24px] text-wb-grey-04 shrink-0" />
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-04 whitespace-nowrap">
              기록 삭제
            </span>
          </button>
        )}
      </div>
    );
  }

  // ── filter variants (box-content / content-record) ──
  const items = variant === 'box-content' ? BOX_CONTENT_ITEMS : CONTENT_RECORD_ITEMS;

  return (
    <div className={containerClass}>
      {items.map(({ filter, label }, index) => {
        const isActive = selected === filter;
        return (
          <button
            key={filter}
            type="button"
            className={rowClass(isActive, index, items.length)}
            onClick={() => onFilterChange?.(filter)}
          >
            <FilterIcon filter={filter} />
            <span className="text-[14px] font-medium leading-[24px] tracking-[0.1px] text-wb-grey-04 whitespace-nowrap">
              {label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
