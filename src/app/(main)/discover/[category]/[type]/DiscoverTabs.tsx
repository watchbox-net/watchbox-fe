'use client';

import { useRouter } from 'next/navigation';
import TabNav from '@/components/common/TabNav';

const TABS = ['영화', '시리즈'];
const TYPE_KEYS = ['movie', 'tv'];

interface DiscoverTabsProps {
  category: string;
  type: string;
}

export default function DiscoverTabs({ category, type }: DiscoverTabsProps) {
  const router = useRouter();
  const activeIndex = TYPE_KEYS.indexOf(type);

  const handleChange = (index: number) => {
    router.replace(`/discover/${category}/${TYPE_KEYS[index]}`);
  };

  return (
    <TabNav
      tabs={TABS}
      activeIndex={activeIndex}
      onChange={handleChange}
    />
  );
}
