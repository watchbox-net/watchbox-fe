'use client';

interface DetailCategoryTitleProps {
  /** 좌측 카테고리 제목 (예: "상세 정보", "출연/제작", "이미지") */
  title: string;
  /** "더보기" 버튼 노출 여부 */
  more?: boolean;
  /** "더보기" 클릭 시 실행 */
  onMore?: () => void;
  /** 하단 라인 노출 여부 */
  line?: boolean;
  className?: string;
}

/**
 * 상세 페이지의 카테고리 헤더
 * 피그마: Detail Category Title (more on/off, line on/off)
 *
 * 라인 사양: 양옆 16px 패딩(컨텐츠 가로폭과 동일), 색 wb-grey-01
 */
export default function DetailCategoryTitle({
  title,
  more = false,
  onMore,
  line = false,
  className,
}: DetailCategoryTitleProps) {
  return (
    <div className={className}>
      <div className="flex items-end justify-between px-[16px]">
        <h2 className="text-[16px] font-semibold text-wb-white-01">{title}</h2>
        {more && (
          <button
            type="button"
            onClick={onMore}
            className="text-[14px] text-wb-grey-03 cursor-pointer"
          >
            더보기
          </button>
        )}
      </div>
      {line && <div className="mx-[16px] h-px bg-wb-grey-01" />}
    </div>
  );
}
