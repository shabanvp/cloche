"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import {
  User,
  Heart,
  Building2,
  Sparkles,
  CheckSquare,
  DollarSign,
  MessageSquare,
  Settings,
  LogOut,
  Star,
  Trash2,
  Plus,
  ArrowRight,
  Eye,
  Calendar,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import { getWishlistItems, removeWishlistItem, syncWishlistWithServer, WishlistItem } from "@/lib/wishlistStore";
import { getSavedInspirations, removeSavedInspiration, SavedInspirationItem } from "@/lib/inspirationStore";
import { fetchAuthenticatedUser, fetchAuthenticatedUserProfile, resolveUserDisplayName } from "@/lib/userStore";
import { logout } from "@/app/actions/auth";

type DashboardTab =
  | "profile"
  | "saved-vendors"
  | "saved-venues"
  | "saved-inspirations"
  | "checklist"
  | "budget"
  | "enquiries"
  | "settings";

interface ChecklistItem {
  id: string;
  task: string;
  category: string;
  completed: boolean;
}

interface BudgetItem {
  id: string;
  category: string;
  estimated: number;
  actual: number;
}

interface UserDashboardClientProps {
  initialTab?: DashboardTab;
}

export function UserDashboardClient({ initialTab }: UserDashboardClientProps = {}) {
  const [activeTab, setActiveTab] = useState<DashboardTab>(initialTab || "profile");
  const [mobileActiveTab, setMobileActiveTab] = useState<DashboardTab | null>(initialTab || null);
  const [userName, setUserName] = useState(() => resolveUserDisplayName());
  const firstName = userName ? userName.trim().split(" ")[0] : "Planner";
  const [userEmail, setUserEmail] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userEmail") || localStorage.getItem("email") || "";
    }
    return "";
  });
  const [weddingDate, setWeddingDate] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("weddingDate") || "";
    }
    return "";
  });
  const [city, setCity] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userCity") || "";
    }
    return "";
  });
  const [phone, setPhone] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("userPhone") || "";
    }
    return "";
  });
  const [isLoading, setIsLoading] = useState(true);

  // Saved Data States
  const [savedVendors, setSavedVendors] = useState<WishlistItem[]>([]);
  const [savedVenues, setSavedVenues] = useState<WishlistItem[]>([]);
  const [savedInspirations, setSavedInspirations] = useState<SavedInspirationItem[]>([]);
  const [selectedInspiration, setSelectedInspiration] = useState<SavedInspirationItem | null>(null);

  // Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "chk-1", task: "Finalize Wedding Date & City", category: "General", completed: false },
    { id: "chk-2", task: "Shortlist & Book Main Venue", category: "Venues", completed: false },
    { id: "chk-3", task: "Book Lead Photographer & Videographer", category: "Photography", completed: false },
    { id: "chk-4", task: "Book Bridal Makeup Artist", category: "Makeup", completed: false },
    { id: "chk-5", task: "Select Stage Decorator & Florist", category: "Decor", completed: false },
    { id: "chk-6", task: "Finalize Feast / Sadya Menu with Caterer", category: "Catering", completed: false },
    { id: "chk-7", task: "Order Custom E-Invites & Cards", category: "Invites", completed: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");

  // Budget Planner State (User-entered only, starts empty)
  const [totalBudget, setTotalBudget] = useState(0);
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newEstimatedInput, setNewEstimatedInput] = useState("");
  const [newActualInput, setNewActualInput] = useState("");

  // Enquiries & Quotations State
  const [enquiries, setEnquiries] = useState<any[]>([]);

  useEffect(() => {
    async function initUserDashboard() {
      try {
        // 1. Fetch fresh customer profile settings from API
        const settingsRes = await fetch("/api/v1/customer/settings", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
        if (settingsRes && settingsRes.success && settingsRes.data) {
          const d = settingsRes.data;
          if (d.full_name || d.name) setUserName(d.full_name || d.name);
          if (d.email) setUserEmail(d.email);
          if (d.phone) setPhone(d.phone);
          if (d.city) setCity(d.city);
          if (d.wedding_date) setWeddingDate(d.wedding_date);
        } else {
          // 2. Fallback to auth store profile
          const profile = await fetchAuthenticatedUserProfile();
          if (profile) {
            if (profile.name && profile.name !== "User") setUserName(profile.name);
            if (profile.email) setUserEmail(profile.email);
            if (profile.phone) setPhone(profile.phone);
            if (profile.city) setCity(profile.city);
            if (profile.weddingDate) setWeddingDate(profile.weddingDate);
          }
        }

        // Sync wishlist items from server
        const items = await syncWishlistWithServer();
        setSavedVendors(items.filter((i) => (i.category || "").toLowerCase() !== "venue" && (i.category || "").toLowerCase() !== "venues"));
        setSavedVenues(items.filter((i) => (i.category || "").toLowerCase() === "venue" || (i.category || "").toLowerCase() === "venues"));

        // Load live dashboard inquiries
        const res = await fetch("/api/v1/customer/dashboard", { cache: "no-store" }).then((r) => r.json()).catch(() => null);
        if (res && res.success && res.data) {
          if (res.data.inquiries && res.data.inquiries.length > 0) {
            setEnquiries(res.data.inquiries);
          }
          if (res.data.user) {
            const u = res.data.user;
            if (u.fullName) setUserName((prev) => prev || u.fullName);
            if (u.email) setUserEmail((prev) => prev || u.email);
            if (u.phone) setPhone((prev) => prev || u.phone);
            if (u.city) setCity((prev) => prev || u.city);
            if (u.weddingDate) setWeddingDate((prev) => prev || u.weddingDate);
          }
        }
        // Load saved checklist from localStorage if present
        try {
          const savedChecklist = localStorage.getItem("cloche_user_checklist");
          if (savedChecklist) {
            const parsed = JSON.parse(savedChecklist);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setChecklist(parsed);
            }
          }
        } catch (e) {}
        // Load saved inspirations from store
        try {
          const loadedInspirations = getSavedInspirations();
          setSavedInspirations(loadedInspirations);
        } catch (e) {}

        // Load saved checklist from localStorage if present
        try {
          const savedChecklist = localStorage.getItem("cloche_user_checklist");
          if (savedChecklist) {
            const parsed = JSON.parse(savedChecklist);
            if (Array.isArray(parsed) && parsed.length > 0) {
              setChecklist(parsed);
            }
          }
        } catch (e) {}

        // Load saved budget items from localStorage if present
        try {
          const savedBudget = localStorage.getItem("cloche_user_budget_items");
          if (savedBudget) {
            const parsed = JSON.parse(savedBudget);
            if (Array.isArray(parsed)) {
              setBudgetItems(parsed);
            }
          }
          const savedTotalBudget = localStorage.getItem("cloche_user_total_budget");
          if (savedTotalBudget !== null && !isNaN(Number(savedTotalBudget))) {
            setTotalBudget(Number(savedTotalBudget));
          }
        } catch (e) {}
      } catch (e) {
        console.error("Dashboard init error:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initUserDashboard();

    const handleInspirationsSync = () => {
      setSavedInspirations(getSavedInspirations());
    };
    window.addEventListener("cloche_saved_inspirations_updated", handleInspirationsSync);

    return () => {
      window.removeEventListener("cloche_saved_inspirations_updated", handleInspirationsSync);
    };
  }, []);

  // Handlers
  const handleRemoveVendor = (id: string | number) => {
    const updated = removeWishlistItem(id);
    setSavedVendors(updated.filter((i) => (i.category || "").toLowerCase() !== "venue" && (i.category || "").toLowerCase() !== "venues"));
  };

  const handleRemoveVenue = (id: string | number) => {
    const updated = removeWishlistItem(id);
    setSavedVenues(updated.filter((i) => (i.category || "").toLowerCase() === "venue" || (i.category || "").toLowerCase() === "venues"));
  };

  const selectedInspirationIndex = useMemo(() => {
    if (!selectedInspiration) return -1;
    return savedInspirations.findIndex((item) => String(item.id) === String(selectedInspiration.id));
  }, [selectedInspiration, savedInspirations]);

  const handlePrevInspiration = useCallback(() => {
    if (savedInspirations.length === 0) return;
    const idx = selectedInspirationIndex >= 0 ? selectedInspirationIndex : 0;
    const prevIdx = (idx - 1 + savedInspirations.length) % savedInspirations.length;
    setSelectedInspiration(savedInspirations[prevIdx]);
  }, [selectedInspirationIndex, savedInspirations]);

  const handleNextInspiration = useCallback(() => {
    if (savedInspirations.length === 0) return;
    const idx = selectedInspirationIndex >= 0 ? selectedInspirationIndex : 0;
    const nextIdx = (idx + 1) % savedInspirations.length;
    setSelectedInspiration(savedInspirations[nextIdx]);
  }, [selectedInspirationIndex, savedInspirations]);

  // Keyboard navigation for inspiration viewer
  useEffect(() => {
    if (!selectedInspiration) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrevInspiration();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNextInspiration();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedInspiration(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedInspiration, handlePrevInspiration, handleNextInspiration]);

  // Lock body scroll when inspiration viewer is open
  useEffect(() => {
    if (selectedInspiration) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedInspiration]);

  const handleRemoveInspiration = (id: string | number) => {
    const updated = removeSavedInspiration(id);
    setSavedInspirations(updated);
    if (selectedInspiration && String(selectedInspiration.id) === String(id)) {
      if (updated.length > 0) {
        const nextIdx = Math.min(selectedInspirationIndex, updated.length - 1);
        setSelectedInspiration(updated[nextIdx]);
      } else {
        setSelectedInspiration(null);
      }
    }
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) => {
      const updated = prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item));
      try {
        localStorage.setItem("cloche_user_checklist", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setChecklist((prev) => {
      const updated = [
        ...prev,
        { id: `chk-${Date.now()}`, task: newTaskInput.trim(), category: "General", completed: false },
      ];
      try {
        localStorage.setItem("cloche_user_checklist", JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    setNewTaskInput("");
  };

  const handleUpdateTotalBudget = (amount: number) => {
    setTotalBudget(amount);
    try {
      localStorage.setItem("cloche_user_total_budget", String(amount));
    } catch (e) {}
  };

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim() || !newEstimatedInput) return;
    const est = Number(newEstimatedInput) || 0;
    const act = newActualInput ? Number(newActualInput) || 0 : 0;
    const updated = [
      ...budgetItems,
      {
        id: `b-${Date.now()}`,
        category: newCategoryInput.trim(),
        estimated: est,
        actual: act,
      },
    ];
    setBudgetItems(updated);
    try {
      localStorage.setItem("cloche_user_budget_items", JSON.stringify(updated));
    } catch (e) {}
    setNewCategoryInput("");
    setNewEstimatedInput("");
    setNewActualInput("");
  };

  const handleRemoveBudgetItem = (id: string) => {
    const updated = budgetItems.filter((i) => i.id !== id);
    setBudgetItems(updated);
    try {
      localStorage.setItem("cloche_user_budget_items", JSON.stringify(updated));
    } catch (e) {}
  };

  // Calculations
  const completedTasks = checklist.filter((i) => i.completed).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;

  const totalEstimatedBudget = budgetItems.reduce((acc, i) => acc + i.estimated, 0);
  const totalActualBudget = budgetItems.reduce((acc, i) => acc + i.actual, 0);
  const remainingBudget = totalBudget > 0 ? totalBudget - totalActualBudget : 0;

  const navTabs: { id: DashboardTab; label: string; icon: any; count?: number }[] = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "saved-vendors", label: "Saved Vendors", icon: Heart, count: savedVendors.length },
    { id: "saved-venues", label: "Saved Venues", icon: Building2, count: savedVenues.length },
    { id: "saved-inspirations", label: "Saved Inspirations", icon: Heart, count: savedInspirations.length },
    { id: "checklist", label: "Wedding Checklist", icon: CheckSquare, count: `${completedTasks}/${checklist.length}` as any },
    { id: "budget", label: "Budget Planner", icon: DollarSign },
    { id: "enquiries", label: "Enquiries & Quotes", icon: MessageSquare, count: enquiries.length },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  const handleSelectTab = (tabId: DashboardTab) => {
    setActiveTab(tabId);
    setMobileActiveTab(tabId);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", `/user/dashboard?tab=${tabId}`);
    }
  };

  const handleMobileBack = () => {
    setMobileActiveTab(null);
    if (typeof window !== "undefined") {
      window.history.pushState({}, "", "/user/dashboard");
    }
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (
        tabParam &&
        [
          "profile",
          "saved-vendors",
          "saved-venues",
          "saved-inspirations",
          "checklist",
          "budget",
          "enquiries",
          "settings",
        ].includes(tabParam)
      ) {
        setActiveTab(tabParam as DashboardTab);
        setMobileActiveTab(tabParam as DashboardTab);
      }
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#FAF9F6] py-6 sm:py-8 px-4 sm:px-6 lg:px-8 pb-28 sm:pb-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">

        {/* Top User Welcome Header */}
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#145C54] to-charcoal rounded-3xl p-5 sm:p-8 text-white shadow-md relative overflow-hidden border border-gold/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5 sm:gap-6">
            
            {/* User Info Block */}
            <div className="flex items-center gap-3.5 sm:gap-5">
              <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-gold/20 border-2 border-gold/40 text-gold flex items-center justify-center text-xl sm:text-3xl font-display font-bold shadow-inner shrink-0">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="space-y-1 min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                  <h1 className="text-xl sm:text-3xl font-bold font-display tracking-tight text-white leading-snug">
                    <span className="sm:hidden">Welcome back, {firstName}!</span>
                    <span className="hidden sm:inline">Welcome back, {userName}!</span>
                  </h1>
                  <span className="bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-gold/30 flex items-center gap-1 shrink-0">
                    <ShieldCheck className="w-3 h-3 text-gold" /> Verified Member
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-white/80 font-light flex items-center gap-3 sm:gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold shrink-0" /> Wedding: {weddingDate || "Not Set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold shrink-0" /> Location: {city || "Not Set"}
                  </span>
                </p>
              </div>
            </div>

            {/* Quick Action Pills */}
            <div className="flex items-center gap-2.5 sm:gap-3 pt-1 sm:pt-0">
              <button
                onClick={() => handleSelectTab("checklist")}
                className="flex-1 sm:flex-initial justify-center bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-gold" />
                <span>Checklist ({checklistProgress}%)</span>
              </button>
              <button
                onClick={() => handleSelectTab("budget")}
                className="flex-1 sm:flex-initial justify-center bg-gold hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Planner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid (Sidebar Nav + Active Content) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">

          {/* Left Sidebar Navigation */}
          <aside className={`md:col-span-1 ${mobileActiveTab !== null ? "hidden md:block" : "block"}`}>
            <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xs border border-gold/15 sticky top-24 space-y-2">
              <div className="px-3 py-2 sm:px-4 sm:py-3 border-b border-gold/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">Planning Hub</span>
                  <p className="text-xs font-semibold text-charcoal">Your Wedding Workspace</p>
                </div>
                <span className="text-[10px] font-bold bg-[#FAF7F2] text-[#0F4C45] px-2.5 py-0.5 rounded-full border border-gold/20 hidden sm:inline-block">
                  Menu
                </span>
              </div>

              <div className="space-y-1.5 pt-1">
                {navTabs.map((tab) => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => handleSelectTab(tab.id)}
                      className={`w-full flex items-center justify-between p-3 sm:px-3.5 sm:py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer border ${
                        isActive
                          ? "bg-[#0F4C45] text-white shadow-xs border-[#0F4C45]"
                          : "bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] text-charcoal border-gold/10 hover:border-gold/30"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                            isActive ? "bg-white/15 text-gold" : "bg-white text-[#0F4C45] shadow-2xs border border-gold/10"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold text-xs">{tab.label}</span>
                      </div>

                      {tab.count !== undefined && (
                        <span
                          className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full shrink-0 ${
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-white text-[#0F4C45] border border-gold/20 shadow-2xs"
                          }`}
                        >
                          {tab.count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-gold/10 px-1">
                <button
                  onClick={async () => {
                    await logout();
                    if (typeof window !== "undefined") {
                      localStorage.clear();
                      window.location.href = "/login?logout=success";
                    }
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-2xl text-xs font-bold text-rose-600 bg-rose-50/50 hover:bg-rose-50 border border-rose-100 transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shrink-0 shadow-2xs border border-rose-100">
                    <LogOut className="w-4 h-4 text-rose-600" />
                  </div>
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className={`md:col-span-3 space-y-6 ${mobileActiveTab === null ? "hidden md:block" : "block"}`}>

            {/* Dedicated Mobile Top Header with Back Arrow */}
            {mobileActiveTab !== null && (
              <div className="md:hidden bg-white border border-gold/15 p-4 rounded-3xl flex items-center justify-between shadow-2xs">
                <button
                  onClick={handleMobileBack}
                  className="flex items-center gap-2 text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] hover:bg-gold/10 px-3.5 py-2 rounded-full border border-gold/20 transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4 text-[#0F4C45]" />
                  <span>Back to Dashboard</span>
                </button>
                <div className="text-right">
                  <span className="text-xs font-bold text-charcoal font-display block">
                    {navTabs.find((t) => t.id === activeTab)?.label || "Planning Hub"}
                  </span>
                  <span className="text-[10px] text-gold font-bold uppercase tracking-wider">
                    Planning Hub
                  </span>
                </div>
              </div>
            )}

            {/* TAB 1: PROFILE */}
            {activeTab === "profile" && (
              <div className="space-y-6 animate-in fade-in duration-300">
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6">
                  <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                    <div>
                      <h2 className="text-xl font-bold text-charcoal font-display">Personal Profile Details</h2>
                      <p className="text-xs text-charcoal/60">Manage your wedding planning profile and account settings.</p>
                    </div>
                    <button
                      onClick={() => setActiveTab("settings")}
                      className="text-xs font-bold text-[#0F4C45] hover:underline"
                    >
                      Edit Profile
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10">
                      <span className="text-[11px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <User className="w-3.5 h-3.5" /> Full Name
                      </span>
                      <p className="text-sm font-semibold text-charcoal">{userName || "User"}</p>
                    </div>

                    <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10">
                      <span className="text-[11px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <Mail className="w-3.5 h-3.5" /> Email Address
                      </span>
                      <p className="text-sm font-semibold text-charcoal">{userEmail || "Not Provided"}</p>
                    </div>

                    <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10">
                      <span className="text-[11px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5" /> Phone Number
                      </span>
                      <p className="text-sm font-semibold text-charcoal">{phone || "Not Provided"}</p>
                    </div>

                    <div className="space-y-1 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10">
                      <span className="text-[11px] font-bold text-gold uppercase tracking-wider flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> Wedding Date
                      </span>
                      <p className="text-sm font-semibold text-charcoal">{weddingDate || "Not Set"}</p>
                    </div>
                  </div>
                </div>

                {/* Quick Planning Summary KPI Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Saved Vendors</span>
                    <h3 className="text-2xl font-bold font-display text-charcoal">{savedVendors.length}</h3>
                    <button onClick={() => setActiveTab("saved-vendors")} className="text-[11px] font-bold text-[#0F4C45] hover:underline block pt-1">View All →</button>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Saved Venues</span>
                    <h3 className="text-2xl font-bold font-display text-charcoal">{savedVenues.length}</h3>
                    <button onClick={() => setActiveTab("saved-venues")} className="text-[11px] font-bold text-[#0F4C45] hover:underline block pt-1">View All →</button>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Checklist Tasks</span>
                    <h3 className="text-2xl font-bold font-display text-charcoal">{checklistProgress}%</h3>
                    <button onClick={() => setActiveTab("checklist")} className="text-[11px] font-bold text-[#0F4C45] hover:underline block pt-1">Update →</button>
                  </div>

                  <div className="bg-white p-5 rounded-3xl border border-gold/15 shadow-xs space-y-1">
                    <span className="text-[11px] font-bold text-gold uppercase tracking-wider">Budget Spent</span>
                    <h3 className="text-2xl font-bold font-display text-charcoal">₹{(totalActualBudget / 100000).toFixed(1)}L</h3>
                    <button onClick={() => setActiveTab("budget")} className="text-[11px] font-bold text-[#0F4C45] hover:underline block pt-1">Details →</button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: SAVED VENDORS */}
            {activeTab === "saved-vendors" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display">Saved Vendors Wishlist</h2>
                    <p className="text-xs text-charcoal/60">Your bookmarked photographers, decorators, makeup artists & caterers.</p>
                  </div>
                  <Link href="/vendors" className="text-xs font-bold text-[#0F4C45] hover:underline">
                    Browse More Vendors →
                  </Link>
                </div>

                {savedVendors.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedVendors.map((item) => (
                      <div key={item.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10 flex items-center justify-between gap-4 group">
                        <div className="flex items-center gap-3">
                          <img src={item.image || "https://images.unsplash.com/photo-1519741497674-611481863552?w=300"} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{item.category}</span>
                            <h4 className="font-bold text-sm text-charcoal line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-charcoal/60 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#0F4C45]" /> {item.city || item.location || "Kerala"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={item.href || `/boutiques/${item.id}`} className="bg-[#0F4C45] text-white p-2 rounded-xl text-xs font-bold hover:bg-[#12584E] transition-all">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleRemoveVendor(item.id)} className="bg-rose-50 text-rose-600 p-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Heart className="w-10 h-10 text-gold/40 mx-auto" />
                    <p className="text-sm font-semibold text-charcoal">No saved vendors yet</p>
                    <p className="text-xs text-charcoal/60 max-w-sm mx-auto">Explore verified vendors across Kerala and click the heart icon to save them to your profile.</p>
                    <Link href="/vendors" className="inline-block bg-[#0F4C45] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xs hover:bg-[#12584E] transition-all">
                      Explore Vendors
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: SAVED VENUES */}
            {activeTab === "saved-venues" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display">Saved Wedding Venues</h2>
                    <p className="text-xs text-charcoal/60">Banquet halls, luxury beach resorts, and heritage venues.</p>
                  </div>
                  <Link href="/venues" className="text-xs font-bold text-[#0F4C45] hover:underline">
                    Browse Venues →
                  </Link>
                </div>

                {savedVenues.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedVenues.map((item) => (
                      <div key={item.id} className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                          <img src={item.image || "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=300"} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                          <div>
                            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">Venue</span>
                            <h4 className="font-bold text-sm text-charcoal line-clamp-1">{item.name}</h4>
                            <p className="text-xs text-charcoal/60 flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#0F4C45]" /> {item.city || item.location || "Kerala"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link href={`/venues`} className="bg-[#0F4C45] text-white p-2 rounded-xl text-xs font-bold hover:bg-[#12584E] transition-all">
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button onClick={() => handleRemoveVenue(item.id)} className="bg-rose-50 text-rose-600 p-2 rounded-xl text-xs font-bold hover:bg-rose-100 transition-all cursor-pointer">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Building2 className="w-10 h-10 text-gold/40 mx-auto" />
                    <p className="text-sm font-semibold text-charcoal">No saved venues yet</p>
                    <p className="text-xs text-charcoal/60 max-w-sm mx-auto">Browse banquet halls, convention centers, and beach resorts to shortlist your dream wedding venue.</p>
                    <Link href="/venues" className="inline-block bg-[#0F4C45] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xs hover:bg-[#12584E] transition-all">
                      Find Venues
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: SAVED INSPIRATIONS */}
            {activeTab === "saved-inspirations" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display flex items-center gap-2">
                      <span>Liked Inspirations Board</span>
                      <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                    </h2>
                    <p className="text-xs text-charcoal/60">Decor concepts, bridal fashion looks, and wedding ideas you've liked.</p>
                  </div>
                  <Link href="/inspiration" className="text-xs font-bold text-[#0F4C45] hover:underline">
                    Explore Inspiration →
                  </Link>
                </div>

                {savedInspirations.length > 0 ? (
                  <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
                    {savedInspirations.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelectedInspiration(item)}
                        className="relative rounded-2xl md:rounded-3xl overflow-hidden border border-gold/15 group shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer aspect-[3/4] bg-gray-100 select-none active:scale-[0.98]"
                      >
                        <img
                          src={item.image}
                          alt={item.title || "Wedding Inspiration"}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveInspiration(item.id);
                          }}
                          className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 bg-white/95 hover:bg-rose-50 p-2 rounded-full text-rose-500 shadow-md hover:scale-110 active:scale-95 transition-all cursor-pointer flex items-center justify-center border border-rose-100 z-10"
                          title="Unlike inspiration (Remove)"
                          aria-label="Unlike inspiration"
                        >
                          <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Heart className="w-10 h-10 text-rose-300 mx-auto" />
                    <p className="text-sm font-semibold text-charcoal">No liked inspirations yet</p>
                    <p className="text-xs text-charcoal/60 max-w-sm mx-auto">Click the heart like button on any photo or theme in the Inspiration Gallery to save your favorite wedding looks here.</p>
                    <Link
                      href="/inspiration"
                      className="inline-block mt-2 px-5 py-2.5 rounded-full bg-[#0F4C45] text-white text-xs font-bold hover:bg-[#12584E] transition-colors shadow-2xs"
                    >
                      Browse Inspiration Gallery
                    </Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: WEDDING CHECKLIST */}
            {activeTab === "checklist" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display">Interactive Wedding Checklist</h2>
                    <p className="text-xs text-charcoal/60">Track key milestones and planning tasks for your wedding.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-[#0F4C45]">{checklistProgress}% Completed</span>
                    <div className="w-28 h-2 bg-gray-100 rounded-full mt-1 overflow-hidden">
                      <div className="h-full bg-[#0F4C45] transition-all duration-500" style={{ width: `${checklistProgress}%` }} />
                    </div>
                  </div>
                </div>

                <form onSubmit={handleAddChecklist} className="flex gap-2">
                  <input
                    type="text"
                    value={newTaskInput}
                    onChange={(e) => setNewTaskInput(e.target.value)}
                    placeholder="Add a new custom task (e.g., Book DJ, Order Favors)..."
                    className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-2.5 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                  />
                  <button type="submit" className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2.5 rounded-2xl hover:bg-[#12584E] transition-all flex items-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>

                <div className="space-y-2">
                  {checklist.map((item) => (
                    <label key={item.id} className="flex items-center justify-between p-3.5 bg-[#FAF7F2] rounded-2xl border border-gold/10 hover:border-gold/30 transition-all cursor-pointer">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={item.completed}
                          onChange={() => handleToggleChecklist(item.id)}
                          className="w-4 h-4 accent-[#0F4C45] rounded cursor-pointer"
                        />
                        <span className={`text-xs font-semibold ${item.completed ? "line-through text-charcoal/40" : "text-charcoal"}`}>
                          {item.task}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gold bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                        {item.category}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: BUDGET PLANNER */}
            {activeTab === "budget" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display">Interactive Budget Planner</h2>
                    <p className="text-xs text-charcoal/60">Set target budgets and track estimated vs actual expenses.</p>
                  </div>
                  <div className="sm:text-right">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Target Total Budget</span>
                    <div className="relative inline-block mt-0.5">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-[#0F4C45]">₹</span>
                      <input
                        type="number"
                        value={totalBudget || ""}
                        placeholder="0"
                        onChange={(e) => handleUpdateTotalBudget(Number(e.target.value) || 0)}
                        className="text-sm font-bold text-right text-[#0F4C45] bg-[#FAF7F2] border border-gold/20 rounded-xl pl-7 pr-3 py-1.5 w-36 outline-none focus:border-[#0F4C45]"
                      />
                    </div>
                  </div>
                </div>

                {/* Budget Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Estimated Total</span>
                    <p className="text-lg font-bold text-charcoal mt-1">₹{totalEstimatedBudget.toLocaleString("en-IN")}</p>
                  </div>
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/10">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Actual Committed</span>
                    <p className="text-lg font-bold text-[#0F4C45] mt-1">₹{totalActualBudget.toLocaleString("en-IN")}</p>
                  </div>
                  <div className={`p-4 rounded-2xl border ${remainingBudget >= 0 ? "bg-emerald-50 border-emerald-200" : "bg-rose-50 border-rose-200"}`}>
                    <span className="text-[10px] font-bold uppercase tracking-wider block text-charcoal/70">Remaining Balance</span>
                    <p className={`text-lg font-bold mt-1 ${remainingBudget >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                      ₹{remainingBudget.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>

                {/* Add Category Form */}
                <form onSubmit={handleAddBudgetItem} className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Expense category (e.g., Venue, Photography, Decor, Outfits)..."
                    className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-2.5 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                  />
                  <input
                    type="number"
                    value={newEstimatedInput}
                    onChange={(e) => setNewEstimatedInput(e.target.value)}
                    placeholder="Estimated (₹)"
                    className="w-full sm:w-32 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-3 py-2.5 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                  />
                  <input
                    type="number"
                    value={newActualInput}
                    onChange={(e) => setNewActualInput(e.target.value)}
                    placeholder="Actual (₹, optional)"
                    className="w-full sm:w-36 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-3 py-2.5 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                  />
                  <button type="submit" className="bg-[#0F4C45] text-white text-xs font-bold px-5 py-2.5 rounded-2xl hover:bg-[#12584E] transition-all flex items-center justify-center gap-1 cursor-pointer shrink-0">
                    <Plus className="w-4 h-4" /> Add Expense
                  </button>
                </form>

                {/* Budget Item List */}
                {budgetItems.length > 0 ? (
                  <div className="space-y-2.5">
                    {budgetItems.map((item) => (
                      <div key={item.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/10 flex items-center justify-between gap-4 group hover:border-gold/30 transition-all">
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-xs text-charcoal truncate">{item.category}</h4>
                          <p className="text-[11px] text-charcoal/60 mt-0.5">
                            Estimated: <span className="font-semibold text-charcoal">₹{item.estimated.toLocaleString("en-IN")}</span>
                          </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="text-right">
                            <span className="text-[10px] text-charcoal/50 block font-medium">Actual Committed</span>
                            <span className="text-xs font-bold text-[#0F4C45]">₹{item.actual.toLocaleString("en-IN")}</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveBudgetItem(item.id)}
                            className="p-1.5 text-rose-500 hover:bg-rose-50 rounded-xl transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                            title="Delete expense"
                            aria-label="Delete expense"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3 bg-[#FAF7F2]/50 rounded-2xl border border-dashed border-gold/25 p-8">
                    <DollarSign className="w-10 h-10 text-gold/40 mx-auto" />
                    <p className="text-sm font-semibold text-charcoal">No expenses added yet</p>
                    <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                      Start planning your wedding budget by setting your target budget above and adding your custom expense categories.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 7: ENQUIRIES */}
            {activeTab === "enquiries" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display">Submitted Enquiries & Quotes</h2>
                    <p className="text-xs text-charcoal/60">Track vendor communication and price quotes.</p>
                  </div>
                  <span className="text-xs font-bold text-[#0F4C45]">{enquiries.length} Active Requests</span>
                </div>

                {enquiries.length > 0 ? (
                  <div className="space-y-4">
                    {enquiries.map((enq) => (
                      <div key={enq.id} className="p-5 bg-[#FAF7F2] rounded-2xl border border-gold/15 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{enq.category}</span>
                            <span className="text-[10px] text-charcoal/40">• {enq.date}</span>
                          </div>
                          <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border ${
                            enq.status.includes("Received")
                              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                              : "bg-amber-50 text-amber-800 border-amber-200"
                          }`}>
                            {enq.status}
                          </span>
                        </div>
                        <h4 className="font-bold text-base text-charcoal font-display">{enq.vendorName}</h4>
                        <p className="text-xs text-charcoal/70">{enq.notes}</p>
                        <div className="pt-2 border-t border-gold/10 flex items-center justify-between text-xs">
                          <span className="text-charcoal/60">Estimated Quote:</span>
                          <span className="font-bold text-[#0F4C45]">{enq.amount}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <MessageSquare className="w-10 h-10 text-gold/40 mx-auto" />
                    <p className="text-sm font-semibold text-charcoal">No submitted enquiries yet</p>
                    <p className="text-xs text-charcoal/60 max-w-sm mx-auto">Explore wedding vendors and click "Send Inquiry" to request custom quotes.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB 8: SETTINGS */}
            {activeTab === "settings" && (
              <div className="bg-white p-6 sm:p-8 rounded-3xl border border-gold/15 shadow-xs space-y-6 animate-in fade-in duration-300">
                <div className="border-b border-gold/10 pb-4">
                  <h2 className="text-xl font-bold text-charcoal font-display">Account & Profile Settings</h2>
                  <p className="text-xs text-charcoal/60">Update personal info and preferences.</p>
                </div>

                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch("/api/v1/customer/settings", {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          profile: {
                            full_name: userName,
                            name: userName,
                            phone: phone,
                            city: city,
                            wedding_date: weddingDate,
                          },
                        }),
                      });
                      const data = await res.json();
                      if (res.ok && data.success) {
                        if (typeof window !== "undefined") {
                          localStorage.setItem("userName", userName);
                          localStorage.setItem("userEmail", userEmail);
                          localStorage.setItem("userPhone", phone);
                          localStorage.setItem("userCity", city);
                          localStorage.setItem("weddingDate", weddingDate);
                        }
                        alert("Profile updated successfully!");
                      } else {
                        alert(data.error?.message || "Failed to save settings.");
                      }
                    } catch (err) {
                      alert("Error saving settings. Please try again.");
                    }
                  }}
                  className="space-y-4 max-w-md"
                >
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Full Name</label>
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-3 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="w-full bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-3 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">Wedding Date</label>
                    <input
                      type="date"
                      value={weddingDate}
                      onChange={(e) => setWeddingDate(e.target.value)}
                      className="w-full bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-3 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-charcoal/70 uppercase">City / State</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      placeholder="Kochi, Kerala"
                      className="w-full bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-3 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="bg-[#0F4C45] text-white text-xs font-bold px-6 py-3 rounded-2xl hover:bg-[#12584E] transition-all cursor-pointer"
                  >
                    Save Changes
                  </button>
                </form>
              </div>
            )}

          </main>
        </div>
      </div>

      {/* FULL-SCREEN SAVED INSPIRATION VIEWER MODAL (SLIDE ROLL CAROUSEL) */}
      {selectedInspiration && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedInspiration(null)}
        >
          {/* Top Bar: Counter & Actions */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-50 pointer-events-none">
            {/* Counter */}
            {selectedInspirationIndex >= 0 && savedInspirations.length > 0 ? (
              <div className="pointer-events-auto bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                <span>{selectedInspirationIndex + 1}</span>
                <span className="text-white/40 mx-1.5">/</span>
                <span>{savedInspirations.length}</span>
              </div>
            ) : <div />}

            {/* Right Controls: Unlike & Close */}
            <div className="pointer-events-auto flex items-center gap-2.5 ml-auto">
              {/* Unlike Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveInspiration(selectedInspiration.id);
                }}
                aria-label="Unlike inspiration"
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-white text-rose-500 border border-rose-200 shadow-rose-500/30 flex items-center justify-center cursor-pointer shadow-xl transition-all active:scale-95"
                title="Unlike inspiration (Remove)"
              >
                <Heart className="w-5 h-5 fill-rose-500 text-rose-500 scale-110" />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedInspiration(null)}
                aria-label="Close image viewer"
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer shadow-xl border border-white/25 active:scale-95 transition-all"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Left Slide Roll Button */}
          {savedInspirations.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrevInspiration();
              }}
              aria-label="Previous saved inspiration"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 min-w-[46px] min-h-[46px] w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer shadow-2xl border border-white/20 active:scale-90 hover:scale-105 transition-all backdrop-blur-md"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Main Selected Image Only */}
          <div
            className="relative flex items-center justify-center max-w-[92vw] max-h-[88vh] sm:max-h-[85vh] select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={selectedInspiration.image}
              alt={selectedInspiration.title || "Wedding Inspiration"}
              className="max-h-[85vh] max-w-[90vw] md:max-w-4xl lg:max-w-5xl w-auto h-auto object-contain rounded-2xl shadow-2xl transition-opacity duration-200"
            />
          </div>

          {/* Right Slide Roll Button */}
          {savedInspirations.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNextInspiration();
              }}
              aria-label="Next saved inspiration"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 min-w-[46px] min-h-[46px] w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer shadow-2xl border border-white/20 active:scale-90 hover:scale-105 transition-all backdrop-blur-md"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
