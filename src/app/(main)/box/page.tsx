'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';
import ContextMenu from '@/components/common/ContextMenu';
import TriplePosterBox from '@/components/content/TriplePosterBox';
import { PlusOutline, EllipsisVerticalSolid } from '@/components/icons';
import ListTitle from '@/components/list/ListTitle';
import { fetchMyBoxList, fetchSharedBoxList } from '@/lib/api/box';
import { useAuth } from '@/lib/hooks/useAuth';
import type { MyBoxResponse, SharedBoxResponse, BoxType } from '@/types/box';

type MenuTarget = { boxId: number; boxType: BoxType };

// 백엔드에서 박스 포스터 이미지를 아직 안 보내므로 임시 샘플
const SAMPLE_POSTERS = [
  [
    'https://image.tmdb.org/t/p/w185/eKZ07Ted7VHxQjbuZrRBFOamcKJ.jpg',
    'https://image.tmdb.org/t/p/w185/zmK5G0JdkL637VbaVPYFeEQ52qi.jpg',
    'https://image.tmdb.org/t/p/w185/uitqZVbhvlQV5iLOdbk3itGoNNd.jpg',
  ],
  [
    'https://image.tmdb.org/t/p/w185/zmK5G0JdkL637VbaVPYFeEQ52qi.jpg',
    'https://image.tmdb.org/t/p/w185/uitqZVbhvlQV5iLOdbk3itGoNNd.jpg',
  ],
  [
    'https://image.tmdb.org/t/p/w185/uitqZVbhvlQV5iLOdbk3itGoNNd.jpg',
  ],
  [],
];

export default function BoxPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [myBoxes, setMyBoxes] = useState<MyBoxResponse[]>([]);
  const [sharedBoxes, setSharedBoxes] = useState<SharedBoxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 컨텍스트 메뉴 상태
  const [openMenu, setOpenMenu] = useState<MenuTarget | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) { setLoading(false); return; }
    Promise.all([fetchMyBoxList(), fetchSharedBoxList()])
      .then(([myRes, sharedRes]) => {
        setMyBoxes(myRes.boxList);
        setSharedBoxes(sharedRes.sharedBoxList);
      })
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

  return (
    <MobileFrame>
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
              className="h-[40px] px-[24px] bg-wb-orange rounded-[8px] text-[14px] font-bold text-wb-white-02"
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
                onAction={() => {/* TODO: 마이 박스 섹션 메뉴 */}}
                className="mb-3"
              />
              {myBoxes.length > 0 && (
                <ul>
                  {myBoxes.map((box, idx) => (
                    <li
                      key={box.boxId}
                      className="flex items-start pl-[16px] pr-[12px] py-[10px]"
                    >
                      <div
                        className="flex gap-[10px] items-start flex-1 min-w-0 cursor-pointer"
                        onClick={() => goToContents(box.boxId, 'MY', box.name)}
                      >
                        <TriplePosterBox posters={SAMPLE_POSTERS[idx % SAMPLE_POSTERS.length]} />
                        <div className="flex flex-col gap-[3px] min-w-0 flex-1">
                          <p className="text-[16px] font-medium text-white leading-[24px] tracking-[0.15px] line-clamp-2">{box.name}</p>
                          <p className="text-[12px] text-wb-grey-03 leading-[20px] tracking-[0.25px]">마지막 업데이트: 2026-03-25</p>
                        </div>
                      </div>

                      {/* 케밥 버튼 + 컨텍스트 메뉴 */}
                      <div className="relative shrink-0" ref={openMenu?.boxId === box.boxId ? menuRef : undefined}>
                        <button
                          onClick={() => toggleMenu(box.boxId, 'MY')}
                          className="p-1 text-white cursor-pointer"
                        >
                          <EllipsisVerticalSolid className="size-[24px]" />
                        </button>
                        {openMenu?.boxId === box.boxId && (
                          <div className="absolute right-[5px] top-full z-50 mt-1">
                            <ContextMenu items={buildMenuItems(box.boxId, 'MY')} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
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
                onAction={() => {/* TODO: 공유 박스 섹션 메뉴 */}}
                className="mb-3"
              />
              {sharedBoxes.length > 0 && (
                <ul>
                  {sharedBoxes.map((box, idx) => (
                    <li
                      key={box.boxId}
                      className="flex items-start pl-[16px] pr-[12px] py-[10px]"
                    >
                      <div
                        className="flex gap-[10px] items-start flex-1 min-w-0 cursor-pointer"
                        onClick={() => goToContents(box.boxId, 'SHARED', box.name)}
                      >
                        <TriplePosterBox posters={SAMPLE_POSTERS[(idx + 2) % SAMPLE_POSTERS.length]} />
                        <div className="flex flex-col gap-[3px] min-w-0 flex-1">
                          <p className="text-[16px] font-medium text-white leading-[24px] tracking-[0.15px] line-clamp-2">{box.name}</p>
                          <p className="text-[12px] text-wb-primary leading-[20px] tracking-[0.25px] truncate">
                            {box.members.map((m) => m.boxMemberName).join(', ')}
                          </p>
                        </div>
                      </div>

                      {/* 케밥 버튼 + 컨텍스트 메뉴 */}
                      <div className="relative shrink-0" ref={openMenu?.boxId === box.boxId ? menuRef : undefined}>
                        <button
                          onClick={() => toggleMenu(box.boxId, 'SHARED')}
                          className="p-1 text-white cursor-pointer"
                        >
                          <EllipsisVerticalSolid className="size-[24px]" />
                        </button>
                        {openMenu?.boxId === box.boxId && (
                          <div className="absolute right-[5px] top-full z-50 mt-1">
                            <ContextMenu items={buildMenuItems(box.boxId, 'SHARED')} />
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
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

      <BottomMenu />
    </MobileFrame>
  );
}
