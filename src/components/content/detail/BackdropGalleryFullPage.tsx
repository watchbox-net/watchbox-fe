'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomNav from '@/components/common/BottomNav';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import DetailCategoryTitle from '@/components/list/DetailCategoryTitle';
import BackdropGallery from '@/components/content/detail/BackdropGallery';
import { useLastMainPath } from '@/lib/hooks/useLastMainPath';
import { fetchContentDetail } from '@/lib/api/content';
import type {
  ContentDetailResponse,
  MovieInfo,
  TvInfo,
} from '@/types/content-detail';

interface BackdropGalleryFullPageProps {
  /** 영화/TV 구분 */
  mediaType: 'MOVIE' | 'TV';
}

/**
 * 영화/TV 상세 → "이미지 더보기" 화면 공통 구현
 *
 * - 모든 backdropPath를 2-column 그리드로 노출
 * - 헤더: 뒤로가기 + 작품 제목
 */
export default function BackdropGalleryFullPage({
  mediaType,
}: BackdropGalleryFullPageProps) {
  const params = useParams();
  const tmdbId = Number(params.contentId);

  const [detail, setDetail] = useState<ContentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const lastMainPath = useLastMainPath();

  useEffect(() => {
    fetchContentDetail(mediaType, tmdbId)
      .then(setDetail)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [mediaType, tmdbId]);

  if (loading) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-wb-grey-03">불러오는 중...</p>
        </div>
        <BottomNav overridePathname={lastMainPath} />
      </MobileFrame>
    );
  }

  if (error || !detail) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-wb-grey-03">오류가 발생했습니다.</p>
        </div>
        <BottomNav overridePathname={lastMainPath} />
      </MobileFrame>
    );
  }

  const info = detail.contentInfo as MovieInfo | TvInfo;
  const headerTitle =
    mediaType === 'MOVIE' ? (info as MovieInfo).titleKo : (info as TvInfo).nameKo;
  const paths = info.backdropPathList ?? [];

  return (
    <MobileFrame>
      <Header variant="back" title={headerTitle} />

      <MainContent>
        <DetailCategoryTitle title="이미지" line />

        {paths.length > 0 ? (
          <BackdropGallery paths={paths} max={paths.length} className="pt-[12px]" />
        ) : (
          <p className="text-center text-wb-grey-03 py-[40px] text-[14px]">
            이미지가 없습니다.
          </p>
        )}

        <div className="h-[40px]" />
      </MainContent>

      <BottomNav overridePathname={lastMainPath} />
    </MobileFrame>
  );
}
