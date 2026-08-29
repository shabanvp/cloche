import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNavBar } from "@/components/BottomNavBar";
import { getSession } from "@/app/actions/auth";
import { DelayedPageTransition } from "@/components/DelayedPageTransition";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: {
    default: "CLOCHE - Your Wedding, Your Way",
    template: "%s | CLOCHE",
  },
  description: "Find the best wedding vendors, luxury boutiques, venues, and inspirations with thousands of trusted reviews.",
  openGraph: {
    title: "CLOCHE - Kerala's Favourite Wedding Planning Platform",
    description: "Find the best wedding vendors, luxury boutiques, venues, and inspirations with thousands of trusted reviews.",
    url: "https://cloche.luxury",
    siteName: "Cloche Weddings",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CLOCHE - Your Wedding, Your Way",
    description: "Find the best wedding vendors, luxury boutiques, venues, and inspirations with thousands of trusted reviews.",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
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
