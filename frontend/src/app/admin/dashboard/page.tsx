"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";

// Types
interface User {
  id: number;
  name: string;
  email: string;
  created_at: string;
  role?: string;
}

interface Boutique {
  id: number;
  boutique_name: string;
  owner_name: string;
  email: string;
  phone: string;
  city: string;
  area?: string;
  district?: string;
  plan: string;
  is_verified: boolean;
  category?: string;
  created_at: string;
  introUnlimited?: boolean;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  image_url?: string;
}

interface Enquiry {
  id: number;
  name: string;
  email: string;
  phone: string;
  wedding_date: string;
  preferred_location: string;
  requirement: string;
  special_requirement: string;
  status: string;
}

interface PaymentProof {
  id: number;
  boutique_id: number;
  plan: string;
  amount: number;
  billing_cycle: string;
  status: string;
  screenshot_url: string;
  created_at: string;
  boutique?: Boutique;
}

interface Analytics {
  success: boolean;
  metrics: {
    totalUsers: number;
    totalBoutiques: number;
    totalProducts: number;
  };
  recentUsers: User[];
  recentBoutiques: Boutique[];
}

const PLAN_MAP: Record<string, string> = {
  early_partner: "Basic Plan",
  early: "Basic Plan",
  basic: "Basic Plan",
  "early partner": "Basic Plan",
  professional: "Professional",
  growth: "Professional",
  premium: "Premium",
  elite: "Premium",
};

