import "./globals.css";
import type { Metadata, Viewport } from "next";
import Providers from './Providers';

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export const metadata: Metadata = {
    title: {
        default: 'WatchBox',
        template: '%s | WatchBox',
    },
    description: '영화와 시리즈를 기록하고 공유하는 왓치박스',
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
            {children}
          </Providers>
      </body>
    </html>
  );
}