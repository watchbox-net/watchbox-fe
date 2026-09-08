'use client';

import Modal from '@/components/common/Modal';

export type PreviewScreen = 'box' | 'record';

// 화면별 안내 문구 (제목은 Modal preview variant 기본값 '미리보기 화면이에요')
const BODY: Record<PreviewScreen, string> = {
  box:    '지금 보이는 박스 화면은 예시예요.\n로그인하면 나만의 박스를 만들고\n친구와 함께 채워갈 수 있어요.',
  record: '지금 보이는 기록 화면은 예시예요.\n로그인하면 내가 본 영화와 시리즈를\n직접 기록하고 관리할 수 있어요.',
};

interface PreviewNoticeModalProps {
  screen: PreviewScreen;
  visible: boolean;
  onClose: () => void;
}

/**
 * 프리뷰 모드 진입 안내 모달
 * 비로그인 상태로 화면에 들어올 때마다 노출한다.
 * 노출 여부는 페이지가 state로 들고 있어 페이지 방문당 1회만 뜨고,
 * 탭/정렬 변경으로 리스트가 다시 로딩돼도 재노출되지 않는다.
 * 로그인 유도는 하단 PreviewOverlay가 담당하므로 여기서는 안내만 한다.
 */
export default function PreviewNoticeModal({ screen, visible, onClose }: PreviewNoticeModalProps) {
  return (
    <Modal
      visible={visible}
      variant="preview"
      body={BODY[screen]}
      onConfirm={onClose}
    />
  );
}
