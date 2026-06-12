'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import { Loading } from '@/components/common/Loading';
import Modal from '@/components/common/Modal';
import ContextMenu from '@/components/common/ContextMenu';
import BoxItem from '@/components/box/BoxItem';
import BoxList from '@/components/box/BoxList';
import PreviewOverlay from '@/components/preview/PreviewOverlay';
import { PlusOutline } from '@/components/icons';
import { fetchBoxList, deleteBox } from '@/lib/api/box';
import { hasReceivedInvitation } from '@/lib/api/member';
import { fetchPreviewBoxList } from '@/lib/api/preview';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import type { BoxType } from '@/types/box';

type MenuTarget = { boxId: number; boxType: BoxType };

export default function BoxPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const isPreview = !authLoading && !isAuthenticated;

  // 삭제 모달 상태
  const [deleteTarget, setDeleteTarget] = useState<{ boxId: number; name: string } | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // ── 인증된 사용자: 일반 API ──
  const { data, isLoading, isError } = useQuery({
    queryKey: ['boxList'],
    queryFn: fetchBoxList,
    enabled: !authLoading && isAuthenticated,
    staleTime: 0,
  });

  // ── 비인증 사용자: Preview API ──
  const { data: previewData, isLoading: previewLoading } = useQuery({
    queryKey: ['previewBoxList'],
    queryFn: fetchPreviewBoxList,
    enabled: isPreview,
    staleTime: 1000 * 60 * 5,
  });

  const boxes = isAuthenticated ? (data?.boxItemList ?? []) : (previewData?.boxItemList ?? []);
  const loading = authLoading || (isAuthenticated ? isLoading : previewLoading);

  // ── 받은 초대 존재 유무 (벨 배지용) ──
  // SSE 실시간 갱신이 있지만, 에러로 알림이 누락될 수 있으므로
  // staleTime 0 → 박스 화면 진입할 때마다 항상 fresh 확인 (안전망)
  const { data: hasNewAlarm = false } = useQuery({
    queryKey: ['hasReceivedInvitation'],
    queryFn: hasReceivedInvitation,
    enabled: !authLoading && isAuthenticated,
    staleTime: 0,
  });

  // 컨텍스트 메뉴 상태
  const [openMenu, setOpenMenu] = useState<MenuTarget | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    if (openMenu) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const toggleMenu = (boxId: number, boxType: BoxType) => {
    setOpenMenu((prev) => (prev?.boxId === boxId ? null : { boxId, boxType }));
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    try {
      await deleteBox(deleteTarget.boxId);
      setDeleteTarget(null);
      queryClient.invalidateQueries({ queryKey: ['boxList'] });
    } catch (err) {
      setDeleteTarget(null);
      const axiosError = err as AxiosError<{ error?: { message?: string } }>;
      const msg = axiosError.response?.data?.error?.message ?? '박스 삭제 중 오류가 발생했습니다.';
      setErrorMessage(msg);
    }
  };

  const goToContents = (boxId: number, boxType: BoxType, name: string) => {
    if (isPreview) {
      router.push(`/box/${boxId}/contents?type=${boxType}&name=${encodeURIComponent(name)}&preview=true`);
    } else {
      router.push(`/box/${boxId}/contents?type=${boxType}&name=${encodeURIComponent(name)}`);
    }
  };

  const buildMenuItems = (boxId: number, boxType: BoxType) => [
    ...(boxType === 'SHARED'
      ? [{
          type: 'invite' as const,
          onClick: () => {
            setOpenMenu(null);
            router.push(`/box/invite/${boxId}`);
          },
        }]
      : []),
    {
      type: 'edit' as const,
      onClick: () => {
        setOpenMenu(null);
        router.push(`/box/edit/${boxId}?type=${boxType}`);
      },
    },
    {
      type: 'delete' as const,
      onClick: () => {
        const box = boxes.find((b) => b.boxId === boxId);
        setOpenMenu(null);
        setDeleteTarget({ boxId, name: box?.name ?? '박스' });
      },
    },
  ];

  return (
    <>
      <Header
        variant="icon2"
        title="박스"
        hasNewAlarm={hasNewAlarm}
        onAlarm={() => {
          if (!isAuthenticated) { showLoginModal(); return; }
          router.push('/box/invitations');
        }}
        icon2Right={
          <button type="button" onClick={() => {
            if (!isAuthenticated) { showLoginModal(); return; }
            router.push('/box/create');
          }}>
            <PlusOutline className="size-6 text-wb-white-02" strokeWidth={2} />
          </button>
        }
      />

      <MainContent className="relative">
        {loading && <Loading />}

        {!authLoading && isAuthenticated && isError && (
          <p className="text-center text-neutral-500 py-8">오류가 발생했습니다.</p>
        )}

        {!loading && boxes.length > 0 && (
          <>
            <BoxList>
              {boxes.map((box) => {
                const isMenuOpen = openMenu?.boxId === box.boxId;
                return (
                  <BoxItem
                    key={box.boxId}
                    type={box.boxType}
                    name={box.name}
                    lastContentAddedAt={box.lastContentAddedAt}
                    posters={box.previewPosterList}
                    memberNames={box.memberList?.map((m) => m.boxMemberName)}
                    onClick={() => goToContents(box.boxId, box.boxType, box.name)}
                    onMenuClick={() => {
                      if (isPreview) { showLoginModal(); return; }
                      toggleMenu(box.boxId, box.boxType);
                    }}
                    menuSlot={isMenuOpen ? (
                      <div ref={menuRef} className="absolute right-[5px] top-full z-50 mt-1">
                        <ContextMenu items={buildMenuItems(box.boxId, box.boxType)} />
                      </div>
                    ) : null}
                  />
                );
              })}
            </BoxList>
          </>
        )}

        {/* Preview 오버레이 */}
        {isPreview && !previewLoading && boxes.length > 0 && <PreviewOverlay />}
      </MainContent>

      {/* 삭제 확인 모달 */}
      <Modal
        visible={!!deleteTarget}
        variant="delete"
        title={`'${deleteTarget?.name}' 박스를 삭제하시겠습니까?`}
        body="삭제된 박스는 복구할 수 없습니다."
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
      />

      {/* 에러 모달 (백엔드 에러 메시지 표시) */}
      <Modal
        visible={!!errorMessage}
        variant="error"
        title="삭제 실패"
        body={errorMessage ?? ''}
        onCancel={() => setErrorMessage(null)}
        onConfirm={() => setErrorMessage(null)}
      />
    </>
  );
}
