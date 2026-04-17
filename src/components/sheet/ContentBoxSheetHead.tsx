'use client';

interface ContentBoxSheetHeadProps {
  /** 완료 버튼 클릭 (시트 닫기) */
  onDone?: () => void;
  className?: string;
}

/**
 * Content Box Sheet 상단 헤더
 * 피그마 Content Box Sheet Head 대응
 * - 높이 50px, 상단 둥근 모서리 20px, 배경 wb-dark-04
 * - 중앙 타이틀: "박스에 추가하기"
 * - 우측 "완료" (브랜드 green)
 */
export default function ContentBoxSheetHead({
  onDone,
  className,
}: ContentBoxSheetHeadProps) {
  return (
    <div
      className={`relative h-[50px] w-full bg-wb-dark-04 rounded-t-[20px] ${className ?? ''}`}
    >
      <p className="absolute left-1/2 top-[16px] -translate-x-1/2 text-[16px] font-semibold text-white leading-none whitespace-nowrap">
        박스에 추가하기
      </p>
      <button
        type="button"
        onClick={onDone}
        className="absolute right-[25px] top-[16px] text-[14px] font-medium leading-none text-wb-green cursor-pointer"
      >
        완료
      </button>
    </div>
  );
}
