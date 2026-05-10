import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '마이 페이지',
  robots: { index: false, follow: false },
};

export default function MyLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
