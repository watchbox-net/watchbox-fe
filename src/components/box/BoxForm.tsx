'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { BoxType } from '@/types/box';

interface BoxFormProps {
  mode: 'create' | 'edit';
  initialName?: string;
  initialDescription?: string;
  initialBoxType?: BoxType;
  /** edit 모드에서 박스 유형 변경 불가 */
  boxTypeDisabled?: boolean;
  onSubmit: (data: { name: string; description?: string; boxType: BoxType }) => Promise<void>;
}

export default function BoxForm({
  mode,
  initialName = '',
  initialDescription = '',
  initialBoxType = 'MY',
  boxTypeDisabled = false,
  onSubmit,
}: BoxFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [boxType, setBoxType] = useState<BoxType>(initialBoxType);
  const [submitting, setSubmitting] = useState(false);

  const isCreate = mode === 'create';
  const title = isCreate ? '박스 만들기' : '박스 수정';
  const buttonText = isCreate ? '만들기' : '저장';
  const buttonLoadingText = isCreate ? '생성 중...' : '저장 중...';

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    setSubmitting(true);
    try {
      await onSubmit({
        name: trimmedName,
        description: description.trim() || undefined,
        boxType,
      });
    } catch {
      alert(isCreate ? '박스 생성에 실패했습니다.' : '박스 수정에 실패했습니다.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* 헤더 */}
      <div className="flex items-center py-4 px-4 relative">
        <button
          onClick={() => router.back()}
          className="text-black text-xl cursor-pointer"
        >
          ‹
        </button>
        <h1 className="text-lg font-bold flex-1 text-center">{title}</h1>
        <div className="w-6" />
      </div>

      <main className="flex-1 px-4 flex flex-col">
        {/* 이름 */}
        <div className="mb-5">
          <label className="block text-sm text-black mb-2">이름</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, 30))}
            placeholder="박스 이름"
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 text-sm outline-none placeholder-neutral-500"
          />
          <p className="text-xs text-neutral-500 text-right mt-1">
            {name.length} / 30
          </p>
        </div>

        {/* 설명 */}
        <div className="mb-5">
          <label className="block text-sm text-black mb-2">설명(선택)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value.slice(0, 100))}
            placeholder="박스 설명"
            rows={3}
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 text-sm outline-none placeholder-neutral-500 resize-none"
          />
          <p className="text-xs text-neutral-500 text-right mt-1">
            {description.length} / 100
          </p>
        </div>

        {/* 박스 유형 */}
        <div className="mb-5">
          <label className="block text-sm text-black mb-2">박스 유형</label>
          <select
            value={boxType}
            onChange={(e) => setBoxType(e.target.value as BoxType)}
            disabled={boxTypeDisabled}
            className="w-full bg-neutral-800 text-white rounded-lg px-4 py-3 text-sm outline-none appearance-none cursor-pointer disabled:opacity-60"
          >
            <option value="MY">마이 박스</option>
            <option value="SHARED">공유 박스</option>
          </select>
        </div>

        <div className="flex-1" />

        {/* 제출 버튼 */}
        <button
          onClick={handleSubmit}
          disabled={!name.trim() || submitting}
          className="w-full py-4 rounded-lg text-base font-bold mb-6 cursor-pointer
            bg-emerald-500 text-black disabled:bg-neutral-700 disabled:text-neutral-500"
        >
          {submitting ? buttonLoadingText : buttonText}
        </button>
      </main>
    </>
  );
}
