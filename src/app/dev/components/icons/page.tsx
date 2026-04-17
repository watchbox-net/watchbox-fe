'use client';

import Link from 'next/link';
import WatchStatusIcon from '@/components/icons/WatchStatusIcon';
import LikeIcon from '@/components/icons/LikeIcon';
import BoxIcon from '@/components/icons/BoxIcon';
import DeleteIcon from '@/components/icons/DeleteIcon';
import AddedStatusIcon from '@/components/icons/AddedStatusIcon';
import ProfileIcon from '@/components/icons/ProfileIcon';
import GoogleCircleLogo from '@/components/icons/GoogleCircleLogo';

import type { WatchStatus, WatchStatusSize } from '@/components/icons/WatchStatusIcon';
import type { LikeIconSize } from '@/components/icons/LikeIcon';
import type { BoxIconVariant, BoxIconSize } from '@/components/icons/BoxIcon';

const WATCH_STATUSES: WatchStatus[] = ['completed', 'watching', 'planned', 'paused', 'none', 'outline'];
const WATCH_STATUS_LABELS: Record<WatchStatus, string> = {
  completed: '시청 완료',
  watching:  '시청 중',
  planned:   '시청 예정',
  paused:    '중단',
  none:      '미설정',
  outline:   '아웃라인',
};

const SIZES: WatchStatusSize[] = ['xl', 'large', 'medium', 'small', 'tiny'];
const SIZE_LABELS: Record<WatchStatusSize, string> = {
  xl: '48px', large: '32px', medium: '24px', small: '20px', tiny: '12px',
};

const BOX_VARIANTS: BoxIconVariant[] = ['added', 'none', 'outline'];
const BOX_VARIANT_LABELS: Record<BoxIconVariant, string> = {
  added: '추가됨', none: '미추가', outline: '아웃라인',
};

