"use client";

import { useState, useMemo } from "react";
import { 
  Search, ShieldCheck, CheckCircle2, Ban, Eye, Store, Camera, 
  Sparkles, MapPin, Phone, Mail, Calendar, Tag, ChevronRight, X, User, Check
} from "lucide-react";
import { Button } from "@/components/Button";

export type VendorRecord = {
  id: string | number;
  boutique_name: string;
  owner_name?: string;
  category: string;
  email: string;
  phone?: string;
  city?: string;
  plan?: string;
  created_at?: string;
  status: "active" | "pending" | "suspended";
  description?: string;
  rating?: number;
};

const CATEGORY_TABS = [
  "All Categories",
  "Photographers",
  "Bridal Boutiques",
  "Groom Wear",
  "Makeup Artists",
  "Wedding Venues",
  "Catering & Feasts",
  "Decor & Planning",
  "Mehendi Artists",
  "Invitations & Gifts",
  "Jewellery"
];

const MOCK_REGISTERED_VENDORS: VendorRecord[] = [
  {
    id: "photographer-1",
    boutique_name: "Memory Lanes Photography",
    owner_name: "Rahul Nair",
    category: "Photographers",
    email: "info@memorylanes.in",
    phone: "+91 98470 12345",
    city: "Kozhikode, Kerala",
    plan: "Premium Partner",
    created_at: "2026-03-15",
    status: "active",
    description: "Candid wedding & pre-wedding photography specializing in luxury destination celebrations across Kerala.",
    rating: 4.9
  },
  {
    id: "photographer-2",
    boutique_name: "Magic Motion Media",
    owner_name: "Anand Krishna",
    category: "Photographers",
    email: "contact@magicmotion.com",
    phone: "+91 98950 67890",
    city: "Kochi, Kerala",
    plan: "Professional Monthly",
    created_at: "2026-04-02",
    status: "active",
    description: "Cinematic wedding films and high-end bridal portraiture.",
    rating: 4.8
  },
  {
    id: "photographer-3",
    boutique_name: "Frames & Stories",
    owner_name: "Vishnu Varma",
    category: "Photographers",
    email: "vishnu@framesandstories.in",
    phone: "+91 97441 22334",
    city: "Trivandrum, Kerala",
    plan: "Early Partner",
    created_at: "2026-05-10",
    status: "pending",
    description: "Fine art wedding photography capturing emotional moments and timeless memories.",
    rating: 4.7
  },
  {
    id: "boutique-1",
    boutique_name: "Aurelia Brides",
    owner_name: "Fanas Rin",
    category: "Bridal Boutiques",
    email: "meharoofanasrin20@gmail.com",
    phone: "+91 95678 11223",
    city: "Ernakulam, Kerala",
    plan: "Early Partner",
    created_at: "2026-02-10",
    status: "active",
    description: "Custom bridal lehengas, silk saris, and contemporary wedding ensembles.",
    rating: 5.0
  },
  {
    id: "boutique-2",
    boutique_name: "Bohemian Bridal Rental",
    owner_name: "Shifana V",
    category: "Bridal Boutiques",
    email: "bohemianbridals@gmail.com",
    phone: "+91 94471 88990",
    city: "Taliparamba, Kannur",
    plan: "Professional Monthly",
    created_at: "2026-03-22",
    status: "active",
    description: "Rental luxury bridal wear and designer wedding gowns.",
    rating: 4.8
  },
  {
    id: "groom-1",
    boutique_name: "Royal Groom Couture",
    owner_name: "Muhammed Shaban",
    category: "Groom Wear",
    email: "shabanmuhammed26@gmail.com",
    phone: "+91 73066 33171",
    city: "Malappuram, Kerala",
    plan: "Premium Partner",
    created_at: "2026-01-18",
    status: "active",
    description: "Designer suits, sherwanis, and bespoke ethnic attire for grooms.",
    rating: 4.9
  },
  {
    id: "makeup-1",
    boutique_name: "Faces by Leena Bhushan",
    owner_name: "Leena Bhushan",
    category: "Makeup Artists",
    email: "info@facesbyleena.com",
    phone: "+91 98112 33445",
    city: "Kochi, Kerala",
    plan: "Premium Partner",
    created_at: "2026-02-01",
    status: "active",
    description: "HD bridal makeup, airbrush styling, and traditional reception glam.",
    rating: 4.9
  },
  {
    id: "makeup-2",
    boutique_name: "Makeup by Parul Garg",
    owner_name: "Parul Garg",
    category: "Makeup Artists",
    email: "parul@parulgargmakeup.com",
    phone: "+91 99990 12345",
    city: "Kozhikode, Kerala",
    plan: "Professional Monthly",
    created_at: "2026-03-11",
    status: "active",
    description: "Flawless celebrity-style bridal makeover and hair design.",
    rating: 4.8
  },
  {
    id: "venue-1",
    boutique_name: "Grand Solitaire Island Resort",
    owner_name: "Events Manager",
    category: "Wedding Venues",
    email: "events.kochi@solitaire.com",
    phone: "+91 484 266 1234",
    city: "Bolgatty Island, Kochi",
    plan: "Enterprise Luxury",
    created_at: "2025-11-20",
    status: "active",
    description: "Waterfront luxury convention center and grand banquet lawns.",
    rating: 5.0
  },
  {
    id: "venue-2",
    boutique_name: "Seaside Haven Resort",
    owner_name: "Reservations Team",
    category: "Wedding Venues",
    email: "weddings.kovalam@seasidehaven.com",
    phone: "+91 471 305 1234",
    city: "Kovalam, Trivandrum",
    plan: "Enterprise Luxury",
    created_at: "2025-12-05",
    status: "active",
    description: "Cliff-top beach resort ideal for royal destination weddings.",
    rating: 4.9
  },
  {
    id: "catering-1",
    boutique_name: "Vinayaka Catering Services",
    owner_name: "Venkatesh Iyer",
    category: "Catering & Feasts",
    email: "orders@vinayakacatering.com",
    phone: "+91 98460 55443",
    city: "Kochi, Kerala",
    plan: "Premium Partner",
    created_at: "2026-01-10",
    status: "active",
    description: "Authentic traditional Kerala Sadya served on banana leaf & multi-cuisine buffet spreads.",
    rating: 4.9
  },
  {
    id: "decor-1",
    boutique_name: "Flora Wedding Decorators",
    owner_name: "Deepak Thomas",
    category: "Decor & Planning",
    email: "deepak@floradecor.in",
    phone: "+91 98951 99887",
    city: "Kottayam, Kerala",
    plan: "Professional Monthly",
    created_at: "2026-03-08",
    status: "active",
    description: "Grand floral mandap designs, ambient lighting, and theme wedding setups.",
    rating: 4.8
  },
  {
    id: "mehendi-1",
    boutique_name: "Mehendi by Reshma",
    owner_name: "Reshma Khan",
    category: "Mehendi Artists",
    email: "reshma.henna@gmail.com",
    phone: "+91 97455 66778",
    city: "Malappuram, Kerala",
    plan: "Early Partner",
    created_at: "2026-04-19",
    status: "active",
    description: "Intricate Arabic, Rajasthani, and personalized bridal henna designs.",
    rating: 4.8
  },
  {
    id: "invitations-1",
    boutique_name: "Krafted Cards & Invites",
    owner_name: "Sanjay Kumar",
    category: "Invitations & Gifts",
    email: "hello@kraftedcards.com",
    phone: "+91 98471 33221",
    city: "Thrissur, Kerala",
    plan: "Early Partner",
    created_at: "2026-04-25",
    status: "pending",
    description: "Gold foil luxury wedding invitations, digital e-cards, and customized favor boxes.",
    rating: 4.7
  },
  {
    id: "jewellery-1",
    boutique_name: "Malabar Gold & Diamonds",
    owner_name: "Boutique Manager",
    category: "Jewellery",
    email: "support@malabargold.com",
    phone: "+91 495 272 1234",
    city: "Kozhikode, Kerala",
    plan: "Enterprise Luxury",
    created_at: "2025-10-10",
    status: "active",
    description: "Traditional Kerala bridal gold jewelry, uncut diamond polki sets, and antique temple collections.",
    rating: 5.0
  }
];

