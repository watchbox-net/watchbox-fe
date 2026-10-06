'use client';

import ContentItem from '@/components/list/ContentItem';
import AddedStatusIcon2 from '@/components/icons/AddedStatusIcon2';
import type { ContentSummary, WatchStatus } from '@/types/content-summary';

interface SheetContentRecordItemProps {
  summary: ContentSummary;
  watchStatus?: WatchStatus | null;
  liked?: boolean;
  /** 이 박스에 담겨 있는지 (체크 상태) */
  checked: boolean;
  /** 행 클릭 — 체크 토글 */
  onToggle?: () => void;
}

/**
 * Sheet Content Record Item — 시트 안의 시청 기록 한 행
 *
 * 피그마 Sheet Content Record Item 대응. 시청 기록 리스트 행({@link ContentItem})에
 * <b>체크 표시만 하나 더 붙은 형태</b>라 행 자체를 새로 그리지 않고 trailingSlot 으로 얹는다.
 *
 * <p>행 전체가 토글 영역이다 — 시트에서는 상세 페이지로 이동할 일이 없고,
 * 체크박스만 누르게 하면 터치 영역이 좁아진다.
 */
export default function SheetContentRecordItem({
  summary,
  watchStatus,
  liked = false,
  checked,
  onToggle,
}: SheetContentRecordItemProps) {
  return (
    <div className="cursor-pointer" onClick={onToggle}>
      <ContentItem
        summary={summary}
        watchStatus={watchStatus}
        boxMode={{ mode: 'my', liked }}
        trailingSlot={<AddedStatusIcon2 variant={checked ? 'checked' : 'unchecked'} />}
      />
    </div>
  );
}
