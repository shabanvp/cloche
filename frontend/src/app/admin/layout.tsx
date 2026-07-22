import { ReactNode } from "react";
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  ShoppingBag, 
  LayoutTemplate,
  Tag,
  FileText,
  BarChart3, 
  CreditCard,
  LogOut,
  ShieldCheck,
  Calendar
} from "lucide-react";
import AdminNav from "./AdminNav";

export const metadata = {
  title: "Admin CMS - Cloche",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin/dashboard" },
    { label: "Vendors", icon: Users, href: "/admin/vendors" },
    { label: "Boutiques", icon: Store, href: "/admin/boutiques" },
    { label: "Collections", icon: ShoppingBag, href: "/admin/collections" },
    { label: "Homepage CMS", icon: LayoutTemplate, href: "/admin/homepage" },
    { label: "Categories", icon: Tag, href: "/admin/categories" },
    { label: "Content", icon: FileText, href: "/admin/content" },
    { label: "Appointments", icon: Calendar, href: "/admin/appointments" },
    { label: "Reports", icon: BarChart3, href: "/admin/reports" },
    { label: "Subscriptions", icon: CreditCard, href: "/admin/subscriptions" },
  ];

  return (
    <div className="min-h-screen bg-[#fbf8f1] flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-60 bg-[#002f22] text-white shrink-0 min-h-screen sticky top-0 flex flex-col shadow-[8px_0_24px_rgba(0,47,34,0.14)]">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <div>
            <h1 className="font-display text-xl font-medium text-ivory">Cloche Admin</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Superuser Mode</p>
          </div>
        </div>

        <AdminNav items={navItems} />

        <div className="p-4 border-t border-white/10">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-left rounded-xl text-sm font-medium text-red-400 hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
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
