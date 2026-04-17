import type { ReactNode } from 'react';

interface BoxListProps {
  children: ReactNode;
  className?: string;
}

/**
 * BoxItem을 감싸는 리스트 래퍼
 * 피그마 Box List 컴포넌트 대응 (gap 17, pt 25, pb 10)
 */
export default function BoxList({ children, className = '' }: BoxListProps) {
  return (
    <div className={`flex flex-col gap-[17px] items-start pt-[25px] pb-[10px] ${className}`.trim()}>
      {children}
    </div>
  );
}
