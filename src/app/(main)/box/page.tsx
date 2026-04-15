'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import ContextMenu from '@/components/common/ContextMenu';
import TriplePosterBox from '@/components/box/TriplePosterBox';
import { PlusOutline, EllipsisVerticalSolid } from '@/components/icons';
import ListTitle from '@/components/list/ListTitle';
import { fetchBoxList } from '@/lib/api/box';
import { useAuth } from '@/lib/context/AuthContext';
import type { BoxResponse, BoxType } from '@/types/box';

type MenuTarget = { boxId: number; boxType: BoxType };

export default function BoxPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [boxes, setBoxes] = useState<BoxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 컨텍스트 메뉴 상태
  const [openMenu, setOpenMenu] = useState<MenuTarget | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLoading(false); return; }
    fetchBoxList()
      .then((res) => setBoxes(res.boxList ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [authLoading, isAuthenticated]);

  // 외부 클릭 시 메뉴 닫기
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    if (openMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openMenu]);

  const toggleMenu = (boxId: number, boxType: BoxType) => {
    setOpenMenu((prev) =>
      prev?.boxId === boxId ? null : { boxId, boxType }
    );
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

  const myBoxes = boxes.filter((b) => b.boxType === 'MY');
  const sharedBoxes = boxes.filter((b) => b.boxType === 'SHARED');

  const renderBoxItem = (box: BoxResponse) => (
    <li
      key={box.boxId}
      className="flex items-start pl-[16px] pr-[12px] py-[10px]"
    >
      <div
        className="flex gap-[10px] items-start flex-1 min-w-0 cursor-pointer"
        onClick={() => goToContents(box.boxId, box.boxType, box.name)}
      >
        <TriplePosterBox posters={box.previewPosterList} />
        <div className="flex flex-col gap-[3px] min-w-0 flex-1">
          <p className="text-[16px] font-medium text-white leading-[24px] tracking-[0.15px] line-clamp-2">{box.name}</p>
          {box.boxType === 'SHARED' && box.memberList && (
            <p className="text-[12px] text-wb-primary leading-[20px] tracking-[0.25px] truncate">
              {box.memberList.map((m) => m.boxMemberName).join(', ')}
            </p>
          )}
          {box.lastContentAddedAt && (
            <p className="text-[12px] text-wb-grey-03 leading-[20px] tracking-[0.25px]">마지막 업데이트: {box.lastContentAddedAt.slice(0, 10)}</p>
          )}
        </div>
      </div>

      {/* 케밥 버튼 + 컨텍스트 메뉴 */}
      <div className="relative shrink-0" ref={openMenu?.boxId === box.boxId ? menuRef : undefined}>
        <button
          onClick={() => toggleMenu(box.boxId, box.boxType)}
          className="p-1 text-white cursor-pointer"
        >
          <EllipsisVerticalSolid className="size-[24px]" />
        </button>
        {openMenu?.boxId === box.boxId && (
          <div className="absolute right-[5px] top-full z-50 mt-1">
            <ContextMenu items={buildMenuItems(box.boxId, box.boxType)} />
          </div>
        )}
      </div>
    </li>
  );

  return (
    <>
      <Header
        variant="icon2"
        title="박스"
        onAlarm={() => router.push('/box/invitations')}
        onSearch={() => {/* TODO: 박스 검색 */}}
      />

      <MainContent>
        {loading && (
          <p className="text-center text-neutral-500 py-8">불러오는 중...</p>
        )}

        {!loading && !isAuthenticated && (
          <div className="flex flex-col items-center gap-[16px] py-[60px]">
            <p className="text-[16px] text-wb-grey-02">로그인이 필요한 페이지입니다.</p>
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
          <p className="text-center text-neutral-500 py-8">
            오류가 발생했습니다.
          </p>
        )}

        {!loading && isAuthenticated && !error && (
          <>
            {/* 마이 박스 */}
            <section className="mb-8">
              <ListTitle
                title={`마이 박스 (${myBoxes.length})`}
                variant="none"
                className="mb-3"
              />
              {myBoxes.length > 0 && (
                <ul>{myBoxes.map(renderBoxItem)}</ul>
              )}
              <button
                onClick={() => router.push('/box/create')}
                className="flex items-center justify-center gap-2 w-full py-4 cursor-pointer rounded-[8px] hover:bg-wb-dark-05 transition-colors"
              >
                <PlusOutline className="size-5 text-wb-grey-02" />
                <span className="text-sm text-wb-grey-02">새 박스 만들기</span>
              </button>
            </section>

            {/* 공유 박스 */}
            <section>
              <ListTitle
                title={`공유 박스 (${sharedBoxes.length})`}
                variant="none"
                className="mb-3"
              />
              {sharedBoxes.length > 0 && (
                <ul>{sharedBoxes.map(renderBoxItem)}</ul>
              )}
              <button
                onClick={() => router.push('/box/create')}
                className="flex items-center justify-center gap-2 w-full py-4 cursor-pointer rounded-[8px] hover:bg-wb-dark-05 transition-colors"
              >
                <PlusOutline className="size-5 text-wb-grey-02" />
                <span className="text-sm text-wb-grey-02">새 박스 만들기</span>
              </button>
            </section>
          </>
        )}
      </MainContent>
    </>
  );
}
