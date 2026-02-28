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

  if (!CATEGORY_MAP[category] || !TYPE_MAP[type]) {
    notFound();
  }

  const title = `${CATEGORY_MAP[category]} ${TYPE_MAP[type]}`;

  try {
    if (type === 'movie') {
      const { contentItemList } = await fetchPopularMovieList();
      return (
        <MobileFrame>
          <Header />
          <main className="p-4">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div>
              {contentItemList.map((item) => (
                <div key={item.contentSummary.contentId} className="flex gap-2 mb-2">
                  <span>{item.contentSummary.contentId}</span>
                  <span>{item.contentSummary.title}</span>
                  <span>{item.contentSummary.voteAverage}</span>
                </div>
              ))}
            </div>
          </main>
          <BottomMenu />
        </MobileFrame>
      );
    }

    if (type === 'tv') {
      const { contentItemList } = await fetchPopularTvList();
      return (
        <MobileFrame>
          <Header />
          <main className="p-4">
            <h1 className="text-xl font-bold mb-4">{title}</h1>
            <div>
              {contentItemList.map((item) => (
                <div key={item.contentSummary.contentId} className="flex gap-2 mb-2">
                  <span>{item.contentSummary.contentId}</span>
                  <span>{item.contentSummary.name}</span>
                  <span>{item.contentSummary.voteAverage}</span>
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
