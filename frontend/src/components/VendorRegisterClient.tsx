"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Upload } from "lucide-react";

type FieldName =
  | "boutique_name"
  | "owner_name"
  | "category"
  | "gst_number"
  | "email"
  | "phone"
  | "address"
  | "city"
  | "district"
  | "state"
  | "pincode"
  | "website"
  | "instagram"
  | "facebook"
  | "description"
  | "logo"
  | "cover"
  | "password"
  | "confirm_password"
  | "terms";

type FieldErrors = Partial<Record<FieldName, string>>;

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith("/api") ? rawBaseUrl : `${rawBaseUrl}/api`;

const VENDOR_CATEGORIES = [
  "Bridal Boutique", "Groom Wear", "Wedding Venue", "Photographer", "Videographer",
  "Makeup Artist", "Mehendi Artist", "Wedding Planner", "Decorator", "Caterer",
  "Jewellery Store", "Invitation Designer", "Cake Designer", "Entertainment",
  "Choreographer", "Car Rental", "Flower Decoration", "Rental Services",
  "Gift Store", "Honeymoon Planner", "Other"
];

const fieldNames: FieldName[] = [
  "boutique_name", "owner_name", "category", "gst_number", "email", "phone",
  "address", "city", "district", "state", "pincode", "website", "instagram",
  "facebook", "description", "logo", "cover", "password", "confirm_password",
  "terms"
];

const textInputClass = "w-full bg-surface-dim border rounded-xl px-4 py-3 focus:outline-none transition-colors";
const normalBorderClass = "border-outline/20 focus:border-emerald";
const errorBorderClass = "border-red-400 focus:border-red-500 bg-red-50/40";

const textValue = (formData: FormData, name: string) => String(formData.get(name) || "").trim();
const digitsOnly = (value: string) => value.replace(/\D/g, "");

