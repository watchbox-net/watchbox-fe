import BoxHistory, {
  type BoxHistoryItem,
} from './BoxHistory';

interface BoxHistoryListProps {
  items: BoxHistoryItem[];
}

/** 박스 히스토리 리스트 — 항목 간격 25px, 위아래 패딩 15px */
export default function BoxHistoryList({ items }: BoxHistoryListProps) {
  return (
    <div className="flex flex-col gap-[25px] py-[15px]">
      {items.map((item, i) => (
        <BoxHistory key={i} item={item} />
      ))}
    </div>
  );
}
