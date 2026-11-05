"use client";

import { useState, useEffect } from "react";
import { 
  Bell, Hourglass, ShoppingBag, Store, Users, CheckCircle2, Check, X
} from "lucide-react";
import { logAdminAction } from "@/lib/systemStore";

export type ApplicationRecord = {
  id: string;
  boutique: string;
  email: string;
  origin: string;
  date: string;
  status: "pending" | "approved" | "rejected";
  partnerId?: string | number;
};

type PendingVendorPayload = {
  id: string | number;
  vendorCode?: string;
  boutique?: string;
  email?: string;
  origin?: string;
  date?: string;
};

type PendingVendorsResponse = {
  success?: boolean;
  data?: PendingVendorPayload[];
  error?: { message?: string };
};

export function AdminOverviewClient({ metrics }: { metrics: { totalUsers?: number; totalBoutiques?: number } }) {
  const [applications, setApplications] = useState<ApplicationRecord[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadPendingApplications() {
      try {
        const response = await fetch("/api/v1/admin/vendors?status=pending", {
          cache: "no-store",
          credentials: "same-origin",
        });
        const result: PendingVendorsResponse = await response.json();

        if (!response.ok || !result.success || !Array.isArray(result.data)) {
          throw new Error(result?.error?.message || "Unable to load pending applications.");
        }

        if (isMounted) {
          setApplications(result.data.map((vendor): ApplicationRecord => ({
            id: String(vendor.id),
            boutique: vendor.boutique || "Vendor Application",
            email: vendor.email || "",
            origin: vendor.origin || "Kerala",
            date: vendor.date || new Date().toLocaleDateString("en-IN"),
            status: "pending",
            partnerId: vendor.vendorCode || vendor.id,
          })));
        }
      } catch (error) {
        console.error("Failed to load pending vendor applications:", error);
        if (isMounted) setApplications([]);
      }
    }

    loadPendingApplications();
    return () => { isMounted = false; };
  }, []);

  const handleApprove = async (app: ApplicationRecord) => {
    try {
      const response = await fetch("/api/v1/admin/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: app.id, action: "approve" }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Unable to approve the vendor application.");
      }

      setApplications((current) => current.filter((item) => item.id !== app.id));
      logAdminAction("Super Admin", "Super Admin", `Approved partnership application for '${app.boutique}'`, "Vendor Partnerships");
      setActionNotice(`Partnership '${app.boutique}' APPROVED successfully!`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (error) {
      console.error("Failed to approve vendor application:", error);
      setActionNotice("Unable to approve the vendor application. Please try again.");
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const handleReject = async (app: ApplicationRecord) => {
    try {
      const response = await fetch("/api/v1/admin/vendors", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vendorId: app.id, action: "reject" }),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result?.error?.message || "Unable to reject the vendor application.");
      }

      setApplications((current) => current.filter((item) => item.id !== app.id));
      logAdminAction("Super Admin", "Super Admin", `Rejected partnership application for '${app.boutique}'`, "Vendor Partnerships");
      setActionNotice(`Partnership '${app.boutique}' REJECTED.`);
      setTimeout(() => setActionNotice(null), 3000);
    } catch (error) {
      console.error("Failed to reject vendor application:", error);
      setActionNotice("Unable to reject the vendor application. Please try again.");
      setTimeout(() => setActionNotice(null), 3000);
    }
  };

  const statusPills: Record<string, string> = {
    approved: "bg-emerald-100 text-emerald-800 font-bold border border-emerald-300",
    rejected: "bg-red-100 text-red-800 font-bold border border-red-300",
    pending: "bg-amber-100 text-amber-800 font-bold border border-amber-300",
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] space-y-6 bg-[#fbf8f1] text-charcoal p-4 sm:p-6">
      
      {/* Toast Notification */}
      {actionNotice && (
        <div className="fixed top-6 right-6 z-50 bg-[#0F4C45] text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-xs flex items-center gap-2 border border-gold/20 animate-in fade-in duration-300">
          <CheckCircle2 className="w-4 h-4 text-emerald" /> {actionNotice}
        </div>
      )}

      {/* Header */}
      <header className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-[#102c25]">Platform Operations & Partner Approvals</h1>
          <p className="mt-1 text-sm text-charcoal/70">Review new vendor partnership applications, approve registrations, and manage payments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button type="button" className="relative h-10 w-10 rounded-full bg-white text-charcoal shadow-sm flex items-center justify-center">
            <Bell className="h-5 w-5 text-charcoal/80" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-gold" />
          </button>
          <div className="flex items-center gap-3 rounded-full bg-white px-4 py-2 shadow-sm border border-gold/10">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-[#0F4C45] text-xs font-bold text-white">A</span>
            <span className="text-sm font-semibold">Super Admin</span>
          </div>
        </div>
      </header>

      {/* Metric Cards */}
      <section className="grid gap-4 lg:grid-cols-3">
        <div className="flex items-center gap-5 rounded-2xl border border-[#eee7dc] bg-white p-6 shadow-sm">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0F4C45] text-white">
            <Users className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-charcoal/70">Total Registered Users</p>
            <p className="font-display text-3xl font-bold text-[#102c25]">{metrics?.totalUsers || 16}</p>
            <p className="mt-1 text-xs font-semibold text-emerald">+ 2 new today</p>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-[#eee7dc] bg-white p-6 shadow-sm">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0F4C45] text-white">
            <Store className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-charcoal/70">Partner Vendors</p>
            <p className="font-display text-3xl font-bold text-[#102c25]">{metrics?.totalBoutiques || 13}</p>
            <p className="mt-1 text-xs font-semibold text-emerald">+ 1 new pending review</p>
          </div>
        </div>

        <div className="flex items-center gap-5 rounded-2xl border border-[#eee7dc] bg-white p-6 shadow-sm">
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-[#0F4C45] text-white">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <div>
            <p className="text-xs font-bold uppercase text-charcoal/70">Pending Approvals</p>
            <p className="font-display text-3xl font-bold text-amber-600">
              {applications.filter((a) => a.status === "pending").length} Pending
            </p>
            <p className="mt-1 text-xs font-semibold text-amber-700">Action Required</p>
          </div>
        </div>
      </section>

      {/* Main Partnership Approval Table */}
      <section className="bg-white rounded-3xl border border-gold/15 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-gold/10 pb-4">
          <div>
            <h2 className="font-display text-2xl font-semibold text-charcoal flex items-center gap-2">
              <Hourglass className="w-6 h-6 text-gold" /> Pending Partnership Applications & Approval Actions
            </h2>
            <p className="text-xs text-charcoal/70 mt-1">Review new vendor partnership applications and click <strong>Approve</strong> or <strong>Reject</strong>.</p>
          </div>
          <span className="bg-gold/15 text-charcoal px-3 py-1 rounded-full text-xs font-bold uppercase">
            {applications.filter((a) => a.status === "pending").length} Pending Requests
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#F8F6F0] border-b border-gold/10 uppercase tracking-wider text-charcoal/60 font-semibold">
                <th className="p-4 pl-6">Vendor / Boutique</th>
                <th className="p-4">Origin Location</th>
                <th className="p-4">Partner ID</th>
                <th className="p-4">Submission Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-6">Approval Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gold/10">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-[#FBF8F1] transition-colors">
                  <td className="p-4 pl-6">
                    <div className="font-bold text-charcoal text-sm">{app.boutique}</div>
                    <div className="text-[11px] text-charcoal/60">{app.email}</div>
                  </td>

                  <td className="p-4 font-semibold text-charcoal">{app.origin}</td>

                  <td className="p-4 font-mono font-bold text-[#0F4C45]">
                    {app.partnerId ? `PARTNER ID: ${app.partnerId}` : "PARTNER-NEW"}
                  </td>

                  <td className="p-4 text-charcoal/60 font-medium">{app.date}</td>

                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${statusPills[app.status]}`}>
                      {app.status}
                    </span>
                  </td>

                  <td className="p-4 pr-6 text-right">
                    {app.status === "pending" ? (
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleApprove(app)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" /> Approve
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReject(app)}
                          className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded-xl font-bold text-xs transition-colors flex items-center gap-1 shadow-sm"
                        >
                          <X className="w-3.5 h-3.5" /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs font-semibold text-charcoal/50 italic">
                        {app.status === "approved" ? "Approved by Admin" : "Rejected"}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

    </div>
  );
}
