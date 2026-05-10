import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '박스',
  robots: { index: false, follow: false },
};

export default function BoxLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
