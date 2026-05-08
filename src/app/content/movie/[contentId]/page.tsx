'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomNav from '@/components/common/BottomNav';
import { useLastMainPath } from '@/lib/hooks/useLastMainPath';
import Toast from '@/components/common/Toast';
import DetailBackdrop from '@/components/content/detail/DetailBackdrop';
import DetailPosterTitle from '@/components/content/detail/DetailPosterTitle';
import OverviewBlock from '@/components/content/detail/OverviewBlock';
import ContentActionBar from '@/components/content/detail/ContentActionBar';
import DetailCategoryTitle from '@/components/list/DetailCategoryTitle';
import InfoTable, { type InfoRow } from '@/components/content/detail/InfoTable';
import CreditScroll from '@/components/content/detail/CreditScroll';
import BackdropGallery from '@/components/content/detail/BackdropGallery';
import { fetchContentDetail } from '@/lib/api/content';
import { TMDB_POSTER, formatIsoDate } from '@/lib/utils/content';
import type { ContentDetailResponse, MovieInfo } from '@/types/content-detail';
import type { WatchStatus } from '@/types/content-summary';

export default function MovieDetailPage() {
  const router = useRouter();
  const params = useParams();
  const tmdbId = Number(params.contentId);

  const [detail, setDetail] = useState<ContentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 액션 상태
  const [liked, setLiked] = useState(false);
  const [recordId, setRecordId] = useState<number | null>(null);
  const [watchStatus, setWatchStatus] = useState<WatchStatus | null>(null);

  // BottomNav 활성 경로 — useSyncExternalStore로 hydration 안전 처리
  const lastMainPath = useLastMainPath();

  // 토스트
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (msg: string) => setToast({ visible: true, message: msg });

  useEffect(() => {
    fetchContentDetail('MOVIE', tmdbId)
      .then((res) => {
        setDetail(res);
        setLiked(res.memberRecord?.liked === true);
        setRecordId(res.memberRecord?.recordId ?? null);
        setWatchStatus(res.memberRecord?.watchStatus ?? null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [tmdbId]);

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

  const m = detail.contentInfo as MovieInfo;
  const posterUrl = m.posterPath ? `${TMDB_POSTER.md}${m.posterPath}` : null;

  // 메타 텍스트: "2025 · 모험, 애니메이션 · 108분"
  const metaText = [
    m.year,
    m.genreList?.join(', '),
    m.runtime ? `${m.runtime}분` : null,
  ].filter(Boolean).join(' · ');

  // 상세 정보 행
  const infoRows: InfoRow[] = [
    { label: '제목',     value: m.titleKo },
    { label: '원제',     value: m.titleOriginal },
    { label: '개봉',     value: formatIsoDate(m.releaseDate) },
    { label: '장르',     value: m.genreList?.join(', ') ?? null },
    { label: '러닝타임', value: m.runtime != null ? `${m.runtime}분` : null },
    { label: '국가',     value: m.originCountry },
    // 제작사: BE 보류
    { label: '플랫폼',   value: m.watchProviderList?.join(', ') ?? null },
  ];

  const credit = m.personCredit;

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* 백드롭 + 뒤로가기 */}
        <DetailBackdrop backdropPath={m.backdropPath} />

        {/* 포스터 + 제목/메타 */}
        <DetailPosterTitle
          posterPath={m.posterPath}
          titleKo={m.titleKo}
          titleOriginal={m.titleOriginal}
          metaText={metaText}
        />

        {/* 줄거리 */}
        <OverviewBlock overview={m.overview} />

        {/* 액션 바 (좋아요/박스/시청상태) */}
        <ContentActionBar
          mediaType="MOVIE"
          tmdbId={tmdbId}
          liked={liked}
          watchStatus={watchStatus}
          recordId={recordId}
          sheetContent={{
            posterSrc: posterUrl,
            title: m.titleKo,
            year: m.year,
            genres: m.genreList,
          }}
          onLikedChange={setLiked}
          onWatchStatusChange={setWatchStatus}
          onRecordIdRefresh={setRecordId}
          showToast={showToast}
        />

        {/* 상세 정보 */}
        <DetailCategoryTitle title="상세 정보" line />
        <InfoTable rows={infoRows} />

        {/* 출연/제작 */}
        {credit && ((credit.castList?.length ?? 0) > 0 || (credit.crewList?.length ?? 0) > 0) && (
          <>
            <DetailCategoryTitle
              title="출연/제작"
              more
              line
              onMore={() => router.push(`/content/movie/${tmdbId}/credits`)}
            />
            <CreditScroll
              cast={credit.castList}
              crew={credit.crewList}
              scrollKey={`movie-credit-${tmdbId}`}
            />
          </>
        )}

        {/* 이미지 */}
        {m.backdropPathList && m.backdropPathList.length > 0 && (
          <>
            <DetailCategoryTitle
              title="이미지"
              more
              line
              onMore={() => {/* TODO: 전체 보기 페이지 */}}
            />
            <BackdropGallery paths={m.backdropPathList} max={4} />
          </>
        )}

        <div className="h-[40px]" />
      </div>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
      <BottomNav overridePathname={lastMainPath} />
    </MobileFrame>
  );
}
