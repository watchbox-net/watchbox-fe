'use client';

import BoxItem from '@/components/box/BoxItem';
import MemberInvitationItem from '@/components/invite/MemberInvitationItem';

interface BoxInvitationReceivedItemProps {
  /** 박스 이름 */
  boxName: string;
  /** 공유 박스 멤버 이름 */
  memberNames?: string[];
  /** 포스터 경로 배열 */
  posters?: (string | null)[];
  /** 초대한 사람 이름 */
  inviterName: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

/**
 * 피그마 Box Invitaion Received Item 대응.
 * 구성: BoxItem(shared, update=false) + MemberInvitationItem(received)
 */
export default function BoxInvitationReceivedItem({
  boxName,
  memberNames,
  posters,
  inviterName,
  onAccept,
  onReject,
  className,
}: BoxInvitationReceivedItemProps) {
  return (
    <div className={`flex flex-col gap-[4px] ${className ?? ''}`}>
      <BoxItem
        type="SHARED"
        name={boxName}
        memberNames={memberNames}
        posters={posters}
        update={false}
      />
      <MemberInvitationItem
        type="received"
        inviterName={inviterName}
        onAccept={onAccept}
        onReject={onReject}
      />
    </div>
  );
}
