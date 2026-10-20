import { ReactNode } from "react";
import { LogOut, ShieldCheck } from "lucide-react";
import AdminNav from "./AdminNav";
import { AdminSignOutButton } from "./AdminSignOutButton";

export const metadata = {
  title: "Admin CMS - Cloche",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#FAF9F6] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-60 bg-[#002f22] text-white shrink-0 min-h-screen sticky top-0 flex flex-col shadow-[8px_0_24px_rgba(0,47,34,0.14)]">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <div>
            <h1 className="font-display text-xl font-medium text-ivory">Cloche Admin</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Superuser Mode</p>
          </div>
        </div>

        <AdminNav />

        <div className="p-4 border-t border-white/10">
          <AdminSignOutButton />
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 p-4 sm:p-8 lg:p-12 overflow-y-auto">
        <div className="max-w-[1400px] mx-auto">
          {children}
        </div>
      </main>
      
    </div>
  );
}
