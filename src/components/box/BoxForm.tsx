'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import { ChevronDownOutline } from '@/components/icons';
import Button from '@/components/common/Button';
import MainContent from '@/components/common/MainContent';
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
      <Header variant="back" title={title} onBack={() => router.back()} />

      <MainContent className="px-[12px] flex flex-col">
        {/* 이름 */}
        <div className="mb-5">
          <label className="block text-[14px] font-medium text-wb-grey-03 mb-[5px]">
            이름
          </label>
          <div className="py-[5px]">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 30))}
              placeholder="박스 이름"
              className="w-full h-[48px] bg-wb-dark-03 border-[0.5px] border-wb-dark-05 rounded-[8px] px-[15px] text-[15px] font-medium text-wb-white outline-none placeholder:text-wb-grey-01"
            />
          </div>
          <p className="text-[10px] font-medium text-wb-grey-01 text-right mt-[2px] mr-[2px]">
            {name.length} / 30
          </p>
        </div>

        {/* 설명 */}
        <div className="mb-5">
          <label className="block text-[14px] font-medium text-wb-grey-03 mb-[5px]">
            설명(선택)
          </label>
          <div className="py-[5px]">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value.slice(0, 100))}
              placeholder="박스 설명"
              className="w-full h-[87px] bg-wb-dark-03 border-[0.5px] border-wb-dark-05 rounded-[8px] px-[15px] py-[16px] text-[15px] font-medium text-wb-white outline-none placeholder:text-wb-grey-01 resize-none"
            />
          </div>
          <p className="text-[10px] font-medium text-wb-grey-01 text-right mt-[2px] mr-[2px]">
            {description.length} / 100
          </p>
        </div>

        {/* 박스 유형 */}
        <div className="mb-5">
          <label className="block text-[14px] font-medium text-wb-grey-03 mb-[5px]">
            박스 유형
          </label>
          <div className="py-[5px] relative">
            <select
              value={boxType}
              onChange={(e) => setBoxType(e.target.value as BoxType)}
              disabled={boxTypeDisabled}
              className={`w-full h-[48px] border-[0.5px] rounded-[8px] px-[15px] pr-[40px] text-[15px] font-medium outline-none appearance-none ${
                boxTypeDisabled
                  ? 'bg-wb-dark-03 border-wb-dark-05 text-wb-grey-01 cursor-not-allowed'
                  : 'bg-wb-dark-03 border-wb-dark-05 text-wb-white cursor-pointer'
              }`}
            >
              <option value="MY">마이 박스</option>
              <option value="SHARED">공유 박스</option>
            </select>
            {!boxTypeDisabled && (
              <ChevronDownOutline className="absolute right-[15px] top-1/2 -translate-y-1/2 size-[22px] text-wb-grey-04 pointer-events-none" />
            )}
          </div>
        </div>

        {/* 제출 버튼 */}
        <div className="mt-3">
          <Button
            size="wide"
            variant={!name.trim() || submitting ? 'off' : 'save'}
            onClick={handleSubmit}
            disabled={!name.trim() || submitting}
          >
            {submitting ? buttonLoadingText : buttonText}
          </Button>
        </div>
      </MainContent>
    </>
  );
}
