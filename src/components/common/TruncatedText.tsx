'use client';

import { useLayoutEffect, useRef, useState } from 'react';

interface TruncatedTextProps {
  /** 원본 텍스트 */
  text: string;
  /**
   * 잘림 표시 문자
   * @default ".."
   */
  ellipsis?: string;
  className?: string;
}

/**
 * 커스텀 ellipsis로 한 줄 truncate.
 * CSS `text-overflow: ellipsis`는 "…" / "..."만 지원하므로,
 * 커스텀 문자열("..", "··" 등)을 쓰려면 JS 측정이 필요.
 *
 * 동작: 부모 너비를 측정 → 보이지 않는 측정용 span으로 후보 길이 binary search →
 * 들어가는 가장 긴 prefix + ellipsis 로 표시.
 *
 * 주의: 부모(컨테이너)가 width를 가져야 측정 가능 — 보통 `w-full` + 부모가 너비 고정.
 */
export default function TruncatedText({ text, ellipsis = '..', className }: TruncatedTextProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const measureRef = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(text);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const measure = measureRef.current;
    if (!container || !measure) return;

    const compute = () => {
      const maxWidth = container.clientWidth;
      if (maxWidth === 0) return;

      // 1) 풀 텍스트로 측정 — 들어가면 그대로
      measure.textContent = text;
      if (measure.scrollWidth <= maxWidth) {
        setDisplay(text);
        return;
      }

      // 2) Binary search: 가장 긴 prefix + ellipsis 가 들어가는 길이
      let lo = 0;
      let hi = text.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi + 1) / 2);
        measure.textContent = text.slice(0, mid) + ellipsis;
        if (measure.scrollWidth <= maxWidth) lo = mid;
        else hi = mid - 1;
      }
      setDisplay(lo > 0 ? text.slice(0, lo) + ellipsis : ellipsis);
    };

    compute();

    // 너비 변동 대응 (부모 폭이 변할 수 있는 환경)
    const ro = new ResizeObserver(() => compute());
    ro.observe(container);
    return () => ro.disconnect();
  }, [text, ellipsis]);

  return (
    <span
      ref={containerRef}
      className={`relative block overflow-hidden whitespace-nowrap ${className ?? ''}`}
    >
      {/* 화면 밖에 위치한 측정 전용 span — 부모와 동일한 폰트 스타일 상속 */}
      <span
        ref={measureRef}
        aria-hidden
        className="invisible absolute top-0 left-0 whitespace-nowrap pointer-events-none"
      />
      {display}
    </span>
  );
}
