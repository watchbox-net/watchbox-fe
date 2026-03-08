import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'WTB Dev',
};

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
