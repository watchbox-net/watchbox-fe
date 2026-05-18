import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const env = process.env.NEXT_PUBLIC_ENV ?? 'local';
  const title =
    env === 'prod' ? 'WatchBox'
    : env === 'dev' ? 'WatchBox-dev'
    : 'WatchBox-local';

  return {
    title,
    robots: { index: false, follow: false },
  };
}

export default function DevLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
