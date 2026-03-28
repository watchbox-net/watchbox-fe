'use client';

import { useState } from 'react';
import Link from 'next/link';

// ─── Outline 아이콘 ─────────────────────────────────────────
import {
  ArchiveBoxIcon as ArchiveBoxO,
  AdjustmentsHorizontalIcon as AdjustmentsHorizontalO,
  ArrowDownIcon as ArrowDownO,
  ArrowDownCircleIcon as ArrowDownCircleO,
  ArrowLeftIcon as ArrowLeftO,
  ArrowLeftCircleIcon as ArrowLeftCircleO,
  ArrowRightIcon as ArrowRightO,
  ArrowRightCircleIcon as ArrowRightCircleO,
  ArrowUpIcon as ArrowUpO,
  ArrowUpCircleIcon as ArrowUpCircleO,
  Bars3Icon as Bars3O,
  Bars4Icon as Bars4O,
  BellIcon as BellO,
  BellAlertIcon as BellAlertO,
  BellSlashIcon as BellSlashO,
  CheckIcon as CheckO,
  CheckCircleIcon as CheckCircleO,
  ChevronDownIcon as ChevronDownO,
  ChevronLeftIcon as ChevronLeftO,
  ChevronRightIcon as ChevronRightO,
  ChevronUpIcon as ChevronUpO,
  Cog6ToothIcon as Cog6ToothO,
  Cog8ToothIcon as Cog8ToothO,
  EllipsisHorizontalIcon as EllipsisHorizontalO,
  EllipsisVerticalIcon as EllipsisVerticalO,
  ExclamationCircleIcon as ExclamationCircleO,
  ExclamationTriangleIcon as ExclamationTriangleO,
  EyeIcon as EyeO,
  EyeSlashIcon as EyeSlashO,
  FilmIcon as FilmO,
  HandThumbDownIcon as HandThumbDownO,
  HandThumbUpIcon as HandThumbUpO,
  HeartIcon as HeartO,
  HomeIcon as HomeO,
  MagnifyingGlassIcon as MagnifyingGlassO,
  PauseIcon as PauseO,
  PauseCircleIcon as PauseCircleO,
  PencilIcon as PencilO,
  PencilSquareIcon as PencilSquareO,
  PhotoIcon as PhotoO,
  PlayIcon as PlayO,
  PlayCircleIcon as PlayCircleO,
  PlusIcon as _PlusO,
  PlusCircleIcon as PlusCircleO,
  QuestionMarkCircleIcon as QuestionMarkCircleO,
  RectangleStackIcon as RectangleStackO,
  Squares2X2Icon as Squares2X2O,
  StopIcon as StopO,
  StopCircleIcon as StopCircleO,
  TrashIcon as TrashO,
  UserIcon as UserO,
  UserCircleIcon as UserCircleO,
  UserGroupIcon as UserGroupO,
  UserMinusIcon as UserMinusO,
  UserPlusIcon as UserPlusO,
  UsersIcon as UsersO,
  VideoCameraIcon as VideoCameraO,
  VideoCameraSlashIcon as VideoCameraSlashO,
  XCircleIcon as XCircleO,
  XMarkIcon as _XMarkO,
} from '@heroicons/react/24/outline';

// plus, x-mark 기본 strokeWidth=2
const PlusO = ((props: React.ComponentProps<typeof _PlusO>) => <_PlusO strokeWidth={2} {...props} />) as typeof _PlusO;
const XMarkO = ((props: React.ComponentProps<typeof _XMarkO>) => <_XMarkO strokeWidth={2} {...props} />) as typeof _XMarkO;

