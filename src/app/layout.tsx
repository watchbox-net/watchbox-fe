import "./globals.css";
import type { Metadata, Viewport } from "next";
import HealthCheck from "@/components/common/HealthCheck";

export const viewport: Viewport = {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
}

export const metadata: Metadata = {
    title: 'Watch Box',
    description: '...',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
          <HealthCheck />
          {children}
      </body>
    </html>
  );
}
