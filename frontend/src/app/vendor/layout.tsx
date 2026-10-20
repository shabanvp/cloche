"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { VendorToast } from "@/components/VendorToast";

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans">
      <main className="w-full">
        {children}
      </main>
      <VendorToast />
    </div>
  );
}
