'use client';

import Button from './Button';
import { ExclamationCircleSolid } from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export type ModalVariant = 'confirm' | 'invite' | 'login' | 'body-only' | 'delete' | 'error';

interface ModalProps {
  visible: boolean;
  variant?: ModalVariant;
  title?: string;
  /** 본문 (줄바꿈은 \n) */
  body?: string;
  onCancel?: () => void;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
}

// ─── variant별 기본 확인 버튼 설정 ──────────────────────────
const CONFIRM_DEFAULTS: Record<ModalVariant, { label: string; variant: 'accept' | 'invite' | 'alert' }> = {
  confirm:     { label: '이동', variant: 'accept' },
  invite:      { label: '초대', variant: 'invite' },
  login:       { label: '이동', variant: 'accept' },
  'body-only': { label: '이동', variant: 'accept' },
  delete:      { label: '삭제', variant: 'alert' },
  error:       { label: '확인', variant: 'accept' },
};

// ─── Component ──────────────────────────────────────────────
export default function Modal({
  visible,
  variant = 'confirm',
  title,
  body,
  onCancel,
  onConfirm,
  confirmLabel,
  cancelLabel = '취소',
}: ModalProps) {
  if (!visible) return null;

  const confirm = CONFIRM_DEFAULTS[variant];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-wb-black/50">
      <div className="bg-wb-grey-03 rounded-[18px] pt-[25px] pb-[18px] px-[23px] w-[321px]">
        <div className="flex flex-col gap-[30px]">
          {/* Text Content */}
          <div className="flex flex-col gap-[14px]">
            {variant === 'error' ? (
              <div className="flex flex-col gap-[10px]">
                <div className="flex items-center gap-[5px]">
                  <ExclamationCircleSolid className="size-[25px] text-wb-red" />
                  <p className="wb-modal-header text-wb-dark-02">{title}</p>
                </div>
                {body && <p className="wb-modal-body text-wb-dark-05">{body}</p>}
              </div>
            ) : (
              <>
                {variant !== 'body-only' && title && (
                  <p className="wb-modal-header text-wb-dark-02">{title}</p>
                )}
                {body && (
                  <div className="wb-modal-body text-wb-dark-05">
                    {body.split('\n').map((line, i) => (
                      <p key={i} className={i > 0 ? 'mt-[5px]' : ''}>
                        {line}
                      </p>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-[10px]">
            <Button size="modal" variant="cancel" onClick={onCancel}>
              {cancelLabel}
            </Button>
            <Button size="modal" variant={confirm.variant} onClick={onConfirm}>
              {confirmLabel ?? confirm.label}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
