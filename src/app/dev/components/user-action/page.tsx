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
import MediaTypeButton from '@/components/common/MediaTypeButton';
import MediaTypeSwitchButton from '@/components/common/MediaTypeSwitchButton';
import Toast from '@/components/common/Toast';
import SnackBar from '@/components/common/SnackBar';
import { CircleXIcon } from '@/components/icons';

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
  const [mediaTypeSelected, setMediaTypeSelected] = useState<'all' | 'movie' | 'tv'>('all');
  const [toastVisible, setToastVisible] = useState(false);
  const [snackBarVisible, setSnackBarVisible] = useState(false);

  const activeDemo = MODAL_DEMOS.find((d) => d.variant === activeModal);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / User Action</h1>
      </div>

      {/* ── Toast & SnackBar ─────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Toast & SnackBar</h2>

        <div className="flex gap-3 mb-4">
          <button
            onClick={() => setToastVisible(true)}
            className="bg-neutral-100 text-neutral-800 px-3 py-2 rounded text-sm hover:bg-neutral-200"
          >
            Toast 띄우기
          </button>
          <button
            onClick={() => setSnackBarVisible(true)}
            className="bg-neutral-100 text-neutral-800 px-3 py-2 rounded text-sm hover:bg-neutral-200"
          >
            SnackBar 띄우기
          </button>
        </div>

        <div className="space-y-4">
          {/* Toast 미리보기 (인라인) */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">Toast — 자동 사라짐, 액션 없음</p>
            <div className="bg-wb-dark-02 rounded-lg p-4">
              <div className="bg-wb-dark-04 rounded-[8px] shadow-[0px_4px_6px_rgba(0,0,0,0.2)] flex items-center px-[18px] py-[11px]">
                <p className="text-[13px] tracking-[0.25px] leading-[18px] text-wb-white-02">
                  박스에 추가했습니다.
                </p>
              </div>
            </div>
          </div>

          {/* SnackBar 미리보기 (인라인) — 한 줄 */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">SnackBar — 한 줄</p>
            <div className="bg-wb-dark-02 rounded-lg p-4">
              <div className="bg-wb-white-02 rounded-[8px] shadow-[0px_4px_6px_rgba(0,0,0,0.35)] flex items-center gap-[16px] px-[18px] py-[10px]">
                <p className="flex-1 text-[13px] tracking-[0.25px] leading-[17px] text-wb-dark-01">
                  <span className="font-semibold">강조할 텍스트</span>와 일반 텍스트 내용 알림
                </p>
                <div className="flex items-center gap-[16px] shrink-0">
                  <span className="text-[13px] font-semibold tracking-[0.25px] leading-[20px] text-wb-blue">보러가기</span>
                  <CircleXIcon size={20} className="text-[#353535]" />
                </div>
              </div>
            </div>
          </div>

          {/* SnackBar 미리보기 (인라인) — 두 줄 */}
          <div>
            <p className="text-xs font-semibold text-neutral-500 mb-2">SnackBar — 두 줄 (긴 텍스트)</p>
            <div className="bg-wb-dark-02 rounded-lg p-4 max-w-[430px]">
              <div className="bg-wb-white-02 rounded-[8px] shadow-[0px_4px_6px_rgba(0,0,0,0.35)] flex items-center gap-[16px] px-[18px] py-[10px]">
                <p className="flex-1 text-[13px] tracking-[0.25px] leading-[17px] text-wb-dark-01">
                  <span className="font-semibold">너구리</span>님이 회원님을 &apos;<span className="font-semibold">너구리와 해달의 즐겁고 무서운 공유 박스</span>&apos;에 초대했습니다.
                </p>
                <div className="flex items-center gap-[16px] shrink-0">
                  <span className="text-[13px] font-semibold tracking-[0.25px] leading-[20px] text-wb-blue">보러가기</span>
                  <CircleXIcon size={20} className="text-[#353535]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

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

      {/* ── Media Type Button / Switch Button / Line ───── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Media Type Button & Switch</h2>

        {/* Media Type Button */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 mb-2">Media Type Button — selected vs not</p>
          <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-3">
            <MediaTypeButton selected>전체</MediaTypeButton>
            <MediaTypeButton>영화</MediaTypeButton>
            <MediaTypeButton>시리즈</MediaTypeButton>
          </div>
        </div>

        {/* Media Type Switch Button */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-neutral-500 mb-2">Media Type Switch Button — person / watch-media</p>
          <div className="bg-wb-dark-02 rounded-lg p-6 flex gap-4">
            <MediaTypeSwitchButton variant="person" />
            <MediaTypeSwitchButton variant="watch-media" />
          </div>
        </div>

        {/* Content Media Type Line — 박스 컨텐츠 페이지에서 사용되는 row 조합 */}
        <div>
          <p className="text-xs font-semibold text-neutral-500 mb-2">Content Media Type Line — 박스 컨텐츠 페이지 row</p>
          <div className="bg-wb-dark-02 rounded-lg py-3">
            {/* watch-media 모드 */}
            <div className="flex items-center justify-between pl-[16px] pr-[5px] mb-3">
              <div className="flex items-center gap-[8px]">
                <MediaTypeButton selected={mediaTypeSelected === 'all'} onClick={() => setMediaTypeSelected('all')}>전체</MediaTypeButton>
                <MediaTypeButton selected={mediaTypeSelected === 'movie'} onClick={() => setMediaTypeSelected('movie')}>영화</MediaTypeButton>
                <MediaTypeButton selected={mediaTypeSelected === 'tv'} onClick={() => setMediaTypeSelected('tv')}>시리즈</MediaTypeButton>
              </div>
              <MediaTypeSwitchButton variant="person" />
            </div>
            {/* people 모드 */}
            <div className="flex items-center justify-between pl-[16px] pr-[5px]">
              <MediaTypeButton selected>인물</MediaTypeButton>
              <MediaTypeSwitchButton variant="watch-media" />
            </div>
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

      {/* Toast / SnackBar 렌더 */}
      <Toast
        message="박스에 추가했습니다."
        visible={toastVisible}
        onClose={() => setToastVisible(false)}
      />
      <SnackBar
        highlight="{너구리 1}"
        message="님으로부터 박스 초대 요청이 도착했습니다."
        visible={snackBarVisible}
        onClose={() => setSnackBarVisible(false)}
        actionLabel="보러가기"
        onAction={() => { alert('초대 페이지로 이동'); setSnackBarVisible(false); }}
      />

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
