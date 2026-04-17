'use client';

import LogoWide from '@/components/icons/LogoWide';

export default function DevLogoPage() {
  return (
    <div className="min-h-screen bg-wb-dark-02 p-6">
      <h1 className="text-2xl font-bold text-white mb-8">Logo</h1>

      {/* LogoWide */}
      <section className="mb-10">
        <h2 className="text-lg font-semibold text-wb-grey-03 mb-4">LogoWide</h2>
        <div className="flex flex-col gap-6">
          {/* 다크 배경 */}
          <div className="bg-wb-dark-01 rounded-[12px] p-8 flex items-center justify-center">
            <LogoWide />
          </div>
          {/* 밝은 배경 */}
          <div className="bg-white rounded-[12px] p-8 flex items-center justify-center">
            <LogoWide />
          </div>
        </div>
      </section>
    </div>
  );
}
