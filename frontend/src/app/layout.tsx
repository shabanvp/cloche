import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { BottomNavBar } from "@/components/BottomNavBar";
import { getSession } from "@/app/actions/auth";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "CLOCHE - Your Wedding, Your Way",
  description: "Find the best wedding vendors with thousands of trusted reviews",
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
        <Header session={session} />
        {children}
        <BottomNavBar />
      </body>
    </html>
  );
}
