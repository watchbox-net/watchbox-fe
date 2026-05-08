'use client';

import PersonCreditFullListPage from '@/components/content/detail/PersonCreditFullListPage';

/** 영화 상세 → 출연/제작 더보기 */
export default function MovieCreditsPage() {
  return <PersonCreditFullListPage mediaType="MOVIE" />;
}
