import MobileFrame from '@/components/common/MobileFrame';
import Header from '@/components/common/Header';
import BottomMenu from '@/components/common/BottomMenu';
import { fetchPopularMovieList } from '@/api/movie';
import { fetchPopularTvList } from '@/api/tv';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{
    category: string;
    type: string;
  }>;
}

const CATEGORY_MAP: Record<string, string> = {
  popular: '인기',
  'top-rated': '높은 평가',
};

const TYPE_MAP: Record<string, string> = {
  movie: '영화',
  tv: '시리즈',
};

export default async function DiscoverCategoryPage({ params }: PageProps) {
  const { category, type } = await params;

  // 유효하지 않은 경로 처리
  if (!CATEGORY_MAP[category] || !TYPE_MAP[type]) {
    notFound();
  }

  const title = `${CATEGORY_MAP[category]} ${TYPE_MAP[type]}`;

  // 현재는 popular만 구현
  // if (category !== 'popular') {
  //   return (
  //     <MobileFrame>
  //       <Header />
  //       <main className="p-4">
  //         <h1 className="text-xl font-bold mb-4">{title}</h1>
  //         <p>준비 중입니다.</p>
  //       </main>
  //       <BottomMenu />
  //     </MobileFrame>
  //   );
  // }

  try {
    if (type === 'movie') {
      const movieList = await fetchPopularMovieList();
      return (
        <MobileFrame>
          <Header />
          <main className="p-4">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div>
              {movieList.map((movie) => (
                <div key={movie.id} className="flex gap-2 mb-2">
                  <span>{movie.id}</span>
                  <span>{movie.title}</span>
                  <span>{movie.voteAverage}</span>
                </div>
              ))}
            </div>
          </main>
          <BottomMenu />
        </MobileFrame>
      );
    }

    else if (type === 'tv') {
      const tvList = await fetchPopularTvList();
      return (
        <MobileFrame>
          <Header />
          <main className="p-4">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div>
              {tvList.map((tv) => (
                <div key={tv.id} className="flex gap-2 mb-2">
                  <span>{tv.id}</span>
                  <span>{tv.nameKo || tv.nameEn}</span>
                  <span>{tv.voteAverage}</span>
                </div>
              ))}
            </div>
          </main>
          <BottomMenu />
        </MobileFrame>
      );
    }
  } catch (error) {
      console.error(error);
    return (
      <MobileFrame>
        <Header />
        <main className="p-4">
          <h1 className="text-xl font-bold mb-4">{title}</h1>
          <p>오류가 발생했습니다.</p>
        </main>
        <BottomMenu />
      </MobileFrame>
    );
  }
}
