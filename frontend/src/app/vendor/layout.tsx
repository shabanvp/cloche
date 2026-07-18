import { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Store, 
  Tag, 
  Calendar, 
  Inbox, 
  BarChart3, 
  CreditCard,
  LogOut
} from "lucide-react";

export const metadata = {
  title: "Vendor Dashboard - Cloche",
};

export default function VendorLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/vendor" },
    { label: "Collections", icon: ShoppingBag, href: "/vendor/collections" },
    { label: "Profile", icon: Store, href: "/vendor/profile" },
    { label: "Offers", icon: Tag, href: "/vendor/offers" },
    { label: "Appointments", icon: Calendar, href: "/vendor/appointments" },
    { label: "Enquiries", icon: Inbox, href: "/vendor/enquiries" },
    { label: "Analytics", icon: BarChart3, href: "/vendor/analytics" },
    { label: "Subscription", icon: CreditCard, href: "/vendor/subscription" },
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-[1400px] mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Vendor Sidebar */}
          <aside className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gold/10 overflow-hidden sticky top-24">
              
              {/* Boutique summary */}
              <div className="p-6 border-b border-gold/10 bg-charcoal text-white text-center">
                <div className="w-16 h-16 rounded-full bg-ivory text-charcoal flex items-center justify-center mx-auto mb-3 text-2xl font-display shadow-md">
                  M
                </div>
                <h2 className="font-display text-lg font-medium">Milan Designs</h2>
                <p className="text-xs text-white/60">Premium Partner</p>
              </div>

              {/* Navigation */}
              <nav className="p-3 space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.href}
                      href={item.href} 
                      className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-charcoal hover:bg-emerald/10 hover:text-emerald transition-colors"
                    >
                      <Icon className="w-4 h-4 opacity-70" /> {item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="p-4 border-t border-gold/10">
                <button className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </div>
            </div>
          </aside>

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
