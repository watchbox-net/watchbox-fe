'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import pkg from '../../../package.json';

const SPLASH_KEY = 'splash-last-shown-at';
const SPLASH_INTERVAL_MS = 3 * 60 * 60 * 1000; // 3시간
const MIN_DISPLAY_MS = 1200;
const FADE_MS = 400;

/** 3시간마다 1회 스플래시 오버레이 */
export default function Splash() {
  const [phase, setPhase] = useState<'hidden' | 'visible' | 'fading' | 'done'>('hidden');

  useEffect(() => {
    const now = Date.now();
    const last = Number(localStorage.getItem(SPLASH_KEY) ?? 0);

    if (now - last < SPLASH_INTERVAL_MS) {
      setPhase('done');
      return;
    }

    // 3시간 경과 → 스플래시 표시
    setPhase('visible');
    localStorage.setItem(SPLASH_KEY, String(now));

    const timer = setTimeout(() => {
      setPhase('fading');
      setTimeout(() => setPhase('done'), FADE_MS);
    }, MIN_DISPLAY_MS);

    return () => clearTimeout(timer);
  }, []);

  if (phase === 'hidden' || phase === 'done') return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 transition-opacity ${
        phase === 'fading' ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ transitionDuration: `${FADE_MS}ms` }}
    >
    <div className="relative w-full max-w-[430px] h-dvh bg-wb-dark-02 flex flex-col items-center justify-center">
      {/* 로고 — 화면 중앙 */}
      <Image
        src="/logo-text/LogoTextH2.5.svg"
        alt="WatchBox"
        width={206}
        height={43}
        priority
      />

      {/* 버전 — 하단 고정 */}
      <span className="absolute bottom-[60px] text-[13px] text-wb-grey-03 tracking-[0.25px]">
        {pkg.version}
      </span>
    </div>
    </div>
  );
}
