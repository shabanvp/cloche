<<<<<<< HEAD
import {
  Bell,
  BriefcaseBusiness,
  Clock3,
  Hourglass,
  MoreVertical,
  RefreshCw,
  ShieldCheck,
  ShoppingBag,
  Store,
  Users,
} from "lucide-react";
import type { ReactNode } from "react";
import { getAdminAnalytics } from "@/services/api";

type RecentUser = {
  id?: string | number;
  name?: string;
  email?: string;
  created_at?: string;
};

type RecentBoutique = {
  id?: string | number;
  boutique_name?: string;
  owner_name?: string;
  email?: string;
  city?: string;
  plan?: string;
  created_at?: string;
};

const formatDate = (value?: string) => {
  if (!value) return "Joined 11/4/2026";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "Joined 11/4/2026";

  return `Joined ${date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  })}`;
};

const statusStyles: Record<string, string> = {
  approved: "bg-emerald/10 text-emerald",
  rejected: "bg-red-50 text-red-500",
  pending: "bg-gold/15 text-gold",
};

function StatusPill({ status }: { status: "approved" | "rejected" | "pending" }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase ${statusStyles[status]}`}>
      {status}
    </span>
  );
}

function Panel({
  title,
  icon,
  children,
}: {
  title: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-lg border border-[#eee7dc] bg-white shadow-[0_8px_24px_rgba(32,27,20,0.06)]">
      <div className="flex items-center justify-between gap-4 px-5 py-4">
        <h2 className="font-display text-xl font-semibold text-charcoal">{title}</h2>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-[#eee7dc] text-gold"
            aria-label={`${title} tools`}
          >
            {icon}
          </button>
          <button
            type="button"
            className="h-8 rounded-md border border-[#eee7dc] px-3 text-xs font-bold text-gold"
          >
            View All
          </button>
        </div>
      </div>
      {children}
    </section>
  );
}

export default async function AdminOverview() {
  const data = await getAdminAnalytics("admin-session-secure-token");
  const metrics = data?.metrics || { totalUsers: 16, totalBoutiques: 13, totalProducts: 23 };
  const recentUsers: RecentUser[] = data?.recentUsers || [];
  const recentBoutiques: RecentBoutique[] = data?.recentBoutiques || [];

  const registrations = recentUsers.slice(0, 3);
  const paymentRows = [
    { boutique: "Halo & Hue", email: "shahanmuhammed26@gmail.com", plan: "Premium Monthly", status: "rejected" as const },
    { boutique: "Halo & Hue", email: "sreeravs@gmail.com", plan: "Professional Monthly", status: "rejected" as const },
    { boutique: "Halo & Hue", email: "sreeravs@gmail.com", plan: "Professional Monthly", status: "approved" as const },
  ];
  const partnerships = recentBoutiques.slice(0, 2);

  return (
    <div className="min-h-[calc(100vh-4rem)] space-y-5 bg-[#fbf8f1] text-charcoal">
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#102c25]">Platform Overview</h1>
          <p className="mt-1 text-sm text-charcoal/70">Welcome back, Admin</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="relative h-10 w-10 rounded-full bg-white text-charcoal shadow-sm" aria-label="Notifications">
            <Bell className="mx-auto h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
          </button>
          <div className="flex items-center gap-3 rounded-full bg-white px-3 py-2 shadow-sm">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald text-sm font-bold text-white">A</span>
            <span className="text-sm font-semibold">Admin</span>
          </div>
        </div>
      </header>

      <div className="flex justify-end">
        <div className="flex items-center gap-3 rounded-full bg-white px-4 py-3 text-xs font-semibold text-charcoal/70 shadow-sm">
          <Clock3 className="h-4 w-4" />
          Last Updated: Just now
          <RefreshCw className="h-4 w-4 text-charcoal" />
        </div>
      </div>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          { label: "Total Users", value: metrics.totalUsers, icon: Users, delta: "2 new today" },
          { label: "Partner Boutiques", value: metrics.totalBoutiques, icon: Store, delta: "1 new today" },
          { label: "Total Products", value: metrics.totalProducts, icon: ShoppingBag, delta: "5 new today" },
        ].map((item) => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="flex items-center gap-5 rounded-lg border border-[#eee7dc] bg-white p-6 shadow-[0_8px_24px_rgba(32,27,20,0.07)]">
              <div className="grid h-16 w-16 shrink-0 place-items-center rounded-full bg-emerald text-white">
                <Icon className="h-8 w-8" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-charcoal/70">{item.label}</p>
                <p className="font-display text-4xl font-bold leading-none text-[#102c25]">{item.value}</p>
                <p className="mt-2 text-xs font-semibold text-emerald">+ {item.delta}</p>
              </div>
            </div>
          );
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-2">
        <Panel title="Recent Registrations" icon={<Users className="h-4 w-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs">
              <thead className="border-y border-[#eee7dc] text-[10px] font-bold uppercase text-charcoal/60">
                <tr>
                  <th className="px-5 py-3">Member</th>
                  <th className="px-5 py-3">Details</th>
                  <th className="px-5 py-3">Boutique</th>
                  <th className="px-5 py-3">Plan Details</th>
                </tr>
              </thead>
              <tbody>
                {(registrations.length ? registrations : [{ name: "shahan", email: "shahanmuhammed@gmail.com" }, { name: "Sreerhedseen", email: "sreeravs@gmail.com" }, { name: "Muhammed Shaban", email: "shabanmuhammed26@gmail.com" }]).map((user, index) => (
                  <tr key={`${user.email}-${index}`} className="border-b border-[#f1ebe2]">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald/10 text-emerald">
                          <Users className="h-4 w-4" />
                        </span>
                        <div>
                          <p className="font-bold">{user.name || "Unnamed User"}</p>
                          <p className="text-[11px] text-charcoal/55">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-semibold">{user.email}</p>
                      <p className="text-[11px] text-charcoal/55">{formatDate(user.created_at)}</p>
                    </td>
                    <td className="px-5 py-4 font-bold">Halo & Hue</td>
                    <td className="px-5 py-4">
                      <p className="font-bold uppercase">{index === 0 ? "Premium" : "Professional"}</p>
                      <p className="font-bold uppercase">Monthly</p>
                      <StatusPill status="rejected" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Payment Verification" icon={<BriefcaseBusiness className="h-4 w-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left text-xs">
              <thead className="border-y border-[#eee7dc] text-[10px] font-bold uppercase text-charcoal/60">
                <tr>
                  <th className="px-5 py-3">Boutique</th>
                  <th className="px-5 py-3">Plan Details</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paymentRows.map((row) => (
                  <tr key={`${row.email}-${row.status}`} className="border-b border-[#f1ebe2]">
                    <td className="px-5 py-4">
                      <p className="font-bold">{row.boutique}</p>
                      <p className="text-[11px] text-charcoal/55">{row.email}</p>
                    </td>
                    <td className="px-5 py-4 font-bold uppercase">{row.plan}</td>
                    <td className="px-5 py-4"><StatusPill status={row.status} /></td>
                    <td className="px-5 py-4 text-right"><MoreVertical className="ml-auto h-5 w-5" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>

        <Panel title="Pending Applications" icon={<Hourglass className="h-4 w-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="border-y border-[#eee7dc] text-[10px] font-bold uppercase text-charcoal/60">
                <tr>
                  <th className="px-5 py-3">Boutique</th>
                  <th className="px-5 py-3">Submitted</th>
                  <th className="px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-5 py-4"><p className="font-bold">IHA Designs</p><p className="text-[11px] text-charcoal/55">contactbrandyy@gmail.com</p></td>
                  <td className="px-5 py-4"><p className="font-semibold">Unknown</p><p className="text-[11px] text-charcoal/55">Applied 19/4/2026</p></td>
                  <td className="px-5 py-4"><StatusPill status="pending" /></td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mx-5 mb-5 h-1 rounded-full bg-emerald/30" />
        </Panel>

        <Panel title="New Partnerships" icon={<ShieldCheck className="h-4 w-4" />}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-xs">
              <thead className="border-y border-[#eee7dc] text-[10px] font-bold uppercase text-charcoal/60">
                <tr>
                  <th className="px-5 py-3">Boutique</th>
                  <th className="px-5 py-3">Origin</th>
                  <th className="px-5 py-3">Partner ID</th>
                </tr>
              </thead>
              <tbody>
                {(partnerships.length ? partnerships : [{ boutique_name: "cloche", owner_name: "MUHAMMED SHABAN", city: "perinthalmanna", id: 30 }, { boutique_name: "Bohemian Bridal Rental", owner_name: "SHIFANA V", city: "taliparamba, kannur", id: 23 }]).map((boutique) => (
                  <tr key={boutique.id} className="border-b border-[#f1ebe2]">
                    <td className="px-5 py-4"><p className="font-bold">{boutique.boutique_name}</p><p className="text-[11px] font-semibold uppercase text-charcoal/60">{boutique.owner_name}</p></td>
                    <td className="px-5 py-4 font-semibold">{boutique.city || "perinthalmanna"}</td>
                    <td className="px-5 py-4 font-bold uppercase text-emerald">Partner ID: {boutique.id}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </div>

      <Panel title="Service Enquiries" icon={<BriefcaseBusiness className="h-4 w-4" />}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left text-xs">
            <thead className="border-y border-[#eee7dc] text-[10px] font-bold uppercase text-charcoal/60">
              <tr>
                <th className="px-5 py-3">Customer Profile</th>
                <th className="px-5 py-3">Preferred Location</th>
                <th className="px-5 py-3">Specific Requirement</th>
                <th className="px-5 py-3">Protocol</th>
              </tr>
            </thead>
          </table>
        </div>
        <div className="grid place-items-center px-5 py-8 text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-md bg-emerald text-white shadow-sm">
            <BriefcaseBusiness className="h-6 w-6" />
          </div>
          <p className="text-sm font-bold text-charcoal/70">No service enquiries yet.</p>
        </div>
      </Panel>
=======
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!email || !password) {
      setError("Email and password required");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch(`${API_ORIGIN}/api/admin/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Store token
      localStorage.setItem("adminToken", data.token);

      // Redirect to dashboard
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.message || "An error occurred");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      {/* Decorative Background */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2 -z-10 pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full translate-y-1/2 -translate-x-1/2 -z-10 pointer-events-none"></div>

      {/* Login Card */}
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-serif text-white mb-2 tracking-widest">CLOCHE</h1>
          <p className="text-primary text-sm uppercase tracking-[0.2em]">Admin Portal</p>
        </div>

        <div className="bg-[rgba(26,26,26,0.6)] backdrop-blur-md border border-[rgba(193,166,113,0.1)] rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl font-serif text-white mb-8 text-center">Admin Login</h2>

          {error && (
            <div className="bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800 px-4 py-3 text-sm rounded-lg mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary transition-colors"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-black py-3 rounded-lg font-semibold tracking-wide uppercase hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="animate-spin">⟳</span> Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <p className="text-center text-xs text-gray-500 mt-6">
            Protected admin access only
          </p>
        </div>
      </div>
>>>>>>> 86c056120d7238ec7d01b93bd87bfc2665a4edd0
    </div>
  );
}
