"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getDynamicPackages, createAdPackage, saveDynamicPackages, AdPackage } from "@/lib/adStore";
import { Layers, Plus, Edit2, Trash2, CheckCircle2, ShieldCheck, ArrowRight, X } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminMarketingPackagesPage() {
  const [packages, setPackages] = useState<AdPackage[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPkg, setEditingPkg] = useState<AdPackage | null>(null);

  // Form Fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [placement, setPlacement] = useState("Homepage Hero Banner");
  const [weeklyPrice, setWeeklyPrice] = useState<number>(2499);
  const [monthlyPrice, setMonthlyPrice] = useState<number>(7499);
  const [priorityLevel, setPriorityLevel] = useState<number>(8);
  const [estimatedReach, setEstimatedReach] = useState("50,000+ views/mo");
  const [desktopBannerSize, setDesktopBannerSize] = useState("1400x400 px");
  const [mobileBannerSize, setMobileBannerSize] = useState("750x450 px");

  useEffect(() => {
    setPackages(getDynamicPackages());
  }, []);

  const refreshPackages = () => {
    setPackages(getDynamicPackages());
  };

  const handleOpenCreate = () => {
    setEditingPkg(null);
    setName("");
    setDescription("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (pkg: AdPackage) => {
    setEditingPkg(pkg);
    setName(pkg.name);
    setDescription(pkg.description);
    setPlacement(pkg.placement);
    setWeeklyPrice(pkg.weeklyPrice);
    setMonthlyPrice(pkg.monthlyPrice);
    setPriorityLevel(pkg.priorityLevel);
    setEstimatedReach(pkg.estimatedReach);
    setDesktopBannerSize(pkg.desktopBannerSize);
    setMobileBannerSize(pkg.mobileBannerSize);
    setIsModalOpen(true);
  };

  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingPkg) {
      const updated = packages.map((p) =>
        p.id === editingPkg.id
          ? {
              ...p,
              name,
              description,
              placement,
              weeklyPrice,
              monthlyPrice,
              priorityLevel,
              estimatedReach,
              desktopBannerSize,
              mobileBannerSize,
            }
          : p
      );
      saveDynamicPackages(updated);
    } else {
      createAdPackage({
        name,
        description,
        placement,
        weeklyPrice,
        monthlyPrice,
        priorityLevel,
        estimatedReach,
        desktopBannerSize,
        mobileBannerSize,
      });
    }

    refreshPackages();
    setIsModalOpen(false);
    alert("Advertisement Package saved successfully!");
  };

  const handleDeletePackage = (id: string) => {
    if (confirm("Are you sure you want to delete this package?")) {
      const updated = packages.filter((p) => p.id !== id);
      saveDynamicPackages(updated);
      refreshPackages();
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4 border-b border-gold/10">
        <div>
          <h1 className="text-3xl font-display text-charcoal font-semibold">Dynamic Advertisement Package Management</h1>
          <p className="text-sm text-charcoal/70 mt-1">
            Configure pricing, placement slots, reach estimates, and priority levels offered to vendors.
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          className="bg-[#0F4C45] text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-md hover:bg-[#12584E] transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" /> Create New Package
        </Button>
      </div>

      {/* Submenu Pills */}
      <div className="flex gap-2 overflow-x-auto pb-2 border-b border-gold/10 hide-scrollbar">
        <Link href="/admin/marketing" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Overview & Campaigns
        </Link>
        <Link href="/admin/marketing/leads" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Sales Leads
        </Link>
        <Link href="/admin/marketing/followups" className="bg-white text-charcoal/70 hover:bg-gold/10 border border-gold/15 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Follow-Ups
        </Link>
        <Link href="/admin/marketing/packages" className="bg-charcoal text-white px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider whitespace-nowrap">
          Dynamic Ad Packages ({packages.length})
        </Link>
      </div>

      {/* Packages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white rounded-3xl border border-gold/20 p-6 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <span className="text-[10px] font-bold uppercase tracking-widest text-gold bg-gold/10 px-2.5 py-0.5 rounded-full">
                  Priority Level {pkg.priorityLevel}
                </span>
                <div className="flex gap-1">
                  <button onClick={() => handleOpenEdit(pkg)} className="p-1.5 hover:bg-gray-100 rounded-lg text-charcoal/70">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button onClick={() => handleDeletePackage(pkg.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <h3 className="font-display font-semibold text-xl text-charcoal">{pkg.name}</h3>
              <p className="text-xs text-charcoal/70">{pkg.description}</p>

              <div className="pt-2 border-t border-gold/10 flex justify-between items-baseline">
                <div>
                  <span className="text-2xl font-bold text-[#0F4C45]">₹{pkg.monthlyPrice.toLocaleString()}</span>
                  <span className="text-xs text-charcoal/60"> / mo</span>
                </div>
                <div className="text-xs text-charcoal/70">
                  Weekly: <strong className="text-charcoal">₹{pkg.weeklyPrice.toLocaleString()}</strong>
                </div>
              </div>

              <div className="bg-[#FBF8F1] p-3 rounded-xl border border-gold/10 text-xs space-y-1">
                <div className="flex justify-between"><span className="text-charcoal/50">Placement:</span> <span className="font-semibold text-charcoal">{pkg.placement}</span></div>
                <div className="flex justify-between"><span className="text-charcoal/50">Desktop Spec:</span> <span className="font-medium">{pkg.desktopBannerSize}</span></div>
                <div className="flex justify-between"><span className="text-charcoal/50">Mobile Spec:</span> <span className="font-medium">{pkg.mobileBannerSize}</span></div>
              </div>
            </div>

            <Button onClick={() => handleOpenEdit(pkg)} variant="outline" className="w-full border-gold/20 text-charcoal hover:bg-gold/10 rounded-xl text-xs font-bold uppercase tracking-wider">
              Edit Package Settings
            </Button>
          </div>
        ))}
      </div>

      {/* Package Form Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <form
            onSubmit={handleSavePackage}
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-gold/20 space-y-4 my-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-center border-b border-gold/10 pb-3">
              <h3 className="font-display text-xl text-charcoal font-semibold">
                {editingPkg ? `Edit Package: ${editingPkg.name}` : "Create New Ad Package"}
              </h3>
              <button type="button" onClick={() => setIsModalOpen(false)}><X className="w-6 h-6 text-gray-400" /></button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Package Name</label>
                <input
                  required
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div>
                <label className="font-semibold block text-charcoal/70 mb-1">Description</label>
                <textarea
                  required
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Placement Slot</label>
                  <input
                    type="text"
                    value={placement}
                    onChange={(e) => setPlacement(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Priority Level (1-10)</label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={priorityLevel}
                    onChange={(e) => setPriorityLevel(Number(e.target.value))}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Weekly Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={weeklyPrice}
                    onChange={(e) => setWeeklyPrice(Number(e.target.value))}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Monthly Price (₹)</label>
                  <input
                    required
                    type="number"
                    value={monthlyPrice}
                    onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none font-bold text-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Desktop Spec</label>
                  <input
                    type="text"
                    value={desktopBannerSize}
                    onChange={(e) => setDesktopBannerSize(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
                <div>
                  <label className="font-semibold block text-charcoal/70 mb-1">Mobile Spec</label>
                  <input
                    type="text"
                    value={mobileBannerSize}
                    onChange={(e) => setMobileBannerSize(e.target.value)}
                    className="w-full bg-[#FBF8F1] border border-gold/20 rounded-xl p-2.5 text-charcoal outline-none"
                  />
                </div>
              </div>
            </div>

            <div className="pt-3 flex justify-end gap-3 border-t border-gold/10">
              <Button type="button" variant="ghost" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" className="bg-[#0F4C45] text-white rounded-xl">Save Package</Button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
