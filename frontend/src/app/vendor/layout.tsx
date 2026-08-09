"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { VendorSidebar } from "./VendorSidebar";
import { VendorToast } from "@/components/VendorToast";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/register" || pathname === "/vendor/verify-email";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <VendorToast />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col justify-between font-sans">
      <main className="flex-1 py-6 lg:py-10 px-4 sm:px-6 lg:px-8 max-w-[1600px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <VendorSidebar />
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
      <Footer />
      <VendorToast />
    </div>
  );
}
