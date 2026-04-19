import Header from '@/components/common/Header';
import Link from 'next/link';

const DISCOVER_LINKS = [
  { href: '/discover/popular/movie', label: '인기 영화' },
  { href: '/discover/popular/tv', label: '인기 시리즈' },
  { href: '/discover/top-rated/movie', label: '높은 평점의 영화' },
  { href: '/discover/top-rated/tv', label: '높은 평점의 시리즈' },
  { href: '/discover/now-showing/movie', label: '현재 상영중인 영화' },
  { href: '/discover/now-showing/tv', label: '현재 방영중인 시리즈' },
  { href: '/discover/trending/movie', label: '이번주 트렌드 영화' },
  { href: '/discover/trending/tv', label: '이번주 트렌드 시리즈' },
];

export default function DiscoverPage() {
  return (
    <>
      <Header />
      <main className="p-4">
        <h1 className="text-xl font-bold mb-4">둘러보기</h1>
        <div className="flex flex-col gap-2">
          {DISCOVER_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="p-3 bg-gray-100 rounded hover:bg-gray-200"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}