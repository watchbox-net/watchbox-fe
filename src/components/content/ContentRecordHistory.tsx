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

/** 시청 상태 → 텍스트 색상 (WatchStatusIcon 색상과 동일) */
const WATCH_STATUS_COLOR: Record<Exclude<WatchStatus, 'none' | 'outline'>, string> = {
  completed: 'text-wb-green',
  watching: 'text-wb-orange',
  planned: 'text-wb-purple',
  paused: 'text-wb-grey-02',
};

/** 삭제/해제 newValue 색상 — 기록 삭제(없음) & 좋아요 취소 공통 */
const REMOVED_COLOR = 'text-wb-grey-01';

export type ContentRecordHistoryType =
  | 'status-registered' // 시청 상태 첫 등록 (1줄, "등록 : {값}")
  | 'status-changed'    // 등록된 상태 변경 (2줄, "{old} → {new}")
  | 'like'
  | 'like-removed';
type IconStatus = Exclude<WatchStatus, 'none' | 'outline'>;

export interface ContentRecordHistoryItem {
  /** 콘텐츠(영화/시리즈) 포스터 이미지 URL */
  posterUrl?: string | null;
  /** 콘텐츠명 */
  contentTitle: string;
  /** 기록 종류 */
  type: ContentRecordHistoryType;
  /** status-changed일 때 변경 전 상태 (없으면 '없음') */
  oldStatus?: IconStatus;
  /** status-* 일 때 시청 상태 (아이콘 + 라벨; 없으면 '없음') */
  watchStatus?: IconStatus;
  /** 백엔드로부터 받은 시행 일시 (예: "2026-06-01 19:17:51") */
  date: string;
}

interface ContentRecordHistoryProps {
  item: ContentRecordHistoryItem;
  /** 포스터/텍스트 클릭 시 (상세 이동 등). 날짜·아이콘은 제외 */
  onContentClick?: () => void;
}

/** 시청 상태 라벨 (없으면 '없음') */
function statusLabel(s?: IconStatus): string {
  return s ? WATCH_STATUS_LABEL[s] : '없음';
}

/** 시청 상태 라벨 — 상태 색상 적용 (없으면 = 기록 삭제 색상) */
function StatusValue({ status }: { status?: IconStatus }) {
  return (
    <span className={status ? WATCH_STATUS_COLOR[status] : REMOVED_COLOR}>
      {statusLabel(status)}
    </span>
  );
}

/** 시청 기록 히스토리 — 개별 항목 (포스터 + 내용 + 시청상태/좋아요 아이콘) */
export default function ContentRecordHistory({ item, onContentClick }: ContentRecordHistoryProps) {
  const { posterUrl, contentTitle, type, oldStatus, watchStatus, date } = item;
  const isStatus = type === 'status-registered' || type === 'status-changed';
  const clickableClass = onContentClick ? 'cursor-pointer' : '';

  return (
    <div className="flex items-center px-[16px]">
      <div className="flex flex-1 items-center gap-[10px] min-w-0">
        {/* 포스터 (Figma TriplePoster small — 32.65×46.31, ratio 0.706 유지) — 클릭 시 상세 이동 */}
        <div
          className={`w-[33px] h-[47px] rounded-[4px] overflow-hidden shrink-0 ${clickableClass}`}
          onClick={onContentClick}
        >
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
          {/* 메시지 영역 — 클릭 시 상세 이동 (날짜는 제외) */}
          <div className={clickableClass} onClick={onContentClick}>
            {type === 'status-changed' ? (
              // 시청 상태 변경 — 2줄, line-height 18 (newValue만 상태 색상)
              <div className="text-[14px] leading-[18px] text-white break-keep [overflow-wrap:anywhere]">
                <p>
                  <span className="font-semibold">{contentTitle}</span>의 시청 상태 변경
                </p>
                <p>
                  {statusLabel(oldStatus)} → <StatusValue status={watchStatus} />
                </p>
              </div>
            ) : (
              // 시청 상태 등록 / 좋아요 등록 / 좋아요 취소 — 1줄
              <p className="text-[14px] leading-none text-white break-keep [overflow-wrap:anywhere]">
                <span className="font-medium">{contentTitle}</span>
                {type === 'status-registered' ? (
                  <>의 시청 상태 등록 : <StatusValue status={watchStatus} /></>
                ) : (
                  <>
                    의{' '}
                    <span className={type === 'like' ? 'text-wb-red' : REMOVED_COLOR}>
                      좋아요
                    </span>{' '}
                    {type === 'like' ? '등록' : '취소'}
                  </>
                )}
              </p>
            )}
          </div>
          <p className="text-[11px] leading-none font-medium text-wb-grey-03 whitespace-nowrap">
            {date}
          </p>
        </div>

        {/* 우측 아이콘 (medium) */}
        {isStatus ? (
          <WatchStatusIcon status={watchStatus ?? 'none'} size="medium" className="shrink-0" />
        ) : (
          <LikeIcon active={type === 'like'} size="medium" className="shrink-0" />
        )}
      </div>
    </div>
  );
}
