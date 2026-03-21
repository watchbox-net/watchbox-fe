import { ReactNode } from 'react';

interface MainContentProps {
  children: ReactNode;
  className?: string;
}

/**
 * 메인 컨텐츠 영역 레이아웃 컴포넌트
 * MobileFrame 내부에서 Header 아래, BottomMenu 위 영역으로 사용
 * 좌우 패딩은 각 컴포넌트 내부에서 관리
 */
export default function MainContent({ children, className = '' }: MainContentProps) {
  return (
    <main className={`flex-1 overflow-y-auto pb-24 ${className}`.trim()}>
      {children}
    </main>
  );
}
