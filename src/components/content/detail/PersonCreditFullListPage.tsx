'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomNav from '@/components/common/BottomNav';
import { Loading } from '@/components/common/Loading';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import PersonCreditList from '@/components/content/detail/PersonCreditList';
import { useLastMainPath } from '@/lib/hooks/useLastMainPath';
import { fetchContentDetail } from '@/lib/api/content';
import type {
  ContentDetailResponse,
  MovieInfo,
  TvInfo,
} from '@/types/content-detail';

/** 출연 초기 노출 개수 */
const CAST_INITIAL = 3;
/** 제작 초기 노출 개수 */
const CREW_INITIAL = 2;

interface PersonCreditFullListPageProps {
  /** 영화/TV 구분 — 부모 페이지에서 결정 */
  mediaType: 'MOVIE' | 'TV';
}

/**
 * 영화/TV 상세 → "출연/제작 더보기" 화면 공통 구현
 *
 * - 출연 3개 / 제작 2개를 기본 노출
 * - 더보기 클릭 시 10개씩 추가, 전부 노출되면 "접기"로 변경
 */
export default function PersonCreditFullListPage({
  mediaType,
}: PersonCreditFullListPageProps) {
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
        <Loading className="flex-1" />
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
  const credit = info.personCredit;

  const castList = credit?.castList ?? [];
  const crewList = credit?.crewList ?? [];
  const isEmpty = castList.length === 0 && crewList.length === 0;

  return (
    <MobileFrame>
      <Header variant="back" title={headerTitle} />

      <MainContent>
        {isEmpty ? (
          <p className="text-center text-wb-grey-03 py-[40px] text-[14px]">
            출연/제작 정보가 없습니다.
          </p>
        ) : (
          <>
            {castList.length > 0 && (
              <PersonCreditList
                kind="cast"
                items={castList}
                initialCount={CAST_INITIAL}
              />
            )}
            {crewList.length > 0 && (
              <PersonCreditList
                kind="crew"
                items={crewList}
                initialCount={CREW_INITIAL}
              />
            )}
          </>
        )}
        <div className="h-[40px]" />
      </MainContent>

      <BottomNav overridePathname={lastMainPath} />
    </MobileFrame>
  );
}
