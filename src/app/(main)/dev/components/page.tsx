'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header, { type HeaderVariant } from '@/components/common/Header';
import BottomNav from '@/components/common/BottomNav';

// ─── BottomNav 데모 ────────────────────────────────────────
const DEMO_PATHS = ['/', '/search', '/box', '/record', '/my'] as const;
const DEMO_LABELS = ['홈', '검색', '박스', '기록', '마이'] as const;

// ─── Header 데모 ───────────────────────────────────────────
const HEADER_VARIANTS: { variant: HeaderVariant; label: string }[] = [
  { variant: 'center', label: 'center' },
  { variant: 'back', label: 'back' },
  { variant: 'icon1', label: 'icon1' },
  { variant: 'icon1-back', label: 'icon1 & back' },
  { variant: 'icon2', label: 'icon2' },
  { variant: 'icon2-back', label: 'icon2 & back' },
  { variant: 'search-before', label: 'search before' },
  { variant: 'search-after', label: 'search after' },
  { variant: 'search-with-header', label: 'search with header' },
  { variant: 'edit', label: 'edit' },
  { variant: 'done', label: 'done' },
];

export default function DevComponentsPage() {
  const [activePath, setActivePath] = useState('/');
  const [searchText, setSearchText] = useState('주토피아');

  return (
    <div className="min-h-screen bg-white p-6 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">WatchBox Components</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Figma Components 기반 공통 컴포넌트 시연
          </p>
        </div>
        <div className="flex gap-3 text-sm">
          <Link href="/dev/styles" className="text-blue-600 hover:underline">Styles</Link>
          <Link href="/dev" className="text-blue-600 hover:underline">Dev 홈</Link>
        </div>
      </div>

      {/* ── Header ────────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-black mb-1">Header</h2>
        <p className="text-sm text-neutral-500 mb-4">
          <code className="bg-neutral-100 px-1 rounded text-xs">{'<Header />'}</code> — 11개 variant, 페이지별 헤더 구성
        </p>

        {/* 라이브 프리뷰 — 전체 variant */}
        <div className="mx-auto w-[393px] bg-wb-dark-02 rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
          {HEADER_VARIANTS.map(({ variant, label }) => (
            <div key={variant} className="border-b border-wb-dark-04 last:border-b-0">
              <Header
                variant={variant}
                searchValue={variant === 'search-after' ? searchText : undefined}
                onSearchChange={variant === 'search-after' ? setSearchText : undefined}
                onSearchClear={variant === 'search-after' ? () => setSearchText('') : undefined}
              />
              <p className="text-[10px] text-wb-grey-01 text-center pb-1">{label}</p>
            </div>
          ))}
        </div>

        {/* 스펙 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-lg p-4 text-xs">
            <p className="font-semibold text-black mb-2">디자인 스펙</p>
            <ul className="space-y-1 text-neutral-600">
              <li>높이: <code className="bg-neutral-200 px-1 rounded">50px</code> (검색: 60px)</li>
              <li>패딩: <code className="bg-neutral-200 px-1 rounded">px-10</code> <code className="bg-neutral-200 px-1 rounded">py-12</code></li>
              <li>타이틀: <code className="bg-neutral-200 px-1 rounded">wb-header-title</code> 16px/Bold</li>
              <li>타이틀 색상: <code className="bg-neutral-200 px-1 rounded">wb-grey-04</code> #D9D9D9</li>
              <li>편집/완료: <code className="bg-neutral-200 px-1 rounded">wb-header-edit</code> 14px/Medium</li>
              <li>편집/완료 색상: <code className="bg-neutral-200 px-1 rounded">wb-primary</code> #F59E0B</li>
              <li>아이콘: 24×24px, <code className="bg-neutral-200 px-1 rounded">wb-grey-04</code></li>
              <li>알림↔검색 간격: 15px</li>
              <li>검색바: <code className="bg-neutral-200 px-1 rounded">wb-dark-05</code> h-36 rounded-10</li>
              <li>검색 아이콘: 17×17px, <code className="bg-neutral-200 px-1 rounded">wb-grey-02</code></li>
              <li>검색 텍스트: 15px/Regular, <code className="bg-neutral-200 px-1 rounded">wb-grey-02</code></li>
            </ul>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 text-xs">
            <p className="font-semibold text-black mb-2">사용법</p>
            <pre className="overflow-x-auto text-neutral-700 whitespace-pre-wrap">{`import Header from
  '@/components/common/Header';

// 기본 (center)
<Header />

// 뒤로가기 + 아이콘 2개
<Header
  variant="icon2-back"
  onBack={() => router.back()}
  onAlarm={() => {}}
  onSearch={() => {}}
/>

// 검색 입력
<Header
  variant="search-after"
  searchValue={query}
  onSearchChange={setQuery}
  onSearchClear={() => setQuery('')}
  onBack={() => router.back()}
/>

// 편집 모드
<Header variant="edit" onEdit={...} />
<Header variant="done"
  onBack={...} onDone={...} />`}</pre>
          </div>
        </div>
      </section>

      {/* ── Bottom Navigation Bar ─────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-black mb-1">Bottom Navigation Bar</h2>
        <p className="text-sm text-neutral-500 mb-4">
          <code className="bg-neutral-100 px-1 rounded text-xs">{'<BottomNav />'}</code> — 5개 탭, 현재 경로 기반 활성 상태 자동 감지
        </p>

        {/* 경로 시뮬레이터 */}
        <div className="flex flex-wrap gap-2 mb-6">
          <span className="text-xs text-neutral-500 py-1">활성 탭 시뮬레이션:</span>
          {DEMO_PATHS.map((path, i) => (
            <button
              key={path}
              onClick={() => setActivePath(path)}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                activePath === path
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-neutral-300 hover:border-neutral-500'
              }`}
            >
              {DEMO_LABELS[i]} ({path})
            </button>
          ))}
        </div>

        {/* 라이브 프리뷰 (모바일 프레임) */}
        <div className="mx-auto w-[393px] bg-neutral-100 rounded-2xl overflow-hidden shadow-lg border border-neutral-200">
          {/* 가상 컨텐츠 영역 */}
          <div className="h-60 flex items-center justify-center bg-wb-dark-02">
            <p className="text-wb-grey-02 text-sm">
              현재 경로: <span className="text-wb-white font-semibold">{activePath}</span>
            </p>
          </div>
          {/* BottomNav */}
          <BottomNav overridePathname={activePath} />
        </div>

        {/* 스펙 */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-neutral-50 rounded-lg p-4 text-xs">
            <p className="font-semibold text-black mb-2">디자인 스펙</p>
            <ul className="space-y-1 text-neutral-600">
              <li>배경: <code className="bg-neutral-200 px-1 rounded">wb-dark-01</code> #101010</li>
              <li>활성 색상: <code className="bg-neutral-200 px-1 rounded">wb-white</code> #FFFFFF</li>
              <li>비활성 색상: <code className="bg-neutral-200 px-1 rounded">wb-dark-05</code> #353535</li>
              <li>아이콘: 22×22px (active=solid, inactive=outline)</li>
              <li>라벨: <code className="bg-neutral-200 px-1 rounded">wb-menu-bottombar</code> 11px/Regular</li>
              <li>높이: 72px (하단 패딩 10px)</li>
              <li>아이콘↔라벨 간격: 8px</li>
            </ul>
          </div>
          <div className="bg-neutral-50 rounded-lg p-4 text-xs">
            <p className="font-semibold text-black mb-2">사용법</p>
            <pre className="overflow-x-auto text-neutral-700">{`import BottomNav from '@/components/common/BottomNav';

// 레이아웃에 배치 (pathname 자동 감지)
<main>{children}</main>
<BottomNav />

// 탭 5개: 홈(/), 검색(/search),
//   박스(/box), 기록(/record), 마이(/my)
// 활성: solid 아이콘 + white 텍스트
// 비활성: outline 아이콘 + dark-05 텍스트`}</pre>
          </div>
        </div>
      </section>
    </div>
  );
}
