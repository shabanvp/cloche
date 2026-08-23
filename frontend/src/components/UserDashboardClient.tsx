"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";
import { getWishlistItems, removeWishlistItem, syncWishlistWithServer, WishlistItem } from "@/lib/wishlistStore";
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

export function UserDashboardClient() {
  const [activeTab, setActiveTab] = useState<DashboardTab>("profile");
  const [userName, setUserName] = useState(() => resolveUserDisplayName());
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
  const [savedInspirations, setSavedInspirations] = useState<
    { id: string; title: string; category: string; image: string }[]
  >([
    {
      id: "insp-1",
      title: "Minimal Botanical Stage Decor",
      category: "Decor",
      image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "insp-2",
      title: "Traditional Kerala Bride Silk Saree",
      category: "Bridal Wear",
      image: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
    },
  ]);

  // Checklist State
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: "chk-1", task: "Finalize Wedding Date & City", category: "General", completed: true },
    { id: "chk-2", task: "Shortlist & Book Main Venue", category: "Venues", completed: true },
    { id: "chk-3", task: "Book Lead Photographer & Videographer", category: "Photography", completed: false },
    { id: "chk-4", task: "Book Bridal Makeup Artist", category: "Makeup", completed: false },
    { id: "chk-5", task: "Select Stage Decorator & Florist", category: "Decor", completed: false },
    { id: "chk-6", task: "Finalize Feast / Sadya Menu with Caterer", category: "Catering", completed: false },
    { id: "chk-7", task: "Order Custom E-Invites & Cards", category: "Invites", completed: false },
  ]);
  const [newTaskInput, setNewTaskInput] = useState("");

  // Budget Planner State
  const [totalBudget, setTotalBudget] = useState(1500000); // 15 Lakhs default
  const [budgetItems, setBudgetItems] = useState<BudgetItem[]>([
    { id: "b-1", category: "Venue & Resort", estimated: 500000, actual: 480000 },
    { id: "b-2", category: "Catering & Banquet Feasts", estimated: 350000, actual: 320000 },
    { id: "b-3", category: "Photography & Cinema", estimated: 250000, actual: 260000 },
    { id: "b-4", category: "Stage Decor & Floral Setup", estimated: 200000, actual: 190000 },
    { id: "b-5", category: "Bridal & Groom Attire", estimated: 150000, actual: 140000 },
    { id: "b-6", category: "Bridal Makeup & Styling", estimated: 50000, actual: 45000 },
  ]);
  const [newCategoryInput, setNewCategoryInput] = useState("");
  const [newEstimatedInput, setNewEstimatedInput] = useState("");

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
      } catch (e) {
        console.error("Dashboard init error:", e);
      } finally {
        setIsLoading(false);
      }
    }

    initUserDashboard();
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

  const handleRemoveInspiration = (id: string) => {
    setSavedInspirations((prev) => prev.filter((i) => i.id !== id));
  };

  const handleToggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleAddChecklist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskInput.trim()) return;
    setChecklist((prev) => [
      ...prev,
      { id: `chk-${Date.now()}`, task: newTaskInput.trim(), category: "General", completed: false },
    ]);
    setNewTaskInput("");
  };

  const handleAddBudgetItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryInput.trim() || !newEstimatedInput) return;
    setBudgetItems((prev) => [
      ...prev,
      {
        id: `b-${Date.now()}`,
        category: newCategoryInput.trim(),
        estimated: Number(newEstimatedInput),
        actual: Number(newEstimatedInput),
      },
    ]);
    setNewCategoryInput("");
    setNewEstimatedInput("");
  };

  // Calculations
  const completedTasks = checklist.filter((i) => i.completed).length;
  const checklistProgress = checklist.length > 0 ? Math.round((completedTasks / checklist.length) * 100) : 0;

  const totalEstimatedBudget = budgetItems.reduce((acc, i) => acc + i.estimated, 0);
  const totalActualBudget = budgetItems.reduce((acc, i) => acc + i.actual, 0);
  const remainingBudget = totalBudget - totalActualBudget;

  const navTabs: { id: DashboardTab; label: string; icon: any; count?: number }[] = [
    { id: "profile", label: "My Profile", icon: User },
    { id: "saved-vendors", label: "Saved Vendors", icon: Heart, count: savedVendors.length },
    { id: "saved-venues", label: "Saved Venues", icon: Building2, count: savedVenues.length },
    { id: "saved-inspirations", label: "Saved Inspirations", icon: Sparkles, count: savedInspirations.length },
    { id: "checklist", label: "Wedding Checklist", icon: CheckSquare, count: `${completedTasks}/${checklist.length}` as any },
    { id: "budget", label: "Budget Planner", icon: DollarSign },
    { id: "enquiries", label: "Enquiries & Quotes", icon: MessageSquare, count: enquiries.length },
    { id: "settings", label: "Account Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FBF9F5] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top User Welcome Header */}
        <div className="bg-gradient-to-r from-[#0F4C45] via-[#145C54] to-charcoal rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden border border-gold/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-gold/10 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gold/20 border-2 border-gold/40 text-gold flex items-center justify-center text-2xl sm:text-3xl font-display font-bold shadow-inner">
                {userName.charAt(0).toUpperCase()}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-bold font-display tracking-tight text-white">
                    Welcome back, {userName}!
                  </h1>
                  <span className="bg-gold/20 text-gold text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-gold/30 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3 text-gold" /> Verified Member
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-white/80 font-light mt-1 flex items-center gap-4 flex-wrap">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-gold" /> Wedding: {weddingDate || "Not Set"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-gold" /> Location: {city || "Not Set"}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveTab("checklist")}
                className="bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all flex items-center gap-1.5"
              >
                <CheckSquare className="w-3.5 h-3.5 text-gold" />
                <span>Checklist ({checklistProgress}%)</span>
              </button>
              <button
                onClick={() => setActiveTab("budget")}
                className="bg-gold hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all shadow-sm flex items-center gap-1.5"
              >
                <DollarSign className="w-3.5 h-3.5" />
                <span>Planner</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Main Grid (Sidebar Nav + Active Content) */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

          {/* Left Sidebar Navigation */}
          <aside className="md:col-span-1">
            <div className="bg-white rounded-3xl p-3 shadow-xs border border-gold/15 sticky top-24 space-y-1">
              <div className="px-4 py-3 border-b border-gold/10">
                <span className="text-[10px] font-bold text-gold uppercase tracking-widest block">User Navigation</span>
                <p className="text-xs font-semibold text-charcoal">Wedding Command Desk</p>
              </div>

              {navTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-semibold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0F4C45] text-white shadow-xs"
                        : "text-charcoal/70 hover:bg-[#FAF7F2] hover:text-[#0F4C45]"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 ${isActive ? "text-gold" : "text-[#0F4C45]"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.count !== undefined && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          isActive ? "bg-white/20 text-white" : "bg-gray-100 text-charcoal/70"
                        }`}
                      >
                        {tab.count}
                      </span>
                    )}
                  </button>
                );
              })}

              <div className="pt-3 border-t border-gold/10 px-2">
                <button
                  onClick={async () => {
                    await logout();
                    if (typeof window !== "undefined") {
                      localStorage.clear();
                      window.location.href = "/login?logout=success";
                    }
                  }}
                  className="w-full flex items-center gap-2 px-3.5 py-2.5 rounded-2xl text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          </aside>

          {/* Right Main Content Area */}
          <main className="md:col-span-3 space-y-6">

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
                    <h2 className="text-xl font-bold text-charcoal font-display">Saved Inspiration Board</h2>
                    <p className="text-xs text-charcoal/60">Decor concepts, bridal fashion looks, and wedding ideas.</p>
                  </div>
                  <Link href="/inspiration" className="text-xs font-bold text-[#0F4C45] hover:underline">
                    Explore Inspiration →
                  </Link>
                </div>

                {savedInspirations.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {savedInspirations.map((item) => (
                      <div key={item.id} className="bg-[#FAF7F2] rounded-2xl overflow-hidden border border-gold/10 group shadow-2xs">
                        <div className="relative h-44 overflow-hidden">
                          <img src={item.image} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                          <button onClick={() => handleRemoveInspiration(item.id)} className="absolute top-3 right-3 bg-white/90 p-1.5 rounded-full text-rose-600 shadow-sm hover:bg-rose-50 transition-all cursor-pointer">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <div className="p-4 space-y-1">
                          <span className="text-[10px] font-bold text-gold uppercase tracking-wider">{item.category}</span>
                          <h4 className="font-bold text-sm text-charcoal">{item.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 space-y-3">
                    <Sparkles className="w-10 h-10 text-gold/40 mx-auto" />
                    <p className="text-sm font-semibold text-charcoal">No saved inspirations</p>
                    <p className="text-xs text-charcoal/60 max-w-sm mx-auto">Browse wedding photos and decor ideas to save inspiration for your big day.</p>
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
                <div className="flex items-center justify-between border-b border-gold/10 pb-4">
                  <div>
                    <h2 className="text-xl font-bold text-charcoal font-display">Interactive Budget Planner</h2>
                    <p className="text-xs text-charcoal/60">Set target budgets and track estimated vs actual expenses.</p>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold text-gold uppercase tracking-wider block">Target Total Budget</span>
                    <input
                      type="number"
                      value={totalBudget}
                      onChange={(e) => setTotalBudget(Number(e.target.value))}
                      className="text-sm font-bold text-right text-[#0F4C45] bg-[#FAF7F2] border border-gold/20 rounded-xl px-2 py-1 w-32 outline-none"
                    />
                  </div>
                </div>

                {/* Budget Summary Cards */}
                <div className="grid grid-cols-3 gap-4">
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
                <form onSubmit={handleAddBudgetItem} className="flex gap-2">
                  <input
                    type="text"
                    value={newCategoryInput}
                    onChange={(e) => setNewCategoryInput(e.target.value)}
                    placeholder="Expense category (e.g., Return Gifts, DJ)..."
                    className="flex-1 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-4 py-2.5 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                  />
                  <input
                    type="number"
                    value={newEstimatedInput}
                    onChange={(e) => setNewEstimatedInput(e.target.value)}
                    placeholder="Estimated (₹)"
                    className="w-32 bg-[#FAF7F2] border border-gold/20 rounded-2xl px-3 py-2.5 text-xs text-charcoal outline-none focus:border-[#0F4C45]"
                  />
                  <button type="submit" className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2.5 rounded-2xl hover:bg-[#12584E] transition-all flex items-center gap-1 cursor-pointer">
                    <Plus className="w-4 h-4" /> Add
                  </button>
                </form>

                {/* Budget Item List */}
                <div className="space-y-2">
                  {budgetItems.map((item) => (
                    <div key={item.id} className="p-4 bg-[#FAF7F2] rounded-2xl border border-gold/10 flex items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-xs text-charcoal">{item.category}</h4>
                        <p className="text-[11px] text-charcoal/60">Estimated: ₹{item.estimated.toLocaleString("en-IN")}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#0F4C45]">₹{item.actual.toLocaleString("en-IN")}</span>
                      </div>
                    </div>
                  ))}
                </div>
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
    </div>
  );
}
