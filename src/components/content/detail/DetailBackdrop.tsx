'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ChevronLeftOutline } from '@/components/icons';
import { TMDB_BACKDROP } from '@/lib/utils/content';

interface DetailBackdropProps {
  backdropPath: string | null;
  height?: number;
}

/**
 * 상세 페이지 백드롭 영역 + 좌상단 뒤로가기 버튼
 */
export default function DetailBackdrop({ backdropPath, height = 230 }: DetailBackdropProps) {
  const router = useRouter();
  const backdropUrl = backdropPath ? `${TMDB_BACKDROP.md}${backdropPath}` : null;

  return (
    <div className="relative bg-wb-dark-03 shrink-0" style={{ height }}>
      {backdropUrl ? (
        <Image src={backdropUrl} alt="" fill className="object-cover" />
      ) : (
        <div className="w-full h-full bg-wb-dark-03" />
      )}
      <div className="absolute inset-0 from-black/40 via-transparent to-black/20" />
      <button
        type="button"
        onClick={() => router.back()}
        className="absolute top-3 left-3 cursor-pointer"
      >
        <ChevronLeftOutline className="size-6 text-wb-white-02" />
      </button>
    </div>
  );
}
