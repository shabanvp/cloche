import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNavBar } from "@/components/BottomNavBar";
import { getSession } from "@/app/actions/auth";
import { DelayedPageTransition } from "@/components/DelayedPageTransition";
import { SITE_URL } from "@/lib/pageMetadata";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  metadataBase: new URL(`${SITE_URL}/`),
  title: {
    default: "Kerala Wedding Marketplace",
    template: "%s | CLOCHE",
  },
  description: "Discover wedding professionals, venues, and inspiration across Kerala.",
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "Kerala Wedding Marketplace",
    description: "Discover wedding professionals, venues, and inspiration across Kerala.",
    url: SITE_URL,
    siteName: "CLOCHE",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kerala Wedding Marketplace | CLOCHE",
    description: "Discover wedding professionals, venues, and inspiration across Kerala.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();

  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/google-font-display -- display=block is required for ligature icon fonts. */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=block" rel="stylesheet" />
      </head>
      <body className="min-h-full flex flex-col">
        <DelayedPageTransition />
        <Header session={session} />
        {children}
        <BottomNavBar />
      </body>
    </html>
  );
}
