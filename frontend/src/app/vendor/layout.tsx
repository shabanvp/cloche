"use client";

import { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/Footer";
import { VendorSidebar } from "./VendorSidebar";

export default function VendorLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/vendor/login" || pathname === "/vendor/register";

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-ivory flex flex-col justify-between">
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col justify-between">
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          <VendorSidebar />
          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

