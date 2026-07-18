import { ReactNode } from "react";
import Link from "next/link";
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

export const metadata = {
  title: "Admin CMS - Cloche",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  const navItems = [
    { label: "Overview", icon: LayoutDashboard, href: "/admin" },
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
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-charcoal text-white shrink-0 min-h-screen sticky top-0 flex flex-col">
        <div className="p-6 border-b border-white/10 flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-gold" />
          <div>
            <h1 className="font-display text-xl font-medium text-ivory">Cloche Admin</h1>
            <p className="text-[10px] text-white/50 uppercase tracking-wider font-semibold">Superuser Mode</p>
          </div>
        </div>

        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link 
                key={item.href}
                href={item.href} 
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white/70 hover:bg-white/10 hover:text-white transition-colors"
              >
                <Icon className="w-4 h-4 opacity-70" /> {item.label}
              </Link>
            )
          })}
        </nav>

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
