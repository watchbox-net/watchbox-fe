'use client';

// ─── Types ──────────────────────────────────────────────────
export type ButtonSize = 'wide' | 'modal' | 'list';
export type ButtonVariant =
  | 'save' | 'off' | 'white'       // wide
  | 'cancel' | 'accept' | 'invite' | 'alert'  // modal
  | 'reject' | 'delete';           // list (accept도 공유)

interface ButtonProps {
  size?: ButtonSize;
  variant?: ButtonVariant;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

// ─── Size 스타일 ────────────────────────────────────────────
const SIZE_STYLES: Record<ButtonSize, string> = {
  wide:  'w-full h-[48px] rounded-[8px] wb-button-medium',
  modal: 'w-[75px] h-[40px] rounded-[10px] wb-button-medium',
  list:  'w-[55px] h-[28px] rounded-[8px] wb-button-small',
};

// ─── Variant 스타일 (bg + text) ─────────────────────────────
const VARIANT_STYLES: Record<ButtonVariant, string> = {
  // wide
  save:   'bg-wb-green text-wb-white-01',
  off:    'bg-wb-dark-05 text-wb-grey-01',
  white:  'bg-wb-white-02 text-wb-dark-04',
  // modal
  cancel: 'bg-wb-grey-01 text-wb-grey-03',
  accept: 'bg-wb-dark-02 text-wb-grey-03',
  invite: 'bg-wb-green text-wb-white-01',
  alert:  'bg-wb-red text-wb-white-01',
  // list
  reject: 'bg-wb-dark-04 text-wb-white-01',
  delete: 'bg-wb-red text-wb-white-01',
};

// ─── Component ──────────────────────────────────────────────
export default function Button({
  size = 'wide',
  variant = 'save',
  children,
  onClick,
  disabled,
  className,
}: ButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center justify-center shadow-[0px_1px_2px_0px_rgba(10,13,18,0.05)] disabled:opacity-50 ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${className ?? ''}`}
    >
      {children}
    </button>
  );
}
