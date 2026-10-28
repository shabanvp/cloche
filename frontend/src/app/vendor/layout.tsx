"use client";

import { ReactNode } from "react";
import { VendorToast } from "@/components/VendorToast";
import { ErrorBoundary } from "@/components/ErrorBoundaryFallback";

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] font-sans">
      <ErrorBoundary
        title="Vendor Portal Issue"
        message="Something went wrong while loading this vendor section. Please refresh or try again."
      >
        <main className="w-full">
          {children}
        </main>
      </ErrorBoundary>
      <VendorToast />
    </div>
  );
}
