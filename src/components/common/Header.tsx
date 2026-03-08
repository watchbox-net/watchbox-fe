'use client';

import { useRouter } from 'next/navigation';
import {
  ChevronLeftOutline,
  MagnifyingGlassOutline,
  BellSolid,
  XCircleSolid,
} from '@/components/icons';

// ─── Types ──────────────────────────────────────────────────
export type HeaderVariant =
  | 'center'
  | 'back'
  | 'icon1'
  | 'icon1-back'
  | 'icon2'
  | 'icon2-back'
  | 'search-before'
  | 'search-after'
  | 'search-with-header'
  | 'edit'
  | 'done';

interface HeaderProps {
  variant?: HeaderVariant;
  title?: string;
  onBack?: () => void;
  onSearch?: () => void;
  onAlarm?: () => void;
  onEdit?: () => void;
  onDone?: () => void;
  /** icon1 / icon1-back 우측 아이콘을 커스텀할 때 사용 */
  rightIcon?: React.ReactNode;
  onRightIconClick?: () => void;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  onSearchClear?: () => void;
  onSearchSubmit?: () => void;
  searchPlaceholder?: string;
  onSearchBarClick?: () => void;
}

const DEFAULT_PLACEHOLDER = '영화, 시리즈, 인물을 검색해보세요';

export default function Header({
  variant = 'center',
  title = 'WatchBox',
  onBack,
  onSearch,
  onAlarm,
  onEdit,
  onDone,
  rightIcon,
  onRightIconClick,
  searchValue,
  onSearchChange,
  onSearchClear,
  onSearchSubmit,
  searchPlaceholder = DEFAULT_PLACEHOLDER,
  onSearchBarClick,
}: HeaderProps) {
  const router = useRouter();
  const isSearch = variant.startsWith('search');
  const hasBack = ['back', 'icon1-back', 'icon2-back', 'done'].includes(variant) ||
    (variant === 'search-after' && onBack !== undefined);
  const handleBack = onBack ?? (() => router.back());

  const heightPadding =
    ['search-before', 'search-after'].includes(variant)
      ? 'h-[60px] pt-4 pb-2'
      : variant === 'search-with-header'
        ? 'h-[50px] py-[7px]'
        : 'h-[50px] py-3';

  return (
    <header
      className={`relative flex items-center px-[10px] w-full ${heightPadding}${
        variant === 'search-after' ? ' gap-[5px]' : ''
      }`}
    >
      {/* 뒤로가기 */}
      {hasBack && (
        <button type="button" onClick={handleBack} className="shrink-0">
          <ChevronLeftOutline className="size-6 text-wb-grey-04" />
        </button>
      )}

      {/* ── 타이틀 헤더 (비검색 variants) ── */}
      {!isSearch && (
        <>
          <p className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 wb-header-title text-wb-grey-04 whitespace-nowrap">
            {title}
          </p>

          {(variant === 'icon2' || variant === 'icon2-back') && (
            <div className="ml-auto flex items-center gap-[15px]">
              <button type="button" onClick={onAlarm}>
                <BellSolid className="size-6 text-wb-grey-04" />
              </button>
              <button type="button" onClick={onSearch}>
                <MagnifyingGlassOutline className="size-6 text-wb-grey-04" />
              </button>
            </div>
          )}

          {(variant === 'icon1' || variant === 'icon1-back') && (
            <button type="button" onClick={onRightIconClick ?? onSearch} className="ml-auto">
              {rightIcon ?? <MagnifyingGlassOutline className="size-6 text-wb-grey-04" />}
            </button>
          )}

          {variant === 'edit' && (
            <button type="button" onClick={onEdit} className="ml-auto wb-header-edit text-wb-primary">
              편집
            </button>
          )}

          {variant === 'done' && (
            <button type="button" onClick={onDone} className="ml-auto wb-header-edit text-wb-primary">
              완료
            </button>
          )}
        </>
      )}

      {/* ── 검색바 (검색 variants) ── */}
      {isSearch && variant === 'search-after' && (
        <div className="bg-wb-dark-05 flex items-center h-[36px] pl-4 pr-3 rounded-[10px] flex-1">
          <MagnifyingGlassOutline className="size-[17px] text-wb-grey-02 shrink-0" />
          <input
            type="text"
            value={searchValue ?? ''}
            onChange={(e) => onSearchChange?.(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && onSearchSubmit?.()}
            placeholder={searchPlaceholder}
            autoFocus
            className="flex-1 ml-[9px] bg-transparent text-wb-grey-04 placeholder:text-wb-grey-02 text-[15px] font-normal leading-none outline-none"
          />
          {searchValue && (
            <button type="button" onClick={onSearchClear} className="shrink-0 ml-1">
              <XCircleSolid className="size-[15px] text-wb-grey-02" />
            </button>
          )}
        </div>
      )}

      {isSearch && variant !== 'search-after' && (
        <button
          type="button"
          onClick={onSearchBarClick}
          className="bg-wb-dark-05 flex items-center h-[36px] pl-4 pr-3 rounded-[10px] flex-1 text-left"
        >
          <MagnifyingGlassOutline className="size-[17px] text-wb-grey-02 shrink-0" />
          <span className="ml-[9px] text-wb-grey-02 text-[15px] font-normal leading-none whitespace-nowrap">
            {searchPlaceholder}
          </span>
        </button>
      )}
    </header>
  );
}
