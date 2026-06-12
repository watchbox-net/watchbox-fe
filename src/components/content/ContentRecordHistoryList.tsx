import ContentRecordHistory, {
  type ContentRecordHistoryItem,
} from './ContentRecordHistory';

interface ContentRecordHistoryListProps {
  items: ContentRecordHistoryItem[];
}

/** 시청 기록 히스토리 리스트 — 항목 간격 20px, 위아래 패딩 10px */
export default function ContentRecordHistoryList({ items }: ContentRecordHistoryListProps) {
  return (
    <div className="flex flex-col gap-[20px] py-[10px]">
      {items.map((item, i) => (
        <ContentRecordHistory key={i} item={item} />
      ))}
    </div>
  );
}
