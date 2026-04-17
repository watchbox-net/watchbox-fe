'use client';

import { useState } from 'react';
import ProfileIcon from '@/components/icons/ProfileIcon';
import AddedStatusIcon from '@/components/icons/AddedStatusIcon';

// ─── Types ──────────────────────────────────────────────────

/** Searched Member — 검색된 회원 행 (프로필 + 이름 + Add/Added 아이콘) */
interface SearchedMemberProps {
  type: 'searched';
  /** 회원 이름 */
  name: string;
  /** 이미 추가(초대)됐으면 true → 체크 아이콘 */
  added: boolean;
  onAdd?: () => void;
  className?: string;
}

/** Box Invitation Received Action Line — 받은 초대의 하단 라인 (초대자명 + 수락/거절) */
interface ReceivedActionLineProps {
  type: 'received';
  /** 초대한 사람 이름 */
  inviterName: string;
  onAccept?: () => void;
  onReject?: () => void;
  className?: string;
}

/** Box Invitation Sended Action Line — 보낸 초대 행 (대기중: 취소 / 거절: 삭제) */
interface SendedActionLineProps {
  type: 'sended';
  /** 초대받은 상대 이름 */
  receiverName: string;
  /** 공유 박스 이름 */
  boxName: string;
  /** 'pending' → 취소 (dark) / 'rejected' → 삭제 (red) */
  status: 'pending' | 'rejected';
  onAction?: () => void;
  className?: string;
}

export type MemberInvitationItemProps =
  | SearchedMemberProps
  | ReceivedActionLineProps
  | SendedActionLineProps;

// ─── Sub: 28px 소형 버튼 ────────────────────────────────────
function SmallButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: 'green' | 'dark' | 'red';
  onClick?: () => void;
}) {
  const bg = color === 'green' ? 'bg-wb-green' : color === 'red' ? 'bg-wb-red' : 'bg-wb-dark-04';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-[28px] w-[55px] rounded-[8px] text-[13px] font-medium leading-none text-white shadow-[0px_1px_2px_rgba(10,13,18,0.05)] cursor-pointer shrink-0 ${bg}`}
    >
      {label}
    </button>
  );
}

// ─── Component ──────────────────────────────────────────────
/**
 * 피그마 Member Invitation Item 대응.
 * 3가지 type:
 *  - searched: 검색된 회원 (이름 + Add/Added)
 *  - received: 받은 초대의 하단 액션 라인 (초대자명 + 수락/거절)
 *  - sended:   보낸 초대 행 (대기중: 취소 / 거절: 삭제)
 */
export default function MemberInvitationItem(props: MemberInvitationItemProps) {
  // ── searched ──
  if (props.type === 'searched') {
    const { name, added, onAdd, className } = props;
    return (
      <div className={`flex h-[30px] items-center justify-between px-[16px] ${className ?? ''}`}>
        <div className="flex items-center gap-[10px] min-w-0">
          <ProfileIcon variant="list" />
          <span className="text-[18px] leading-[28px] text-wb-grey-04 truncate">
            {name}
          </span>
        </div>
        <button
          type="button"
          onClick={added ? undefined : onAdd}
          disabled={added}
          aria-label={added ? '추가됨' : '추가'}
          className="shrink-0 cursor-pointer disabled:cursor-default"
        >
          <AddedStatusIcon variant={added ? 'checked' : 'add'} />
        </button>
      </div>
    );
  }

  // ── received ──
  if (props.type === 'received') {
    const { inviterName, onAccept, onReject, className } = props;
    return (
      <div className={`flex h-[30px] items-center justify-between pl-[16px] pr-[5px] ${className ?? ''}`}>
        <div className="flex items-center gap-[10px] min-w-0">
          <ProfileIcon variant="list" />
          <span className="text-[14px] leading-[20px] text-wb-grey-02 truncate">
            초대자: {inviterName}
          </span>
        </div>
        <div className="flex items-center gap-[7px] shrink-0">
          <SmallButton label="수락" color="green" onClick={onAccept} />
          <SmallButton label="거절" color="dark" onClick={onReject} />
        </div>
      </div>
    );
  }

  // ── sended ──
  const { receiverName, boxName, status, onAction, className } = props;
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`flex items-center gap-[16px] pl-[16px] pr-[5px] ${className ?? ''}`}>
      <ProfileIcon variant="list" />
      <button
        type="button"
        className="flex-1 min-w-0 text-left cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <p className={`text-[14px] leading-none text-white ${expanded ? '' : 'truncate'}`}>
          {receiverName} 님에게 {boxName} 참가 요청
        </p>
        <p className="text-[11px] leading-none text-wb-grey-02 mt-[7px]">
          상태: {status === 'pending' ? '대기중' : '거절'}
        </p>
      </button>
      <SmallButton
        label={status === 'pending' ? '취소' : '삭제'}
        color={status === 'pending' ? 'dark' : 'red'}
        onClick={onAction}
      />
    </div>
  );
}