// ─── Solid 아이콘 ───────────────────────────────────────────
import {
  ArchiveBoxIcon as ArchiveBoxS,
  BellIcon as BellS,
  BellAlertIcon as BellAlertS,
  BellSlashIcon as BellSlashS,
  CheckCircleIcon as CheckCircleS,
  Cog6ToothIcon as Cog6ToothS,
  Cog8ToothIcon as Cog8ToothS,
  ExclamationCircleIcon as ExclamationCircleS,
  ExclamationTriangleIcon as ExclamationTriangleS,
  EyeIcon as EyeS,
  EyeSlashIcon as EyeSlashS,
  FilmIcon as FilmS,
  HandThumbDownIcon as HandThumbDownS,
  HandThumbUpIcon as HandThumbUpS,
  HeartIcon as HeartS,
  HomeIcon as HomeS,
  MagnifyingGlassIcon as MagnifyingGlassS,
  PauseCircleIcon as PauseCircleS,
  PencilIcon as PencilS,
  PencilSquareIcon as PencilSquareS,
  PhotoIcon as PhotoS,
  PlayCircleIcon as PlayCircleS,
  PlusCircleIcon as PlusCircleS,
  QuestionMarkCircleIcon as QuestionMarkCircleS,
  RectangleStackIcon as RectangleStackS,
  Squares2X2Icon as Squares2X2S,
  StopCircleIcon as StopCircleS,
  TrashIcon as TrashS,
  UserIcon as UserS,
  UserCircleIcon as UserCircleS,
  UserGroupIcon as UserGroupS,
  UserMinusIcon as UserMinusS,
  UserPlusIcon as UserPlusS,
  UsersIcon as UsersS,
  VideoCameraIcon as VideoCameraS,
  VideoCameraSlashIcon as VideoCameraSlashS,
  XCircleIcon as XCircleS,
} from '@heroicons/react/24/solid';

import type { ComponentType, SVGProps } from 'react';

// ─── Color Palette 데이터 (Figma Color Styles) ───────────────
interface ColorToken {
  token: string;       // CSS var 이름 (--wb-dark-01)
  twClass: string;     // Tailwind 클래스 (wb-dark-01)
  hex: string;
  label: string;
}

interface ColorGroup {
  title: string;
  description: string;
  colors: ColorToken[];
}

const COLOR_GROUPS: ColorGroup[] = [
  {
    title: 'Dark Theme / Dark',
    description: '배경, 카드, 서피스에 사용',
    colors: [
      { token: '--wb-dark-01', twClass: 'wb-dark-01', hex: '#101010', label: 'dark01' },
      { token: '--wb-dark-02', twClass: 'wb-dark-02', hex: '#181818', label: 'dark02' },
      { token: '--wb-dark-03', twClass: 'wb-dark-03', hex: '#202020', label: 'dark03' },
      { token: '--wb-dark-04', twClass: 'wb-dark-04', hex: '#2a2a2a', label: 'dark04' },
      { token: '--wb-dark-05', twClass: 'wb-dark-05', hex: '#353535', label: 'dark05' },
    ],
  },
  {
    title: 'Dark Theme / Grey',
    description: '텍스트, 보조 텍스트, 구분선에 사용',
    colors: [
      { token: '--wb-grey-01', twClass: 'wb-grey-01', hex: '#525252', label: 'grey01' },
      { token: '--wb-grey-02', twClass: 'wb-grey-02', hex: '#a3a3a3', label: 'grey02' },
      { token: '--wb-grey-03', twClass: 'wb-grey-03', hex: '#b1b1b1', label: 'grey03' },
      { token: '--wb-grey-04', twClass: 'wb-grey-04', hex: '#d9d9d9', label: 'grey04' },
    ],
  },
  {
    title: 'Light Theme',
    description: '기본 흑백 및 라이트 테마',
    colors: [
      { token: '--wb-black',    twClass: 'wb-black',    hex: '#000000', label: 'black' },
      { token: '--wb-white-01', twClass: 'wb-white-01', hex: '#ffffff', label: 'white01' },
      { token: '--wb-white-02', twClass: 'wb-white-02', hex: '#d9d9d9', label: 'white02' },
    ],
  },
  {
    title: 'Brand',
    description: '브랜드 컬러',
    colors: [
      { token: '--wb-primary', twClass: 'wb-primary', hex: '#f59e0b', label: 'primary' },
      { token: '--wb-green',   twClass: 'wb-green',   hex: '#10b981', label: 'green' },
      { token: '--wb-blue',    twClass: 'wb-blue',    hex: '#3b82f6', label: 'blue' },
      { token: '--wb-orange',  twClass: 'wb-orange',  hex: '#f97316', label: 'orange' },
      { token: '--wb-purple',  twClass: 'wb-purple',  hex: '#a855f7', label: 'purple' },
      { token: '--wb-red',     twClass: 'wb-red',     hex: '#de4e4e', label: 'red' },
    ],
  },
];

