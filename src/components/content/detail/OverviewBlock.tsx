'use client';

import { useState } from 'react';

interface OverviewBlockProps {
  overview: string | null;
  /** 줄임 임계 문자수 (default 100) */
  threshold?: number;
}

/**
 * 줄거리 영역 — 임계 문자수 초과 시 "더보기/접기" 토글
 */
export default function OverviewBlock({ overview, threshold = 100 }: OverviewBlockProps) {
  const [expanded, setExpanded] = useState(false);

  if (!overview) return null;
  const needsExpansion = overview.length > threshold;

  return (
    <div className="px-[16px] mt-[20px]">
      <p className="text-[13px] font-medium leading-[22px] text-wb-grey-04">
        {expanded || !needsExpansion ? overview : `${overview.slice(0, threshold)}...`}
        {needsExpansion && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            className="text-wb-white-01 ml-[4px] cursor-pointer"
          >
            {expanded ? '접기' : '더보기'}
          </button>
        )}
      </p>
    </div>
  );
}
