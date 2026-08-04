"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckCircle2, Circle, ArrowRight, Building2, Sparkles, Image, Package, CheckSquare } from "lucide-react";

export default function VendorOnboardingWizard() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(true);
  const [vendorData, setVendorData] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  // Form states
  const [businessName, setBusinessName] = useState("");
  const [city, setCity] = useState("Kochi");
  const [description, setDescription] = useState("");
  const [startingPrice, setStartingPrice] = useState("₹50,000");

  useEffect(() => {
    async function loadStatus() {
      try {
        const res = await fetch("/api/v1/vendor/onboarding/status");
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setVendorData(json.data);
            if (json.data.profile) {
              setBusinessName(json.data.profile.business_name || "");
              setCity(json.data.profile.city || "Kochi");
              setDescription(json.data.profile.description || "");
              setStartingPrice(json.data.profile.starting_price || "₹50,000");
            }
          }
        }
      } catch (err) {
        // Fallback
      } finally {
        setLoading(false);
      }
    }
    loadStatus();
  }, []);

  const handleNextStep = async () => {
    setSaving(true);
    let nextStage = "business_details_added";
    let pct = 40;

    if (currentStep === 2) {
      nextStage = "services_added";
      pct = 60;
    } else if (currentStep === 3) {
      nextStage = "portfolio_added";
      pct = 80;
    } else if (currentStep === 4) {
      nextStage = "submitted_for_review";
      pct = 100;
    }

    try {
      await fetch("/api/v1/vendor/onboarding/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          stage: nextStage,
          completionPercentage: pct,
          profileUpdates: {
            business_name: businessName,
            city,
            description,
            starting_price: startingPrice,
          },
        }),
      });
    } catch (e) {
      // ignore
    } finally {
      setSaving(false);
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
      } else {
        alert("Congratulations! Your onboarding profile has been submitted for admin review.");
        router.push("/vendor/profile");
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-4 border-emerald border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-charcoal/70">Loading onboarding status...</p>
        </div>
      </div>
    );
  }

  const steps = [
    { id: 1, name: "Business Details", icon: Building2 },
    { id: 2, name: "Services & Pricing", icon: Package },
    { id: 3, name: "Portfolio & Media", icon: Image },
    { id: 4, name: "Submit for Review", icon: CheckSquare },
  ];

  return (
    <div className="min-h-screen bg-ivory text-charcoal py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="bg-white rounded-3xl p-8 border border-gold/10 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gold mb-1">
              <Sparkles className="w-4 h-4" /> Vendor Onboarding Wizard
            </div>
            <h1 className="font-display text-2xl md:text-3xl text-charcoal">Complete Your Business Profile</h1>
            <p className="text-sm text-charcoal/60 mt-1">
              Code: <span className="font-mono font-bold text-emerald">{vendorData?.vendorCode || "VND-2026-9841"}</span> | Category: <span className="font-semibold">{vendorData?.category || "Vendor"}</span>
            </p>
          </div>

          <div className="w-full md:w-48 bg-ivory p-4 rounded-2xl border border-gold/10 text-center">
            <span className="text-xs font-semibold text-charcoal/60 uppercase block mb-1">Completion</span>
            <div className="w-full bg-gold/20 h-2 rounded-full overflow-hidden mb-1">
              <div
                className="bg-emerald h-full transition-all duration-500"
                style={{ width: `${vendorData?.profileCompletionPercentage || (currentStep * 25)}%` }}
              ></div>
            </div>
            <span className="text-lg font-bold text-emerald">{vendorData?.profileCompletionPercentage || (currentStep * 25)}%</span>
          </div>
        </div>

        {/* Step Progress Tracker */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {steps.map((step) => {
            const Icon = step.icon;
            const isDone = currentStep > step.id;
            const isCurrent = currentStep === step.id;
            return (
              <div
                key={step.id}
                onClick={() => isDone && setCurrentStep(step.id)}
                className={`p-4 rounded-2xl border transition-all ${
                  isCurrent
                    ? "bg-emerald text-white border-emerald shadow-md"
                    : isDone
                    ? "bg-white text-charcoal border-emerald/30 cursor-pointer hover:border-emerald"
                    : "bg-white/60 text-charcoal/40 border-gold/10"
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <Icon className={`w-5 h-5 ${isCurrent ? "text-white" : isDone ? "text-emerald" : "text-charcoal/40"}`} />
                  {isDone ? <CheckCircle2 className="w-4 h-4 text-emerald" /> : <Circle className="w-4 h-4 text-charcoal/20" />}
                </div>
                <span className="text-xs font-semibold block uppercase tracking-wider">Step 0{step.id}</span>
                <span className="text-sm font-medium block truncate">{step.name}</span>
              </div>
            );
          })}
        </div>

        {/* Form Wizard Body */}
        <div className="bg-white rounded-3xl p-8 md:p-10 border border-gold/10 shadow-sm space-y-6">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-display text-xl border-b border-gold/10 pb-3">Step 1: Primary Business Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                    className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald"
                    placeholder="E.g. Royal Crown Photography"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Primary Operating City</label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald"
                    placeholder="E.g. Kochi, Ernakulam"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">About / Business Description</label>
                  <textarea
                    rows={4}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald resize-none"
                    placeholder="Describe your services, style, experience, and what makes your boutique special..."
                  ></textarea>
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-display text-xl border-b border-gold/10 pb-3">Step 2: Services & Starting Pricing</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Starting Price Package</label>
                  <input
                    type="text"
                    value={startingPrice}
                    onChange={(e) => setStartingPrice(e.target.value)}
                    className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald"
                    placeholder="E.g. ₹50,000"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-charcoal/70 uppercase block mb-1">Service Type</label>
                  <select className="w-full bg-ivory border border-gold/20 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-emerald">
                    <option>On-Location & Studio</option>
                    <option>Studio Exclusive</option>
                    <option>Destination Wedding Service</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in fade-in">
              <h2 className="font-display text-xl border-b border-gold/10 pb-3">Step 3: Portfolio & Gallery Setup</h2>
              <p className="text-sm text-charcoal/70">
                Upload your high-resolution portfolio images to show your best work to couples. You can add up to 20 gallery images in your profile settings anytime.
              </p>
              <div className="border-2 border-dashed border-gold/30 bg-ivory p-8 rounded-2xl text-center space-y-3">
                <Image className="w-10 h-10 text-emerald mx-auto" />
                <p className="text-sm font-semibold">Drag & drop portfolio images or click to browse</p>
                <p className="text-xs text-charcoal/50">PNG, JPG or WEBP up to 10MB each</p>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in fade-in text-center py-6">
              <CheckCircle2 className="w-16 h-16 text-emerald mx-auto" />
              <h2 className="font-display text-2xl text-charcoal">Ready to Submit Profile</h2>
              <p className="text-sm text-charcoal/70 max-w-md mx-auto">
                Your onboarding checklist is complete! Click submit to send your business profile for administrative review and publish live on Cloche.
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-6 border-t border-gold/10">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-6 py-3 rounded-xl border border-gold/20 text-sm font-semibold hover:bg-ivory transition-colors"
              >
                Back
              </button>
            ) : (
              <div></div>
            )}

            <button
              type="button"
              onClick={handleNextStep}
              disabled={saving}
              className="bg-emerald text-white px-8 py-3 rounded-xl font-semibold text-sm hover:bg-emerald/90 transition-colors flex items-center gap-2 disabled:opacity-50"
            >
              {saving ? (
                "Saving..."
              ) : currentStep === 4 ? (
                "Submit for Admin Review"
              ) : (
                <>
                  Continue <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
