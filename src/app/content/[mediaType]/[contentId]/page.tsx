'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import TabNav from '@/components/common/TabNav';
import LikeIcon from '@/components/icons/LikeIcon';
import BoxIcon from '@/components/icons/BoxIcon';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import { ChevronLeftOutline } from '@/components/icons';
import { fetchContentDetail } from '@/lib/api/content';
import type {
  ContentDetailResponse,
  ContentDetailMediaType,
  MovieInfo,
  TvInfo,
} from '@/types/content-detail';

// ─── TMDB 이미지 베이스 URL ──────────────────────────────────
const TMDB_POSTER   = 'https://image.tmdb.org/t/p/w342';
const TMDB_BACKDROP = 'https://image.tmdb.org/t/p/w780';

// ─── mediaType별 표시 정보 추출 ─────────────────────────────
function extractInfo(detail: ContentDetailResponse) {
  if (detail.mediaType === 'MOVIE') {
    const m = detail.contentInfo as MovieInfo;
    return {
      titleKo:       m.titleKo,
      titleOriginal: m.titleOriginal,
      posterPath:    m.posterPath,
      backdropPath:  m.backdropPath,
      year:          m.year,
      genreList:     m.genreList,
      overview:      m.overview,
      runtime:       m.runtime,
      infoRows: [
        { label: '제목',     value: m.titleKo },
        { label: '원제',     value: m.titleOriginal },
        { label: '연도',     value: m.year != null ? String(m.year) : null },
        { label: '장르',     value: m.genreList?.join(', ') },
        { label: '러닝타임', value: m.runtime != null ? `${m.runtime}분` : null },
      ],
    };
  } else {
    const t = detail.contentInfo as TvInfo;
    return {
      titleKo:       t.nameKo,
      titleOriginal: t.nameOriginal,
      posterPath:    t.posterPath,
      backdropPath:  t.backdropPath,
      year:          t.year,
      genreList:     t.genreList,
      overview:      t.overview,
      runtime:       null,
      infoRows: [
        { label: '제목',      value: t.nameKo },
        { label: '원제',      value: t.nameOriginal },
        { label: '연도',      value: t.year != null ? String(t.year) : null },
        { label: '장르',      value: t.genreList?.join(', ') },
        { label: '에피소드',  value: t.numberOfEpisodes != null ? `${t.numberOfEpisodes}개` : null },
        { label: '시즌',      value: t.numberOfSeasons  != null ? `${t.numberOfSeasons}개`  : null },
      ],
    };
  }
}

// ─── WatchStatus → icon status ──────────────────────────────
function toIconStatus(status: string | null | undefined) {
  if (!status || status === 'NONE') return 'none' as const;
  return status.toLowerCase() as 'completed' | 'watching' | 'planned' | 'paused';
}

