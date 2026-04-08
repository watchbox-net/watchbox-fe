'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import TabNav from '@/components/common/TabNav';
import Toast from '@/components/common/Toast';
import Modal from '@/components/common/Modal';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import LikeIcon from '@/components/icons/LikeIcon';
import BoxIcon from '@/components/icons/BoxIcon';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import { ChevronLeftOutline } from '@/components/icons';
import { fetchContentDetail } from '@/lib/api/content';
import { addLike } from '@/lib/api/record';
import { TMDB_POSTER, TMDB_BACKDROP } from '@/lib/utils/content';
import type {
  ContentDetailResponse,
  ContentDetailMediaType,
  DetailMemberRecord,
  MovieInfo,
  TvInfo,
} from '@/types/content-detail';
import type { WatchStatus } from '@/types/content';

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
    <div className="flex gap-[20px] py-[7px]">
      <span className="w-[51px] shrink-0 text-[14px] text-wb-grey-02">{label}</span>
      <span className="text-[14px] text-wb-grey-04">{value}</span>
    </div>
  );
}

// ─── 메인 페이지 ─────────────────────────────────────────────
export default function ContentDetailPage() {
  const router    = useRouter();
  const params    = useParams();
  const mediaType = (params.mediaType as string).toUpperCase() as ContentDetailMediaType;
  const contentId = Number(params.contentId);

  const [detail,      setDetail]      = useState<ContentDetailResponse | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [error,       setError]       = useState(false);
  const [expanded,    setExpanded]    = useState(false);
  const [activeTab,   setActiveTab]   = useState(0);

  // 로컬 상호작용 상태
  const [liked,         setLiked]         = useState(false);
  const [recordId,      setRecordId]      = useState<number | null>(null);
  const [watchStatus,   setWatchStatus]   = useState<WatchStatus | null>(null);

  // 시청 상태 메뉴
  const [statusMenuOpen, setStatusMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // 모달
  const [preparingModalVisible, setPreparingModalVisible] = useState(false);

  // 토스트
  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (msg: string) => setToast({ visible: true, message: msg });

  const { changeStatus, deleteStatus, requireAuth } = useWatchStatus({
    onStatusChanged: (status) => setWatchStatus(status),
    onDeleted: () => setWatchStatus(null),
    showToast,
  });

  useEffect(() => {
    fetchContentDetail(mediaType, contentId)
      .then((res) => {
        setDetail(res);
        const mr: DetailMemberRecord | null = res.memberRecord;
        setLiked(mr?.liked === true);
        setRecordId(mr?.recordId ?? null);
        setWatchStatus(mr?.watchStatus ?? null);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [mediaType, contentId]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleMouseDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setStatusMenuOpen(false);
      }
    };
    if (statusMenuOpen) document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [statusMenuOpen]);

  // ── 좋아요 토글 ─────────────────────────────────────────────
  const handleLike = async () => {
    if (!requireAuth()) return;
    if (mediaType !== 'MOVIE' && mediaType !== 'TV') return;
    try {
      if (liked) {
        await addLike({ contentId, mediaType, liked: false });
        setLiked(false);
        showToast('좋아요를 취소했습니다.');
      } else {
        await addLike({ contentId, mediaType, liked: true });
        setLiked(true);
        showToast('좋아요를 등록했습니다.');
      }
    } catch {/* 에러 무시 */}
  };

  // ── 시청 상태 변경 ──────────────────────────────────────────
  const handleStatusSelect = async (status: Exclude<WatchStatus, 'NONE'>) => {
    setStatusMenuOpen(false);
    if (mediaType !== 'MOVIE' && mediaType !== 'TV') return;
    const success = await changeStatus(contentId, mediaType, status);
    if (success) {
      // recordId 갱신 (삭제 시 필요)
      const res = await fetchContentDetail(mediaType, contentId);
      setRecordId(res.memberRecord?.recordId ?? null);
    }
  };

  // ── 시청 기록 삭제 ──────────────────────────────────────────
  const handleStatusDelete = async () => {
    setStatusMenuOpen(false);
    if (!recordId) return;
    await deleteStatus(recordId);
  };

  if (loading) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-wb-grey-02">불러오는 중...</p>
        </div>
      </MobileFrame>
    );
  }

  if (error || !detail) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-wb-grey-02">오류가 발생했습니다.</p>
        </div>
      </MobileFrame>
    );
  }

  const info = extractInfo(detail);
  const posterUrl   = info.posterPath   ? `${TMDB_POSTER.md}${info.posterPath}`     : null;
  const backdropUrl = info.backdropPath ? `${TMDB_BACKDROP.md}${info.backdropPath}` : null;

  const metaParts = [
    info.year,
    info.genreList?.join(', '),
    info.runtime ? `${info.runtime}분` : null,
  ].filter(Boolean);

  const needsExpansion = (info.overview?.length ?? 0) > 100;

  return (
    <MobileFrame>
      <div className="flex-1 overflow-y-auto scrollbar-hide">

        {/* ── 백드롭 + 뒤로가기 ─────────────────────────── */}
        <div className="relative h-[230px] bg-wb-dark-03 shrink-0">
          {backdropUrl ? (
            <Image src={backdropUrl} alt="" fill className="object-cover" />
          ) : (
            <div className="w-full h-full bg-wb-dark-03" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/20" />
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
          <div className="w-[115px] h-[163px] rounded-[10px] overflow-hidden shrink-0 bg-wb-dark-03">
            {posterUrl ? (
              <Image src={posterUrl} alt={info.titleKo} width={115} height={163} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-wb-dark-05" />
            )}
          </div>
          <div className="flex flex-col justify-center gap-[4px] min-w-0 pt-[4px]">
            <h1 className="text-[24px] font-semibold leading-[1.3] text-white break-keep">
              {info.titleKo}
            </h1>
            {info.titleOriginal && (
              <p className="text-[11px] text-wb-grey-03 truncate">{info.titleOriginal}</p>
            )}
            {metaParts.length > 0 && (
              <p className="text-[12px] text-wb-grey-03 mt-[2px]">{metaParts.join(' · ')}</p>
            )}
          </div>
        </div>

        {/* ── 줄거리 ───────────────────────────────────── */}
        {info.overview && (
          <div className="px-[16px] mt-[20px]">
            <p className="text-[13px] font-medium leading-[22px] text-wb-grey-03">
              {expanded ? info.overview : needsExpansion ? `${info.overview.slice(0, 100)}...` : info.overview}
              {needsExpansion && (
                <button
                  type="button"
                  onClick={() => setExpanded((v) => !v)}
                  className="text-wb-white-01 ml-[4px] cursor-pointer"
                >
                  {expanded ? '접기' : '더보기'}
                </button>
              )}
            </p>
          </div>
        )}

        {/* ── 액션 아이콘 3개 ──────────────────────────── */}
        <div className="flex items-start justify-around px-[20px] py-[24px]">

          {/* 좋아요 */}
          <button
            type="button"
            className="flex flex-col items-center gap-[8px] cursor-pointer"
            onClick={handleLike}
          >
            <LikeIcon size="xl" active={liked} />
            <span className="text-[11px] text-wb-grey-04">좋아요</span>
          </button>

          {/* 박스에 추가 */}
          <button
            type="button"
            className="flex flex-col items-center gap-[8px] cursor-pointer"
            onClick={() => setPreparingModalVisible(true)}
          >
            <BoxIcon size="xl" variant="none" />
            <span className="text-[11px] text-wb-grey-04">박스 추가</span>
          </button>

          {/* 시청 상태 */}
          <div className="relative flex flex-col items-center gap-[8px]">
            <button
              type="button"
              className="cursor-pointer"
              onClick={() => setStatusMenuOpen((v) => !v)}
            >
              <WatchStatusIcon size="xl" status={toIconStatus(watchStatus)} />
            </button>
            <span className="text-[11px] text-wb-grey-04">시청 상태</span>

            {/* 시청 상태 메뉴 - 아이콘 아래로 */}
            {statusMenuOpen && (
              <div ref={menuRef} className="absolute top-full mt-1 center z-50">
                <WatchStatusMenu
                  onSelect={handleStatusSelect}
                  onDelete={handleStatusDelete}
                />
              </div>
            )}
          </div>
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
        {activeTab === 1 && (
          <div className="px-[16px] pt-[20px]">
            <p className="text-[14px] text-wb-grey-02 text-center py-8">준비 중입니다.</p>
          </div>
        )}

      </div>

      <Modal
        visible={preparingModalVisible}
        variant="preparing"
        onConfirm={() => setPreparingModalVisible(false)}
      />
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </MobileFrame>
  );
}
