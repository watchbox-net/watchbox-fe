import type { ReactNode } from 'react';

interface ContentListProps {
  children: ReactNode;
  className?: string;
}

/**
 * ContentItem을 감싸는 리스트 래퍼
 * 피그마 Content List 컴포넌트 대응 (gap 5, 위아래 패딩 10)
 */
export default function ContentList({ children, className = '' }: ContentListProps) {
  return (
    <div className={`flex flex-col gap-[5px] py-[10px] ${className}`.trim()}>
      {children}
    </div>
  );
}
