'use client';

import { useState } from 'react';
import Image from 'next/image';
import ProfileIcon from '@/components/icons/ProfileIcon';
import AddedStatusIcon from '@/components/icons/AddedStatusIcon';

// ─── Types ──────────────────────────────────────────────────
type SearchVariant = {
  variant: 'search';
  /** 검색된 멤버 닉네임 */
  name: string;
  /** 이미 추가(초대)됐으면 true → checked 아이콘 */
  added: boolean;
  onAdd: () => void;
  className?: string;
};

type InvitationVariant = {
  variant: 'invitation';
  /** 초대받은 박스 이름 */
  boxName: string;
  /** e.g. "멤버: 너구리, 해달" */
  boxMembers: string;
  /** 박스 썸네일 이미지 URL (없으면 placeholder) */
  boxThumbnailSrc?: string;
  /** 초대한 사람 닉네임 */
  inviterName: string;
  onAccept: () => void;
  onReject: () => void;
  className?: string;
};

type StatusVariant = {
  variant: 'status';
  /** 초대받은 상대 닉네임 */
  userName: string;
  /** 공유 박스 이름 */
  boxName: string;
  /** 대기중: 취소 버튼 | 거절됨: 삭제 버튼 */
  status: 'pending' | 'rejected';
  /** pending → "취소" / rejected → "삭제" */
  onAction: () => void;
  className?: string;
};

export type MemberInviteListItemProps =
  | SearchVariant
  | InvitationVariant
  | StatusVariant;

// ─── Sub: 소형 액션 버튼 ─────────────────────────────────────
function ActionButton({
  label,
  color,
  onClick,
}: {
  label: string;
  color: 'green' | 'dark' | 'red';
  onClick: () => void;
}) {
  const bg =
    color === 'green'
      ? 'bg-wb-green'
      : color === 'red'
        ? 'bg-wb-red'
        : 'bg-wb-dark-04';

  return (
    <button
      onClick={onClick}
      className={`h-[28px] w-[55px] rounded-[8px] text-[13px] font-medium text-white shadow-[0px_1px_2px_rgba(10,13,18,0.05)] cursor-pointer shrink-0 ${bg}`}
    >
      {label}
    </button>
  );
}

// ─── Component ──────────────────────────────────────────────
export default function MemberInviteListItem(props: MemberInviteListItemProps) {
  // ── search variant ──
  if (props.variant === 'search') {
    const { name, added, onAdd, className } = props;
    return (
      <div className={`flex items-center gap-[10px] py-[10px] ${className ?? ''}`}>
        <ProfileIcon variant="list" />
        <span className="flex-1 text-[18px] leading-[28px] text-wb-grey-04 truncate">
          {name}
        </span>
        <button
          onClick={added ? undefined : onAdd}
          className="shrink-0 cursor-pointer disabled:cursor-default"
          disabled={added}
          aria-label={added ? '추가됨' : '추가'}
        >
          <AddedStatusIcon variant={added ? 'checked' : 'add'} />
        </button>
      </div>
    );
  }

  // ── invitation variant ──
  if (props.variant === 'invitation') {
    const { boxName, boxMembers, boxThumbnailSrc, inviterName, onAccept, onReject, className } = props;
    return (
      <div className={`flex flex-col gap-[10px] ${className ?? ''}`}>
        {/* 박스 정보 */}
        <div className="flex items-center gap-[12px]">
          {/* 박스 썸네일 (148×81) */}
          <div className="w-[148px] h-[81px] rounded-[5px] bg-wb-dark-05 shrink-0 overflow-hidden">
            {boxThumbnailSrc ? (
              <Image src={boxThumbnailSrc} alt={boxName} width={148} height={81} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-wb-dark-05" />
            )}
          </div>
          {/* 박스 이름 + 멤버 */}
          <div className="flex flex-col gap-[4px] min-w-0">
            <p className="text-[16px] font-medium leading-[24px] tracking-[0.15px] text-wb-white truncate">
              {boxName}
            </p>
            <p className="text-[12px] leading-[20px] tracking-[0.25px] text-wb-primary truncate">
              {boxMembers}
            </p>
          </div>
        </div>

        {/* 초대자 + 버튼 */}
        <div className="flex items-center h-[30px]">
          <ProfileIcon variant="list" />
          <span className="flex-1 ml-[10px] text-[14px] leading-[20px] text-wb-grey-02 truncate">
            초대자: {inviterName}
          </span>
          <div className="flex items-center gap-[7px]">
            <ActionButton label="수락" color="green" onClick={onAccept} />
            <ActionButton label="거절" color="dark" onClick={onReject} />
          </div>
        </div>
      </div>
    );
  }

  // ── status variant ──
  const { userName, boxName, status, onAction, className } = props;
  const [expanded, setExpanded] = useState(false);
  return (
    <div className={`flex items-center gap-[16px] py-[5px] ${className ?? ''}`}>
      <ProfileIcon variant="list" />
      <button
        type="button"
        className="flex-1 min-w-0 text-left cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <p className={`text-[14px] leading-[20px] text-wb-white ${expanded ? '' : 'truncate'}`}>
          {userName} 님에게 {boxName} 참가 요청
        </p>
        <p className="text-[11px] leading-[16px] text-wb-grey-02 mt-[2px]">
          상태: {status === 'pending' ? '대기중' : '거절'}
        </p>
      </button>
      <ActionButton
        label={status === 'pending' ? '취소' : '삭제'}
        color={status === 'pending' ? 'dark' : 'red'}
        onClick={onAction}
      />
    </div>
  );
}
