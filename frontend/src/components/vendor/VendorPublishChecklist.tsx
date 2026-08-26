"use client";

import { useState, useEffect } from "react";
import {
  Rocket,
  CheckCircle2,
  AlertCircle,
  Camera,
  Package,
  MapPin,
  Phone,
  FileText,
  Sparkles,
  Loader2,
  ArrowRight,
} from "lucide-react";

interface VendorPublishChecklistProps {
  publicationStatus: string;
  onPublishedSuccess?: () => void;
  onNavigateTab?: (tab: string) => void;
}

export function VendorPublishChecklist({
  publicationStatus,
  onPublishedSuccess,
  onNavigateTab,
}: VendorPublishChecklistProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishError, setPublishError] = useState<string | null>(null);
  const [publishSuccessMsg, setPublishSuccessMsg] = useState<string | null>(null);

  // Mandatory items state
  const [hasDescription, setHasDescription] = useState(false);
  const [galleryCount, setGalleryCount] = useState(0);
  const [packagesCount, setPackagesCount] = useState(0);
  const [hasLocation, setHasLocation] = useState(false);
  const [hasPhone, setHasPhone] = useState(false);

  const getHeaders = () => {
    const headers: Record<string, string> = { "Content-Type": "application/json" };
    if (typeof window !== "undefined") {
      try {
        const cookieStr = document.cookie;
        const match = cookieStr.match(/(?:^|;\s*)user_data=([^;]*)/);
        if (match) {
          const parsed = JSON.parse(decodeURIComponent(match[1]));
          if (parsed?.id) headers["x-user-id"] = parsed.id;
          if (parsed?.email) headers["x-user-email"] = parsed.email;
        }
        const tokenMatch = cookieStr.match(/(?:^|;\s*)auth_token=([^;]*)/);
        if (tokenMatch && tokenMatch[1]) headers["x-auth-token"] = tokenMatch[1];
      } catch (_) {}
    }
    return headers;
  };

  const fetchProfileRequirements = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/v1/vendor/profile", { headers: getHeaders() });
      if (res.ok) {
        const json = await res.json();
        const data = json.data || {};
        const v = data.vendor || {};
        const prof = data.profile || v.vendor_profiles?.[0] || {};
        const contacts = data.contacts || v.vendor_contacts || [];
        const contact = Array.isArray(contacts) && contacts.length > 0 ? contacts[0] : {};
        const gallery = data.gallery || v.vendor_gallery || [];
        const services = data.services || v.vendor_services || [];
        const packages = data.packages || v.vendor_service_packages || [];

        setHasDescription(Boolean(prof.about && prof.about.trim().length >= 10));
        setGalleryCount(Array.isArray(gallery) ? gallery.length : 0);
        setPackagesCount((Array.isArray(services) ? services.length : 0) + (Array.isArray(packages) ? packages.length : 0));
        setHasLocation(Boolean(prof.city || prof.address || contact.city || contact.address));
        setHasPhone(Boolean(contact.phone || contact.whatsapp || prof.phone));
      }
    } catch (err) {
      console.error("[VendorPublishChecklist] Error checking profile status:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileRequirements();
  }, []);

  const isPublished = publicationStatus === "published";

  // Calculate missing mandatory items
  const missingItems: string[] = [];
  if (!hasDescription) missingItems.push("Business description (min 10 chars)");
  if (galleryCount < 5) missingItems.push(`At least 5 portfolio photos (currently ${galleryCount})`);
  if (packagesCount < 1) missingItems.push("At least 1 package or service");
  if (!hasLocation) missingItems.push("Business location (city/address)");
  if (!hasPhone) missingItems.push("Contact number");

  const completedCount = 5 - missingItems.length;
  const completionPercentage = Math.round((completedCount / 5) * 100);
  const isReadyToPublish = missingItems.length === 0;

  const handlePublish = async () => {
    if (!isReadyToPublish || isPublishing) return;
    setIsPublishing(true);
    setPublishError(null);
    setPublishSuccessMsg(null);

    try {
      const res = await fetch("/api/v1/vendor/profile/publish", {
        method: "POST",
        headers: getHeaders(),
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setPublishSuccessMsg("🎉 Congratulations! Your vendor page is now live and published.");
        if (onPublishedSuccess) onPublishedSuccess();
      } else {
        const msg = json.error?.message || json.message || "Failed to publish vendor page.";
        const missing = json.error?.missingItems;
        if (Array.isArray(missing) && missing.length > 0) {
          setPublishError(`Cannot publish: ${missing.join(", ")}`);
        } else {
          setPublishError(msg);
        }
      }
    } catch (err: any) {
      setPublishError(err.message || "Network error publishing profile.");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isPublished) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5 text-emerald-900 font-medium">
          <span className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm">
            <CheckCircle2 className="w-5 h-5" />
          </span>
          <div>
            <span className="font-bold text-sm text-emerald-950 block">Your Vendor Page is Published & Live</span>
            <span className="text-emerald-700">Customers can view your storefront, search for your business, and send direct enquiries.</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent border-2 border-amber-400/40 rounded-3xl p-5 sm:p-6 space-y-5 shadow-xs">
      
      {/* Draft Mode Banner Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-amber-200/60 pb-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md">
            <Rocket className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-amber-100 text-amber-900 text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded-md border border-amber-300">
                Draft Mode
              </span>
              <span className="text-xs font-bold text-amber-900">
                {completionPercentage}% Mandatory Profile Completion
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-charcoal font-display mt-1">
              🚀 Complete your business profile to publish your vendor page
            </h3>
            <p className="text-xs text-charcoal/70 mt-0.5">
              Your profile is currently in <span className="font-bold text-amber-900">Draft mode</span> and is not visible to public customers.
            </p>
          </div>
        </div>
      </div>

      {/* Progress Checklist Grid */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold text-charcoal uppercase tracking-wider">
          Mandatory Publishing Checklist ({completedCount}/5 Complete)
        </h4>

        {isLoading ? (
          <div className="flex items-center gap-2 text-xs text-charcoal/60 py-4">
            <Loader2 className="w-4 h-4 animate-spin text-[#0F4C45]" /> Checking requirements...
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            
            {/* 1. Business Description */}
            <div
              onClick={() => onNavigateTab && onNavigateTab("profile")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                hasDescription
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-white border-amber-200/80 text-charcoal hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <FileText className={`w-4 h-4 shrink-0 ${hasDescription ? "text-emerald-600" : "text-amber-600"}`} />
                <span className="text-xs font-bold truncate">Business Description</span>
              </div>
              {hasDescription ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Required</span>
              )}
            </div>

            {/* 2. Portfolio Photos (Min 5) */}
            <div
              onClick={() => onNavigateTab && onNavigateTab("media")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                galleryCount >= 5
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-white border-amber-200/80 text-charcoal hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Camera className={`w-4 h-4 shrink-0 ${galleryCount >= 5 ? "text-emerald-600" : "text-amber-600"}`} />
                <span className="text-xs font-bold truncate">Portfolio Photos</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                galleryCount >= 5 ? "text-emerald-800 bg-emerald-100" : "text-amber-800 bg-amber-100"
              }`}>
                {galleryCount}/5 Photos
              </span>
            </div>

            {/* 3. Packages & Services (Min 1) */}
            <div
              onClick={() => onNavigateTab && onNavigateTab("pricing")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                packagesCount >= 1
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-white border-amber-200/80 text-charcoal hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Package className={`w-4 h-4 shrink-0 ${packagesCount >= 1 ? "text-emerald-600" : "text-amber-600"}`} />
                <span className="text-xs font-bold truncate">Packages & Pricing</span>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                packagesCount >= 1 ? "text-emerald-800 bg-emerald-100" : "text-amber-800 bg-amber-100"
              }`}>
                {packagesCount} Added
              </span>
            </div>

            {/* 4. Business Location */}
            <div
              onClick={() => onNavigateTab && onNavigateTab("profile")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                hasLocation
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-white border-amber-200/80 text-charcoal hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <MapPin className={`w-4 h-4 shrink-0 ${hasLocation ? "text-emerald-600" : "text-amber-600"}`} />
                <span className="text-xs font-bold truncate">City & Address</span>
              </div>
              {hasLocation ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Required</span>
              )}
            </div>

            {/* 5. Contact Number */}
            <div
              onClick={() => onNavigateTab && onNavigateTab("profile")}
              className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                hasPhone
                  ? "bg-emerald-50/80 border-emerald-200 text-emerald-900"
                  : "bg-white border-amber-200/80 text-charcoal hover:border-amber-300"
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <Phone className={`w-4 h-4 shrink-0 ${hasPhone ? "text-emerald-600" : "text-amber-600"}`} />
                <span className="text-xs font-bold truncate">Contact Phone</span>
              </div>
              {hasPhone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full shrink-0">Required</span>
              )}
            </div>

          </div>
        )}
      </div>

      {/* Publish Error / Success Messages */}
      {publishError && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-xl text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{publishError}</span>
        </div>
      )}

      {publishSuccessMsg && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-950 p-3.5 rounded-xl text-xs font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{publishSuccessMsg}</span>
        </div>
      )}

      {/* Publish CTA Bar */}
      <div className="pt-2 border-t border-amber-200/60 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs text-charcoal/70">
          {!isReadyToPublish ? (
            <span className="text-rose-700 font-medium flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" /> Missing {missingItems.length} mandatory requirement{missingItems.length > 1 ? "s" : ""} to go live.
            </span>
          ) : (
            <span className="text-emerald-700 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> All mandatory requirements complete! Ready to publish.
            </span>
          )}
        </div>

        <button
          onClick={handlePublish}
          disabled={!isReadyToPublish || isPublishing}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs shadow-md flex items-center justify-center gap-2 transition-all ${
            isReadyToPublish && !isPublishing
              ? "bg-[#0F4C45] hover:bg-[#145C54] text-white cursor-pointer"
              : "bg-gray-200 text-gray-400 border border-gray-300 cursor-not-allowed shadow-none"
          }`}
        >
          {isPublishing ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Publishing...</span>
            </>
          ) : isReadyToPublish ? (
            <>
              <Rocket className="w-4 h-4 text-amber-300" />
              <span>Publish Vendor Page Now →</span>
            </>
          ) : (
            <>
              <span>Publish Disabled ({missingItems.length} Missing)</span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
