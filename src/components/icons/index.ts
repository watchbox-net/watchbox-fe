/**
 * WatchBox 아이콘 인덱스
 * Figma Style Guides / Icon Buttons 기반 heroicons re-export
 *
 * 사용법:
 *   import { OutlineIcons, SolidIcons } from '@/components/icons';
 *   <OutlineIcons.HeartIcon className="w-6 h-6" />
 *   <SolidIcons.HeartIcon className="w-6 h-6" />
 */

// ─── Outline (24x24 stroke) ─────────────────────────────────
export {
  ArchiveBoxIcon as ArchiveBoxOutline,
  AdjustmentsHorizontalIcon as AdjustmentsHorizontalOutline,
  ArrowDownIcon as ArrowDownOutline,
  ArrowDownCircleIcon as ArrowDownCircleOutline,
  ArrowLeftIcon as ArrowLeftOutline,
  ArrowLeftCircleIcon as ArrowLeftCircleOutline,
  ArrowRightIcon as ArrowRightOutline,
  ArrowRightCircleIcon as ArrowRightCircleOutline,
  ArrowUpIcon as ArrowUpOutline,
  ArrowUpCircleIcon as ArrowUpCircleOutline,
  Bars3Icon as Bars3Outline,
  Bars4Icon as Bars4Outline,
  BellIcon as BellOutline,
  BellAlertIcon as BellAlertOutline,
  BellSlashIcon as BellSlashOutline,
  CheckIcon as CheckOutline,
  CheckCircleIcon as CheckCircleOutline,
  // ChevronDown → 아래에서 strokeWidth=0.5 래핑
  // ChevronLeft, ChevronRight → 아래에서 strokeWidth=2 래핑
  ChevronUpIcon as ChevronUpOutline,
  Cog6ToothIcon as Cog6ToothOutline,
  Cog8ToothIcon as Cog8ToothOutline,
  EllipsisHorizontalIcon as EllipsisHorizontalOutline,
  EllipsisVerticalIcon as EllipsisVerticalOutline,
  ExclamationCircleIcon as ExclamationCircleOutline,
  ExclamationTriangleIcon as ExclamationTriangleOutline,
  EyeIcon as EyeOutline,
  EyeSlashIcon as EyeSlashOutline,
  FilmIcon as FilmOutline,
  HandThumbDownIcon as HandThumbDownOutline,
  HandThumbUpIcon as HandThumbUpOutline,
  HeartIcon as HeartOutline,
  HomeIcon as HomeOutline,
  MagnifyingGlassIcon as MagnifyingGlassOutline,
  MegaphoneIcon as MegaphoneOutline,
  PauseIcon as PauseOutline,
  PauseCircleIcon as PauseCircleOutline,
  PencilIcon as PencilOutline,
  PencilSquareIcon as PencilSquareOutline,
  PhotoIcon as PhotoOutline,
  PlayIcon as PlayOutline,
  PlayCircleIcon as PlayCircleOutline,
  // PlusIcon → 아래에서 strokeWidth=2 래핑
  PlusCircleIcon as PlusCircleOutline,
  QuestionMarkCircleIcon as QuestionMarkCircleOutline,
  RectangleStackIcon as RectangleStackOutline,
  Squares2X2Icon as Squares2X2Outline,
  StopIcon as StopOutline,
  StopCircleIcon as StopCircleOutline,
  TagIcon as TagOutline,
  TrashIcon as TrashOutline,
  UserIcon as UserOutline,
  UserCircleIcon as UserCircleOutline,
  UserGroupIcon as UserGroupOutline,
  UserMinusIcon as UserMinusOutline,
  UserPlusIcon as UserPlusOutline,
  UsersIcon as UsersOutline,
  VideoCameraIcon as VideoCameraOutline,
  VideoCameraSlashIcon as VideoCameraSlashOutline,
  XCircleIcon as XCircleOutline,
  // XMarkIcon → 아래에서 strokeWidth=2 래핑
} from '@heroicons/react/24/outline';

import React from 'react';
import {
  PlusIcon as _PlusIcon,
  XMarkIcon as _XMarkIcon,
  ChevronLeftIcon as _ChevronLeftIcon,
  ChevronRightIcon as _ChevronRightIcon,
  ChevronDownIcon as _ChevronDownIcon,
} from '@heroicons/react/24/outline';

// Plus, XMark, ChevronLeft, ChevronRight 기본 strokeWidth=2
export const PlusOutline = ((props: React.ComponentProps<typeof _PlusIcon>) =>
  React.createElement(_PlusIcon, { strokeWidth: 2, ...props })) as typeof _PlusIcon;
