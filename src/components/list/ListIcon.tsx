'use client';

import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import BoxIcon from '@/components/icons/BoxIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';

// ─── Types ──────────────────────────────────────────────────
export type ListIconType = 'watchStatus' | 'box' | 'like' | 'delete';

interface ListIconProps {
  type: ListIconType;
  /** watchStatus: WatchStatus 값, like: active 여부 */
  value?: string | boolean;
  className?: string;
}

// ─── Component ──────────────────────────────────────────────
/**
 * 리스트 아이템 오른쪽에 표시되는 아이콘
 * 피그마 List Icon 컴포넌트 셋 대응
 */
export default function ListIcon({ type, value, className }: ListIconProps) {
  switch (type) {
    case 'watchStatus':
      return (
        <WatchStatusIcon
          status={(value as 'completed' | 'watching' | 'planned' | 'paused' | 'none') ?? 'none'}
          size="medium"
          className={className}
        />
      );
    case 'box':
      return <BoxIcon variant="added" size="medium" className={className} />;
    case 'like':
      return <LikeIcon active={!!value} size="medium" className={className} />;
    case 'delete':
      return <DeleteIcon variant="grey" className={className} />;
  }
}
