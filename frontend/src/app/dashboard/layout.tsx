import { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Footer } from "@/components/Footer";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { getSession } from "@/app/actions/auth";

export const metadata = {
  title: "Dashboard - Cloche",
};

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  const session = await getSession();

  if (!session?.token) {
    redirect("/login?unauthorized=true");
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <DashboardSidebar />

          {/* Main Content Area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}
