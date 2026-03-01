'use client';

import { useEffect, useState } from 'react';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import { fetchMyBoxList, fetchSharedBoxList } from '@/lib/api/box';
import type { MyBoxResponse, SharedBoxResponse } from '@/types/box';

export default function BoxPage() {
  const [myBoxes, setMyBoxes] = useState<MyBoxResponse[]>([]);
  const [sharedBoxes, setSharedBoxes] = useState<SharedBoxResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    Promise.all([fetchMyBoxList(), fetchSharedBoxList()])
      .then(([myRes, sharedRes]) => {
        setMyBoxes(myRes.boxList);
        setSharedBoxes(sharedRes.sharedBoxList);
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MobileFrame>
      {/* 헤더 */}
      <div className="flex items-center justify-center py-4">
        <h1 className="text-lg font-bold">박스</h1>
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
                      <div className="w-24 h-16 rounded bg-neutral-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black truncate">
                          {box.name}
                        </p>
                      </div>
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
                      <div className="w-24 h-16 rounded bg-neutral-800 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-black truncate">
                          {box.name}
                        </p>
                        <p className="text-xs text-neutral-500 truncate">
                          {box.members.map((m) => m.boxMemberName).join(', ')}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </main>

      <BottomMenu />
    </MobileFrame>
  );
}
