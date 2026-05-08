'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomNav from '@/components/common/BottomNav';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import MediaTypeButton from '@/components/common/MediaTypeButton';
import Toast from '@/components/common/Toast';
import { useLastMainPath } from '@/lib/hooks/useLastMainPath';
import { ChevronDownOutline, BoxIcon } from '@/components/icons';
import DetailCategoryTitle from '@/components/list/DetailCategoryTitle';
import SpreadActionLine from '@/components/common/SpreadActionLine';
import DetailWorkCreditCard from '@/components/content/detail/DetailWorkCreditCard';
import BaseCreditImage from '@/components/content/detail/BaseCreditImage';
import ContentBoxSheetContainer from '@/components/sheet/ContentBoxSheetContainer';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { fetchContentDetail } from '@/lib/api/content';
import { TMDB_POSTER } from '@/lib/utils/content';
import type { ContentDetailResponse, PersonInfo } from '@/types/content-detail';

const INITIAL_VISIBLE = 9;
const STEP = 9;

const FILTER_TABS = [
  { key: 'ALL',   label: '전체' },
  { key: 'MOVIE', label: '영화' },
  { key: 'TV',    label: '시리즈' },
] as const;

export default function PersonDetailPage() {
  const params = useParams();
  const tmdbId = Number(params.contentId);

  const [detail, setDetail] = useState<ContentDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 작품 더보기 — 표시 개수
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE);
  const [bioExpanded, setBioExpanded] = useState(false);

  // 박스 시트
  const [boxSheetVisible, setBoxSheetVisible] = useState(false);
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  // BottomNav 활성 경로 — useSyncExternalStore로 hydration 안전 처리
  const lastMainPath = useLastMainPath();

  const [toast, setToast] = useState({ visible: false, message: '' });
  const showToast = (msg: string) => setToast({ visible: true, message: msg });
  const showNotReady = () => showToast('아직 준비중입니다.');

  useEffect(() => {
    fetchContentDetail('PERSON', tmdbId)
      .then(setDetail)
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

  const p = detail.contentInfo as PersonInfo;
  const profileUrl = p.profilePath ? `${TMDB_POSTER.lg}${p.profilePath}` : null;

  // 2줄: nameOriginal / nameEn (중복 제거 후 콤마 join)
  const altNames = Array.from(
    new Set(
      [p.nameOriginal, p.nameEn]
        .map((s) => s?.trim())
        .filter((s): s is string => !!s),
    ),
  ).join(', ');

  // 3줄: birthday (age) + placeOfBirth — 같은 텍스트박스 안에서 줄바꿈
  const birthLine = [
    p.birthday,
    p.age != null ? `(${p.age}세)` : null,
  ].filter(Boolean).join(' ');

  // 작품 (백엔드 정렬 그대로 사용 / 필터는 미준비)
  const allCredits = p.workCredit?.combinedCreditList ?? [];
  const totalCount = p.workCredit?.totalCount ?? allCredits.length;
  const visibleCredits = allCredits.slice(0, visibleCount);
  const isAllShown = visibleCount >= allCredits.length;

  return (
    <MobileFrame>
      <Header variant="back" title={p.nameKo} />

      <MainContent>
        {/* ── 구역 1: 프로필 (이미지 + 우측 정보 세로 중앙) ─────── */}
        <section className="flex items-center gap-[14px] px-[16px] pt-[12px] pb-[20px]">
          <div className="w-[115px] h-[163px] rounded-[10px] overflow-hidden shrink-0 bg-wb-dark-03">
            {profileUrl ? (
              <Image
                src={profileUrl}
                alt={p.nameKo}
                width={115}
                height={163}
                className="w-full h-full object-cover"
              />
            ) : (
              <BaseCreditImage variant="person" />
            )}
          </div>

          <div className="flex flex-col gap-[4px] min-w-0">
            {/* 이름 + 박스 아이콘 (가로 auto layout, gap 7) */}
            <div className="flex items-center gap-[7px] min-w-0">
              <h1 className="text-[20px] font-semibold leading-[1.3] text-white break-keep min-w-0">
                {p.nameKo}
              </h1>
              <button
                type="button"
                aria-label="박스에 추가"
                className="shrink-0 cursor-pointer"
                onClick={() => {
                  if (!authLoading && !isAuthenticated) { showLoginModal(); return; }
                  setBoxSheetVisible(true);
                }}
              >
                <BoxIcon variant="none" size="medium" />
              </button>
            </div>

            {altNames && (
              <p className="text-[12px] text-wb-grey-04 break-keep">{altNames}</p>
            )}
            {(birthLine || p.placeOfBirth || p.knownForDepartment) && (
              <p className="text-[12px] text-wb-grey-04 break-keep mt-[2px] leading-[1.5]">
                {[birthLine, p.placeOfBirth, p.knownForDepartment]
                  .filter((s): s is string => !!s)
                  .map((line, i, arr) => (
                    <span key={i}>
                      {line}
                      {i < arr.length - 1 && <br />}
                    </span>
                  ))}
              </p>
            )}
          </div>
        </section>

        {/* ── 구역 2: 작품 ─────────────────────────────── */}
        <section>
          {/* 필터 탭 (전체/영화/시리즈) — 백엔드 미준비, 클릭 시 토스트 */}
          <div className="flex items-center gap-[8px] px-[16px] pt-[8px]">
            {FILTER_TABS.map(({ key, label }) => (
              <MediaTypeButton
                key={key}
                selected={key === 'ALL'}
                onClick={showNotReady}
              >
                {label}
              </MediaTypeButton>
            ))}
          </div>

          {/* 카운트 + 정렬 드롭다운 (UI만) */}
          <div className="flex items-center justify-between pl-[16px] pr-[6px] pt-[12px]">
            <span className="text-[14px] text-wb-grey-04">작품 {totalCount}개</span>
            <button
              type="button"
              onClick={showNotReady}
              className="flex items-center gap-[2px] text-[14px] text-wb-white-02 cursor-pointer"
            >
              최신순
              <ChevronDownOutline className="size-[16px] text-wb-white-02" />
            </button>
          </div>

          {/* 작품 그리드 — 3 cols, 9개씩 노출/추가 */}
          {visibleCredits.length > 0 ? (
            <div className="grid grid-cols-3 gap-x-[10px] gap-y-[20px] px-[16px] pt-[12px]">
              {visibleCredits.map((c) => (
                <DetailWorkCreditCard
                  key={`${c.watchMediaType}-${c.tmdbId}-${c.creditRole}`}
                  credit={c}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-wb-grey-03 py-[40px] text-[14px]">
              작품 정보가 없습니다.
            </p>
          )}

          {/* 더보기/접기 — 9개씩 추가, 모두 보이면 접기 */}
          {allCredits.length > INITIAL_VISIBLE && (
            <SpreadActionLine
              expanded={isAllShown}
              onToggle={() => {
                if (isAllShown) {
                  setVisibleCount(INITIAL_VISIBLE);
                } else {
                  setVisibleCount((v) => Math.min(v + STEP, allCredits.length));
                }
              }}
            />
          )}
        </section>

        {/* ── 구역 3: 소개 ─────────────────────────────── */}
        {p.biography && (
          <section className="mt-[8px]">
            <DetailCategoryTitle title="소개" line />
            <BiographyBlock biography={p.biography} expanded={bioExpanded} onToggle={() => setBioExpanded((v) => !v)} />
          </section>
        )}

        <div className="h-[40px]" />
      </MainContent>

      <ContentBoxSheetContainer
        visible={boxSheetVisible}
        onClose={() => setBoxSheetVisible(false)}
        content={{
          posterSrc: profileUrl,
          title: p.nameKo,
          year: null,
          genres: null,
        }}
        mediaType="PERSON"
        tmdbId={tmdbId}
        onCompleted={({ added, removed }) => {
          if (added > 0 && removed > 0) showToast('박스 목록을 변경했습니다.');
          else if (added > 0) showToast('박스에 추가했습니다.');
          else if (removed > 0) showToast('박스에서 제거했습니다.');
        }}
      />
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
      <BottomNav overridePathname={lastMainPath} />
    </MobileFrame>
  );
}

// ─── Bio 영역 (잘라서 보여주기 + 더보기/접기) ─────────────────
function BiographyBlock({
  biography,
  expanded,
  onToggle,
}: {
  biography: string;
  expanded: boolean;
  onToggle: () => void;
}) {
  const THRESHOLD = 200;
  const needsExpansion = biography.length > THRESHOLD;
  const shown = expanded || !needsExpansion ? biography : `${biography.slice(0, THRESHOLD)}...`;

  return (
    <>
      <p className="text-[13px] font-medium leading-[22px] text-wb-grey-04 px-[16px] pt-[12px] whitespace-pre-line">
        {shown}
      </p>
      {needsExpansion && (
        <SpreadActionLine expanded={expanded} onToggle={onToggle} />
      )}
    </>
  );
}
