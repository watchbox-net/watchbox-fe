'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import Modal from '@/components/common/Modal';
import Toast from '@/components/common/Toast';
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
import { useAuth } from '@/lib/context/AuthContext';
import type { MyPageResponse } from '@/types/mypage';

export default function MyPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading, logout } = useAuth();
  const [data, setData] = useState<MyPageResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg: string) => setToast({ visible: true, message: msg });

  const handleLogout = async () => {
    setLogoutModalVisible(false);
    try {
      await logout();
      router.push('/');
    } catch {
      showToast('로그아웃에 실패했습니다.');
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLoading(false); return; }
    fetchMyPage()
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

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
    <>
      <Header
        variant="icon1"
        title="마이 페이지"
        rightIcon={rightIcons}
      />

      <MainContent>
        {loading && (
          <p className="text-center text-wb-grey-03 py-8">불러오는 중...</p>
        )}
        {!loading && !isAuthenticated && (
          <div className="flex flex-col items-center gap-[16px] py-[60px]">
            <p className="text-[16px] text-wb-grey-03">로그인이 필요한 페이지입니다.</p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="h-[40px] px-[24px] bg-wb-primary rounded-[8px] text-[14px] font-bold text-wb-white-01"
            >
              로그인
            </button>
          </div>
        )}
        {!loading && isAuthenticated && error && (
          <p className="text-center text-wb-grey-03 py-8">
            오류가 발생했습니다.
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
                  <span className="text-[14px] text-wb-grey-03 leading-[14px]">
                    {data.profile.email}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 통계 행 1: 좋아요 / 박스 / 기록 ────────── */}
            <div className="flex items-start justify-around pt-[24px]">
              <div className="flex flex-col items-center gap-[9px] w-[56px]">
                <span className="text-[18px] text-wb-grey-03">좋아요</span>
                <LikeIcon size="xl" active />
                <span className="text-[32px] text-wb-grey-03">
                  {data.memberStats.likeCount}
                </span>
              </div>
              <div className="flex flex-col items-center gap-[9px] w-[50px]">
                <span className="text-[18px] text-wb-grey-03">박스</span>
                <BoxIcon size="xl" variant="added" />
                <span className="text-[32px] text-wb-grey-03">
                  {data.memberStats.boxCount}
                </span>
              </div>
              <div className="flex flex-col items-center gap-[9px] w-[50px]">
                <span className="text-[18px] text-wb-grey-03">기록</span>
                <WatchStatusIcon size="xl" status="completed" />
                <span className="text-[32px] text-wb-grey-03">
                  {data.memberStats.watchStatusCount}
                </span>
              </div>
            </div>

            {/* ── 통계 행 2: 팔로워 / 팔로잉 ─────────────── */}
            <div className="flex items-start justify-center gap-[100px] pt-[50px]">
              <div className="flex flex-col items-center gap-[9px] w-[53px]">
                <span className="text-[18px] text-wb-grey-03">팔로워</span>
                <UsersSolid className="size-[50px] text-wb-grey-03" />
                <span className="text-[32px] text-wb-grey-03">
                  0
                </span>
              </div>
              <div className="flex flex-col items-center gap-[9px] w-[52px]">
                <span className="text-[18px] text-wb-grey-03">팔로잉</span>
                <UserGroupSolid className="size-[50px] text-wb-grey-03" />
                <span className="text-[32px] text-wb-grey-03">
                  0
                </span>
              </div>
            </div>

            {/* ── 버튼 영역 ──────────────────────────────── */}
            <div className="flex flex-col gap-[15px] px-[25px] mt-[50px]">
              <button
                type="button"
                onClick={() => setLogoutModalVisible(true)}
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

      <Modal
        visible={logoutModalVisible}
        variant="confirm"
        title="로그아웃"
        body="정말 로그아웃 하시겠습니까?"
        confirmLabel="로그아웃"
        cancelLabel="취소"
        onConfirm={handleLogout}
        onCancel={() => setLogoutModalVisible(false)}
      />

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
