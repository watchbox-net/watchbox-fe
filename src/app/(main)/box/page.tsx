'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import ContextMenu from '@/components/common/ContextMenu';
import BoxItem from '@/components/box/BoxItem';
import BoxList from '@/components/box/BoxList';
import { PlusOutline } from '@/components/icons';
import { fetchBoxList } from '@/lib/api/box';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import type { BoxType } from '@/types/box';

type MenuTarget = { boxId: number; boxType: BoxType };

export default function BoxPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['boxList'],
    queryFn: fetchBoxList,
    enabled: !authLoading && isAuthenticated,
    staleTime: 0,
  });

  const boxes = data?.boxItemList ?? [];

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

  const goToContents = (boxId: number, boxType: BoxType, name: string) => {
    router.push(`/box/${boxId}/contents?type=${boxType}&name=${encodeURIComponent(name)}`);
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
        setOpenMenu(null);
        // TODO: 삭제 확인 모달
      },
    },
  ];

  return (
    <>
      <Header
        variant="icon2"
        title="박스"
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

      <MainContent>
        {(authLoading || isLoading) && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}

        {!authLoading && !isAuthenticated && (
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

        {!authLoading && isAuthenticated && isError && (
          <p className="text-center text-neutral-500 py-8">오류가 발생했습니다.</p>
        )}

        {!authLoading && isAuthenticated && !isError && !isLoading && (
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
                    onMenuClick={() => toggleMenu(box.boxId, box.boxType)}
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
      </MainContent>
    </>
  );
}
