'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Header from '@/components/common/Header';
import BottomSheet from '@/components/common/BottomSheet';
import MainContent from '@/components/common/MainContent';
import { PlusOutline } from '@/components/icons';
import ListTitle from '@/components/list/ListTitle';
import { fetchMyBoxList, fetchSharedBoxList } from '@/lib/api/box';
import type { MyBoxResponse, SharedBoxResponse, BoxType } from '@/types/box';

export default function BoxPage() {
  const router = useRouter();
  const [myBoxes, setMyBoxes] = useState<MyBoxResponse[]>([]);
  const [sharedBoxes, setSharedBoxes] = useState<SharedBoxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // 바텀시트 상태
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedBox, setSelectedBox] = useState<{ boxId: number; boxType: BoxType } | null>(null);

  useEffect(() => {
    Promise.all([fetchMyBoxList(), fetchSharedBoxList()])
      .then(([myRes, sharedRes]) => {
        setMyBoxes(myRes.boxList);
        setSharedBoxes(sharedRes.sharedBoxList);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const openMenu = (boxId: number, boxType: BoxType) => {
    setSelectedBox({ boxId, boxType });
    setSheetOpen(true);
  };

  const goToContents = (boxId: number, boxType: BoxType, name: string) => {
    router.push(`/box/${boxId}/contents?type=${boxType}&name=${encodeURIComponent(name)}`);
  };

  const sheetItems = [
    // 초대: 공유 박스에서만 표시
    ...(selectedBox?.boxType === 'SHARED'
      ? [
          {
            icon: '✓',
            label: '초대',
            onClick: () => {
              if (selectedBox) {
                router.push(`/box/invite/${selectedBox.boxId}`);
              }
            },
          },
        ]
      : []),
    {
      icon: '✎',
      label: '수정',
      onClick: () => {
        if (selectedBox) {
          router.push(`/box/edit/${selectedBox.boxId}?type=${selectedBox.boxType}`);
        }
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

        {!loading && error && (
          <p className="text-center text-neutral-500 py-8">
            로그인이 필요하거나 오류가 발생했습니다.
          </p>
        )}

        {!loading && !error && (
          <>
            {/* 마이 박스 */}
            <section className="mb-8">
              <ListTitle
                title={`마이 박스 (${myBoxes.length})`}
                variant="kebab"
                onAction={() => {/* TODO: 마이 박스 섹션 메뉴 */}}
                className="mb-3"
              />
              {myBoxes.length > 0 && (
                <ul className="space-y-3">
                  {myBoxes.map((box) => (
                    <li
                      key={box.boxId}
                      className="flex items-center gap-3 py-2 border-b border-neutral-800"
                    >
                      <div
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => goToContents(box.boxId, 'MY', box.name)}
                      >
                        <div className="w-24 h-16 rounded bg-neutral-800 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-wb-white truncate">
                            {box.name}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMenu(box.boxId, 'MY')}
                        className="text-neutral-400 text-xl px-1 cursor-pointer shrink-0"
                      >
                        ⋮
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => router.push('/box/create')}
                className="flex items-center justify-center gap-2 w-full py-4 cursor-pointer"
              >
                <PlusOutline className="size-5 text-wb-grey-02" />
                <span className="text-sm text-wb-grey-02">새 박스 만들기</span>
              </button>
            </section>

            {/* 공유 박스 */}
            <section>
              <ListTitle
                title={`공유 박스 (${sharedBoxes.length})`}
                variant="kebab"
                onAction={() => {/* TODO: 공유 박스 섹션 메뉴 */}}
                className="mb-3"
              />
              {sharedBoxes.length > 0 && (
                <ul className="space-y-3">
                  {sharedBoxes.map((box) => (
                    <li
                      key={box.boxId}
                      className="flex items-center gap-3 py-2 border-b border-neutral-800"
                    >
                      <div
                        className="flex items-center gap-3 flex-1 min-w-0 cursor-pointer"
                        onClick={() => goToContents(box.boxId, 'SHARED', box.name)}
                      >
                        <div className="w-24 h-16 rounded bg-neutral-800 shrink-0" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-wb-white truncate">
                            {box.name}
                          </p>
                          <p className="text-xs text-neutral-500 truncate">
                            {box.members.map((m) => m.boxMemberName).join(', ')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => openMenu(box.boxId, 'SHARED')}
                        className="text-neutral-400 text-xl px-1 cursor-pointer shrink-0"
                      >
                        ⋮
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <button
                onClick={() => router.push('/box/create')}
                className="flex items-center justify-center gap-2 w-full py-4 cursor-pointer"
              >
                <PlusOutline className="size-5 text-wb-grey-02" />
                <span className="text-sm text-wb-grey-02">새 박스 만들기</span>
              </button>
            </section>
          </>
        )}
      </MainContent>

      {/* 바텀시트 */}
      <BottomSheet
        visible={sheetOpen}
        onClose={() => setSheetOpen(false)}
        items={sheetItems}
      />

      <BottomMenu />
    </MobileFrame>
  );
}