const isValidUrl = (value: string) => {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

const addRequiredTextError = (errors: FieldErrors, formData: FormData, name: FieldName, label: string) => {
  if (!textValue(formData, name)) {
    errors[name] = `${label} is required. Type ${label.toLowerCase()} here.`;
  }
};

const mapServerErrorToField = (message: string): { fieldErrors: FieldErrors; generalError: string } => {
  const lower = message.toLowerCase();
  const fieldErrors: FieldErrors = {};

  if (lower.includes("mobile") || lower.includes("phone") || lower.includes("character varying(10)")) {
    fieldErrors.phone = "Enter only the 10-digit mobile number, without +91. Example: 8606924541.";
  } else if (lower.includes("email")) {
    fieldErrors.email = message;
  } else if (lower.includes("boutique_name") || lower.includes("boutique with this name")) {
    fieldErrors.boutique_name = message;
  } else if (lower.includes("category")) {
    fieldErrors.category = "Select the correct vendor category.";
  } else if (lower.includes("image") || lower.includes("logo")) {
    fieldErrors.logo = "Upload a profile logo image.";
    fieldErrors.cover = "Upload a cover image.";
  }

  return {
    fieldErrors,
    generalError: Object.keys(fieldErrors).length ? "Please fix the highlighted fields below." : message,
  };
};

const validateVendorForm = (formData: FormData) => {
  const errors: FieldErrors = {};
  const limits: Partial<Record<FieldName, number>> = {
    boutique_name: 100,
    owner_name: 100,
    email: 255,
    address: 255,
    city: 100,
    district: 100,
    state: 100,
    website: 255,
    instagram: 30,
    facebook: 255,
    description: 1000,
    gst_number: 15,
  };

  addRequiredTextError(errors, formData, "boutique_name", "Business name");
  addRequiredTextError(errors, formData, "owner_name", "Owner name");
  addRequiredTextError(errors, formData, "category", "Vendor category");
  addRequiredTextError(errors, formData, "email", "Email address");
  addRequiredTextError(errors, formData, "phone", "Mobile number");
  addRequiredTextError(errors, formData, "address", "Business address");
  addRequiredTextError(errors, formData, "city", "City");
  addRequiredTextError(errors, formData, "district", "District");
  addRequiredTextError(errors, formData, "state", "State");
  addRequiredTextError(errors, formData, "pincode", "Pincode");
  addRequiredTextError(errors, formData, "instagram", "Instagram handle");
  addRequiredTextError(errors, formData, "description", "Business description");

  fieldNames.forEach((name) => {
    const limit = limits[name];
    const value = textValue(formData, name);
    if (limit && value.length > limit) {
      errors[name] = `Too long. Type ${limit} characters or fewer here.`;
    }
  });

  const email = textValue(formData, "email");
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = "Type a valid email address, for example business@example.com.";
  }

  const phone = textValue(formData, "phone");
  const phoneDigits = digitsOnly(phone);
  if (phone && (phoneDigits.length !== 10 || phone.startsWith("+91") || phoneDigits.startsWith("91"))) {
    errors.phone = "Enter only the 10-digit mobile number, without +91. Example: 8606924541.";
  }

  const pincode = textValue(formData, "pincode");
  if (pincode && !/^\d{6}$/.test(pincode)) {
    errors.pincode = "Type a 6-digit pincode, for example 679341.";
  }

  const website = textValue(formData, "website");
  if (website && !isValidUrl(website)) {
    errors.website = "Type a full website URL, for example https://cloche.com, or leave this box empty.";
  }

  const instagram = textValue(formData, "instagram").replace(/^@/, "");
  if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) {
    errors.instagram = "Type only the Instagram username, for example cloche.in_.";
  }

  const gstNumber = textValue(formData, "gst_number");
  if (gstNumber && !/^[0-9A-Za-z]{15}$/.test(gstNumber)) {
    errors.gst_number = "Type a 15-character GST number, or leave this box empty.";
  }

  const description = textValue(formData, "description");
  if (description && description.length < 20) {
    errors.description = "Type at least 20 characters describing your business.";
  }

  const logo = formData.get("logo");
  const cover = formData.get("cover");
  if (!(logo instanceof File) || logo.size === 0) {
    errors.logo = "Upload a profile logo image here.";
  }
  if (!(cover instanceof File) || cover.size === 0) {
    errors.cover = "Upload a cover image here.";
  }

  ["logo", "cover"].forEach((name) => {
    const fieldName = name as FieldName;
    const file = formData.get(fieldName);
    if (file instanceof File && file.size > 10 * 1024 * 1024) {
      errors[fieldName] = "Upload an image smaller than 10 MB.";
    }
  });

  const password = textValue(formData, "password");
  const confirm = textValue(formData, "confirm_password");
  if (!password) {
    errors.password = "Type a password here.";
  } else if (password.length < 8) {
    errors.password = "Type at least 8 characters for the password.";
  }
  if (!confirm) {
    errors.confirm_password = "Retype the same password here.";
  } else if (password && password !== confirm) {
    errors.confirm_password = "Passwords do not match. Type the same password in both boxes.";
  }

  if (formData.get("terms") !== "on") {
    errors.terms = "Tick this box to accept the Terms of Service and Privacy Policy.";
  }

  if (!errors.phone && phoneDigits) {
    formData.set("phone", phoneDigits);
  }
  if (!errors.instagram && instagram) {
    formData.set("instagram", instagram);
  }

  return errors;
};