type VendorManagementProps = {
  backendVendors: any[];
};

export function VendorManagementClient({ backendVendors }: VendorManagementProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All Categories");
  const [selectedStatus, setSelectedStatus] = useState<string>("All Vendors");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeVendor, setActiveVendor] = useState<VendorRecord | null>(null);
  const [vendorList, setVendorList] = useState<VendorRecord[]>(() => {
    return backendVendors.map((b) => ({
      id: b.id,
      boutique_name: b.boutique_name || b.name || "Partner Vendor",
      owner_name: b.owner_name || "Owner",
      category: b.category || "Bridal Boutiques",
      email: b.email || "vendor@cloche.com",
      phone: b.phone || "+91 98765 43210",
      city: b.city || b.location || "Kerala, India",
      plan: b.plan || "Early Partner",
      created_at: b.created_at || "2026-04-01",
      status: b.status === "suspended" ? "suspended" : b.status === "pending" ? "pending" : "active",
      description: b.about || b.description || "Registered luxury vendor on Cloche marketplace.",
      rating: b.rating || 4.9
    }));
  });

  // Filter vendors based on Category, Status, and Search Query
  const filteredVendors = useMemo(() => {
    return vendorList.filter((v) => {
      // Category filter
      if (selectedCategory !== "All Categories") {
        const catLower = v.category.toLowerCase();
        const selLower = selectedCategory.toLowerCase();

        if (selLower.includes("photographer")) {
          if (!catLower.includes("photo") && !catLower.includes("video")) return false;
        } else if (selLower.includes("boutique")) {
          if (!catLower.includes("boutique") && !catLower.includes("bridal") && !catLower.includes("wear")) return false;
        } else if (selLower.includes("groom")) {
          if (!catLower.includes("groom") && !catLower.includes("suit")) return false;
        } else if (selLower.includes("makeup")) {
          if (!catLower.includes("makeup") && !catLower.includes("hair") && !catLower.includes("beauty")) return false;
        } else if (selLower.includes("venue")) {
          if (!catLower.includes("venue") && !catLower.includes("hall") && !catLower.includes("resort")) return false;
        } else if (selLower.includes("catering")) {
          if (!catLower.includes("cater") && !catLower.includes("food") && !catLower.includes("sadya")) return false;
        } else if (selLower.includes("decor")) {
          if (!catLower.includes("decor") && !catLower.includes("planner")) return false;
        } else if (selLower.includes("mehendi")) {
          if (!catLower.includes("mehendi") && !catLower.includes("henna")) return false;
        } else if (selLower.includes("invitation")) {
          if (!catLower.includes("invitation") && !catLower.includes("card") && !catLower.includes("gift")) return false;
        } else if (selLower.includes("jewel")) {
          if (!catLower.includes("jewel") && !catLower.includes("gold")) return false;
        } else {
          if (!catLower.includes(selLower)) return false;
        }
      }

      // Status filter
      if (selectedStatus === "Active" && v.status !== "active") return false;
      if (selectedStatus === "Pending Approval" && v.status !== "pending") return false;
      if (selectedStatus === "Suspended" && v.status !== "suspended") return false;

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = v.boutique_name.toLowerCase().includes(q);
        const matchOwner = (v.owner_name || "").toLowerCase().includes(q);
        const matchEmail = v.email.toLowerCase().includes(q);
        const matchCity = (v.city || "").toLowerCase().includes(q);
        const matchCat = v.category.toLowerCase().includes(q);

        if (!matchName && !matchOwner && !matchEmail && !matchCity && !matchCat) {
          return false;
        }
      }

      return true;
    });
  }, [vendorList, selectedCategory, selectedStatus, searchQuery]);

  const handleDeleteVendor = (id: string | number) => {
    if (confirm("Are you sure you want to remove this vendor from the database?")) {
      setVendorList((prev) => prev.filter((item) => item.id !== id));
      if (activeVendor?.id === id) setActiveVendor(null);
    }
  };

  const handleToggleStatus = (id: string | number, newStatus: "active" | "suspended" | "pending") => {
    setVendorList((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: newStatus } : item))
    );
    if (activeVendor?.id === id) {
      setActiveVendor((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Vendor Management</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Filter, inspect, approve, and manage registered wedding vendors across Kerala.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 bg-emerald/10 text-emerald px-3.5 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" /> {filteredVendors.length} Vendors Listed
          </span>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="space-y-3">
        <label className="text-xs font-bold uppercase tracking-wider text-charcoal/60 block">Filter By Vendor Category</label>
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {CATEGORY_TABS.map((cat) => {
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  isActive
                    ? "bg-[#0F4C45] text-white shadow-md shadow-[#0F4C45]/20"
                    : "bg-white text-charcoal/70 hover:bg-gold/10 hover:text-charcoal border border-gold/15"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Status Filter & Search */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 bg-white p-4 rounded-2xl border border-gold/15 shadow-sm">
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar">
          {["All Vendors", "Active", "Pending Approval", "Suspended"].map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedStatus(tab)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-colors ${
                selectedStatus === tab
                  ? "bg-charcoal text-white"
                  : "bg-gray-100 text-charcoal/70 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        
        <div className="relative flex-1 sm:max-w-xs">
          <input
            type="text"
            placeholder="Search by vendor, city, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#FBF8F1] border border-gold/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald text-charcoal placeholder:text-charcoal/40"
          />
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      {/* Vendors Table */}
      <div className="bg-white rounded-2xl border border-gold/15 shadow-sm overflow-hidden">
        {filteredVendors.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <Store className="w-12 h-12 text-charcoal/30 mx-auto" />
            <h3 className="text-lg font-display text-charcoal">No vendors found</h3>
            <p className="text-sm text-charcoal/60">No vendor matches the selected category or search filters.</p>
            <button
              onClick={() => {
                setSelectedCategory("All Categories");
                setSelectedStatus("All Vendors");
                setSearchQuery("");
              }}
              className="text-xs text-emerald font-bold uppercase tracking-wider hover:underline pt-2"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F6F0] border-b border-gold/10 text-xs uppercase tracking-wider text-charcoal/60 font-semibold">
                  <th className="p-4 pl-6">Vendor / Business</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Contact</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gold/10">
                {filteredVendors.map((v) => (
                  <tr key={v.id} className="hover:bg-[#FBF8F1] transition-colors group">
                    <td className="p-4 pl-6">
                      <div 
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => setActiveVendor(v)}
                      >
                        <div className="w-10 h-10 rounded-full bg-emerald/10 text-emerald flex items-center justify-center font-bold shrink-0">
                          {v.category.toLowerCase().includes("photo") ? (
                            <Camera className="w-5 h-5" />
                          ) : (
                            <Store className="w-5 h-5" />
                          )}
                        </div>
                        <div>
                          <h4 className="font-display font-medium text-charcoal group-hover:text-emerald transition-colors">{v.boutique_name}</h4>
                          <p className="text-xs text-charcoal/50">Owner: {v.owner_name || "Partner"} • ID: #{v.id}</p>
                        </div>
                      </div>
                    </td>

                    <td className="p-4">
                      <span className="inline-block bg-gold/15 text-charcoal font-semibold px-2.5 py-1 rounded-md text-xs">
                        {v.category}
                      </span>
                    </td>

                    <td className="p-4">
                      <div className="text-xs text-charcoal font-medium">{v.email}</div>
                      <div className="text-[11px] text-charcoal/60">{v.phone || "N/A"}</div>
                    </td>

                    <td className="p-4">
                      <span className="text-xs text-charcoal">{v.city || "Kerala, India"}</span>
                    </td>

                    <td className="p-4">
                      {v.status === "active" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald/10 text-emerald">
                          <CheckCircle2 className="w-3 h-3" /> Active
                        </span>
                      ) : v.status === "pending" ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-200">
                          Pending
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-200">
                          Suspended
                        </span>
                      )}
                    </td>

                    <td className="p-4 pr-6 text-right space-x-2">
                      <button
                        onClick={() => setActiveVendor(v)}
                        className="inline-flex items-center gap-1 bg-gray-100 text-charcoal hover:bg-gray-200 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Eye className="w-3.5 h-3.5" /> Details
                      </button>
                      
                      <button
                        onClick={() => handleDeleteVendor(v.id)}
                        className="inline-flex items-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Detail Drawer Modal */}
      {activeVendor && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gold/20 space-y-6 animate-in zoom-in duration-200 relative">
            <button
              onClick={() => setActiveVendor(null)}
              className="absolute right-6 top-6 text-charcoal/40 hover:text-charcoal p-1"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-4 border-b border-gold/10 pb-4">
              <div className="w-14 h-14 rounded-2xl bg-[#0F4C45] text-white flex items-center justify-center font-serif text-2xl shadow-md">
                {activeVendor.boutique_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                  {activeVendor.category}
                </span>
                <h3 className="font-display text-2xl text-charcoal font-semibold mt-1">{activeVendor.boutique_name}</h3>
                <p className="text-xs text-charcoal/60">Vendor ID: #{activeVendor.id}</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4 bg-[#FBF8F1] p-4 rounded-2xl border border-gold/10">
                <div>
                  <span className="text-[11px] uppercase font-bold text-charcoal/50 block">Contact Person</span>
                  <span className="font-semibold text-charcoal flex items-center gap-1.5 mt-0.5">
                    <User className="w-4 h-4 text-gold" /> {activeVendor.owner_name || "Partner"}
                  </span>
                </div>
                <div>
                  <span className="text-[11px] uppercase font-bold text-charcoal/50 block">Subscription Plan</span>
                  <span className="font-semibold text-emerald flex items-center gap-1.5 mt-0.5">
                    <Tag className="w-4 h-4 text-emerald" /> {activeVendor.plan || "Standard Partner"}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-charcoal/80">
                  <Mail className="w-4 h-4 text-gold shrink-0" />
                  <a href={`mailto:${activeVendor.email}`} className="hover:underline">{activeVendor.email}</a>
                </div>
                <div className="flex items-center gap-2 text-charcoal/80">
                  <Phone className="w-4 h-4 text-gold shrink-0" />
                  <span>{activeVendor.phone || "+91 98765 43210"}</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal/80">
                  <MapPin className="w-4 h-4 text-gold shrink-0" />
                  <span>{activeVendor.city || "Kerala, India"}</span>
                </div>
                <div className="flex items-center gap-2 text-charcoal/80">
                  <Calendar className="w-4 h-4 text-gold shrink-0" />
                  <span>Registered: {activeVendor.created_at || "2026-03-01"}</span>
                </div>
              </div>

              {activeVendor.description && (
                <div className="border-t border-gold/10 pt-4">
                  <span className="text-[11px] uppercase font-bold text-charcoal/50 block mb-1">About Vendor</span>
                  <p className="text-xs text-charcoal/80 leading-relaxed bg-[#F8F6F0] p-3 rounded-xl">
                    {activeVendor.description}
                  </p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="border-t border-gold/10 pt-4 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                {activeVendor.status !== "active" && (
                  <button
                    onClick={() => handleToggleStatus(activeVendor.id, "active")}
                    className="bg-emerald text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-emerald/90 transition-colors flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Approve & Activate
                  </button>
                )}
                {activeVendor.status === "active" && (
                  <button
                    onClick={() => handleToggleStatus(activeVendor.id, "suspended")}
                    className="bg-amber-500 text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-amber-600 transition-colors"
                  >
                    Suspend Vendor
                  </button>
                )}
              </div>

              <button
                onClick={() => handleDeleteVendor(activeVendor.id)}
                className="bg-red-50 text-red-600 hover:bg-red-100 px-4 py-2 rounded-xl text-xs font-semibold transition-colors"
              >
                Delete Vendor
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
