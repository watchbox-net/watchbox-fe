import BoxContentUpdateHistory, {
  type BoxContentUpdateHistoryItem,
} from './BoxContentUpdateHistory';

interface BoxContentUpdateHistoryListProps {
  items: BoxContentUpdateHistoryItem[];
}

/** 박스 컨텐츠 변경 히스토리 리스트 — 항목 간격 25px, 위아래 패딩 15px */
export default function BoxContentUpdateHistoryList({ items }: BoxContentUpdateHistoryListProps) {
  return (
    <div className="flex flex-col gap-[25px] py-[15px]">
      {items.map((item, i) => (
        <BoxContentUpdateHistory key={i} item={item} />
      ))}
    </div>
  );
}
