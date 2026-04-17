import type { ReactNode } from 'react';

interface BoxInvitationSendedListProps {
  children: ReactNode;
  className?: string;
}

/**
 * MemberInvitationItem(type=sended) 모음
 * 피그마 Box Invitation Sended List 대응 (gap 20)
 */
export default function BoxInvitationSendedList({ children, className = '' }: BoxInvitationSendedListProps) {
  return (
    <div className={`flex flex-col gap-[20px] ${className}`.trim()}>
      {children}
    </div>
  );
}
