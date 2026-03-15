'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import type { ModalVariant } from '@/components/common/Modal';
import StatusMenu from '@/components/common/StatusMenu';

const MODAL_DEMOS: { variant: ModalVariant; title: string; body: string; confirmLabel?: string }[] = [
  { variant: 'confirm',   title: '사용자 검색하기',     body: '공유 박스 멤버를 초대하기 위해\n사용자 검색 화면으로 이동하시겠습니까?' },
  { variant: 'invite',    title: '박스 초대',           body: '공유 박스 멤버를 초대하기 위해\n사용자 검색 화면으로 이동하시겠습니까?' },
  { variant: 'login',     title: '로그인이 필요해요',    body: '이 기능을 사용하려면 로그인이 필요합니다.\n로그인 화면으로 이동하시겠습니까?' },
  { variant: 'body-only', title: '',                    body: '{너구리 1}님에게 {박스명} 공유 박스로\n초대하겠습니까?' },
  { variant: 'delete',    title: '박스 삭제',           body: '이 박스를 삭제하시겠습니까?' },
  { variant: 'error',     title: '오류가 발생했어요',    body: '잠시 후에 다시 시도해주세요', confirmLabel: '확인' },
];

export default function UserActionComponentsPage() {
  const [activeModal, setActiveModal] = useState<ModalVariant | null>(null);

  const activeDemo = MODAL_DEMOS.find((d) => d.variant === activeModal);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / User Action</h1>
      </div>

      {/* ── Button ─────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Button</h2>

        {/* Wide */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 mb-2">Wide (w-full, h-48)</p>
          <div className="bg-wb-dark-02 rounded-lg p-4 space-y-3">
            <Button size="wide" variant="save">만들기</Button>
            <Button size="wide" variant="off">만들기</Button>
            <Button size="wide" variant="white">만들기</Button>
          </div>
        </div>

        {/* Modal */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 mb-2">Modal (w-75, h-40)</p>
          <div className="bg-wb-dark-02 rounded-lg p-4 flex flex-wrap gap-3">
            <Button size="modal" variant="cancel">취소</Button>
            <Button size="modal" variant="accept">이동</Button>
            <Button size="modal" variant="invite">초대</Button>
            <Button size="modal" variant="alert">삭제</Button>
          </div>
        </div>

        {/* List */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 mb-2">List (w-55, h-28)</p>
          <div className="bg-wb-dark-02 rounded-lg p-4 flex flex-wrap gap-3">
            <Button size="list" variant="accept">수락</Button>
            <Button size="list" variant="reject">거절</Button>
            <Button size="list" variant="delete">삭제</Button>
          </div>
        </div>

        {/* 스펙 */}
        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>Wide — h:48px, rounded:8px, wb-button-medium</p>
          <p>Modal — w:75px, h:40px, rounded:10px, wb-button-medium</p>
          <p>List — w:55px, h:28px, rounded:8px, wb-button-small</p>
          <p>Shadow — 0px 1px 2px rgba(10,13,18,0.05)</p>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Modal</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {MODAL_DEMOS.map((demo) => (
            <button
              key={demo.variant}
              onClick={() => setActiveModal(demo.variant)}
              className="bg-neutral-100 text-neutral-800 px-3 py-2 rounded text-sm hover:bg-neutral-200"
            >
              {demo.variant}
            </button>
          ))}
        </div>

        {/* 스펙 */}
        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>배경 — bg-wb-grey-03 (#b1b1b1), rounded:18px</p>
          <p>패딩 — pt:25px, pb:18px, px:23px, w:321px</p>
          <p>제목 — wb-modal-header (20px SemiBold), text-wb-dark-02</p>
          <p>본문 — wb-modal-body (16px Medium), text-wb-dark-05</p>
          <p>버튼 — Button modal 사이즈 사용, gap:10px, 우측 정렬</p>
          <p>error — ExclamationCircleSolid 아이콘 + 제목</p>
          <p>Overlay — fixed inset-0, bg-wb-black/50 (반투명 검정), z-50</p>
        </div>
      </section>

      {/* ── Status Menu ─────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Status Menu</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 inline-block">
          <StatusMenu onSelect={(action) => alert(`선택: ${action}`)} />
        </div>

        {/* 스펙 */}
        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1 mt-4">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>배경 — bg-wb-dark-05 (#353535), rounded:15px, w:135px</p>
          <p>아이템 — h:45px, py:5px, gap:24px</p>
          <p>텍스트 — 14px Medium, lh:24px, text-wb-grey-03</p>
          <p>Hover — bg-wb-grey-01 (#525252), top/bottom rounded:10px</p>
          <p>아이콘 — WatchStatusIcon medium (24px)</p>
        </div>
      </section>

      {/* Modal 렌더 */}
      {activeDemo && (
        <Modal
          visible={activeModal !== null}
          variant={activeDemo.variant}
          title={activeDemo.title}
          body={activeDemo.body}
          confirmLabel={activeDemo.confirmLabel}
          onCancel={() => setActiveModal(null)}
          onConfirm={() => setActiveModal(null)}
        />
      )}
    </div>
  );
}