export default function AdminDashboard() {
  const router = useRouter();
  const [metrics, setMetrics] = useState({ totalUsers: 0, totalBoutiques: 0, totalProducts: 0 });
  const [users, setUsers] = useState<User[]>([]);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [pendingBoutiques, setPendingBoutiques] = useState<Boutique[]>([]);
  const [enquiries, setEnquiries] = useState<Enquiry[]>([]);
  const [paymentProofs, setPaymentProofs] = useState<PaymentProof[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Utilities
  const getAdminToken = useCallback(() => {
    if (typeof window === "undefined") return "";
    return localStorage.getItem("adminToken") || "";
  }, []);

  const formatPlanName = (plan: string): string => {
    const normalized = String(plan || "").toLowerCase().trim();
    return PLAN_MAP[normalized] || (String(plan || "").charAt(0).toUpperCase() + String(plan || "").slice(1).toLowerCase());
  };

  const formatDate = (date: string): string => {
    if (!date) return "-";
    try {
      return new Date(date).toLocaleDateString();
    } catch {
      return "-";
    }
  };

  // Auth Check
  useEffect(() => {
    if (typeof window !== "undefined") {
      if (!localStorage.getItem("adminToken")) {
        router.push("/admin");
      }
    }
  }, [router]);

  // Load Analytics
  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_ORIGIN}/api/admin/analytics`);
      const data: Analytics = await response.json();

      if (data.success) {
        setMetrics(data.metrics);
        setUsers(Array.isArray(data.recentUsers) ? data.recentUsers : []);
        setBoutiques(Array.isArray(data.recentBoutiques) ? data.recentBoutiques : []);

        // Fetch all boutiques for pending applications
        try {
          const allRes = await fetch(`${API_ORIGIN}/api/boutiques`);
          if (allRes.ok) {
            const allData = await allRes.json();
            if (Array.isArray(allData)) {
              const pending = allData.filter((b: Boutique) => !b.is_verified);
              setPendingBoutiques(pending);
            }
          }
        } catch (err) {
          console.error("Error fetching pending boutiques:", err);
        }
      }
      setError(null);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  }, []);

  // Load Enquiries
  const loadEnquiries = useCallback(async () => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/leads/admin/enquiries`);
      const data = await res.json();
      if (res.ok) {
        setEnquiries(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Failed to load enquiries:", err);
      setEnquiries([]);
    }
  }, []);

  // Load Payment Proofs
  const loadPaymentProofs = useCallback(async () => {
    try {
      const token = getAdminToken();
      const res = await fetch(`${API_ORIGIN}/api/payment/proofs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setPaymentProofs(Array.isArray(data.proofs) ? data.proofs : []);
      }
    } catch (err) {
      console.error("Failed to load payment proofs:", err);
      setPaymentProofs([]);
    }
  }, [getAdminToken]);

  // Initial Load
  useEffect(() => {
    loadAnalytics();
    loadEnquiries();
    loadPaymentProofs();

    // Refresh every 30 seconds
    const interval = setInterval(() => {
      loadAnalytics();
      loadEnquiries();
      loadPaymentProofs();
    }, 30000);

    return () => clearInterval(interval);
  }, [loadAnalytics, loadEnquiries, loadPaymentProofs]);

  // Delete User
  const handleDeleteUser = async (userId: number, userName: string) => {
    const name = userName || "this user";
    if (!confirm(`Remove account for ${name}? This action cannot be undone.`)) return;

    try {
      const token = getAdminToken();
      const res = await fetch(`${API_ORIGIN}/api/admin/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Failed to remove user");
        return;
      }

      alert("User account removed successfully.");
      loadAnalytics();
    } catch (err) {
      alert("Server error while removing user");
    }
  };

  // Delete Boutique
  const handleDeleteBoutique = async (boutiqueId: number, boutiqueName: string) => {
    const name = boutiqueName || "this boutique";
    if (!confirm(`Remove ${name}? This will permanently delete the boutique and revoke access.`)) return;

    try {
      const token = getAdminToken();
      const res = await fetch(`${API_ORIGIN}/api/admin/boutiques/${boutiqueId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) {
        if (res.status === 404) {
          alert("Delete feature is not available. Please update backend.");
          return;
        }
        alert(data.message || "Failed to remove boutique");
        return;
      }

      alert("Boutique removed successfully.");
      loadAnalytics();
    } catch (err) {
      alert("Server error while removing boutique");
    }
  };

  // Review Payment Proof
  const handleReviewProof = async (proofId: number, action: "approve" | "reject") => {
    if (!confirm(`${action === "approve" ? "Approve" : "Reject"} this payment proof?`)) return;

    try {
      const token = getAdminToken();
      const res = await fetch(`${API_ORIGIN}/api/payment/proofs/${proofId}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Review failed");

      alert(data.message || "Updated");
      loadPaymentProofs();
      loadAnalytics();
    } catch (err: any) {
      alert(err.message || "Could not review proof");
    }
  };

  // Send Enquiry to Boutiques
  const handleSendEnquiry = async (enquiryId: number) => {
    try {
      const res = await fetch(`${API_ORIGIN}/api/leads/admin/enquiries/${enquiryId}/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (!res.ok) throw new Error(data.message || "Failed to send enquiry");

      alert(data.message || "Enquiry sent.");
      loadEnquiries();
    } catch (err: any) {
      alert(err.message || "Could not send enquiry");
    }
  };

  // Copy Enquiry to Clipboard
  const handleCopyEnquiry = async (enquiry: Enquiry) => {
    const text = `--- CLOCHE LUXURY ENQUIRY ---
Customer: ${enquiry.name || "N/A"}
Phone: ${enquiry.phone || "N/A"}
Wedding Date: ${enquiry.wedding_date || "N/A"}
Location: ${enquiry.preferred_location || "N/A"}
Requirement: ${enquiry.requirement || "N/A"}
Special Notes: ${enquiry.special_requirement || "None"}
-----------------------------`;

    try {
      await navigator.clipboard.writeText(text);
      alert("Enquiry details copied to clipboard!");
    } catch {
      alert("Failed to copy details.");
    }
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    router.push("/admin");
  };

  const pendingProofCount = paymentProofs.filter((p) => p.status === "pending").length;

  if (loading) {
    return (
      <div className="min-h-screen bg-background-dark flex items-center justify-center">
        <div className="text-primary text-xl">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d0d0d]">
      {/* Navigation */}
      <nav className="border-b border-white/5 py-4 backdrop-blur-md sticky top-0 z-50 bg-black/40">
        <div className="max-w-7xl mx-auto px-6 md:px-8 flex justify-between items-center text-white">
          <div className="flex items-center gap-4">
            <span className="text-xl md:text-2xl font-serif tracking-widest">CLOCHE</span>
            <span className="h-5 w-[1px] bg-white/10 hidden md:block"></span>
            <span className="text-primary text-[10px] uppercase tracking-[0.4em] mt-1 hidden md:block">Admin Dashboard</span>
          </div>
          <button
            onClick={handleLogout}
            className="text-[10px] uppercase tracking-widest text-gray-400 hover:text-primary transition-colors font-bold"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-4 md:p-10">
        {/* Header */}
        <header className="mb-8 md:mb-12 px-2">
          <h1 className="text-2xl md:text-4xl font-serif font-bold text-white mb-2">Platform Overview</h1>
          <p className="text-gray-500 text-sm tracking-wide uppercase font-bold text-[9px] md:text-[10px]">Real-time Ecosystem Metrics</p>
        </header>

        {/* Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-16">
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/5 p-10 md:p-12 rounded-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-8">Total Users</p>
            <h3 className="text-6xl md:text-7xl font-serif text-primary">{metrics.totalUsers}</h3>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/5 p-10 md:p-12 rounded-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-8">Partner Boutiques</p>
            <h3 className="text-6xl md:text-7xl font-serif text-primary">{metrics.totalBoutiques}</h3>
          </div>
          <div className="bg-gradient-to-br from-[#1a1a1a] to-[#111111] border border-white/5 p-10 md:p-12 rounded-2xl">
            <p className="text-[10px] uppercase tracking-[0.4em] text-gray-500 font-bold mb-8">Total Products</p>
            <h3 className="text-6xl md:text-7xl font-serif text-primary">{metrics.totalProducts}</h3>
          </div>
        </div>

        {/* Users and Payment Proofs */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16 mb-16">
          {/* Recent Users */}
          <section>
            <div className="flex items-end justify-between mb-8 px-2">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1">Recent Registrations</h2>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Newest Community Members</p>
              </div>
            </div>
            <div className="bg-[rgba(26,26,26,0.6)] backdrop-blur-sm border border-[rgba(193,166,113,0.1)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Member</th>
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Details</th>
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-10 text-center text-gray-500 text-sm italic">
                          No registered users found.
                        </td>
                      </tr>
                    ) : (
                      users.map((u) => (
                        <tr key={u.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-8 py-5 text-sm">
                            <p className="font-medium text-white">{u.name || "Unnamed User"}</p>
                            <p className="text-[10px] text-primary uppercase font-bold tracking-widest mt-1">{u.role || "Member"}</p>
                            <p className="text-gray-500 text-[9px] mt-1">{u.email || ""}</p>
                          </td>
                          <td className="px-4 md:px-8 py-5 text-gray-400 text-sm">
                            <p>{u.email}</p>
                            <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest font-bold">Joined {formatDate(u.created_at)}</p>
                          </td>
                          <td className="px-4 md:px-8 py-5 text-center">
                            <button
                              onClick={() => handleDeleteUser(u.id, u.name)}
                              className="px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] uppercase tracking-widest border border-red-500/10 text-red-400/60 hover:text-red-400 hover:bg-red-500/10 transition-all font-bold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Payment Proofs */}
          <section>
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-serif text-white uppercase tracking-[0.2em]">Payment Verification</h2>
              <span className="text-[10px] bg-primary/20 text-primary px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                {pendingProofCount} Pending
              </span>
            </div>
            <div className="bg-[rgba(26,26,26,0.6)] backdrop-blur-sm border border-[rgba(193,166,113,0.1)] rounded-2xl overflow-hidden shadow-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[900px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Boutique</th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Plan Details</th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Screenshot</th>
                      <th className="px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paymentProofs.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-8 py-10 text-center text-gray-500 text-sm italic">
                          No payment proofs found.
                        </td>
                      </tr>
                    ) : (
                      paymentProofs.map((proof) => {
                        const isPending = proof.status === "pending";
                        const statusClass =
                          proof.status === "approved"
                            ? "text-emerald-400 border-emerald-500/30 bg-emerald-500/10"
                            : proof.status === "rejected"
                            ? "text-red-400 border-red-500/30 bg-red-500/10"
                            : "text-primary border-primary/30 bg-primary/10";

                        return (
                          <tr key={proof.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                            <td className="px-4 md:px-8 py-6 text-sm">
                              <p className="font-bold text-white mb-1">
                                {proof.boutique?.boutique_name || `Boutique #${proof.boutique_id}`}
                              </p>
                              <p className="text-[10px] text-primary uppercase tracking-widest font-bold">
                                {proof.boutique?.owner_name || "Partner"}
                              </p>
                              <p className="text-[10px] text-gray-500 mt-1">{proof.boutique?.email || ""}</p>
                            </td>
                            <td className="px-4 md:px-8 py-6 text-sm">
                              <p className="text-white uppercase tracking-widest font-bold">{formatPlanName(proof.plan)}</p>
                              <p className="text-primary text-xs mt-1">₹{Number(proof.amount || 0).toLocaleString("en-IN")}</p>
                              <p className="text-[9px] text-gray-500 uppercase tracking-widest mt-1">{proof.billing_cycle || "monthly"}</p>
                              <span className={`inline-flex mt-3 px-2 py-1 rounded border text-[9px] uppercase tracking-widest font-bold ${statusClass}`}>
                                {proof.status}
                              </span>
                            </td>
                            <td className="px-4 md:px-8 py-6 text-sm">
                              <div className="relative w-24 h-16 rounded-lg overflow-hidden border border-white/10 bg-black/40 group">
                                <img
                                  src={proof.screenshot_url}
                                  alt="Proof"
                                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <a
                                  href={proof.screenshot_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                >
                                  <span className="material-symbols-outlined text-white text-sm">open_in_new</span>
                                </a>
                              </div>
                              <p className="text-[9px] text-gray-600 uppercase tracking-widest mt-3 font-medium">
                                {proof.created_at ? new Date(proof.created_at).toLocaleString() : ""}
                              </p>
                            </td>
                            <td className="px-4 md:px-8 py-6 text-center">
                              <div className="flex flex-col gap-2">
                                <button
                                  onClick={() => handleReviewProof(proof.id, "approve")}
                                  disabled={!isPending}
                                  className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest border font-bold transition-all ${
                                    isPending
                                      ? "border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
                                      : "border-white/5 text-gray-700 cursor-not-allowed"
                                  }`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleReviewProof(proof.id, "reject")}
                                  disabled={!isPending}
                                  className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest border font-bold transition-all ${
                                    isPending
                                      ? "border-red-500/30 text-red-400 hover:bg-red-500/10"
                                      : "border-white/5 text-gray-700 cursor-not-allowed"
                                  }`}
                                >
                                  Reject
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Pending Applications and Boutiques */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10 md:gap-16 mb-16">
          {/* Pending Applications */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 px-2 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1">Pending Applications</h2>
                <p className="text-[10px] uppercase tracking-widest text-yellow-500/80 font-bold">Boutiques Awaiting Email Verification</p>
              </div>
              <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-3 py-1 rounded-full font-bold uppercase tracking-widest">
                {pendingBoutiques.length} Pending
              </span>
            </div>
            <div className="bg-[rgba(26,26,26,0.6)] backdrop-blur-sm border border-[rgba(193,166,113,0.1)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Boutique</th>
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Submitted</th>
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingBoutiques.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-10 text-center text-gray-500 text-sm italic">
                          No pending applications found.
                        </td>
                      </tr>
                    ) : (
                      pendingBoutiques.map((b) => (
                        <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-8 py-5 text-sm">
                            <p className="font-medium text-white">{b.boutique_name || "Unnamed Boutique"}</p>
                            <p className="text-[10px] text-yellow-400 uppercase tracking-[0.2em] font-bold mt-1">{b.owner_name || "No Owner"}</p>
                            <p className="text-[10px] text-gray-500 mt-1">{b.email || "No Email"}</p>
                          </td>
                          <td className="px-4 md:px-8 py-5 text-gray-400 text-sm">
                            <p className="text-white font-medium">{b.category || "Unknown"}</p>
                            <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest font-bold">Applied {formatDate(b.created_at)}</p>
                          </td>
                          <td className="px-4 md:px-8 py-5 text-right">
                            <span className="inline-flex px-3 py-1 rounded-full border border-yellow-500/30 bg-yellow-500/10 text-yellow-400 text-[10px] uppercase tracking-widest font-bold">
                              Awaiting Verification
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>

          {/* Verified Boutiques */}
          <section>
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 px-2 gap-4">
              <div>
                <h2 className="text-xl md:text-2xl font-serif font-bold text-white mb-1">New Partnerships</h2>
                <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Curated Luxury Partners</p>
              </div>
            </div>
            <div className="bg-[rgba(26,26,26,0.6)] backdrop-blur-sm border border-[rgba(193,166,113,0.1)] rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left min-w-[800px]">
                  <thead>
                    <tr className="bg-white/5 border-b border-white/5">
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Boutique</th>
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Origin</th>
                      <th className="px-4 md:px-8 py-5 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {boutiques.length === 0 ? (
                      <tr>
                        <td colSpan={3} className="px-8 py-10 text-center text-gray-500 text-sm italic">
                          No verified boutiques found.
                        </td>
                      </tr>
                    ) : (
                      boutiques.map((b) => (
                        <tr key={b.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-8 py-5 text-sm">
                            <p className="font-medium text-white">{b.boutique_name || "Unnamed Boutique"}</p>
                            <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mt-1">{b.owner_name || "No Owner Listed"}</p>
                            <p className="text-[10px] text-gray-500 mt-1">
                              {b.email || "No Email"} • {b.phone || ""}
                            </p>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1 opacity-60">
                              {formatPlanName(b.plan || "early_partner")}
                              {b.introUnlimited ? " • INTRO ∞" : ""}
                            </p>
                          </td>
                          <td className="px-4 md:px-8 py-5 text-gray-400 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="material-symbols-outlined text-xs text-primary/40">location_on</span>
                              <span>{b.city || b.area || b.district || "-"}</span>
                            </div>
                            <p className="text-[9px] text-gray-600 mt-1 uppercase tracking-widest font-bold">Partner ID: {b.id}</p>
                          </td>
                          <td className="px-4 md:px-8 py-5 text-right">
                            <button
                              onClick={() => handleDeleteBoutique(b.id, b.boutique_name)}
                              className="px-3 md:px-4 py-2 rounded-lg text-[9px] md:text-[10px] uppercase tracking-widest border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-bold"
                            >
                              Remove
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </section>
        </div>

        {/* Enquiries Section */}
        <section>
          <div className="flex items-end justify-between mb-10 px-2">
            <div>
              <h2 className="text-2xl md:text-3xl font-serif font-bold text-white mb-2">Service Enquiries</h2>
              <p className="text-[10px] uppercase tracking-widest text-primary font-bold">Active User Requests Needing Dispatch</p>
            </div>
            <button
              onClick={loadEnquiries}
              className="flex items-center gap-2 text-[10px] uppercase tracking-widest text-primary hover:text-white transition-all font-bold group"
            >
              <span className="material-symbols-outlined text-sm group-hover:rotate-180 transition-transform duration-500">refresh</span>
              Refresh Feed
            </button>
          </div>
          <div className="bg-[rgba(26,26,26,0.6)] backdrop-blur-sm border border-[rgba(193,166,113,0.1)] rounded-2xl overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 border-b border-white/5">
                    <th className="px-4 md:px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Customer Profile</th>
                    <th className="px-4 md:px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Preferred Location</th>
                    <th className="px-4 md:px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold">Specific Requirement</th>
                    <th className="px-4 md:px-8 py-6 text-[10px] uppercase tracking-widest text-gray-400 font-bold text-center">Protocol</th>
                  </tr>
                </thead>
                <tbody>
                  {enquiries.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-8 py-10 text-center text-gray-500 text-sm italic">
                        No enquiries found.
                      </td>
                    </tr>
                  ) : (
                    enquiries.map((e) => {
                      const isSent = e.status === "SENT";
                      return (
                        <tr key={e.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                          <td className="px-4 md:px-8 py-6 text-sm">
                            <p className="font-bold text-white mb-1">{e.name || "User"}</p>
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{e.phone || "-"}</p>
                          </td>
                          <td className="px-4 md:px-8 py-6 text-gray-300 text-sm italic font-medium">
                            <p>{e.preferred_location || "-"}</p>
                          </td>
                          <td className="px-4 md:px-8 py-6 text-gray-400 text-sm">
                            <p>{e.requirement || "General enquiry"}</p>
                          </td>
                          <td className="px-4 md:px-8 py-6 text-center">
                            <div className="flex flex-col gap-2">
                              <button
                                onClick={() => handleCopyEnquiry(e)}
                                className="px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 transition-all font-bold"
                              >
                                Copy
                              </button>
                              <button
                                onClick={() => handleSendEnquiry(e.id)}
                                disabled={isSent}
                                className={`px-4 py-2 rounded-lg text-[10px] uppercase tracking-widest border whitespace-nowrap transition-all font-bold ${
                                  isSent
                                    ? "border-white/5 text-gray-700 cursor-not-allowed"
                                    : "border-primary/40 text-primary hover:bg-primary/10 shadow-lg shadow-primary/5"
                                }`}
                              >
                                {isSent ? "Sent" : "Dispatch"}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
