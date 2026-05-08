'use client';

import { useState } from 'react';
import DetailCategoryTitle from '@/components/list/DetailCategoryTitle';
import SpreadActionLine from '@/components/common/SpreadActionLine';
import PersonCreditItem from '@/components/content/detail/PersonCreditItem';
import type { Cast, Crew } from '@/types/credit';

/** 더보기 클릭 시 추가로 노출할 개수 */
const STEP = 10;

type CastListProps = {
  kind: 'cast';
  items: Cast[];
  initialCount: number;
  /** 헤더 제목 — default: "출연" */
  title?: string;
};

type CrewListProps = {
  kind: 'crew';
  items: Crew[];
  initialCount: number;
  /** 헤더 제목 — default: "제작" */
  title?: string;
};

type PersonCreditListProps = CastListProps | CrewListProps;

/**
 * Person Credit List — 출연/제작 더보기 화면의 한 섹션
 *
 * 피그마: Person Credit List Set (cast / crew)
 * - 헤더: title + line
 * - 본문: PersonCreditItem 수직 나열
 * - 하단: 더보기/접기 토글 (10개씩 추가 / 전부 노출 시 접기)
 */
export default function PersonCreditList(props: PersonCreditListProps) {
  const { kind, items, initialCount } = props;
  const titleText = props.title ?? (kind === 'cast' ? '출연' : '제작');

  const [count, setCount] = useState(initialCount);

  if (!items || items.length === 0) return null;

  const visible = items.slice(0, count);
  const isAllShown = count >= items.length;

  return (
    <section>
      <DetailCategoryTitle title={titleText} line />

      <div className="flex flex-col">
        {visible.map((p) => (
          <PersonCreditItem
            key={`${kind}-${p.tmdbId}`}
            tmdbId={p.tmdbId}
            profilePath={p.profilePath}
            name={p.name}
            subText={
              kind === 'cast'
                ? (p as Cast).character
                : crewSubText(p as Crew)
            }
          />
        ))}
      </div>

      {items.length > initialCount && (
        <SpreadActionLine
          expanded={isAllShown}
          onToggle={() => {
            if (isAllShown) {
              setCount(initialCount);
            } else {
              setCount((c) => Math.min(c + STEP, items.length));
            }
          }}
        />
      )}
    </section>
  );
}

/** Crew 부제 — departmentList 우선 */
function crewSubText(c: Crew): string | null {
  if (!c.departmentList || c.departmentList.length === 0) {
    return c.knownForDepartment;
  }
  return c.departmentList.join(', ');
}
