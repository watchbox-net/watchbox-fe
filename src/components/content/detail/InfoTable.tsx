'use client';

export interface InfoRow {
  label: string;
  value: string | null | undefined;
}

interface InfoTableProps {
  rows: InfoRow[];
  className?: string;
}

/**
 * 상세 정보 라벨/값 표
 * - 영화: 제목 / 원제 / 개봉 / 장르 / 러닝타임 / 국가 / 제작사 / 플랫폼
 * - TV:   제목 / 원제 / 방송 기간 / 장르 / 시즌 수 / 국가 / 제작사 / 플랫폼
 */
export default function InfoTable({ rows, className }: InfoTableProps) {
  const visibleRows = rows.filter((r) => !!r.value);

  return (
    <div className={`flex flex-col gap-[10px] px-[20px] pt-[20px] ${className ?? ''}`}>
      {visibleRows.map((row) => (
        <div key={row.label} className="flex gap-[20px]">
          <span className="w-[60px] shrink-0 text-[14px] text-wb-grey-03">{row.label}</span>
          <span className="text-[14px] text-wb-white-02 break-keep">{row.value}</span>
        </div>
      ))}
    </div>
  );
}
