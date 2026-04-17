'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ContentItem from '@/components/list/ContentItem';
import ContentList from '@/components/list/ContentList';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import Toast from '@/components/common/Toast';
import { useAuth } from '@/lib/context/AuthContext';
import { useLoginModal } from '@/lib/context/LoginModalContext';
import { useWatchStatus } from '@/lib/hooks/useWatchStatus';
import { deleteWatchRecord } from '@/lib/api/record';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';
import type { ContentItem as ContentItemData, WatchStatus } from '@/types/content-summary';

interface DiscoverContentListProps {
  items: ContentItemData[];
}

export default function DiscoverContentList({ items: initialItems }: DiscoverContentListProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { showLoginModal } = useLoginModal();
  const [items, setItems] = useState(initialItems);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const [toast, setToast] = useState({ visible: false, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) =>
    setToast({ visible: true, message });

  const { changeStatus } = useWatchStatus({ showToast });

  const handleStatusSelect = async (
    item: ContentItemData,
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    setOpenMenuId(null);
    const summary = item.contentSummary;
    if (summary.mediaType !== 'MOVIE' && summary.mediaType !== 'TV') return;
    const success = await changeStatus(summary.tmdbId, summary.mediaType, status);
    if (success) {
      setItems((prev) =>
        prev.map((i) =>
          i.contentSummary.tmdbId === summary.tmdbId
            ? { ...i, memberRecord: { recordId: i.memberRecord?.recordId ?? null, liked: i.memberRecord?.liked ?? null, watchStatus: status } }
            : i,
        ),
      );
    }
  };

  const handleDelete = async (item: ContentItemData) => {
    setOpenMenuId(null);
    if (!item.memberRecord?.recordId) return;
    try {
      await deleteWatchRecord(item.memberRecord.recordId);
      setItems((prev) =>
        prev.map((i) =>
          i.contentSummary.tmdbId === item.contentSummary.tmdbId
            ? { ...i, memberRecord: null }
            : i,
        ),
      );
      showToast('시청 기록이 삭제되었습니다.');
    } catch {/* 에러 무시 */}
  };

  return (
    <>
      <ContentList>
        {items.map((item) => {
          const summary = item.contentSummary;
          const year = 'year' in summary ? summary.year : null;
          const genres = 'genreList' in summary ? summary.genreList : null;
          const itemId = summary.tmdbId;
          const isMenuOpen = openMenuId === itemId;

          const menu: ReactNode = isMenuOpen ? (
            <div
              ref={menuRef}
              className={`absolute right-0 z-50 ${menuDir === 'down' ? 'top-full mt-1' : 'bottom-full mb-1'}`}
            >
              <WatchStatusMenu
                onSelect={(status) => handleStatusSelect(item, status)}
                onDelete={() => handleDelete(item)}
              />
            </div>
          ) : null;

          return (
            <ContentItem
              key={itemId}
              posterSrc={getImageUrl(summary)}
              title={getDisplayTitle(summary)}
              year={year}
              genres={genres}
              watchStatus={item.memberRecord?.watchStatus ?? null}
              boxMode={item.memberRecord?.liked != null ? { mode: 'my', liked: item.memberRecord.liked } : undefined}
              onClick={() => router.push(`/content/${summary.mediaType}/${summary.tmdbId}`)}
              onStatusClick={(e) => {
                if (!authLoading && !isAuthenticated) { showLoginModal(); return; }
                if (isMenuOpen) { setOpenMenuId(null); return; }
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setMenuDir(window.innerHeight - rect.bottom < 220 ? 'up' : 'down');
                setOpenMenuId(itemId);
              }}
              statusMenuSlot={menu}
            />
          );
        })}
      </ContentList>

      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