// ─── Typography 데이터 (Figma Text Styles) ──────────────────
interface TextStyle {
  name: string;
  twClass: string;       // Tailwind @utility 클래스명
  size: number;          // px
  weight: number;
  weightLabel: string;   // Regular / Medium / Bold
  lineHeight: string;    // '1' | 'normal' | '24px'
  letterSpacing?: string;
}

interface TextStyleGroup {
  category: string;
  styles: TextStyle[];
}

const TEXT_STYLES: TextStyleGroup[] = [
  {
    category: 'Header',
    styles: [
      { name: 'title',  twClass: 'wb-header-title', size: 16, weight: 700, weightLabel: 'Bold',    lineHeight: '1' },
      { name: 'edit',   twClass: 'wb-header-edit',  size: 14, weight: 500, weightLabel: 'Medium',  lineHeight: '1' },
    ],
  },
  {
    category: 'Category',
    styles: [
      { name: 'title',  twClass: 'wb-category-title', size: 20, weight: 700, weightLabel: 'Bold', lineHeight: '1' },
    ],
  },
  {
    category: 'List / Content',
    styles: [
      { name: 'title',  twClass: 'wb-content-title', size: 16, weight: 500, weightLabel: 'Medium',  lineHeight: 'normal' },
      { name: 'info',   twClass: 'wb-content-info',  size: 12, weight: 400, weightLabel: 'Regular', lineHeight: 'normal' },
    ],
  },
  {
    category: 'List / Box',
    styles: [
      { name: 'title',        twClass: 'wb-box-title',   size: 16, weight: 500, weightLabel: 'Medium',  lineHeight: '24px' },
      { name: 'info',         twClass: 'wb-box-info',    size: 12, weight: 400, weightLabel: 'Regular', lineHeight: '20px' },
      { name: 'inviter-name', twClass: 'wb-box-inviter', size: 14, weight: 500, weightLabel: 'Medium',  lineHeight: '20px' },
    ],
  },
  {
    category: 'List / Card',
    styles: [
      { name: 'title', twClass: 'wb-card-title', size: 14, weight: 500, weightLabel: 'Medium', lineHeight: 'normal' },
    ],
  },
  {
    category: 'List / Searched User',
    styles: [
      { name: 'name', twClass: 'wb-user-name', size: 18, weight: 500, weightLabel: 'Medium', lineHeight: '28px' },
    ],
  },
  {
    category: 'Menu',
    styles: [
      { name: 'tab',          twClass: 'wb-menu-tab',         size: 16, weight: 500, weightLabel: 'Medium',  lineHeight: '1' },
      { name: 'bottom-sheet', twClass: 'wb-menu-bottomsheet', size: 14, weight: 500, weightLabel: 'Medium',  lineHeight: '24px' },
      { name: 'bottom-bar',   twClass: 'wb-menu-bottombar',   size: 11, weight: 400, weightLabel: 'Regular', lineHeight: 'normal', letterSpacing: '-0.55px' },
    ],
  },
  {
    category: 'Modal',
    styles: [
      { name: 'header', twClass: 'wb-modal-header', size: 20, weight: 600, weightLabel: 'SemiBold', lineHeight: '1' },
      { name: 'body',   twClass: 'wb-modal-body',   size: 16, weight: 500, weightLabel: 'Medium',   lineHeight: '1' },
    ],
  },
  {
    category: 'Button',
    styles: [
      { name: 'small',  twClass: 'wb-button-small',  size: 13, weight: 500, weightLabel: 'Medium', lineHeight: '16px' },
      { name: 'medium', twClass: 'wb-button-medium', size: 16, weight: 500, weightLabel: 'Medium', lineHeight: '24px' },
    ],
  },
  {
    category: 'Input',
    styles: [
      { name: 'tag',    twClass: 'wb-input-tag',    size: 14, weight: 500, weightLabel: 'Medium', lineHeight: '1' },
      { name: 'body',   twClass: 'wb-input-body',   size: 15, weight: 500, weightLabel: 'Medium', lineHeight: '1' },
      { name: 'footer', twClass: 'wb-input-footer', size: 10, weight: 500, weightLabel: 'Medium', lineHeight: '1' },
    ],
  },
];

