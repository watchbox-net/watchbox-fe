'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import BottomSheet from '@/components/common/BottomSheet';
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
    {
      icon: '✓',
      label: '초대',
      onClick: () => {
        // TODO: 초대 기능 구현
      },
    },
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
      {/* 헤더 */}
      <div className="flex items-center justify-between py-4 px-4">
        <h1 className="text-lg font-bold">박스</h1>
        <button
          onClick={() => router.push('/box/create')}
          className="text-sm text-emerald-500 font-semibold cursor-pointer"
        >
          + 새 박스 만들기
        </button>
      </div>

      <main className="flex-1 overflow-y-auto pb-24 px-4">
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
              <h2 className="text-base font-bold mb-3">
                마이 박스 ({myBoxes.length})
              </h2>
              {myBoxes.length === 0 ? (
                <p className="text-sm text-neutral-500">박스가 없습니다.</p>
              ) : (
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
                          <p className="text-sm text-black truncate">
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
            </section>

            {/* 공유 박스 */}
            <section>
              <h2 className="text-base font-bold mb-3">
                공유 박스 ({sharedBoxes.length})
              </h2>
              {sharedBoxes.length === 0 ? (
                <p className="text-sm text-neutral-500">공유 박스가 없습니다.</p>
              ) : (
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
                          <p className="text-sm text-black truncate">
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
            </section>
          </>
        )}
      </main>

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
