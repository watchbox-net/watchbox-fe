'use client'

import { useRouter, usePathname } from 'next/navigation'

export default function BottomMenu() {
    const router = useRouter();
    const pathname = usePathname();

    const isActive = (path: string) => pathname === path;

    return (
        <nav className="fixed bottom-0 left-0 right-0 mx-auto max-w-[393px] h-20 bg-white border-t border-gray-300 flex items-center justify-around">
            <button
                onClick={() => router.push('/')}
                className={`flex flex-col items-center gap-1 cursor-pointer
                            ${isActive('/') ? 'text-black font-semibold' : 'text-gray-400'}`}
            >
                홈
            </button>
            <button
                onClick={() => router.push('/search')}
                className={`flex flex-col items-center gap-1 cursor-pointer
                            ${isActive('/search') ? 'text-black font-semibold' : 'text-gray-400'}`}
            >
                검색
            </button>
            <button
                onClick={() => router.push('/box')}
                className={`flex flex-col items-center gap-1 cursor-pointer
                            ${isActive('/box') ? 'text-black font-semibold' : 'text-gray-400'}`}
            >
                박스
            </button>
            <button
                onClick={() => router.push('/record')}
                className={`flex flex-col items-center gap-1 cursor-pointer
                            ${isActive('/record') ? 'text-black font-semibold' : 'text-gray-400'}`}
            >
                시청기록
            </button>
            <button
                onClick={() => router.push('/my')}
                className={`flex flex-col items-center gap-1 cursor-pointer
                            ${isActive('/my') ? 'text-black font-semibold' : 'text-gray-400'}`}
            >
                마이
            </button>
        </nav>
    );
}