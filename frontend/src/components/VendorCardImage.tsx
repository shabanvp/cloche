"use client";

import { useState } from "react";

export interface VendorCardImageProps {
  vendorId: string;
  businessName: string;
  coverImage?: string | null;
  profileImage?: string | null;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

function usableUrl(value?: string | null): string {
  const url = typeof value === "string" ? value.trim() : "";
  if (!url || /^(undefined|null)$/i.test(url) || url.startsWith("//")) return "";
  if (/^(https?:\/\/|data:image\/|\/)/i.test(url)) return url;
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  return cloudName ? `https://res.cloudinary.com/${cloudName}/image/upload/${url.replace(/^\/+/, "")}` : "";
}

export function VendorCardImage({ vendorId, businessName, coverImage, profileImage, className = "", sizes, priority = false }: VendorCardImageProps) {
  const cover = usableUrl(coverImage);
  const profile = usableUrl(profileImage);
  const [failed, setFailed] = useState<{ vendorId: string; url: string } | null>(null);
  const current = cover && !(failed?.vendorId === vendorId && failed.url === cover)
    ? cover
    : profile && !(failed?.vendorId === vendorId && failed.url === profile)
      ? profile
      : "";

  if (!current) {
    return (
      <div role="img" aria-label={businessName || "Vendor"} className={`flex h-full w-full items-center justify-center overflow-hidden bg-[#104E45] px-5 text-center ${className}`}>
        <span className="max-w-full break-words font-serif text-[clamp(1.2rem,4vw,2rem)] leading-tight text-[#FFFDF7]">{businessName || "Wedding Vendor"}</span>
      </div>
    );
  }

  return <img key={`${vendorId}:${current}`} src={current} alt={`${businessName} business`} sizes={sizes} loading={priority ? "eager" : "lazy"} onError={() => setFailed({ vendorId, url: current })} className={`h-full w-full object-cover ${className}`} />;
}
