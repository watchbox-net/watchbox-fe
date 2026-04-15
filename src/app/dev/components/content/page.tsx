'use client';

import Link from 'next/link';
import Poster from '@/components/content/Poster';

const SAMPLE_POSTER = 'https://image.tmdb.org/t/p/w185/ib6v6qUXzez1x2qIOLN7C0yJNPQ.jpg';

export default function ContentComponentsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / Content</h1>
      </div>

      {/* ── Poster ─────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Poster</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6">
          {/* 이미지 있을 때 */}
          <p className="text-xs font-semibold text-neutral-500 mb-3">이미지 있음</p>
          <div className="flex items-end gap-6 mb-8">
            <div className="text-center">
              <Poster src={SAMPLE_POSTER} alt="sample" size="large" />
              <p className="text-xs text-neutral-400 mt-2">large (140×199)</p>
            </div>
            <div className="text-center">
              <Poster src={SAMPLE_POSTER} alt="sample" size="medium" />
              <p className="text-xs text-neutral-400 mt-2">medium (115×163)</p>
            </div>
            <div className="text-center">
              <Poster src={SAMPLE_POSTER} alt="sample" size="small" />
              <p className="text-xs text-neutral-400 mt-2">small (60×90)</p>
            </div>
          </div>

          {/* placeholder */}
          <p className="text-xs font-semibold text-neutral-500 mb-3">이미지 없음 (placeholder)</p>
          <div className="flex items-end gap-6">
            <div className="text-center">
              <Poster size="large" />
              <p className="text-xs text-neutral-400 mt-2">large</p>
            </div>
            <div className="text-center">
              <Poster size="medium" />
              <p className="text-xs text-neutral-400 mt-2">medium</p>
            </div>
            <div className="text-center">
              <Poster size="small" />
              <p className="text-xs text-neutral-400 mt-2">small</p>
            </div>
          </div>
        </div>

        {/* 스펙 */}
        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>large — 140×199px, rounded-[10px]</p>
          <p>medium — 115×163px, rounded-[10px]</p>
          <p>small — 60×90px, rounded-[5px]</p>
          <p>이미지 없으면 bg-neutral-700 placeholder</p>
        </div>
      </section>
    </div>
  );
}
