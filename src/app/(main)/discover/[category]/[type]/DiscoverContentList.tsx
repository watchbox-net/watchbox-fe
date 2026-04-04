'use client';

import { useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ContentListItem from '@/components/list/ContentListItem';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import Modal from '@/components/common/Modal';
import Toast from '@/components/common/Toast';
import { useAuth } from '@/lib/hooks/useAuth';
import { upsertWatchStatus, deleteWatchRecord } from '@/lib/api/record';
import { getImageUrl, getDisplayTitle } from '@/lib/utils/content';
import type { ContentItem, WatchStatus } from '@/types/content';

interface DiscoverContentListProps {
  items: ContentItem[];
}

const STATUS_LABEL: Record<Exclude<WatchStatus, 'NONE'>, string> = {
  COMPLETED: '시청 완료',
  WATCHING: '시청중',
  PLANNED: '시청 예정',
  PAUSED: '시청 중단',
};

export default function DiscoverContentList({ items: initialItems }: DiscoverContentListProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [items, setItems] = useState(initialItems);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);
  const [menuDir, setMenuDir] = useState<'down' | 'up'>('down');
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '' });
  const menuRef = useRef<HTMLDivElement>(null);

  const showToast = (message: string) =>
    setToast({ visible: true, message });

  const handleStatusSelect = async (
    item: ContentItem,
    status: Exclude<WatchStatus, 'NONE'>,
  ) => {
    setOpenMenuId(null);
    const summary = item.contentSummary;
    if (summary.mediaType !== 'MOVIE' && summary.mediaType !== 'TV') return;
    try {
      await upsertWatchStatus({
        contentId: summary.contentId,
        watchMediaType: summary.mediaType,
        watchStatus: status,
      });
      setItems((prev) =>
        prev.map((i) =>
          i.contentSummary.contentId === summary.contentId
            ? { ...i, memberRecord: { ...i.memberRecord, liked: i.memberRecord?.liked ?? null, watchStatus: status } }
            : i,
        ),
      );
      showToast(`${STATUS_LABEL[status]}로 변경되었습니다.`);
    } catch {/* 에러 무시 */}
  };

  const handleDelete = async (item: ContentItem) => {
    setOpenMenuId(null);
    if (!item.contentRecordId) return;
    try {
      await deleteWatchRecord(item.contentRecordId);
      setItems((prev) =>
        prev.map((i) =>
          i.contentSummary.contentId === item.contentSummary.contentId
            ? { ...i, memberRecord: null, contentRecordId: null }
            : i,
        ),
      );
      showToast('시청 기록이 삭제되었습니다.');
    } catch {/* 에러 무시 */}
  };

  return (
    <>
      <div>
        {items.map((item, idx) => {
          const summary = item.contentSummary;
          const year = 'year' in summary ? summary.year : null;
          const genres = 'genreList' in summary ? summary.genreList : null;
          const itemId = summary.contentId;
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
            <ContentListItem
              key={itemId}
              posterSrc={getImageUrl(summary)}
              title={getDisplayTitle(summary)}
              year={year}
              genres={genres}
              watchStatus={item.memberRecord?.watchStatus ?? null}
              boxMode={item.memberRecord?.liked != null ? { mode: 'my', liked: item.memberRecord.liked } : undefined}
              showDivider={idx < items.length - 1}
              onClick={() => router.push(`/content/${summary.mediaType}/${summary.contentId}`)}
              onStatusClick={(e) => {
                if (!authLoading && !isAuthenticated) { setLoginModalVisible(true); return; }
                if (isMenuOpen) { setOpenMenuId(null); return; }
                const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
                setMenuDir(window.innerHeight - rect.bottom < 220 ? 'up' : 'down');
                setOpenMenuId(itemId);
              }}
              statusMenuSlot={menu}
            />
          );
        })}
      </div>

      <Modal
        visible={loginModalVisible}
        variant="login"
        title="로그인이 필요합니다"
        body="시청 상태를 변경하려면\n로그인이 필요합니다."
        confirmLabel="로그인"
        cancelLabel="취소"
        onCancel={() => setLoginModalVisible(false)}
        onConfirm={() => { setLoginModalVisible(false); router.push('/login'); }}
      />
      <Toast
        message={toast.message}
        visible={toast.visible}
        onClose={() => setToast((t) => ({ ...t, visible: false }))}
      />
    </>
  );
}
