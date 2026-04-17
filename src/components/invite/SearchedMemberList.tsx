import type { ReactNode } from 'react';

interface SearchedMemberListProps {
  children: ReactNode;
  className?: string;
}

/**
 * MemberInvitationItem(type=searched) 모음
 * 피그마 Searched Member List 대응 (gap 15)
 */
export default function SearchedMemberList({ children, className = '' }: SearchedMemberListProps) {
  return (
    <div className={`flex flex-col gap-[15px] ${className}`.trim()}>
      {children}
    </div>
  );
}
