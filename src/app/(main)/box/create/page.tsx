'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Toast from '@/components/common/Toast';
import BoxForm from '@/components/box/BoxForm';
import { createMyBox, createSharedBox } from '@/lib/api/box';

export default function BoxCreatePage() {
  const router = useRouter();
  const [toast, setToast] = useState(false);

  const handleSubmit = async (data: { name: string; description?: string; boxType: 'MY' | 'SHARED' }) => {
    const req = { name: data.name, description: data.description };

    if (data.boxType === 'MY') {
      await createMyBox(req);
    } else {
      await createSharedBox(req);
    }

    setToast(true);
    setTimeout(() => router.push('/box'), 1500);
  };

  return (
    <>
      <BoxForm mode="create" onSubmit={handleSubmit} />
      <Toast message="박스가 생성되었습니다!" visible={toast} onClose={() => setToast(false)} />
    </>
  );
}
