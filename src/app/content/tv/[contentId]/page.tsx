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
import { TMDB_POSTER, formatAirRange } from '@/lib/utils/content';
import type { ContentDetailResponse, TvInfo } from '@/types/content-detail';
import type { WatchStatus } from '@/types/content-summary';

/** "2010-2022" / "2024-" / "2024" 형태 메타용 표시 */
function formatYearRange(first: number | null, last: number | null): string {
  if (first == null && last == null) return '';
  if (first == null) return String(last);
  if (last == null) return `${first}-`;
  if (first === last) return String(first);
  return `${first}-${last}`;
}

export default function TvDetailPage() {
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
  const [hasAddedInbox, setHasAddedInbox] = useState(false);

  const lastMainPath = useLastMainPath();

  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (msg: string) => setToast({ visible: true, message: msg });

  useEffect(() => {
    fetchContentDetail('TV', tmdbId)
      .then((res) => {
        setDetail(res);
        setLiked(res.memberRecord?.liked === true);
        setRecordId(res.memberRecord?.recordId ?? null);
        setWatchStatus(res.memberRecord?.watchStatus ?? null);
        setHasAddedInbox(res.hasAddedInbox);
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

  const t = detail.contentInfo as TvInfo;
  const posterUrl = t.posterPath ? `${TMDB_POSTER.md}${t.posterPath}` : null;

  // 메타: "2010-2022 · 액션, 어드벤처, 드라마" (TV 장르 최대 3개)
  const metaText = [
    formatYearRange(t.firstYear, t.lastYear),
    t.genreList?.slice(0, 3).join(', '),
  ].filter(Boolean).join(' · ');

  // 상세 정보 행
  const infoRows: InfoRow[] = [
    { label: '제목',     value: t.nameKo },
    { label: '원제',     value: t.nameOriginal },
    { label: '방송 기간', value: formatAirRange(t.firstAirDate, t.lastAirDate) || null },
    { label: '장르',     value: t.genreList?.join(', ') ?? null },
    { label: '시즌 수',   value: t.numberOfSeasons != null ? `${t.numberOfSeasons}` : null },
    { label: '국가',     value: t.originCountry },
    // 제작사: BE 보류
    { label: '플랫폼',   value: t.watchProviderList?.join(', ') ?? null },
  ];

  const credit = t.personCredit;

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <DetailBackdrop backdropPath={t.backdropPath} />

        <DetailPosterTitle
          posterPath={t.posterPath}
          titleKo={t.nameKo}
          titleOriginal={t.nameOriginal}
          metaText={metaText}
        />

        <OverviewBlock overview={t.overview} />

        <ContentActionBar
          mediaType="TV"
          tmdbId={tmdbId}
          liked={liked}
          watchStatus={watchStatus}
          recordId={recordId}
          sheetContent={{
            posterSrc: posterUrl,
            title: t.nameKo,
            year: t.firstYear,
            genres: t.genreList,
          }}
          hasAddedInbox={hasAddedInbox}
          onLikedChange={setLiked}
          onWatchStatusChange={setWatchStatus}
          onRecordIdRefresh={setRecordId}
          onHasAddedInboxChange={setHasAddedInbox}
          showToast={showToast}
        />

        <DetailCategoryTitle title="상세 정보" line />
        <InfoTable rows={infoRows} />

        {/* 역대 출연진/제작진 (시즌별 누적) */}
        {credit && ((credit.castList?.length ?? 0) > 0 || (credit.crewList?.length ?? 0) > 0) && (
          <>
            <DetailCategoryTitle
              title="역대 출연진/제작진"
              more
              line
              onMore={() => router.push(`/content/tv/${tmdbId}/credits`)}
            />
            <CreditScroll
              cast={credit.castList}
              crew={credit.crewList}
              scrollKey={`tv-credit-${tmdbId}`}
            />
          </>
        )}

        {/* 이미지 */}
        {t.backdropPathList && t.backdropPathList.length > 0 && (
          <>
            <DetailCategoryTitle
              title="이미지"
              more
              line
              onMore={() => router.push(`/content/tv/${tmdbId}/images`)}
            />
            <BackdropGallery paths={t.backdropPathList} max={4} />
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
