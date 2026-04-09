'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Toast from '@/components/common/Toast';
import BoxForm from '@/components/box/BoxForm';
import { fetchBox, updateBox } from '@/lib/api/box';
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
        const box = await fetchBox(boxId);
        setInitialName(box.name);
        setInitialDescription(box.description || '');
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
    await updateBox(boxId, { name: data.name, description: data.description });

    setToast(true);
    setTimeout(() => router.push('/box'), 1500);
  };

  if (loading) {
    return (
      <>
        <div className="flex-1 flex items-center justify-center">
          <p className="text-neutral-500 text-sm">불러오는 중...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <BoxForm
        mode="edit"
        initialName={initialName}
        initialDescription={initialDescription}
        initialBoxType={boxType}
        boxTypeDisabled
        onSubmit={handleSubmit}
      />
      <Toast message="박스가 수정되었습니다!" visible={toast} onClose={() => setToast(false)} />
    </>
  );
}
