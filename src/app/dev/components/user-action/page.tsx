'use client';

import { useState } from 'react';
import Link from 'next/link';
import Button from '@/components/common/Button';
import Modal from '@/components/common/Modal';
import type { ModalVariant } from '@/components/common/Modal';
import ContextMenu from '@/components/common/ContextMenu';
import PlainContextMenu from '@/components/common/PlainContextMenu';
import WatchStatusMenu from '@/components/common/WatchStatusMenu';
import type { WatchStatusFilter } from '@/components/common/WatchStatusMenu';

const MODAL_DEMOS: { variant: ModalVariant; title: string; body: string; confirmLabel?: string }[] = [
  { variant: 'confirm',   title: '사용자 검색하기',     body: '공유 박스 멤버를 초대하기 위해\n사용자 검색 화면으로 이동하시겠습니까?' },
  { variant: 'invite',    title: '박스 초대',           body: '공유 박스 멤버를 초대하기 위해\n사용자 검색 화면으로 이동하시겠습니까?' },
  { variant: 'login',     title: '로그인이 필요해요',    body: '이 기능을 사용하려면 로그인이 필요합니다.\n로그인 화면으로 이동하시겠습니까?' },
  { variant: 'body-only', title: '',                    body: '{너구리 1}님에게 {박스명} 공유 박스로\n초대하겠습니까?' },
  { variant: 'delete',    title: '박스 삭제',           body: '이 박스를 삭제하시겠습니까?' },
  { variant: 'error',     title: '오류가 발생했어요',    body: '잠시 후에 다시 시도해주세요', confirmLabel: '확인' },
  { variant: 'preparing', title: '아직 준비중이에요',    body: '' },
];

export default function UserActionComponentsPage() {
  const [activeModal, setActiveModal] = useState<ModalVariant | null>(null);
  const [boxContentFilter, setBoxContentFilter] = useState<WatchStatusFilter>('PLANNED');
  const [contentRecordFilter, setContentRecordFilter] = useState<WatchStatusFilter>('LIKED');

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
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-2">List (w-55, h-28)</p>
          <div className="bg-wb-dark-02 rounded-lg p-4 flex flex-wrap gap-3">
            <Button size="list" variant="accept">수락</Button>
            <Button size="list" variant="reject">거절</Button>
            <Button size="list" variant="delete">삭제</Button>
          </div>
        </div>
      </section>

      {/* ── Modal ──────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Modal</h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
      </section>

      {/* ── Context Menu ────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Context Menu</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-8">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">small — 초대 / 수정 / 삭제</p>
            <ContextMenu
              items={[
                { type: 'invite', onClick: () => alert('초대') },
                { type: 'edit',   onClick: () => alert('수정') },
                { type: 'delete', onClick: () => alert('삭제') },
              ]}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">medium — 알림 설정 / 피드백하기 / 정보</p>
            <ContextMenu
              size="medium"
              items={[
                { type: 'notification', onClick: () => alert('알림 설정') },
                { type: 'feedback',     onClick: () => alert('피드백하기') },
                { type: 'info',         onClick: () => alert('정보') },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Watch Status Menu (variants) ───── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Watch Status Menu</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex flex-wrap gap-8 items-start">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">upsert — 시청 상태 + 기록 삭제</p>
            <WatchStatusMenu
              variant="upsert"
              onSelect={(s) => alert(`상태: ${s}`)}
              onDelete={() => alert('기록 삭제')}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">box-content — 필터 (전체 / 기록 없음)</p>
            <WatchStatusMenu
              variant="box-content"
              selected={boxContentFilter}
              onFilterChange={(f) => setBoxContentFilter(f)}
            />
            <p className="mt-2 text-[11px] text-neutral-400">선택: {boxContentFilter}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">content-record — 필터 (전체 / 좋아요)</p>
            <WatchStatusMenu
              variant="content-record"
              selected={contentRecordFilter}
              onFilterChange={(f) => setContentRecordFilter(f)}
            />
            <p className="mt-2 text-[11px] text-neutral-400">선택: {contentRecordFilter}</p>
          </div>
        </div>
      </section>

      {/* ── Plain Context Menu ─────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Plain Context Menu</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-8">
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">w120 — 정렬 옵션</p>
            <PlainContextMenu
              items={[
                { label: '최근 저장순', onClick: () => alert('최근 저장순') },
                { label: '오래된 저장순', onClick: () => alert('오래된 저장순') },
                { label: '최근 연도순', onClick: () => alert('최근 연도순') },
                { label: '오래된 연도순', onClick: () => alert('오래된 연도순') },
              ]}
            />
          </div>
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-3">w135 — 좋아요 필터</p>
            <PlainContextMenu
              size="w135"
              items={[
                { label: '모두', onClick: () => alert('모두') },
                { label: '나의 좋아요', onClick: () => alert('나의 좋아요') },
                { label: '다른 멤버의 좋아요', onClick: () => alert('다른 멤버의 좋아요') },
                { label: '공통 좋아요', onClick: () => alert('공통 좋아요') },
              ]}
            />
          </div>
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
