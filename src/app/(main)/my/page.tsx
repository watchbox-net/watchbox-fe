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
  const [preparingModalVisible, setPreparingModalVisible] = useState(false);
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

  return (
    <>
      <Header variant="center" title="마이 페이지" />

      <MainContent>
        {loading && (
          <p className="text-center text-wb-grey-03 py-8">불러오는 중...</p>
        )}
        {!loading && !isAuthenticated && (
          <div className="flex flex-col items-center gap-[16px] py-[60px]">
            <p className="text-[16px] text-wb-grey-03">로그인 후 이용해 보세요.</p>
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="h-[40px] px-[24px] bg-wb-green rounded-[8px] text-[14px] font-bold text-wb-white-01"
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
          <div className="flex flex-col gap-[45px] pt-[20px]">
            {/* ── 프로필 섹션 ────────────────────────────── */}
            <div className="flex items-center gap-[12px] px-[32px]">
              <ProfileIcon variant="mypage" />
              <div className="flex flex-col gap-[2px]">
                <div className="flex items-center gap-[5px]">
                  <p className="text-[26px] font-semibold text-white leading-normal">
                    {data.profile.nickname}
                  </p>
                  <button
                    type="button"
                    onClick={() => router.push('/my/edit')}
                    aria-label="프로필 수정"
                  >
                    <PencilSolid className="size-6 text-white" />
                  </button>
                </div>
                <div className="flex items-center gap-[5px] h-[16px]">
                  <GoogleCircleLogo variant="light" />
                  <span className="text-[14px] text-wb-grey-02 leading-[14px]">
                    {data.profile.email}
                  </span>
                </div>
              </div>
            </div>

            {/* ── 회원 통계 ─────────────────────────────── */}
            <div className="flex flex-col gap-[45px] items-center px-[32px]">
              {/* 좋아요 / 박스 / 기록 */}
              <div className="flex items-center gap-[80px]">
                <button
                  type="button"
                  onClick={() => router.push('/record')}
                  className="flex flex-col items-center justify-center gap-[9px] w-[56px]"
                >
                  <span className="text-[18px] text-wb-grey-03">좋아요</span>
                  <LikeIcon size="xl" active />
                  <span className="text-[32px] text-wb-grey-03 leading-none">
                    {data.memberStats.likeCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/box')}
                  className="flex flex-col items-center justify-center gap-[9px] w-[50px]"
                >
                  <span className="text-[18px] text-wb-grey-03">박스</span>
                  <BoxIcon size="xl" variant="added" />
                  <span className="text-[32px] text-wb-grey-03 leading-none">
                    {data.memberStats.boxCount}
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/record')}
                  className="flex flex-col items-center justify-center gap-[9px] w-[50px]"
                >
                  <span className="text-[18px] text-wb-grey-03">기록</span>
                  <WatchStatusIcon size="xl" status="completed" />
                  <span className="text-[32px] text-wb-grey-03 leading-none">
                    {data.memberStats.watchStatusCount}
                  </span>
                </button>
              </div>

              {/* 팔로워 / 팔로잉 */}
              <div className="flex items-center gap-[100px] w-[205px]">
                <button
                  type="button"
                  onClick={() => setPreparingModalVisible(true)}
                  className="flex flex-col items-center justify-center gap-[9px] w-[53px]"
                >
                  <span className="text-[18px] text-wb-grey-01">팔로워</span>
                  <UsersSolid className="size-[50px] text-wb-grey-01" />
                  <span className="text-[32px] text-wb-grey-01 leading-none">0</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPreparingModalVisible(true)}
                  className="flex flex-col items-center justify-center gap-[9px] w-[52px]"
                >
                  <span className="text-[18px] text-wb-grey-01">팔로잉</span>
                  <UserGroupSolid className="size-[50px] text-wb-grey-01" />
                  <span className="text-[32px] text-wb-grey-01 leading-none">0</span>
                </button>
              </div>
            </div>

            {/* ── 버튼 영역 ──────────────────────────────── */}
            <div className="flex flex-col gap-[16px] px-[32px]">
              <button
                type="button"
                onClick={() => setLogoutModalVisible(true)}
                className="h-[44px] bg-wb-dark-05 rounded-[4px] text-[18px] text-white leading-[28px]"
              >
                로그아웃
              </button>
              <button
                type="button"
                onClick={() => router.push('/cs/info')}
                className="h-[44px] bg-wb-dark-05 rounded-[4px] text-[18px] text-white leading-[28px]"
              >
                서비스 정보
              </button>
              <button
                type="button"
                onClick={() => setPreparingModalVisible(true)}
                className="h-[44px] bg-wb-dark-05 rounded-[4px] text-[18px] text-white leading-[28px]"
              >
                피드백하기
              </button>
              <button
                type="button"
                onClick={() => setPreparingModalVisible(true)}
                className="h-[44px] bg-wb-dark-05 rounded-[4px] text-[18px] text-white leading-[28px]"
              >
                회원탈퇴
              </button>
            </div>
          </div>
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
    </>
  );
}
