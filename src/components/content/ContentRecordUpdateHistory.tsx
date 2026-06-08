import Image from 'next/image';
import EmptyPosterImage from '@/components/content/empty/EmptyPosterImage';
import WatchStatusIcon, { type WatchStatus } from '@/components/icons/WatchStatusIcon';
import LikeIcon from '@/components/icons/LikeIcon';

/** 시청 상태 → 한국어 라벨 */
const WATCH_STATUS_LABEL: Record<Exclude<WatchStatus, 'none' | 'outline'>, string> = {
  completed: '시청 완료',
  watching: '시청중',
  planned: '시청 예정',
  paused: '시청 중단',
};

export type ContentRecordHistoryType = 'status' | 'like';

export interface ContentRecordUpdateHistoryItem {
  /** 컨텐츠(영화/시리즈) 포스터 이미지 URL */
  posterUrl?: string | null;
  /** 컨텐츠명 */
  contentTitle: string;
  /** 기록 종류 — 시청 상태 변경 / 좋아요 등록 */
  type: ContentRecordHistoryType;
  /** type이 'status'일 때 변경된 시청 상태 */
  watchStatus?: Exclude<WatchStatus, 'none' | 'outline'>;
  /** 백엔드로부터 받은 시행 날짜 (예: "2026-06-01") */
  date: string;
}

interface ContentRecordUpdateHistoryProps {
  item: ContentRecordUpdateHistoryItem;
}

/** 시청 기록 변경 히스토리 — 개별 항목 (포스터 + 내용 + 시청상태/좋아요 아이콘) */
export default function ContentRecordUpdateHistory({ item }: ContentRecordUpdateHistoryProps) {
  const { posterUrl, contentTitle, type, watchStatus = 'completed', date } = item;

  return (
    <div className="flex items-center px-[16px]">
      <div className="flex flex-1 items-center gap-[10px] min-w-0">
        {/* 포스터 (Figma TriplePoster small — 32.65×46.31, ratio 0.706 유지) */}
        <div className="w-[33px] h-[47px] rounded-[4px] overflow-hidden shrink-0">
          {posterUrl ? (
            <Image
              src={posterUrl}
              alt={contentTitle}
              width={33}
              height={47}
              className="w-full h-full object-cover"
            />
          ) : (
            <EmptyPosterImage size="xsmall" />
          )}
        </div>

        {/* 내용 + 날짜 */}
        <div className="flex flex-1 flex-col gap-[7px] min-w-0">
          <p className="text-[14px] leading-none text-white break-keep [overflow-wrap:anywhere]">
            <span className="font-bold">{contentTitle}</span>
            {type === 'like' ? (
              <span>의 좋아요 등록</span>
            ) : (
              <>
                <span>의 시청 상태를 </span>
                <span className="font-bold">{WATCH_STATUS_LABEL[watchStatus]}</span>
                <span>로 변경</span>
              </>
            )}
          </p>
          <p className="text-[11px] leading-none font-medium text-wb-grey-03 whitespace-nowrap">
            {date}
          </p>
        </div>

        {/* 우측 아이콘 (medium) */}
        {type === 'status' ? (
          <WatchStatusIcon status={watchStatus} size="medium" className="shrink-0" />
        ) : (
          <LikeIcon active size="medium" className="shrink-0" />
        )}
      </div>
    </div>
  );
}
