import ContentRecordUpdateHistory, {
  type ContentRecordUpdateHistoryItem,
} from './ContentRecordUpdateHistory';

interface ContentRecordUpdateHistoryListProps {
  items: ContentRecordUpdateHistoryItem[];
}

/** 시청 기록 변경 히스토리 리스트 — 항목 간격 20px, 위아래 패딩 10px */
export default function ContentRecordUpdateHistoryList({ items }: ContentRecordUpdateHistoryListProps) {
  return (
    <div className="flex flex-col gap-[20px] py-[10px]">
      {items.map((item, i) => (
        <ContentRecordUpdateHistory key={i} item={item} />
      ))}
    </div>
  );
}
