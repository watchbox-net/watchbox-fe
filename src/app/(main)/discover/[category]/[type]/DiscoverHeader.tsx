'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import { RectangleStackSolid } from '@/components/icons';
import { PlainContextMenu } from '@/components/common/ContextMenu';

const CATEGORIES = [
  { key: 'trending', label: '이번주 트렌드' },
  { key: 'popular', label: '인기 작품' },
  { key: 'now-showing', label: '현재 상영중', tvLabel: '현재 방영중' },
  { key: 'top-rated', label: '높은 평점' },
];

interface DiscoverHeaderProps {
  title: string;
  category: string;
  type: string;
}

export default function DiscoverHeader({ title, category, type }: DiscoverHeaderProps) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const activeIndex = CATEGORIES.findIndex((c) => c.key === category);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  return (
    <div className="relative">
      <Header
        variant="icon1-back"
        title={title}
        rightIcon={
          <button type="button" className="cursor-pointer" onClick={() => setMenuOpen((v) => !v)}>
            <RectangleStackSolid className="size-6 text-wb-white-02" />
          </button>
        }
      />
      {menuOpen && (
        <div ref={menuRef} className="absolute right-[10px] top-[45px] z-50">
          <PlainContextMenu
            activeIndex={activeIndex}
            items={CATEGORIES.map((c) => ({
              label: (type === 'tv' && c.tvLabel) ? c.tvLabel : c.label,
              onClick: () => {
                setMenuOpen(false);
                if (c.key !== category) {
                  router.push(`/discover/${c.key}/${type}`);
                }
              },
            }))}
          />
        </div>
      )}
    </div>
  );
}
