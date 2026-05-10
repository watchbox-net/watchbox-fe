import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WTB Dev',
  robots: { index: false, follow: false },
};

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
