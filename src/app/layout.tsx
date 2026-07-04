import "./globals.css";
import type { Metadata, Viewport } from "next";
import Providers from './Providers';
import Splash from '@/components/common/Splash';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    themeColor: '#181818',
}

export async function generateMetadata(): Promise<Metadata> {
    const env = process.env.NEXT_PUBLIC_ENV ?? 'local';
    const title =
        env === 'prod' ? 'WatchBox'
        : env === 'dev' ? 'WatchBox-Dev'
        : 'WatchBox-Local';

    return {
        title,
        description: '...',
    };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <Providers>
            <Splash />
            {children}
          </Providers>
      </body>
    </html>
  );
}