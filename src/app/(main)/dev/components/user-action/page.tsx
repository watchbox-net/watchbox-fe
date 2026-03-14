'use client';

import Link from 'next/link';

export default function UserActionComponentsPage() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / User Action</h1>
      </div>

      <p className="text-sm text-neutral-500">
        User Action 컴포넌트 (버튼, 모달, 바텀시트 등)가 여기에 추가됩니다.
      </p>
    </div>
  );
}