// ─── 정보 행 ────────────────────────────────────────────────
function InfoRow({ label, value }: { label: string; value: string | null | undefined }) {
  if (!value) return null;
  return (
    <div className="flex gap-[20px] py-[10px]">
      <span className="w-[51px] shrink-0 text-[14px] text-wb-grey-02">{label}</span>
      <span className="text-[14px] text-wb-grey-04">{value}</span>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────
export default function ContentDetailPage() {
  const router   = useRouter();
  const params   = useParams();
  const mediaType  = (params.mediaType  as string).toUpperCase() as ContentDetailMediaType;
  const contentId  = Number(params.contentId);

  const [detail,   setDetail]   = useState<ContentDetailResponse | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // 0: 작품 정보, 1: 캐스팅

  useEffect(() => {
    fetchContentDetail(mediaType, contentId)
      .then(setDetail)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [mediaType, contentId]);

  if (loading) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-wb-grey-02">불러오는 중...</p>
        </div>
        <BottomMenu />
      </MobileFrame>
    );
  }

  if (error || !detail) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-wb-grey-02">오류가 발생했습니다.</p>
        </div>
        <BottomMenu />
      </MobileFrame>
    );
  }

  const info = extractInfo(detail);
  const { memberRecord } = detail;

  const posterUrl   = info.posterPath   ? `${TMDB_POSTER}${info.posterPath}`     : null;
  const backdropUrl = info.backdropPath ? `${TMDB_BACKDROP}${info.backdropPath}` : null;

  // 메타 한 줄: 연도 · 장르 · 러닝타임
  const metaParts = [
    info.year,
    info.genreList?.join(', '),
    info.runtime ? `${info.runtime}분` : null,
  ].filter(Boolean);

  const needsExpansion = (info.overview?.length ?? 0) > 120;

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto pb-24">

        {/* ── 백드롭 + 뒤로가기 ─────────────────────────── */}
        <div className="relative h-[230px] bg-wb-dark-03 shrink-0">
          {backdropUrl ? (
            <img
              src={backdropUrl}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-wb-dark-03" />
          )}
          {/* 어두운 그라디언트 오버레이 */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
          {/* 뒤로가기 버튼 */}
          <button
            type="button"
            onClick={() => router.back()}
            className="absolute top-3 left-3 cursor-pointer"
          >
            <ChevronLeftOutline className="size-6 text-wb-grey-04" />
          </button>
        </div>

        {/* ── 포스터 + 제목 블록 ────────────────────────── */}
        <div className="flex gap-[14px] px-[17px] mt-[16px]">
          {/* 포스터 */}
          <div className="w-[115px] h-[163px] rounded-[10px] overflow-hidden shrink-0 bg-wb-dark-03">
            {posterUrl ? (
              <img src={posterUrl} alt={info.titleKo} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-wb-dark-05" />
            )}
          </div>

          {/* 제목 정보 */}
          <div className="flex flex-col justify-center gap-[4px] min-w-0 pt-[4px]">
            <h1 className="text-[24px] font-semibold leading-[1.3] text-white break-keep">
              {info.titleKo}
            </h1>
            {info.titleOriginal && (
              <p className="text-[11px] text-wb-grey-03 truncate">{info.titleOriginal}</p>
            )}
            {metaParts.length > 0 && (
              <p className="text-[12px] text-wb-grey-03 mt-[2px]">
                {metaParts.join(' · ')}
              </p>
            )}
          </div>
        </div>

        {/* ── 줄거리 ───────────────────────────────────── */}
        {info.overview && (
          <div className="px-[16px] mt-[20px]">
            <p
              className={`text-[13px] font-medium leading-[22px] text-wb-grey-03 ${
                !expanded ? 'line-clamp-3' : ''
              }`}
            >
              {info.overview}
            </p>
            {needsExpansion && (
              <button
                type="button"
                onClick={() => setExpanded((v) => !v)}
                className="text-[13px] text-wb-grey-02 mt-[6px] cursor-pointer"
              >
                {expanded ? '접기' : '더보기'}
              </button>
            )}
          </div>
        )}

        {/* ── 액션 아이콘 3개 ──────────────────────────── */}
        <div className="flex items-start justify-around px-[20px] py-[24px]">
          {/* 좋아요 */}
          <button
            type="button"
            className="flex flex-col items-center gap-[8px] cursor-pointer"
            onClick={() => {/* TODO: 좋아요 토글 */}}
          >
            <LikeIcon size="xl" active={memberRecord?.liked ?? false} />
            <span className="text-[11px] text-wb-grey-04">좋아요</span>
          </button>

          {/* 박스에 추가 (이벤트 없음) */}
          <button
            type="button"
            className="flex flex-col items-center gap-[8px] cursor-pointer"
          >
            <BoxIcon size="xl" variant="none" />
            <span className="text-[11px] text-wb-grey-04">박스 추가</span>
          </button>

          {/* 시청 상태 */}
          <button
            type="button"
            className="flex flex-col items-center gap-[8px] cursor-pointer"
            onClick={() => {/* TODO: 시청 상태 변경 */}}
          >
            <WatchStatusIcon
              size="xl"
              status={toIconStatus(memberRecord?.watchStatus)}
            />
            <span className="text-[11px] text-wb-grey-04">시청 상태</span>
          </button>
        </div>

        {/* ── 탭 ───────────────────────────────────────── */}
        <TabNav
          tabs={['작품 정보', '캐스팅']}
          activeIndex={activeTab}
          onChange={setActiveTab}
        />

        {/* ── 탭 콘텐츠 ────────────────────────────────── */}
        {activeTab === 0 && (
          <div className="px-[20px] pt-[8px] pb-[16px]">
            {info.infoRows.map((row) => (
              <InfoRow key={row.label} label={row.label} value={row.value} />
            ))}
          </div>
        )}

        {/* 캐스팅 탭은 미구현 */}
        {activeTab === 1 && (
          <div className="px-[16px] pt-[20px]">
            <p className="text-[14px] text-wb-grey-02 text-center py-8">준비 중입니다.</p>
          </div>
        )}

      </div>

      <BottomMenu />
    </MobileFrame>
  );
}
