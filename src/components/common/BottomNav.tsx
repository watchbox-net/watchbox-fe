'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  HomeIcon,
  MagnifyingGlassIcon,
  ArchiveBoxIcon,
  FilmIcon,
  UserIcon,
} from '@heroicons/react/24/solid';
import type { ComponentType, SVGProps } from 'react';

// ─── 탭 정의 ────────────────────────────────────────────────
type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface NavTab {
  label: string;
  href: string;
  icon: HeroIcon;
}

const TABS: NavTab[] = [
  { label: '홈',   href: '/',        icon: HomeIcon },
  { label: '검색', href: '/search',  icon: MagnifyingGlassIcon },
  { label: '박스', href: '/box',     icon: ArchiveBoxIcon },
  { label: '기록', href: '/record',  icon: FilmIcon },
  { label: '마이', href: '/my',      icon: UserIcon },
];

// ─── 컴포넌트 ────────────────────────────────────────────────

interface BottomNavProps {
  /** 데모용: pathname을 외부에서 주입할 때 사용 */
  overridePathname?: string;
}

export default function BottomNav({ overridePathname }: BottomNavProps) {
  const realPathname = usePathname();
  const pathname = overridePathname ?? realPathname;

  const isActive = (href: string) =>
    href === '/'
      ? pathname === '/' || pathname.startsWith('/discover')
      : pathname.startsWith(href);

  return (
    <nav className={`bg-wb-dark-01 flex items-center justify-between px-4 ${
      overridePathname ? 'w-full' : 'sticky bottom-0 w-full'
    }`}>
      {TABS.map((tab) => {
        const active = isActive(tab.href);

        return (
          <Link
            key={tab.href}
            href={tab.href}
            className="flex flex-col items-center justify-center gap-2 w-16 h-[72px] pb-[10px]"
          >
            <tab.icon
              className={`w-[22px] h-[22px] ${
                active ? 'text-wb-white' : 'text-wb-dark-05'
              }`}
            />
            <span
              className={`wb-menu-bottombar ${
                active ? 'text-wb-white' : 'text-wb-dark-05'
              }`}
            >
              {tab.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
