'use client';

import { useRouter } from 'next/navigation';

/**
 * 프리뷰 모드 로그인 CTA
 * 비로그인 상태에서 샘플 데이터 위에 하단 고정 오버레이로 표시
 */
export default function PreviewOverlay() {
  const router = useRouter();

  return (
    <div className="fixed bottom-[63px] left-1/2 -translate-x-1/2 w-full max-w-[430px] z-40 flex flex-col items-center gap-[12px] bg-wb-dark-03 px-[20px] pb-[24px] pt-[16px]">
      <p className="text-[15px] text-wb-grey-03 text-center">
          로그인하고 시작해 보세요
      </p>
      <button
        type="button"
        onClick={() => router.push('/login')}
        className="w-full h-[48px] bg-wb-primary rounded-[10px] text-[15px] font-bold text-wb-white-01"
      >
        로그인
      </button>
    </div>
  );
}