export const XMarkOutline = ((props: React.ComponentProps<typeof _XMarkIcon>) =>
  React.createElement(_XMarkIcon, { strokeWidth: 2, ...props })) as typeof _XMarkIcon;
export const ChevronLeftOutline = ((props: React.ComponentProps<typeof _ChevronLeftIcon>) =>
  React.createElement(_ChevronLeftIcon, { strokeWidth: 2.5, ...props })) as typeof _ChevronLeftIcon;
export const ChevronRightOutline = ((props: React.ComponentProps<typeof _ChevronRightIcon>) =>
  React.createElement(_ChevronRightIcon, { strokeWidth: 2.5, ...props })) as typeof _ChevronRightIcon;

// ChevronDown 기본 strokeWidth=0.5
export const ChevronDownOutline = ((props: React.ComponentProps<typeof _ChevronDownIcon>) =>
  React.createElement(_ChevronDownIcon, { strokeWidth: 1.7, ...props })) as typeof _ChevronDownIcon;

// ─── Solid (24x24 fill) ─────────────────────────────────────
export {
  ArchiveBoxIcon as ArchiveBoxSolid,
  BellIcon as BellSolid,
  BellAlertIcon as BellAlertSolid,
  BellSlashIcon as BellSlashSolid,
  CheckCircleIcon as CheckCircleSolid,
  Cog6ToothIcon as Cog6ToothSolid,
  Cog8ToothIcon as Cog8ToothSolid,
  EllipsisVerticalIcon as EllipsisVerticalSolid,
  ExclamationCircleIcon as ExclamationCircleSolid,
  ExclamationTriangleIcon as ExclamationTriangleSolid,
  EyeIcon as EyeSolid,
  EyeSlashIcon as EyeSlashSolid,
  FilmIcon as FilmSolid,
  HandThumbDownIcon as HandThumbDownSolid,
  HandThumbUpIcon as HandThumbUpSolid,
  HeartIcon as HeartSolid,
  HomeIcon as HomeSolid,
  MagnifyingGlassIcon as MagnifyingGlassSolid,
  MegaphoneIcon as MegaphoneSolid,
  PauseCircleIcon as PauseCircleSolid,
  PencilIcon as PencilSolid,
  PencilSquareIcon as PencilSquareSolid,
  PhotoIcon as PhotoSolid,
  PlayCircleIcon as PlayCircleSolid,
  PlusCircleIcon as PlusCircleSolid,
  QuestionMarkCircleIcon as QuestionMarkCircleSolid,
  RectangleStackIcon as RectangleStackSolid,
  Squares2X2Icon as Squares2X2Solid,
  StopCircleIcon as StopCircleSolid,
  TagIcon as TagSolid,
  TrashIcon as TrashSolid,
  UserIcon as UserSolid,
  UserCircleIcon as UserCircleSolid,
  UserGroupIcon as UserGroupSolid,
  UserMinusIcon as UserMinusSolid,
  UserPlusIcon as UserPlusSolid,
  UsersIcon as UsersSolid,
  VideoCameraIcon as VideoCameraSolid,
  VideoCameraSlashIcon as VideoCameraSlashSolid,
  XCircleIcon as XCircleSolid,
} from '@heroicons/react/24/solid';

// ─── Namespace re-export (편의용) ────────────────────────────
import * as _Outline from '@heroicons/react/24/outline';
import * as _Solid from '@heroicons/react/24/solid';

export const OutlineIcons = _Outline;
export const SolidIcons = _Solid;

// ─── Custom Icon Components (Figma Design) ──────────────────
export { default as BellNewAlarmIcon } from './BellNewAlarmIcon';
export { default as CircleXIcon } from './CircleXIcon';
export { default as HistoryIcon } from './HistoryIcon';
export { default as WatchStatusIcon } from './WatchStatusIcon';
export { default as LikeIcon } from './LikeIcon';
export { default as BoxIcon } from './BoxIcon';
export { default as ProfileIcon } from './ProfileIcon';
export { default as GoogleCircleLogo } from './GoogleCircleLogo';

export type { WatchStatus, WatchStatusSize } from './WatchStatusIcon';
export type { LikeIconSize } from './LikeIcon';
export type { BoxIconVariant, BoxIconSize } from './BoxIcon';
export type { DeleteIconVariant } from './DeleteIcon';
export type { AddedStatusVariant } from './AddedStatusIcon';
export type { ProfileIconVariant } from './ProfileIcon';
export type { GoogleCircleLogoVariant } from './GoogleCircleLogo';
