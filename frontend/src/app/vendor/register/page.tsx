"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload } from "lucide-react";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

const VENDOR_CATEGORIES = [
  "Bridal Boutique", "Groom Wear", "Wedding Venue", "Photographer", "Videographer",
  "Makeup Artist", "Mehendi Artist", "Wedding Planner", "Decorator", "Caterer",
  "Jewellery Store", "Invitation Designer", "Cake Designer", "Entertainment",
  "Choreographer", "Car Rental", "Flower Decoration", "Rental Services",
  "Gift Store", "Honeymoon Planner", "Other"
];

export default function VendorRegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const submitSignup = async (formData: FormData) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      const text = await res.text();
      const data = text ? JSON.parse(text) : {};

      if (!res.ok || !data.success) {
        return { error: data.message || "Signup failed" };
      }

      return { success: true };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { error: "Upload timed out. Please try again with smaller images." };
      }

      return { error: "Could not submit the application. Please try again." };
    } finally {
      window.clearTimeout(timeout);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "logo" | "cover") => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      if (type === "logo") setLogoPreview(url);
      else setCoverPreview(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    
    const formData = new FormData(e.currentTarget);
    formData.append("account_type", "partner"); 
    
    // Validate passwords match
    const password = formData.get("password") as string;
    const confirm = formData.get("confirm_password") as string;
    
    if (!password || !confirm) {
      setErrorMsg("Password fields are required");
      setIsSubmitting(false);
      return;
    }
    
    if (password !== confirm) {
      setErrorMsg("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

<<<<<<< HEAD
    const res = await submitSignup(formData);
=======
    // Debug log
    console.log("[Vendor Register] Submitting form with data:", {
      boutique_name: formData.get("boutique_name"),
      owner_name: formData.get("owner_name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      category: formData.get("category"),
      hasLogo: !!formData.get("logo"),
      hasCover: !!formData.get("cover"),
    });

    const res = await signup(formData);
>>>>>>> cce9905 (nav logo new)
    
    setIsSubmitting(false);
    
    console.log("[Vendor Register] Response:", res);
    
    if (res.error) {
      setErrorMsg(res.error);
    } else if (res.success) {
      // Show success message with email info if available
      alert(`✅ Application submitted successfully!\n\nA verification email has been sent to your email address. Please check your inbox and verify your account to complete registration.`);
      router.push("/vendor/login?status=registered"); 
    } else {
      setErrorMsg("Application submission failed. Please try again.");
    }
  };

  return (
    <div className="flex-grow flex flex-col px-6 py-12 max-w-5xl mx-auto w-full min-h-[calc(100vh-140px)] bg-ivory">
      <div className="text-center mb-12">
        <h2 className="font-display text-[32px] leading-[40px] text-charcoal mb-2">Partner with Cloche</h2>
        <p className="font-sans text-[16px] text-charcoal/70 max-w-md mx-auto">
          Join the exclusive network of premium wedding vendors and grow your business.
        </p>
      </div>

      <form className="bg-white rounded-3xl shadow-sm border border-gold/10 p-8 md:p-12" onSubmit={handleSubmit}>
        
        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 text-sm rounded-xl mb-8 font-medium text-center">
            {errorMsg}
          </div>
        )}

        {/* SECTION: BASIC DETAILS */}
        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Business Name *</label>
            <input name="boutique_name" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="E.g. Milan Designs" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Owner Name *</label>
            <input name="owner_name" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="Full Name" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Vendor Category *</label>
            <select name="category" required className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors text-charcoal appearance-none">
              <option value="">Select Category</option>
              {VENDOR_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">GST Number</label>
            <input name="gst_number" type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="Optional" />
          </div>
        </div>

        {/* SECTION: CONTACT & LOCATION */}
        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Contact & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Email Address *</label>
            <input name="email" required type="email" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="business@example.com" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Mobile Number *</label>
            <input name="phone" required type="tel" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="+91 98765 43210" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Business Address *</label>
            <input name="address" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="Street, Building, etc." />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">City *</label>
            <input name="city" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="E.g. Mumbai" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">District *</label>
            <input name="district" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="E.g. Mumbai Suburban" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">State *</label>
            <input name="state" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="E.g. Maharashtra" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Pincode *</label>
            <input name="pincode" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="E.g. 400050" />
          </div>
        </div>

        {/* SECTION: SOCIAL & ONLINE */}
        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Online Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Website</label>
            <input name="website" type="url" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="https://" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Instagram Handle *</label>
            <input name="instagram" required type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="@username" />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Facebook</label>
            <input name="facebook" type="text" className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="Username or Link" />
          </div>
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Business Description *</label>
            <textarea name="description" required rows={3} className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors resize-none" placeholder="Tell couples about your services..."></textarea>
          </div>
        </div>

        {/* SECTION: MEDIA & PASSWORD */}
        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Media & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          {/* Logo Upload */}
          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block mb-2">Profile Logo *</label>
            <div className="border-2 border-dashed border-outline/30 rounded-2xl p-6 flex flex-col items-center justify-center relative hover:bg-surface-dim transition-colors cursor-pointer group">
              <input type="file" name="logo" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => handleFileChange(e, "logo")} />
              {logoPreview ? (
                <img src={logoPreview} alt="Logo Preview" className="w-24 h-24 object-contain mb-2" />
              ) : (
                <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mb-3 text-emerald group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
              )}
              <span className="text-sm text-charcoal font-medium">{logoPreview ? "Change Logo" : "Upload Logo"}</span>
              <span className="text-xs text-charcoal/50 mt-1">1:1 ratio recommended</span>
            </div>
          </div>

          {/* Cover Upload */}
          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block mb-2">Cover Image *</label>
            <div className="border-2 border-dashed border-outline/30 rounded-2xl p-6 flex flex-col items-center justify-center relative hover:bg-surface-dim transition-colors cursor-pointer group">
              <input type="file" name="cover" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => handleFileChange(e, "cover")} />
              {coverPreview ? (
                <img src={coverPreview} alt="Cover Preview" className="w-full h-24 object-cover rounded-lg mb-2" />
              ) : (
                <div className="w-16 h-16 bg-emerald/10 rounded-full flex items-center justify-center mb-3 text-emerald group-hover:scale-110 transition-transform">
                  <Upload className="w-6 h-6" />
                </div>
              )}
              <span className="text-sm text-charcoal font-medium">{coverPreview ? "Change Cover" : "Upload Cover Image"}</span>
              <span className="text-xs text-charcoal/50 mt-1">16:9 ratio recommended</span>
            </div>
          </div>

          {/* Passwords */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <input name="password" required type={showPassword ? "text" : "password"} className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-charcoal/40 hover:text-charcoal transition-colors">
                <span className="material-symbols-outlined text-[20px]">{showPassword ? 'visibility_off' : 'visibility'}</span>
              </button>
            </div>
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Confirm Password *</label>
            <input name="confirm_password" required type={showPassword ? "text" : "password"} className="w-full bg-surface-dim border border-outline/20 rounded-xl px-4 py-3 focus:outline-none focus:border-emerald transition-colors" placeholder="••••••••" />
          </div>
        </div>

        {/* Terms & Submit */}
        <div className="pt-6 border-t border-gold/10">
          <div className="flex items-start gap-3 mb-6">
            <input id="terms" type="checkbox" required className="mt-1 w-4 h-4 text-emerald rounded border-outline/30 focus:ring-emerald cursor-pointer" />
            <label className="text-sm text-charcoal/80" htmlFor="terms">
              I certify that I am an authorized representative of this business and agree to the <Link href="/terms" className="text-emerald font-semibold hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-emerald font-semibold hover:underline">Privacy Policy</Link>.
            </label>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-charcoal text-white py-4 rounded-xl font-semibold tracking-wide uppercase hover:bg-charcoal/90 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <span className="material-symbols-outlined animate-spin">refresh</span>
            ) : (
              "Submit Application"
            )}
          </button>
          
          <p className="text-center text-sm text-charcoal/60 mt-6">
            Already a partner? <Link href="/vendor/login" className="text-emerald font-bold hover:underline">Login here</Link>
          </p>
        </div>
      </form>
    </div>
  );
}
