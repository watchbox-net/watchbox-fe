'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import Header from '@/components/common/Header';
import BottomMenu from '@/components/common/BottomMenu';
import MainContent from '@/components/common/MainContent';
import {
  ProfileIcon,
  GoogleCircleLogo,
  LikeIcon,
  BoxIcon,
  WatchStatusIcon,
  PencilSolid,
  Cog6ToothSolid,
  UserGroupSolid,
  UsersSolid,
} from '@/components/icons';
import { fetchMyPage } from '@/lib/api/member';
import type { MyPageResponse } from '@/types/mypage';

export default function MyPage() {
  const router = useRouter();
  const [data, setData] = useState<MyPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchMyPage()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const rightIcons = (
    <div className="flex items-center gap-[15px]">
      <button type="button" onClick={() => router.push('/my/edit')}>
        <PencilSolid className="size-6 text-white" />
      </button>
      <button type="button">
        <Cog6ToothSolid className="size-6 text-white" />
      </button>
    </div>
  );

  return (
    <MobileFrame>
      <Header
        variant="icon1"
        title="마이 페이지"
        rightIcon={rightIcons}
      />

      <MainContent>
        {loading && (
          <p className="text-center text-wb-grey-02 py-8">불러오는 중...</p>
        )}
        {!loading && error && (
          <p className="text-center text-wb-grey-02 py-8">
            로그인이 필요하거나 오류가 발생했습니다.
          </p>
        )}
        {!loading && !error && data && (
          <>
            {/* ── 프로필 섹션 ────────────────────────────── */}
            <div className="flex items-center gap-[12px] px-[32px] pt-[19px] pb-[20px]">
              <ProfileIcon variant="mypage" />
              <div className="flex flex-col gap-[2px]">
                <p className="text-[26px] font-semibold text-white leading-normal">
                  {data.profile.nickname}
                </p>
                <div className="flex items-center gap-[5px]">
                  <GoogleCircleLogo variant="light" />
                  <span className="text-[14px] text-wb-grey-02 leading-[14px]">
                    {data.profile.email}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 통계 행 1: 좋아요 / 박스 / 기록 ────────── */}
            <div className="flex items-start justify-around pt-[24px]">
              <div className="flex flex-col items-center gap-[9px] w-[56px]">
                <span className="text-[18px] text-wb-grey-02">좋아요</span>
                <LikeIcon size="xl" active />
                <span className="text-[32px] text-wb-grey-02">
                  {data.memberStats.likeCount}
                </span>
              </div>
              <div className="flex flex-col items-center gap-[9px] w-[50px]">
                <span className="text-[18px] text-wb-grey-02">박스</span>
                <BoxIcon size="xl" variant="added" />
                <span className="text-[32px] text-wb-grey-02">
                  {data.memberStats.boxCount}
                </span>
              </div>
              <div className="flex flex-col items-center gap-[9px] w-[50px]">
                <span className="text-[18px] text-wb-grey-02">기록</span>
                <WatchStatusIcon size="xl" status="completed" />
                <span className="text-[32px] text-wb-grey-02">
                  {data.memberStats.watchStatusCount}
                </span>
              </div>
            </div>

            {/* ── 통계 행 2: 팔로워 / 팔로잉 ─────────────── */}
            <div className="flex items-start justify-center gap-[100px] pt-[50px]">
              <div className="flex flex-col items-center gap-[9px] w-[53px]">
                <span className="text-[18px] text-wb-grey-02">팔로워</span>
                <UsersSolid className="size-[50px] text-wb-grey-02" />
                <span className="text-[32px] text-wb-grey-02">
                  0
                </span>
              </div>
              <div className="flex flex-col items-center gap-[9px] w-[52px]">
                <span className="text-[18px] text-wb-grey-02">팔로잉</span>
                <UserGroupSolid className="size-[50px] text-wb-grey-02" />
                <span className="text-[32px] text-wb-grey-02">
                  0
                </span>
              </div>
            </div>

            {/* ── 버튼 영역 ──────────────────────────────── */}
            <div className="flex flex-col gap-[15px] px-[25px] mt-[50px]">
              <button
                type="button"
                className="h-[46px] bg-[#353535] rounded-[4px] text-[20px] text-white leading-[28px]"
              >
                로그아웃
              </button>
              <button
                type="button"
                className="h-[46px] bg-[#353535] rounded-[4px] text-[20px] text-white leading-[28px]"
              >
                회원탈퇴
              </button>
            </div>
          </>
        )}
      </MainContent>

      <BottomMenu />
    </MobileFrame>
  );
}
