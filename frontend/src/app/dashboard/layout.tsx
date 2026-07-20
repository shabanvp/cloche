import { ReactNode } from "react";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { User, Heart, Calendar, Settings, LogOut, Bell } from "lucide-react";

export const metadata = {
  title: "Dashboard - Cloche",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <aside className="w-full md:w-64 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden sticky top-24">
              
              {/* User summary */}
              <div className="p-6 border-b border-gold/10 bg-emerald/5 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald text-white flex items-center justify-center mx-auto mb-3 text-2xl font-display">
                  C
                </div>
                <h2 className="font-display text-lg text-charcoal font-medium">Cloche User</h2>
                <p className="text-xs text-charcoal/60">Premium Member</p>
              </div>

              {/* Navigation */}
              <nav className="p-2 space-y-1">
                <Link href="/dashboard" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
                  <User className="w-4 h-4 text-gold" /> My Profile
                </Link>
                <Link href="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
                  <Heart className="w-4 h-4 text-gold" /> Saved Items
                </Link>
                <Link href="/dashboard/appointments" className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-4 h-4 text-gold" /> Appointments
                  </div>
                  <span className="bg-emerald text-white text-[10px] px-2 py-0.5 rounded-full">1</span>
                </Link>
                <Link href="/dashboard/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-ivory hover:text-emerald transition-colors">
                  <Settings className="w-4 h-4 text-gold" /> Settings
                </Link>
              </nav>

              <div className="p-4 border-t border-gold/10">
                <button className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>

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
