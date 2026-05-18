'use client';

import { useRouter } from 'next/navigation';

/**
 * 프리뷰 모드 하단 그라데이션 페이드 + 로그인 CTA
 * 비로그인 상태에서 샘플 데이터 위에 오버레이로 표시
 */
export default function PreviewOverlay() {
  const router = useRouter();

  return (
    <>
      {/* 그라데이션 오버레이 */}
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[300px] bg-gradient-to-b from-transparent to-wb-dark-01" />

      {/* 로그인 CTA - BottomNav(63px) 바로 위에 viewport 기준 고정, 모바일 프레임 폭에 맞춤 */}
      <div className="fixed bottom-[63px] left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex flex-col items-center gap-[12px] bg-wb-dark-03 px-[20px] pb-[24px] pt-[16px]">
        <p className="text-[15px] text-wb-grey-03 text-center">
          샘플 화면입니다
          <br />
          로그인하여 시작해 보세요
        </p>
        <button
          type="button"
          onClick={() => router.push('/login')}
          className="w-full h-[48px] bg-wb-primary rounded-[10px] text-[15px] font-bold text-wb-white-01"
        >
          로그인
        </button>
      </div>
    </>
  );
}
