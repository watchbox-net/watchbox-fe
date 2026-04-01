'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import Toast from '@/components/common/Toast';
import BoxForm from '@/components/box/BoxForm';
import { fetchMyBox, fetchSharedBox, updateMyBox, updateSharedBox } from '@/lib/api/box';
import type { BoxType } from '@/types/box';

export default function BoxEditPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const boxId = Number(params.boxId);
  const boxType = (searchParams.get('type') as BoxType) || 'MY';

  const [loading, setLoading] = useState(true);
  const [initialName, setInitialName] = useState('');
  const [initialDescription, setInitialDescription] = useState('');
  const [toast, setToast] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        if (boxType === 'SHARED') {
          const box = await fetchSharedBox(boxId);
          setInitialName(box.name);
          setInitialDescription(box.description || '');
        } else {
          const box = await fetchMyBox(boxId);
          setInitialName(box.name);
          setInitialDescription(box.description || '');
        }
      } catch {
        alert('박스 정보를 불러올 수 없습니다.');
        router.back();
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [boxId, boxType, router]);

  const handleSubmit = async (data: { name: string; description?: string; boxType: BoxType }) => {
    const req = { name: data.name, description: data.description };

    if (boxType === 'MY') {
      await updateMyBox(boxId, req);
    } else {
      await updateSharedBox(boxId, req);
    }

    setToast(true);
    setTimeout(() => router.push('/box'), 1500);
  };

  if (loading) {
    return (
      <MobileFrame>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500 text-sm">불러오는 중...</p>
        </div>
        <BottomMenu />
      </MobileFrame>
    );
  }

  return (
    <MobileFrame>
      <BoxForm
        mode="edit"
        initialName={initialName}
        initialDescription={initialDescription}
        initialBoxType={boxType}
        boxTypeDisabled
        onSubmit={handleSubmit}
      />
      <BottomMenu />
      <Toast message="박스가 수정되었습니다!" visible={toast} onClose={() => setToast(false)} />
    </MobileFrame>
  );
}