// ─── 타입 ────────────────────────────────────────────────────
type HeroIcon = ComponentType<SVGProps<SVGSVGElement>>;

interface IconEntry {
  name: string;
  outline: HeroIcon;
  solid?: HeroIcon;
}

// ─── 아이콘 목록 (Figma Icon Buttons 기반) ───────────────────
const ICONS: IconEntry[] = [
  { name: 'archive-box', outline: ArchiveBoxO, solid: ArchiveBoxS },
  { name: 'adjustments-horizontal', outline: AdjustmentsHorizontalO },
  { name: 'arrow-down', outline: ArrowDownO },
  { name: 'arrow-down-circle', outline: ArrowDownCircleO },
  { name: 'arrow-left', outline: ArrowLeftO },
  { name: 'arrow-left-circle', outline: ArrowLeftCircleO },
  { name: 'arrow-right', outline: ArrowRightO },
  { name: 'arrow-right-circle', outline: ArrowRightCircleO },
  { name: 'arrow-up', outline: ArrowUpO },
  { name: 'arrow-up-circle', outline: ArrowUpCircleO },
  { name: 'bars-3', outline: Bars3O },
  { name: 'bars-4', outline: Bars4O },
  { name: 'bell', outline: BellO, solid: BellS },
  { name: 'bell-alert', outline: BellAlertO, solid: BellAlertS },
  { name: 'bell-slash', outline: BellSlashO, solid: BellSlashS },
  { name: 'check', outline: CheckO },
  { name: 'check-circle', outline: CheckCircleO, solid: CheckCircleS },
  { name: 'chevron-down', outline: ChevronDownO },
  { name: 'chevron-left', outline: ChevronLeftO },
  { name: 'chevron-right', outline: ChevronRightO },
  { name: 'chevron-up', outline: ChevronUpO },
  { name: 'cog-6-tooth', outline: Cog6ToothO, solid: Cog6ToothS },
  { name: 'cog-8-tooth', outline: Cog8ToothO, solid: Cog8ToothS },
  { name: 'ellipsis-horizontal', outline: EllipsisHorizontalO },
  { name: 'ellipsis-vertical', outline: EllipsisVerticalO },
  { name: 'exclamation-circle', outline: ExclamationCircleO, solid: ExclamationCircleS },
  { name: 'exclamation-triangle', outline: ExclamationTriangleO, solid: ExclamationTriangleS },
  { name: 'eye', outline: EyeO, solid: EyeS },
  { name: 'eye-slash', outline: EyeSlashO, solid: EyeSlashS },
  { name: 'film', outline: FilmO, solid: FilmS },
  { name: 'hand-thumb-down', outline: HandThumbDownO, solid: HandThumbDownS },
  { name: 'hand-thumb-up', outline: HandThumbUpO, solid: HandThumbUpS },
  { name: 'heart', outline: HeartO, solid: HeartS },
  { name: 'home', outline: HomeO, solid: HomeS },
  { name: 'magnifying-glass', outline: MagnifyingGlassO, solid: MagnifyingGlassS },
  { name: 'pause', outline: PauseO },
  { name: 'pause-circle', outline: PauseCircleO, solid: PauseCircleS },
  { name: 'pencil', outline: PencilO, solid: PencilS },
  { name: 'pencil-square', outline: PencilSquareO, solid: PencilSquareS },
  { name: 'photo', outline: PhotoO, solid: PhotoS },
  { name: 'play', outline: PlayO },
  { name: 'play-circle', outline: PlayCircleO, solid: PlayCircleS },
  { name: 'plus', outline: PlusO },
  { name: 'plus-circle', outline: PlusCircleO, solid: PlusCircleS },
  { name: 'question-mark-circle', outline: QuestionMarkCircleO, solid: QuestionMarkCircleS },
  { name: 'rectangle-stack', outline: RectangleStackO, solid: RectangleStackS },
  { name: 'squares-2x2', outline: Squares2X2O, solid: Squares2X2S },
  { name: 'stop', outline: StopO },
  { name: 'stop-circle', outline: StopCircleO, solid: StopCircleS },
  { name: 'trash', outline: TrashO, solid: TrashS },
  { name: 'user', outline: UserO, solid: UserS },
  { name: 'user-circle', outline: UserCircleO, solid: UserCircleS },
  { name: 'user-group', outline: UserGroupO, solid: UserGroupS },
  { name: 'user-minus', outline: UserMinusO, solid: UserMinusS },
  { name: 'user-plus', outline: UserPlusO, solid: UserPlusS },
  { name: 'users', outline: UsersO, solid: UsersS },
  { name: 'video-camera', outline: VideoCameraO, solid: VideoCameraS },
  { name: 'video-camera-slash', outline: VideoCameraSlashO, solid: VideoCameraSlashS },
  { name: 'x-circle', outline: XCircleO, solid: XCircleS },
  { name: 'x-mark', outline: XMarkO },
];