export default function IconComponentsPage() {
  return (
    <div className="p-6 max-w-4xl mx-auto space-y-10">
      <div className="flex items-center gap-3">
        <Link href="/dev" className="text-blue-500 text-sm">← Dev</Link>
        <h1 className="text-2xl font-bold text-black">Components / Icons</h1>
      </div>

      {/* ── Watch Status Icon ────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Watch Status Icon</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 overflow-x-auto mb-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-wb-grey-03 pb-3 pr-4">Size</th>
                {WATCH_STATUSES.map((s) => (
                  <th key={s} className="text-center text-xs text-wb-grey-03 pb-3 px-2">
                    {WATCH_STATUS_LABELS[s]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <td className="text-xs text-wb-grey-04 py-2 pr-4 whitespace-nowrap">
                    {size} ({SIZE_LABELS[size]})
                  </td>
                  {WATCH_STATUSES.map((status) => (
                    <td key={status} className="text-center py-2 px-2">
                      <div className="flex justify-center">
                        <WatchStatusIcon status={status} size={size} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>사이즈 — xl:48px, large:32px, medium:24px, small:20px, tiny:12px</p>
          <p>completed — EyeSolid, text-wb-green (#10B981)</p>
          <p>watching — EyeSolid, text-wb-orange (#F97316)</p>
          <p>planned — EyeSolid, text-wb-purple (#A855F7)</p>
          <p>paused — EyeSlashSolid, text-wb-dark-04 (#2A2A2A)</p>
          <p>none — EyeSolid, text-wb-grey-01 (#525252)</p>
          <p>outline — EyeOutline, text-wb-grey-04 (#B1B1B1)</p>
        </div>
      </section>

      {/* ── Like Icon ────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Like Icon</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 mb-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-wb-grey-03 pb-3 pr-4">Size</th>
                <th className="text-center text-xs text-wb-grey-03 pb-3 px-4">Active</th>
                <th className="text-center text-xs text-wb-grey-03 pb-3 px-4">Inactive</th>
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <td className="text-xs text-wb-grey-04 py-2 pr-4">
                    {size} ({SIZE_LABELS[size]})
                  </td>
                  <td className="text-center py-2 px-4">
                    <div className="flex justify-center">
                      <LikeIcon active size={size as LikeIconSize} />
                    </div>
                  </td>
                  <td className="text-center py-2 px-4">
                    <div className="flex justify-center">
                      <LikeIcon active={false} size={size as LikeIconSize} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>사이즈 — xl:48px, large:32px, medium:24px, small:20px, tiny:12px</p>
          <p>active — HandThumbUpSolid, text-wb-red (#DE4E4E)</p>
          <p>inactive — HandThumbUpSolid, text-wb-grey-01 (#525252)</p>
        </div>
      </section>

      {/* ── Box Icon ─────────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Box Icon</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 mb-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="text-left text-xs text-wb-grey-03 pb-3 pr-4">Size</th>
                {BOX_VARIANTS.map((v) => (
                  <th key={v} className="text-center text-xs text-wb-grey-03 pb-3 px-3">
                    {BOX_VARIANT_LABELS[v]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {SIZES.map((size) => (
                <tr key={size}>
                  <td className="text-xs text-wb-grey-04 py-2 pr-4">
                    {size} ({SIZE_LABELS[size]})
                  </td>
                  {BOX_VARIANTS.map((variant) => (
                    <td key={variant} className="text-center py-2 px-3">
                      <div className="flex justify-center">
                        <BoxIcon variant={variant} size={size as BoxIconSize} />
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>사이즈 — xl:48px, large:32px, medium:24px, small:20px, tiny:12px</p>
          <p>added — ArchiveBoxSolid, text-wb-grey-04</p>
          <p>none — ArchiveBoxSolid, text-wb-grey-01</p>
          <p>outline — ArchiveBoxOutline, text-wb-grey-01</p>
        </div>
      </section>

      {/* ── Delete Icon ──────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Delete Icon</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex items-center gap-8 mb-4">
          <div className="flex flex-col items-center gap-2">
            <DeleteIcon variant="light" />
            <span className="text-xs text-wb-grey-03">light</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <DeleteIcon variant="grey" />
            <span className="text-xs text-wb-grey-03">grey</span>
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>사이즈 — 24px 고정</p>
          <p>light — XMarkOutline, text-wb-white-02</p>
          <p>grey — XMarkOutline, text-wb-grey-01</p>
        </div>
      </section>

      {/* ── Added Status Icon ────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Added Status Icon</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex items-center gap-8 mb-4">
          <div className="flex flex-col items-center gap-2">
            <AddedStatusIcon variant="add" />
            <span className="text-xs text-wb-grey-03">add</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <AddedStatusIcon variant="checked" />
            <span className="text-xs text-wb-grey-03">checked</span>
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>사이즈 — 24px 고정</p>
          <p>add — PlusCircleOutline, text-wb-white-01 (#FFFFFF)</p>
          <p>checked — CheckCircleSolid, text-wb-green (#10B981)</p>
        </div>
      </section>

      {/* ── Profile Icon ─────────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Profile Icon</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex items-center gap-8 mb-4">
          <div className="flex flex-col items-center gap-2">
            <ProfileIcon variant="edit" />
            <span className="text-xs text-wb-grey-03">edit (96px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProfileIcon variant="mypage" />
            <span className="text-xs text-wb-grey-03">mypage (72px)</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <ProfileIcon variant="list" />
            <span className="text-xs text-wb-grey-03">list (28px)</span>
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>edit — UserCircleSolid, 96px, text-wb-grey-04 (#B1B1B1)</p>
          <p>mypage — UserCircleSolid, 72px, text-wb-grey-04 (#B1B1B1)</p>
          <p>list — UserCircleSolid, 28px, text-wb-grey-04 (#B1B1B1)</p>
        </div>
      </section>

      {/* ── Google Circle Logo ─────────────────────── */}
      <section>
        <h2 className="text-xl font-bold text-black mb-4">Google Circle Logo</h2>

        <div className="bg-wb-dark-02 rounded-lg p-6 flex items-center gap-8 mb-4">
          <div className="flex flex-col items-center gap-2">
            <GoogleCircleLogo variant="dark" />
            <span className="text-xs text-wb-grey-03">dark</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <GoogleCircleLogo variant="light" />
            <span className="text-xs text-wb-grey-03">light</span>
          </div>
        </div>

        <div className="bg-neutral-100 rounded-lg p-4 text-sm text-neutral-700 space-y-1">
          <p className="font-semibold text-black mb-2">디자인 스펙</p>
          <p>dark — web_dark_rd_na@2x.png, 18px</p>
          <p>light — web_light_rd_na@2x.png, 18px</p>
        </div>
      </section>
    </div>
  );
}
