import MobileFrame from '@/components/common/MobileFrame';
import BottomMenu from '@/components/common/BottomMenu';
import { fetchPopularMovieList } from '@/api/movie';
import { fetchPopularTvList } from '@/api/tv';
import { notFound } from 'next/navigation';
import type { ContentItem } from '@/types/content';
import { getImageUrl, getDisplayTitle, getSubText } from '@/lib/utils/content';

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
    let contentItems: ContentItem[] = [];

    if (type === 'movie') {
      const response = await fetchPopularMovieList();
      contentItems = response.contentItemList;
    } else if (type === 'tv') {
      const response = await fetchPopularTvList();
      contentItems = response.contentItemList;
    }

    return (
      <MobileFrame>
        <main className="flex-1 overflow-y-auto pb-24">
          <h1 className="text-lg font-bold px-4 py-3">{title}</h1>
          <ul>
            {contentItems.map((item) => (
              <li
                key={item.contentSummary.contentId}
                className="flex items-center gap-3 px-4 py-3 border-b border-neutral-800"
              >
                {getImageUrl(item.contentSummary) ? (
                  <img
                    src={getImageUrl(item.contentSummary)!}
                    alt={getDisplayTitle(item.contentSummary)}
                    className="w-16 h-22 rounded object-cover shrink-0 bg-neutral-800"
                  />
                ) : (
                  <div className="w-16 h-22 rounded bg-neutral-800 shrink-0 flex items-center justify-center text-neutral-600 text-xs">
                    No img
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-black truncate">
                    {getDisplayTitle(item.contentSummary)}
                  </p>
                  <p className="text-xs text-neutral-500 truncate">
                    {getSubText(item.contentSummary)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </main>
        <BottomMenu />
      </MobileFrame>
    );
  } catch (error) {
    console.error(error);
    return (
      <MobileFrame>
        <main className="p-4">
          <h1 className="text-lg font-bold mb-4">{title}</h1>
          <p className="text-neutral-500">오류가 발생했습니다.</p>
        </main>
        <BottomMenu />
      </MobileFrame>
    );
  }
}