export function VendorRegisterClient() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  const getInputClass = (name: FieldName, extra = "") =>
    `${textInputClass} ${fieldErrors[name] ? errorBorderClass : normalBorderClass} ${extra}`.trim();

  const getUploadClass = (name: FieldName) =>
    `border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center relative hover:bg-surface-dim transition-colors cursor-pointer group ${
      fieldErrors[name] ? "border-red-400 bg-red-50/40" : "border-outline/30"
    }`;

  const fieldError = (name: FieldName) => fieldErrors[name] ? (
    <p className="text-xs text-red-600 font-medium mt-1" id={`${name}-error`}>
      {fieldErrors[name]}
    </p>
  ) : null;

  const fieldErrorProps = (name: FieldName) => ({
    "aria-invalid": Boolean(fieldErrors[name]),
    "aria-describedby": fieldErrors[name] ? `${name}-error` : undefined,
  });

  const clearFieldError = (name: string) => {
    if (!fieldNames.includes(name as FieldName)) return;
    setFieldErrors((prev) => {
      if (!prev[name as FieldName]) return prev;
      const next = { ...prev };
      delete next[name as FieldName];
      return next;
    });
  };

  const submitSignup = async (formData: FormData) => {
    const controller = new AbortController();
    const timeout = window.setTimeout(() => controller.abort(), 60000);

    try {
      // 1. Primary Phase 4 Vendor Register API endpoint
      const v1Res = await fetch("/api/v1/vendor/register", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      }).catch(() => null);

      if (v1Res) {
        const v1Data = await v1Res.json().catch(() => null);
        if (v1Data) {
          if (v1Res.ok && v1Data.success) {
            return { success: true, ...v1Data };
          }
          if (v1Data.error?.message || v1Data.message) {
            return { error: v1Data.error?.message || v1Data.message };
          }
        }
      }

      // 2. Fallback to Render API
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

      return { success: true, ...data };
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
      clearFieldError(type);
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        if (type === "logo") setLogoPreview(result);
        else setCoverPreview(result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLFormElement>) => {
    const target = e.target as EventTarget & { name?: string };
    clearFieldError(target.name || "");
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    setFieldErrors({});

    const formData = new FormData(e.currentTarget);
    formData.append("account_type", "partner");

    const validationErrors = validateVendorForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setFieldErrors(validationErrors);
      setErrorMsg("Please fix the highlighted fields below.");
      setIsSubmitting(false);
      const firstError = Object.keys(validationErrors)[0];
      e.currentTarget.querySelector<HTMLElement>(`[name="${firstError}"], #${firstError}`)?.focus();
      return;
    }

    const res = await submitSignup(formData);

    setIsSubmitting(false);

    if (res.error) {
      const mappedError = mapServerErrorToField(res.error);
      setFieldErrors(mappedError.fieldErrors);
      setErrorMsg(mappedError.generalError);
    } else if (res.success) {
      const category = textValue(formData, "category");
      const boutiqueName = textValue(formData, "boutique_name");
      const city = textValue(formData, "city") || "Kochi";
      const district = textValue(formData, "district") || "Ernakulam";
      const phone = textValue(formData, "phone") || "+919876543210";
      const whatsapp = textValue(formData, "whatsapp") || phone;
      const isVenueCategory = category.toLowerCase().includes("venue");

      if (boutiqueName) {
        const slug = boutiqueName.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
        const startingPrice = textValue(formData, "starting_price") || (isVenueCategory ? "₹5,00,000" : "₹50,000");
        const capacity = textValue(formData, "capacity") || "300 – 1200 Guests";
        const spaceType = textValue(formData, "space_type") || "Outdoor & Indoor";

        const validLogo = logoPreview && (logoPreview.startsWith("data:") || logoPreview.startsWith("http") || logoPreview.startsWith("/"))
          ? logoPreview
          : "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=200&auto=format&fit=crop";

        const validCover = coverPreview && (coverPreview.startsWith("data:") || coverPreview.startsWith("http") || coverPreview.startsWith("/"))
          ? coverPreview
          : "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80";

        const newVendorRecord = {
          id: slug,
          slug: slug,
          boutique_name: boutiqueName,
          name: boutiqueName,
          category: category,
          location: `${city}, ${district}`,
          city: city,
          district: district,
          contactNumber: phone,
          phone: phone,
          whatsapp: whatsapp,
          logo: validLogo,
          logo_url: validLogo,
          profile_logo: validLogo,
          image_url: validLogo,
          image: validLogo,
          coverImage: validCover,
          description: textValue(formData, "description"),
          startingPrice: startingPrice,
          capacity: capacity,
          spaceType: spaceType,
          rating: 5.0,
          reviewsCount: 1,
          tags: [category, "Verified Vendor"],
          verified: true,
        };

        if (isVenueCategory || category === "Wedding Venue") {
          const newCmsPayload = {
            id: slug,
            vendorId: slug,
            category: "Wedding Venue" as const,
            lastUpdated: new Date().toISOString(),
            status: "Published" as const,
            businessProfile: {
              businessName: boutiqueName,
              tagline: "Premier Wedding & Event Destination",
              description: textValue(formData, "description") || `Welcome to ${boutiqueName}, a premier wedding destination located in ${city}, ${district}.`,
              city: city,
              district: district,
              address: `${city}, ${district}`,
              contactNumber: phone,
              whatsapp: whatsapp,
              email: textValue(formData, "email") || "events@venue.com",
              website: textValue(formData, "website") || "",
              instagram: textValue(formData, "instagram") || "",
              isVerified: true,
            },
            heroGallery: {
              coverImage: validCover,
              images: [
                { id: "h1", url: validCover, caption: "Grand Entrance" },
                { id: "h2", url: validLogo, caption: "Banquet Hall" },
              ],
            },
            venueInfo: {
              startingPrice: startingPrice,
              minGuests: 200,
              maxGuests: 1200,
              venueType: "Indoor + Outdoor" as const,
              roomsCount: 20,
              parkingCapacity: "300+ Cars",
              bridalSuiteAvailable: true,
              powerBackupAvailable: true,
              inhouseDecoration: "Allowed" as const,
              musicPolicy: "DJ Allowed till 10 PM" as const,
              foodPolicy: "Both Allowed" as const,
              alcoholPolicy: "Allowed with Permit" as const,
            },
            amenities: {
              parking: true,
              valet: true,
              wifi: true,
              generator: true,
              kidsArea: true,
              garden: true,
              swimmingPool: false,
              stage: true,
              decoration: true,
              wheelchairAccess: true,
            },
            packages: [
              { id: "pkg-1", name: "Royal Wedding Package", price: startingPrice, description: "Full venue rental with banquet setup", isPopular: true },
            ],
            availability: { blockedDates: [] },
            gallery: { photos: [validCover], videos: [], panoramas360: [] },
            reviewsList: [{ id: "rev-1", author: "Verified Couple", rating: 5, text: "Magnificent venue and great service!", date: "Recent" }],
            faqs: [],
            seo: { metaTitle: boutiqueName, metaDescription: `Book ${boutiqueName} in ${city}`, keywords: "venue, wedding", ogImage: validCover },
          };
          localStorage.setItem(`cloche_venue_cms_${slug}`, JSON.stringify(newCmsPayload));
        }

        try {
          const rawVendors = localStorage.getItem("cloche_registered_vendors");
          const vendorList = rawVendors ? JSON.parse(rawVendors) : [];
          const updatedVendors = [newVendorRecord, ...vendorList.filter((v: any) => v.id !== slug)];
          localStorage.setItem("cloche_registered_vendors", JSON.stringify(updatedVendors));

          const rawBoutiques = localStorage.getItem("cloche_registered_boutiques");
          const boutiqueList = rawBoutiques ? JSON.parse(rawBoutiques) : [];
          const updatedBoutiques = [newVendorRecord, ...boutiqueList.filter((v: any) => v.id !== slug)];
          localStorage.setItem("cloche_registered_boutiques", JSON.stringify(updatedBoutiques));

          localStorage.setItem(`cloche_venue_${slug}`, JSON.stringify(newVendorRecord));
          localStorage.setItem(`cloche_vendor_${slug}`, JSON.stringify(newVendorRecord));
        } catch (e) {}
      }

      alert("Application submitted and account created successfully!\n\nWelcome to Cloche! Proceeding to your onboarding wizard.");
      router.push("/vendor/onboarding");
    } else {
      setErrorMsg("Application submission failed. Please try again.");
    }
  };

  return (
    <div className="flex-grow flex flex-col px-6 pt-1 pb-10 max-w-5xl mx-auto w-full min-h-[calc(100vh-140px)] bg-ivory">
      <div className="text-center mb-4 pt-0">
        <h2 className="font-display text-[30px] sm:text-[32px] leading-tight text-charcoal mb-1">Partner with Cloche</h2>
        <p className="font-sans text-[15px] text-charcoal/70 max-w-md mx-auto">
          Join the exclusive network of premium wedding vendors and grow your business.
        </p>
      </div>

      <form
        className="bg-white rounded-3xl shadow-sm border border-gold/10 p-8 md:p-12"
        onSubmit={handleSubmit}
        onChange={handleFormChange}
        noValidate
      >
        {errorMsg && (
          <div className="bg-red-50 text-red-600 border border-red-200 px-4 py-3 text-sm rounded-xl mb-8 font-medium text-center">
            {errorMsg}
          </div>
        )}

        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Business Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Business Name *</label>
            <input name="boutique_name" required maxLength={100} type="text" className={getInputClass("boutique_name")} placeholder="E.g. Milan Designs" {...fieldErrorProps("boutique_name")} />
            {fieldError("boutique_name")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Owner Name *</label>
            <input name="owner_name" required maxLength={100} type="text" className={getInputClass("owner_name")} placeholder="Full Name" {...fieldErrorProps("owner_name")} />
            {fieldError("owner_name")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Vendor Category *</label>
            <select
              name="category"
              required
              value={selectedCategory}
              onChange={(e) => {
                setSelectedCategory(e.target.value);
                clearFieldError("category");
              }}
              className={getInputClass("category", "text-charcoal appearance-none")}
              {...fieldErrorProps("category")}
            >
              <option value="">Select Category</option>
              {VENDOR_CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            {fieldError("category")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">GST Number</label>
            <input name="gst_number" type="text" maxLength={15} className={getInputClass("gst_number")} placeholder="Optional" {...fieldErrorProps("gst_number")} />
            {fieldError("gst_number")}
          </div>
        </div>

        {/* Dynamic Venue Specific Registration Fields */}
        {selectedCategory === "Wedding Venue" && (
          <>
            <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Venue Details & Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10 bg-emerald/5 p-6 rounded-2xl border border-emerald/10">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Starting Price *</label>
                <input name="starting_price" type="text" className={textInputClass + " " + normalBorderClass} placeholder="E.g. ₹5,00,000" defaultValue="₹5,00,000" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Guest Capacity *</label>
                <input name="capacity" type="text" className={textInputClass + " " + normalBorderClass} placeholder="E.g. 500 – 1200 Guests" defaultValue="300 – 1200 Guests" />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Space Type *</label>
                <select name="space_type" className={textInputClass + " " + normalBorderClass}>
                  <option value="Outdoor & Indoor">Outdoor & Indoor</option>
                  <option value="Outdoor">Outdoor Lawn</option>
                  <option value="Indoor">Indoor Banquet</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">WhatsApp Contact Number</label>
                <input name="whatsapp" type="tel" className={textInputClass + " " + normalBorderClass} placeholder="E.g. 9876543210" />
              </div>
            </div>
          </>
        )}

        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Contact & Location</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Email Address *</label>
            <input name="email" required maxLength={255} type="email" className={getInputClass("email")} placeholder="business@example.com" {...fieldErrorProps("email")} />
            {fieldError("email")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Mobile Number *</label>
            <input name="phone" required type="tel" inputMode="numeric" maxLength={14} className={getInputClass("phone")} placeholder="9876543210" {...fieldErrorProps("phone")} />
            {fieldError("phone")}
          </div>
          <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Business Address *</label>
            <input name="address" required maxLength={255} type="text" className={getInputClass("address")} placeholder="Street, Building, etc." {...fieldErrorProps("address")} />
            {fieldError("address")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">City *</label>
            <input name="city" required maxLength={100} type="text" className={getInputClass("city")} placeholder="E.g. Mumbai" {...fieldErrorProps("city")} />
            {fieldError("city")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">District *</label>
            <input name="district" required maxLength={100} type="text" className={getInputClass("district")} placeholder="E.g. Mumbai Suburban" {...fieldErrorProps("district")} />
            {fieldError("district")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">State *</label>
            <input name="state" required maxLength={100} type="text" className={getInputClass("state")} placeholder="E.g. Maharashtra" {...fieldErrorProps("state")} />
            {fieldError("state")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Pincode *</label>
            <input name="pincode" required type="text" inputMode="numeric" maxLength={6} className={getInputClass("pincode")} placeholder="E.g. 400050" {...fieldErrorProps("pincode")} />
            {fieldError("pincode")}
          </div>
        </div>

        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Online Presence</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Website</label>
            <input name="website" type="url" maxLength={255} className={getInputClass("website")} placeholder="https://cloche.com" {...fieldErrorProps("website")} />
            {fieldError("website")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Instagram Handle *</label>
            <input name="instagram" required type="text" maxLength={30} className={getInputClass("instagram")} placeholder="username" {...fieldErrorProps("instagram")} />
            {fieldError("instagram")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Facebook</label>
            <input name="facebook" type="text" maxLength={255} className={getInputClass("facebook")} placeholder="Username or Link" {...fieldErrorProps("facebook")} />
            {fieldError("facebook")}
          </div>
          <div className="space-y-1 md:col-span-3">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Business Description *</label>
            <textarea name="description" required rows={3} maxLength={1000} className={getInputClass("description", "resize-none")} placeholder="Tell couples about your services..." {...fieldErrorProps("description")}></textarea>
            {fieldError("description")}
          </div>
        </div>

        <h3 className="font-display text-xl text-charcoal mb-6 border-b border-gold/10 pb-2">Media & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block mb-2">Profile Logo *</label>
            <div className={getUploadClass("logo")}>
              <input type="file" name="logo" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => handleFileChange(e, "logo")} {...fieldErrorProps("logo")} />
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
            {fieldError("logo")}
          </div>

          <div>
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider block mb-2">Cover Image *</label>
            <div className={getUploadClass("cover")}>
              <input type="file" name="cover" required accept="image/*" className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" onChange={(e) => handleFileChange(e, "cover")} {...fieldErrorProps("cover")} />
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
            {fieldError("cover")}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Password *</label>
            <div className="relative">
              <input name="password" required type={showPassword ? "text" : "password"} className={getInputClass("password", "pr-12")} placeholder="At least 8 characters" {...fieldErrorProps("password")} />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-charcoal/40 hover:text-charcoal transition-colors">
                <span className="material-symbols-outlined text-[20px]">{showPassword ? "visibility_off" : "visibility"}</span>
              </button>
            </div>
            {fieldError("password")}
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-charcoal/70 uppercase tracking-wider">Confirm Password *</label>
            <input name="confirm_password" required type={showPassword ? "text" : "password"} className={getInputClass("confirm_password")} placeholder="Retype password" {...fieldErrorProps("confirm_password")} />
            {fieldError("confirm_password")}
          </div>
        </div>

        <div className="pt-6 border-t border-gold/10">
          <div className="flex items-start gap-3 mb-2">
            <input id="terms" name="terms" type="checkbox" required className="mt-1 w-4 h-4 text-emerald rounded border-outline/30 focus:ring-emerald cursor-pointer" {...fieldErrorProps("terms")} />
            <label className="text-sm text-charcoal/80" htmlFor="terms">
              I certify that I am an authorized representative of this business and agree to the <Link href="/content/terms" target="_blank" className="text-emerald font-semibold hover:underline">Terms of Service</Link> and <Link href="/content/privacy" target="_blank" className="text-emerald font-semibold hover:underline">Privacy Policy</Link>.
            </label>
          </div>
          <div className="mb-6">{fieldError("terms")}</div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-charcoal text-[#F5F0E8] py-4 rounded-xl font-semibold tracking-wide uppercase hover:bg-charcoal/90 active:scale-[0.99] transition-all flex items-center justify-center disabled:opacity-70 disabled:cursor-not-allowed"
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
