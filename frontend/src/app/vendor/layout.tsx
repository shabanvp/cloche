import { ReactNode } from "react";
import { Footer } from "@/components/Footer";
import { VendorSidebar } from "./VendorSidebar";


export const metadata = {
  title: "Vendor Dashboard - Cloche",
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
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