// ─── 카테고리 분류 ───────────────────────────────────────────
const CATEGORIES: Record<string, string[]> = {
  'Navigation': [
    'arrow-down', 'arrow-down-circle', 'arrow-left', 'arrow-left-circle',
    'arrow-right', 'arrow-right-circle', 'arrow-up', 'arrow-up-circle',
    'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up',
    'home', 'bars-3', 'bars-4',
  ],
  'Media': [
    'film', 'video-camera', 'video-camera-slash', 'photo',
    'play', 'play-circle', 'pause', 'pause-circle', 'stop', 'stop-circle',
    'rectangle-stack', 'squares-2x2',
  ],
  'User': [
    'user', 'user-circle', 'user-group', 'user-minus', 'user-plus', 'users',
  ],
  'Action': [
    'heart', 'hand-thumb-up', 'hand-thumb-down',
    'check', 'check-circle', 'plus', 'plus-circle',
    'pencil', 'pencil-square', 'archive-box', 'trash',
    'magnifying-glass', 'adjustments-horizontal',
    'x-circle', 'x-mark',
  ],
  'Notification': [
    'bell', 'bell-alert', 'bell-slash',
    'exclamation-circle', 'exclamation-triangle',
    'question-mark-circle',
    'eye', 'eye-slash',
  ],
  'Settings': [
    'cog-6-tooth', 'cog-8-tooth',
    'ellipsis-horizontal', 'ellipsis-vertical',
  ],
};

type ViewMode = 'all' | 'category';
type IconSize = 'sm' | 'md' | 'lg';

const SIZE_CLASS: Record<IconSize, string> = {
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
};

