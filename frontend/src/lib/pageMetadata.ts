import type { Metadata } from "next";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://cloche.luxury").replace(/\/$/, "");

export function pageMetadata(path: string, title: string, description: string): Metadata {
  const url = new URL(path, `${SITE_URL}/`).toString();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, siteName: "CLOCHE", locale: "en_IN", type: "website" },
  };
}
