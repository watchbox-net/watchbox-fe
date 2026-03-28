'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import Header from '@/components/common/Header';
import BottomMenu from '@/components/common/BottomMenu';
import MainContent from '@/components/common/MainContent';
import Toast from '@/components/common/Toast';
import { ProfileIcon, PencilOutline } from '@/components/icons';
import { fetchMyPage, updateProfile } from '@/lib/api/member';

const MAX_LENGTH = 12;
const MIN_LENGTH = 2;

export default function ProfileEditPage() {
  const router = useRouter();
  const [nickname, setNickname] = useState('');
  const [originalNickname, setOriginalNickname] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });

  const showToast = (msg: string) => setToast({ visible: true, message: msg });

  useEffect(() => {
    fetchMyPage()
      .then((res) => {
        setNickname(res.profile.nickname);
        setOriginalNickname(res.profile.nickname);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (value: string) => {
    if (value.length <= MAX_LENGTH) {
      setNickname(value);
    }
  };

  const isValid =
    nickname.length >= MIN_LENGTH &&
    nickname.length <= MAX_LENGTH &&
    nickname !== originalNickname;

  const handleSave = async () => {
    if (!isValid || saving) return;

    // 클라이언트 측 패턴 검증 (한글, 영문, 숫자, _ 만 허용)
    const pattern = /^[가-힣a-zA-Z0-9_]{2,12}$/;
    if (!pattern.test(nickname)) {
      showToast('닉네임은 2-12자의 한글, 영문, 숫자만 가능합니다.');
      return;
    }

    setSaving(true);
    try {
      await updateProfile(nickname);
      showToast('닉네임이 변경되었습니다.');
      setTimeout(() => router.back(), 1000);
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status;
      if (status === 409) {
        showToast('이미 존재하는 닉네임입니다.');
      } else if (status === 400) {
        showToast('닉네임은 2-12자의 한글, 영문, 숫자만 가능합니다.');
      } else {
        showToast('오류가 발생했습니다.');
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <MobileFrame>
      <Header
        variant="back"
        title="프로필 수정"
      />

      <MainContent>
        {loading && (
          <p className="text-center text-wb-grey-02 py-8">불러오는 중...</p>
        )}
        {!loading && error && (
          <p className="text-center text-wb-grey-02 py-8">
            오류가 발생했습니다.
          </p>
        )}
        {!loading && !error && (
          <>
            {/* ── 프로필 이미지 ──────────────────────────── */}
            <div className="flex flex-col items-center gap-[5px] pt-[48px] pb-[20px]">
              <ProfileIcon variant="edit" />
              <div className="flex items-center gap-[7px]">
                <PencilOutline className="size-[18px] text-wb-grey-02" />
                <span className="text-[16px] font-medium text-wb-grey-02">
                  이미지 변경
                </span>
              </div>
            </div>

            {/* ── 닉네임 입력 ───────────────────────────── */}
            <div className="px-[12px] pt-[20px]">
              <p className="text-[14px] font-medium text-wb-grey-03 leading-none mb-[5px]">
                닉네임
              </p>
              <div className="px-[0px] py-[5px]">
                <input
                  type="text"
                  value={nickname}
                  onChange={(e) => handleChange(e.target.value)}
                  maxLength={MAX_LENGTH}
                  className="w-full h-[48px] bg-wb-dark-03 border-[0.5px] border-wb-dark-05 rounded-[8px] px-[15px] py-[16px] text-[15px] font-medium text-white outline-none"
                />
              </div>
              <p className="text-[10px] font-medium text-wb-grey-01 text-right mt-[2px] mr-[6px]">
                {nickname.length} / {MAX_LENGTH}
              </p>
            </div>

            {/* ── 저장 버튼 ─────────────────────────────── */}
            <div className="px-[14px] mt-[16px]">
              <button
                type="button"
                onClick={handleSave}
                disabled={!isValid || saving}
                className={`w-full h-[48px] rounded-[8px] text-[15px] font-bold leading-[24px] shadow-sm ${
                  isValid && !saving
                    ? 'bg-wb-green text-white'
                    : 'bg-wb-dark-05 text-wb-grey-01'
                }`}
              >
                {saving ? '저장 중...' : '저장'}
              </button>
            </div>
          </>
        )}
      </MainContent>

      <BottomMenu />

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </MobileFrame>
  );
}