export default function DevStylesPage() {
  const [view, setView] = useState<ViewMode>('all');
  const [size, setSize] = useState<IconSize>('md');
  const [search, setSearch] = useState('');

  const filtered = search
    ? ICONS.filter((i) => i.name.includes(search.toLowerCase()))
    : ICONS;

  return (
    <div className="min-h-screen bg-white p-6 max-w-5xl mx-auto">
      {/* 헤더 */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-black">WatchBox Design System</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Figma Style Guides 기반 — Colors · Typography · Icons
          </p>
        </div>
        <Link href="/dev" className="text-sm text-blue-600 hover:underline">
          &larr; Dev 홈
        </Link>
      </div>

      {/* ── Color Palette ────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-black mb-1">Color Palette</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Figma Color Styles &mdash; <code className="bg-neutral-100 px-1 rounded text-xs">bg-wb-primary</code>,{' '}
          <code className="bg-neutral-100 px-1 rounded text-xs">text-wb-grey-02</code> 형태로 사용
        </p>

        <div className="space-y-8">
          {COLOR_GROUPS.map((group) => (
            <div key={group.title}>
              <div className="mb-3">
                <h3 className="font-semibold text-black text-base">{group.title}</h3>
                <p className="text-xs text-neutral-400">{group.description}</p>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {group.colors.map((color) => (
                  <ColorSwatch key={color.token} color={color} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 사용법 */}
        <div className="mt-6 bg-neutral-100 rounded-lg p-4 text-sm text-black">
          <p className="font-semibold mb-2">사용법</p>
          <pre className="overflow-x-auto text-xs">{`/* Tailwind 클래스 */
bg-wb-primary        text-wb-grey-02       border-wb-dark-03

/* CSS 변수 */
background: var(--wb-primary);
color: var(--wb-grey-02);`}</pre>
        </div>
      </section>

      <hr className="border-neutral-200 mb-10" />

      {/* ── Typography ───────────────────────────────────── */}
      <section className="mb-12">
        <h2 className="text-xl font-bold text-black mb-1">Typography</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Figma Text Styles &mdash; Pretendard Variable &mdash;{' '}
          <code className="bg-neutral-100 px-1 rounded text-xs">wb-header-title</code> 형태로 사용
        </p>

        <div className="space-y-6">
          {TEXT_STYLES.map((group) => (
            <div key={group.category}>
              <h3 className="font-semibold text-black text-sm mb-2 border-b border-neutral-200 pb-1">
                {group.category}
              </h3>
              <div className="space-y-3">
                {group.styles.map((style) => (
                  <div
                    key={style.twClass}
                    className="flex items-baseline gap-4 bg-neutral-50 rounded-lg p-3"
                  >
                    {/* 미리보기 */}
                    <span
                      className="text-black shrink-0"
                      style={{
                        fontSize: `${style.size}px`,
                        fontWeight: style.weight,
                        lineHeight: style.lineHeight,
                        letterSpacing: style.letterSpacing,
                      }}
                    >
                      가나다 Aa 123
                    </span>

                    {/* 메타 */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1 text-xs text-neutral-500 min-w-0">
                      <span className="font-medium text-black">{style.name}</span>
                      <span>{style.size}px</span>
                      <span>{style.weightLabel}({style.weight})</span>
                      <span>lh:{style.lineHeight}</span>
                      {style.letterSpacing && <span>ls:{style.letterSpacing}</span>}
                      <code className="bg-neutral-200 text-neutral-700 px-1 rounded">
                        {style.twClass}
                      </code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 사용법 */}
        <div className="mt-6 bg-neutral-100 rounded-lg p-4 text-sm text-black">
          <p className="font-semibold mb-2">사용법</p>
          <pre className="overflow-x-auto text-xs">{`/* Tailwind @utility 클래스 (globals.css에 정의) */
<h1 className="wb-header-title text-wb-white">제목</h1>
<p className="wb-content-info text-wb-grey-02">부제</p>
<span className="wb-menu-bottombar">탭 라벨</span>`}</pre>
        </div>
      </section>

      <hr className="border-neutral-200 mb-10" />

      {/* ── Icons ────────────────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-1">Icon Library</h2>
        <p className="text-sm text-neutral-500 mb-6">
          Figma Style Guides / Icon Buttons &mdash; heroicons {ICONS.length}개
        </p>

      {/* 컨트롤 바 */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-neutral-100 rounded-lg p-3">
        {/* 검색 */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="아이콘 검색..."
          className="flex-1 min-w-[160px] bg-white border border-neutral-300 rounded px-3 py-1.5 text-sm outline-none"
        />

        {/* 뷰 모드 */}
        <div className="flex rounded overflow-hidden border border-neutral-300">
          <button
            onClick={() => setView('all')}
            className={`px-3 py-1.5 text-xs font-medium ${
              view === 'all'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setView('category')}
            className={`px-3 py-1.5 text-xs font-medium ${
              view === 'category'
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
          >
            카테고리
          </button>
        </div>

        {/* 사이즈 */}
        <div className="flex rounded overflow-hidden border border-neutral-300">
          {(['sm', 'md', 'lg'] as IconSize[]).map((s) => (
            <button
              key={s}
              onClick={() => setSize(s)}
              className={`px-3 py-1.5 text-xs font-medium uppercase ${
                size === s
                  ? 'bg-black text-white'
                  : 'bg-white text-black hover:bg-neutral-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* 아이콘 그리드 */}
      {view === 'all' ? (
        <IconGrid icons={filtered} sizeClass={SIZE_CLASS[size]} />
      ) : (
        Object.entries(CATEGORIES).map(([cat, names]) => {
          const catIcons = ICONS.filter((i) => names.includes(i.name));
          const catFiltered = search
            ? catIcons.filter((i) => i.name.includes(search.toLowerCase()))
            : catIcons;
          if (catFiltered.length === 0) return null;
          return (
            <div key={cat} className="mb-8">
              <h2 className="text-lg font-semibold text-black mb-3 border-b pb-2">
                {cat}
                <span className="text-neutral-400 text-sm font-normal ml-2">
                  {catFiltered.length}
                </span>
              </h2>
              <IconGrid icons={catFiltered} sizeClass={SIZE_CLASS[size]} />
            </div>
          );
        })
      )}

      {/* 사용법 안내 */}
      <div className="mt-8 bg-neutral-100 rounded-lg p-4 text-sm text-black">
        <p className="font-semibold mb-2">사용법</p>
        <pre className="overflow-x-auto text-xs">{`// 방법 1: 개별 import (tree-shaking)
import { HeartOutline, HeartSolid } from '@/components/icons';

// 방법 2: 직접 import
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon } from '@heroicons/react/24/solid';

// 방법 3: 네임스페이스
import { OutlineIcons, SolidIcons } from '@/components/icons';
<OutlineIcons.HeartIcon className="w-6 h-6" />

// 크기·색상 지정 (디자인 토큰 색상 사용 가능)
<HeartOutline className="w-5 h-5 text-wb-primary" />
<HeartSolid   className="w-6 h-6 text-wb-green" />`}</pre>
      </div>

      </section>  {/* /Icons */}
    </div>
  );
}

// ─── 서브 컴포넌트 ───────────────────────────────────────────

function ColorSwatch({ color }: { color: ColorToken }) {
  const isLight = ['#ffffff', '#d9d9d9', '#b1b1b1', '#a3a3a3'].includes(color.hex.toLowerCase());

  return (
    <div className="rounded-lg overflow-hidden border border-neutral-200 text-xs">
      {/* 색상 블록 */}
      <div
        className="h-16 w-full flex items-end p-2"
        style={{ backgroundColor: color.hex }}
      >
        <span
          className="font-mono font-semibold text-[11px] leading-none"
          style={{ color: isLight ? '#333333' : '#ffffff' }}
        >
          {color.hex.toUpperCase()}
        </span>
      </div>
      {/* 정보 */}
      <div className="p-2 bg-white">
        <p className="font-medium text-black truncate">{color.label}</p>
        <p className="text-neutral-400 font-mono truncate mt-0.5">{color.token}</p>
      </div>
    </div>
  );
}

function IconGrid({ icons, sizeClass }: { icons: IconEntry[]; sizeClass: string }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
      {icons.map((entry) => (
        <div
          key={entry.name}
          className="flex flex-col items-center gap-2 p-3 rounded-lg border border-neutral-200 hover:border-neutral-400 hover:bg-neutral-50 transition-colors"
        >
          {/* Outline */}
          <div className="flex items-center gap-2">
            <entry.outline className={`${sizeClass} text-black`} />
            {entry.solid && (
              <entry.solid className={`${sizeClass} text-black`} />
            )}
          </div>
          <span className="text-[10px] text-neutral-500 text-center leading-tight break-all">
            {entry.name}
          </span>
          {entry.solid && (
            <div className="flex gap-1">
              <span className="text-[8px] bg-neutral-200 text-neutral-600 px-1 rounded">O</span>
              <span className="text-[8px] bg-black text-white px-1 rounded">S</span>
            </div>
          )}
          {!entry.solid && (
            <span className="text-[8px] bg-neutral-200 text-neutral-600 px-1 rounded">O</span>
          )}
        </div>
      ))}
    </div>
  );
}
