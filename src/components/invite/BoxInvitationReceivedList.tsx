import type { ReactNode } from 'react';

interface BoxInvitationReceivedListProps {
  children: ReactNode;
  className?: string;
}

/**
 * BoxInvitationReceivedItem 모음
 * 피그마 Box Invitaion Received List 대응 (gap 15)
 */
export default function BoxInvitationReceivedList({ children, className = '' }: BoxInvitationReceivedListProps) {
  return (
    <div className={`flex flex-col gap-[15px] ${className}`.trim()}>
      {children}
    </div>
  );
}
