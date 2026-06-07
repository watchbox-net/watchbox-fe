import Image from 'next/image';
import ProfileIcon from '@/components/icons/ProfileIcon';

export interface BoxContentUpdateHistoryItem {
  /** 멤버 프로필 이미지 URL (없으면 기본 아이콘) */
  profileImageUrl?: string | null;
  /** 백엔드로부터 받은 내용 텍스트 (예: "{사용자명}님이 {컨텐츠명}을 박스에 추가") */
  content: string;
  /** 백엔드로부터 받은 시행 날짜 (예: "2026-06-01") */
  date: string;
}

interface BoxContentUpdateHistoryProps {
  item: BoxContentUpdateHistoryItem;
}

/** 박스 컨텐츠 변경 히스토리 — 개별 항목 (멤버 이미지 + 내용 + 날짜) */
export default function BoxContentUpdateHistory({ item }: BoxContentUpdateHistoryProps) {
  const { profileImageUrl, content, date } = item;

  return (
    <div className="flex items-center px-[16px]">
      <div className="flex flex-1 items-center gap-[10px] min-w-0">
        {/* 멤버 프로필 이미지 또는 기본 아이콘 */}
        {profileImageUrl ? (
          <Image
            src={profileImageUrl}
            alt=""
            width={28}
            height={28}
            className="size-[28px] rounded-full object-cover shrink-0"
          />
        ) : (
          <ProfileIcon variant="list" className="shrink-0" />
        )}

        {/* 내용 + 날짜 */}
        <div className="flex flex-1 flex-col gap-[7px] min-w-0">
          <p className="text-[14px] leading-none text-white break-keep [overflow-wrap:anywhere]">
            {content}
          </p>
          <p className="text-[11px] leading-none font-medium text-wb-grey-03 whitespace-nowrap">
            {date}
          </p>
        </div>
      </div>
    </div>
  );
}
