'use client';

import Image from 'next/image';
import Header from '@/components/common/Header';
import MainContent from '@/components/common/MainContent';

const INFO_ITEMS: { label: string; value: React.ReactNode }[] = [
  {
    label: '서비스 소개',
    value: (
      <>
        <p>영화, 시리즈, 인물 정보를 탐색하고</p>
        <p>간편하게 기록 및 사용자들끼리 공유하는 서비스</p>
      </>
    ),
  },
  { label: '버전', value: <p>v1.3.1-beta</p> },
  { label: '이메일', value: <p>watchboxnet@gmail.net</p> },
  { label: '제작자', value: <p>최현</p> },
];

export default function ServiceInfoPage() {
  return (
    <>
      <Header variant="back" title="서비스 정보" />

      <MainContent>
        <div className="flex flex-col items-center gap-[50px] pt-[28px]">
          <Image
            src="/logo-text/LogoTextH2.5.svg"
            alt="WatchBox"
            width={180}
            height={38}
            priority
          />

          <div className="flex flex-col gap-[25px] w-full">
            {INFO_ITEMS.map(({ label, value }) => (
              <div key={label} className="flex flex-col gap-[10px] px-[18px]">
                <p className="text-[12px] font-medium text-wb-grey-03 leading-none">
                  {label}
                </p>
                <div className="text-[16px] text-white pb-[20px] border-b border-wb-dark-04">
                  {value}
                </div>
              </div>
            ))}
          </div>
        </div>
      </MainContent>
    </>
  );
}
