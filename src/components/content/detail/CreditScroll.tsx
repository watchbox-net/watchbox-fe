'use client';

import HorizontalScroll from '@/components/common/HorizontalScroll';
import DetailPersonCreditCard from '@/components/content/detail/DetailPersonCreditCard';
import type { Cast, Crew } from '@/types/credit';

/** 한 줄에 노출할 최대 인원 — 응답에서 가장 먼저 오는 N명 사용 */
const MAX_PER_LINE = 7;

interface CreditScrollProps {
  /** 출연 (1번째 줄) */
  cast: Cast[] | null;
  /** 제작 (2번째 줄) */
  crew: Crew[] | null;
  /** 가로 스크롤 위치 보존용 키 */
  scrollKey: string;
  className?: string;
}

/**
 * 출연/제작 가로 스크롤 — 두 줄이 함께 움직이는 한 세트
 * - 1줄: cast 처음 7명
 * - 2줄: crew 처음 7명
 * - 두 줄이 동일한 가로 스크롤을 공유 (한 컨테이너 내부에 flex-col로 쌓임)
 */
export default function CreditScroll({ cast, crew, scrollKey, className }: CreditScrollProps) {
  const castItems = (cast ?? []).slice(0, MAX_PER_LINE);
  const crewItems = (crew ?? []).slice(0, MAX_PER_LINE);

  if (castItems.length === 0 && crewItems.length === 0) return null;

  return (
    <HorizontalScroll scrollKey={scrollKey} className={className}>
      {/* inline-flex + flex-col → 자식 너비 max만큼 가로 확장 → 부모가 가로 스크롤 처리 */}
      <div className="inline-flex flex-col gap-[20px] px-[16px] pt-[12px]">
        {castItems.length > 0 && (
          <div className="flex gap-[10px]">
            {castItems.map((p) => (
              <DetailPersonCreditCard
                key={`cast-${p.tmdbId}`}
                tmdbId={p.tmdbId}
                profilePath={p.profilePath}
                name={p.name}
                subText={p.character}
              />
            ))}
          </div>
        )}
        {crewItems.length > 0 && (
          <div className="flex gap-[10px]">
            {crewItems.map((p) => (
              <DetailPersonCreditCard
                key={`crew-${p.tmdbId}`}
                tmdbId={p.tmdbId}
                profilePath={p.profilePath}
                name={p.name}
                subText={crewSubText(p)}
              />
            ))}
          </div>
        )}
      </div>
    </HorizontalScroll>
  );
}

/** Crew의 2번째 줄 — departmentList(이 작품에서의 역할) join */
function crewSubText(c: Crew): string | null {
  if (!c.departmentList || c.departmentList.length === 0) return null;
  return c.departmentList.join(', ');
}
