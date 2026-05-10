import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '기록',
  robots: { index: false, follow: false },
};

export default function RecordLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
