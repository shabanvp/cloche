"use client";

import { useState, useEffect, useRef } from "react";
import {
  Palette,
  Upload,
  Image as ImageIcon,
  Sparkles,
  CheckCircle,
  Save,
  Eye,
  Loader2,
  ChevronDown,
  ChevronUp,
  LayoutGrid,
  Globe,
  FileText,
  X,
  Award,
  ShieldCheck,
  Building2,
  Clock,
  MapPin,
  Phone,
  MessageCircle,
  Calendar,
  Layers,
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  Check,
  HelpCircle,
  Users,
  Car,
  Utensils,
  Plus,
  Trash2,
  Lock,
  Star,
  Info,
  DollarSign,
  ToggleLeft,
  ToggleRight
} from "lucide-react";
import { VendorCategoryConfig } from "@/lib/vendor-categories";
import { uploadImageToCloudinaryDetailed } from "@/lib/cloudinary";
import {
  fetchAuthenticatedVendorFromDb,
  getActiveVendorIdentity,
  syncVendorProfileWithDatabase,
  showVendorToast,
  VendorProfileData
} from "@/lib/vendorStore";

export interface VenueCustomizeStoreSectionProps {
  vendorName?: string;
  categoryConfig?: VendorCategoryConfig;
  onBack?: () => void;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export const VENUE_FACILITIES_OPTIONS = [
  { id: "indoor", label: "Indoor Venue" },
  { id: "outdoor", label: "Outdoor Venue" },
  { id: "terrace", label: "Terrace / Rooftop" },
  { id: "parking", label: "Parking Available" },
  { id: "ac", label: "Air Conditioned" },
  { id: "generator", label: "Generator Backup" },
  { id: "bridal_room", label: "Bridal Room" },
  { id: "rooms_available", label: "Rooms Available" },
];

export const VENUE_TYPE_OPTIONS = [
  "Banquet Hall",
  "Heritage Resort & Palace",
  "Luxury 5-Star Hotel",
  "Beachfront Lawn",
  "Farmhouse & Garden",
  "Convention Center",
  "Poolside Resort",
];

export function VenueCustomizeStoreSection({
  vendorName,
  categoryConfig,
  onBack,
}: VenueCustomizeStoreSectionProps = {}) {
  const [vendorData, setVendorData] = useState<VendorProfileData | null>(null);

  // 1. Basic Information
  const [venueNameState, setVenueNameState] = useState<string>("");
  const [tagline, setTagline] = useState<string>("");
  const [shortDescription, setShortDescription] = useState<string>("");
  const [about, setAbout] = useState<string>("");
  const [yearStarted, setYearStarted] = useState<string>("2014");
  const [venueType, setVenueType] = useState<string>("Banquet Hall");

  // 2. Contact & Location
  const [phone, setPhone] = useState<string>("");
  const [whatsapp, setWhatsapp] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [district, setDistrict] = useState<string>("Kochi");
  const [stateName, setStateName] = useState<string>("Kerala");
  const [googleMapsUrl, setGoogleMapsUrl] = useState<string>("");

  // 3. Venue Details
  const [guestCapacity, setGuestCapacity] = useState<string>("1,500");
  const [roomsCount, setRoomsCount] = useState<string>("24");
  const [parkingCapacity, setParkingCapacity] = useState<string>("350 Cars");
  const [hasIndoorSpace, setHasIndoorSpace] = useState<boolean>(true);
  const [hasOutdoorSpace, setHasOutdoorSpace] = useState<boolean>(true);
  const [hasRooftopSpace, setHasRooftopSpace] = useState<boolean>(false);
  const [hasBridalRoom, setHasBridalRoom] = useState<boolean>(true);
  const [hasGroomRoom, setHasGroomRoom] = useState<boolean>(true);

  // 4. Pricing Information
  const [vegPrice, setVegPrice] = useState<string>("1200");
  const [nonVegPrice, setNonVegPrice] = useState<string>("1500");
  const [decorStartingPrice, setDecorStartingPrice] = useState<string>("50000");
  const [contactForPricing, setContactForPricing] = useState<boolean>(false);

  // 5. Portfolio (Images)
  const [coverUrl, setCoverUrl] = useState<string>("");
  const [logoUrl, setLogoUrl] = useState<string>("");
  const [galleryImages, setGalleryImages] = useState<string[]>([
    "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  ]);

  // 6. Facilities & Offers Checkboxes
  const [facilities, setFacilities] = useState<string[]>([
    "indoor",
    "outdoor",
    "parking",
    "ac",
    "generator",
    "bridal_room",
    "rooms_available",
  ]);

  // 7. Policies (Switches)
  const [policySwitches, setPolicySwitches] = useState({
    inhouseCatering: true,
    outsideCatering: true,
    outsideDecorator: true,
    outsideAlcohol: true,
    inhouseDj: true,
    outsideDj: true,
    lessThan50Pax: false,
  });
  const [decorationPolicy, setDecorationPolicy] = useState<string>(
    "Empaneled luxury decorators available. Outside decorators permitted with prior approval & security deposit."
  );
  const [cancellationPolicyText, setCancellationPolicyText] = useState<string>(
    "100% refund on cancellations 60+ days prior to event. 50% refund for cancellations 30-50 days prior."
  );

  // 8. Frequently Asked Questions (FAQ Manager)
  const [faqs, setFaqs] = useState<FAQItem[]>([
    {
      id: "faq-1",
      question: "What is the guest capacity of the main banquet hall?",
      answer: "Our main Royal Ballroom comfortably accommodates up to 1,500 floating guests and 800 seated guests."
    },
    {
      id: "faq-2",
      question: "Do you allow outside catering teams?",
      answer: "Yes, outside catering teams are permitted. We also offer 5-star in-house catering with customized live counter menus."
    },
    {
      id: "faq-3",
      question: "Is valet parking provided?",
      answer: "Yes, dedicated valet parking is included for up to 350 vehicles with secure 24/7 CCTV surveillance."
    }
  ]);

  // 9. Availability & Timings
  const [availabilityNote, setAvailabilityNote] = useState<string>("Open for 2026-2027 Wedding Season Bookings");
  const [blockedDates, setBlockedDates] = useState<string>("None (Contact venue manager for slot lock)");
  const [openingTime, setOpeningTime] = useState<string>("09:00 AM");
  const [closingTime, setClosingTime] = useState<string>("10:00 PM");
  const [weeklyOff, setWeeklyOff] = useState<string>("Open All 7 Days");

  // 10. Contact Preferences
  const [contactPreferences, setContactPreferences] = useState({
    enableCallButton: true,
    enableWhatsappButton: true,
    enableMessageButton: true,
  });

  // Accordion Expand/Collapse State
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    basicInfo: true,
    contactLocation: true,
    venueDetails: true,
    pricing: true,
    portfolio: true,
    facilities: true,
    policies: true,
    faqs: true,
    availability: false,
    preferences: false,
    systemFields: false,
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  // Uploading & Saving State
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isUploadingGallery, setIsUploadingGallery] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const logoInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  // Initial Data Fetch
  useEffect(() => {
    const localVendor = getActiveVendorIdentity();
    if (localVendor) {
      setVendorData(localVendor);
      hydrateFields(localVendor);
    }

    async function loadDbVendor() {
      try {
        const dbVendor = await fetchAuthenticatedVendorFromDb();
        if (dbVendor) {
          setVendorData(dbVendor);
          hydrateFields(dbVendor);
        }
      } catch (e) {
        console.error("[VenueCustomizeStore] Error loading vendor from DB:", e);
      }
    }

    loadDbVendor();
  }, []);

  const hydrateFields = (data: Partial<VendorProfileData> & Record<string, any>) => {
    const sf = (data && typeof data.storefront === "object" && data.storefront !== null) ? data.storefront : {};
    const sfContact = sf.contactInfo || {};

    // 1. Basic Info
    const nameVal = data.name || data.boutique_name || sf.businessName || "";
    if (nameVal) setVenueNameState(nameVal);

    const taglineVal = data.tagline || sf.tagline || "";
    if (taglineVal) setTagline(taglineVal);

    const shortDescVal = data.subtitle || data.shortDescription || sf.subtitle || "";
    if (shortDescVal) setShortDescription(shortDescVal);

    const aboutVal = data.about || data.description || sf.about || "";
    if (aboutVal) setAbout(aboutVal);

    const yearVal = data.yearStarted || data.years_in_business || data.experience_years || "";
    if (yearVal) setYearStarted(String(yearVal));

    const typeVal = data.venueType || data.venue_type || "";
    if (typeVal) setVenueType(typeVal);

    // 2. Contact & Location
    if (data.phone || sfContact.phone) setPhone(data.phone || sfContact.phone || "");
    if (data.whatsapp || sfContact.whatsapp) setWhatsapp(data.whatsapp || sfContact.whatsapp || "");
    if (data.email || sfContact.email) setEmail(data.email || sfContact.email || "");
    if (data.address || sfContact.address) setAddress(data.address || sfContact.address || "");
    if (data.district || sfContact.district) setDistrict(data.district || sfContact.district || "");
    if (data.state || sfContact.state) setStateName(data.state || sfContact.state || "");
    if (data.googleMaps || data.google_maps_url || sfContact.googleMaps) {
      setGoogleMapsUrl(data.googleMaps || data.google_maps_url || sfContact.googleMaps || "");
    }

    // 3. Venue Details
    if (data.guestCapacity || data.guest_capacity || data.capacity) {
      setGuestCapacity(String(data.guestCapacity || data.guest_capacity || data.capacity || ""));
    }
    if (data.roomsCount || data.rooms_count || data.numberOfRooms) {
      setRoomsCount(String(data.roomsCount || data.rooms_count || data.numberOfRooms || ""));
    }
    if (data.parkingCapacity || data.parking_capacity) {
      setParkingCapacity(String(data.parkingCapacity || data.parking_capacity || ""));
    }
    if (data.hasIndoorSpace !== undefined) setHasIndoorSpace(Boolean(data.hasIndoorSpace));
    if (data.hasOutdoorSpace !== undefined) setHasOutdoorSpace(Boolean(data.hasOutdoorSpace));
    if (data.hasRooftopSpace !== undefined) setHasRooftopSpace(Boolean(data.hasRooftopSpace));
    if (data.hasBridalRoom !== undefined) setHasBridalRoom(Boolean(data.hasBridalRoom));
    if (data.hasGroomRoom !== undefined) setHasGroomRoom(Boolean(data.hasGroomRoom));

    // 4. Pricing Info
    if (data.vegPrice || data.veg_price) setVegPrice(String(data.vegPrice || data.veg_price || ""));
    if (data.nonVegPrice || data.non_veg_price) setNonVegPrice(String(data.nonVegPrice || data.non_veg_price || ""));
    if (data.decorStartingPrice || data.decor_starting_price) {
      setDecorStartingPrice(String(data.decorStartingPrice || data.decor_starting_price || ""));
    }
    if (data.contactForPricing !== undefined) setContactForPricing(Boolean(data.contactForPricing));

    // 5. Portfolio Images
    const coverVal = data.coverImage || data.cover_image || sf.coverImage || "";
    if (coverVal) setCoverUrl(coverVal);

    const logoVal = data.logo || data.logo_url || sf.logo || "";
    if (logoVal) setLogoUrl(logoVal);

    const gallery = Array.isArray(data.galleryImages) && data.galleryImages.length > 0
      ? data.galleryImages
      : Array.isArray(data.gallery_images) && data.gallery_images.length > 0
      ? data.gallery_images
      : Array.isArray(sf.gallery)
      ? sf.gallery.map((x: any) => (typeof x === "string" ? x : x?.url || x?.image_url))
      : null;
    if (gallery) setGalleryImages(gallery);

    // 6. Facilities
    const facs = data.facilities || data.venue_facilities || sf.facilities;
    if (Array.isArray(facs) && facs.length > 0) setFacilities(facs);

    // 7. Policies Switches
    if (data.policySwitches || data.policy_switches) {
      const ps = (data.policySwitches || data.policy_switches) as any;
      setPolicySwitches({
        inhouseCatering: Boolean(ps.inhouseCatering ?? true),
        outsideCatering: Boolean(ps.outsideCatering ?? true),
        outsideDecorator: Boolean(ps.outsideDecorator ?? true),
        outsideAlcohol: Boolean(ps.outsideAlcohol ?? true),
        inhouseDj: Boolean(ps.inhouseDj ?? true),
        outsideDj: Boolean(ps.outsideDj ?? true),
        lessThan50Pax: Boolean(ps.lessThan50Pax ?? false),
      });
    }
    if (data.decorationPolicy || data.decoration_policy) setDecorationPolicy(data.decorationPolicy || data.decoration_policy);
    if (data.cancellationPolicyText || data.cancellation_policy) setCancellationPolicyText(data.cancellationPolicyText || data.cancellation_policy);

    // 8. FAQs
    const rawFaqs = data.faqs || data.faq_items || sf.faqs;
    if (Array.isArray(rawFaqs) && rawFaqs.length > 0) {
      const formatted = rawFaqs.map((item: any, idx: number) => ({
        id: item.id || `faq-${idx}-${Date.now()}`,
        question: item.question || item.q || "",
        answer: item.answer || item.a || "",
      }));
      setFaqs(formatted);
    }

    // 9. Availability
    const availNote = data.availabilityNote || data.availability_note || "";
    if (availNote) setAvailabilityNote(availNote);

    const blockedD = data.blockedDates || data.blocked_dates || "";
    if (blockedD) setBlockedDates(blockedD);

    const openT = data.openingTime || data.opening_time || "";
    if (openT) setOpeningTime(openT);

    const closeT = data.closingTime || data.closing_time || "";
    if (closeT) setClosingTime(closeT);

    const weekOff = data.weeklyOff || data.weekly_off || "";
    if (weekOff) setWeeklyOff(weekOff);

    // 10. Contact Preferences
    if (data.contactPreferences || data.contact_preferences) {
      const cp = (data.contactPreferences || data.contact_preferences) as any;
      setContactPreferences({
        enableCallButton: Boolean(cp.enableCallButton ?? true),
        enableWhatsappButton: Boolean(cp.enableWhatsappButton ?? true),
        enableMessageButton: Boolean(cp.enableMessageButton ?? true),
      });
    }
  };

  // Facility Toggle Handler
  const toggleFacility = (facilityId: string) => {
    setFacilities((prev) =>
      prev.includes(facilityId) ? prev.filter((id) => id !== facilityId) : [...prev, facilityId]
    );
  };

  // FAQ Handlers
  const handleAddFaq = () => {
    const newFaq: FAQItem = {
      id: `faq-${Date.now()}`,
      question: "New Venue Question?",
      answer: "Provide detailed answer for venue guests here."
    };
    setFaqs((prev) => [...prev, newFaq]);
  };

  const handleUpdateFaq = (id: string, field: "question" | "answer", value: string) => {
    setFaqs((prev) =>
      prev.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleDeleteFaq = (id: string) => {
    setFaqs((prev) => prev.filter((f) => f.id !== id));
  };

  const handleMoveFaq = (index: number, direction: "up" | "down") => {
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= faqs.length) return;
    const newFaqs = [...faqs];
    const temp = newFaqs[index];
    newFaqs[index] = newFaqs[targetIndex];
    newFaqs[targetIndex] = temp;
    setFaqs(newFaqs);
  };

  // Portfolio Image Handlers
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingLogo(true);
      const res = await uploadImageToCloudinaryDetailed(file);
      setLogoUrl(res.secure_url);
      showVendorToast("✓ Venue Logo uploaded", "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload logo", "error");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setIsUploadingCover(true);
      const res = await uploadImageToCloudinaryDetailed(file);
      setCoverUrl(res.secure_url);
      showVendorToast("✓ Cover image uploaded", "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload cover photo", "error");
    } finally {
      setIsUploadingCover(false);
    }
  };

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setIsUploadingGallery(true);
      const uploadPromises = Array.from(files).map((f) => uploadImageToCloudinaryDetailed(f));
      const results = await Promise.all(uploadPromises);
      const newUrls = results.map((r) => r.secure_url);
      setGalleryImages((prev) => [...prev, ...newUrls]);
      showVendorToast(`✓ Uploaded ${newUrls.length} portfolio photo(s)`, "success");
    } catch (err: any) {
      showVendorToast(err?.message || "Failed to upload portfolio images", "error");
    } finally {
      setIsUploadingGallery(false);
    }
  };

  const handleDeleteGalleryImage = (index: number) => {
    setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    showVendorToast("Photo deleted from portfolio", "info");
  };

  const handleMoveGalleryImage = (index: number, direction: "left" | "right") => {
    const targetIndex = direction === "left" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= galleryImages.length) return;
    const newImages = [...galleryImages];
    const temp = newImages[index];
    newImages[index] = newImages[targetIndex];
    newImages[targetIndex] = temp;
    setGalleryImages(newImages);
  };

  const handleSelectCoverFromGallery = (url: string) => {
    setCoverUrl(url);
    showVendorToast("Set as primary cover photo", "success");
  };

  // Save All Venue Customization Changes
  const handleSave = async () => {
    try {
      setIsSaving(true);

      const activeVendor = getActiveVendorIdentity() || {};
      const targetId = vendorData?.id || activeVendor?.id || "venue-1";
      const displayName = venueNameState.trim() || vendorName || activeVendor?.name || activeVendor?.boutique_name || "Royal Orchid Palace & Banquets";
      const fullLocation = [address.trim(), district.trim(), stateName.trim()].filter(Boolean).join(", ");

      const payload: Partial<VendorProfileData> & Record<string, any> = {
        id: targetId,
        category: "venue",
        categorySlug: "venues",
        categoryLabel: "Wedding Venues",

        // 1. Basic Information
        name: displayName,
        boutique_name: displayName,
        venueName: displayName,
        tagline: tagline.trim(),
        subtitle: shortDescription.trim() || tagline.trim(),
        shortDescription: shortDescription.trim(),
        about: about.trim(),
        description: about.trim(),
        yearStarted: yearStarted.trim(),
        years_in_business: yearStarted.trim(),
        venueType,
        venue_type: venueType,

        // 2. Contact & Location
        phone: phone.trim(),
        whatsapp: whatsapp.trim() || phone.trim(),
        email: email.trim(),
        address: address.trim(),
        district: district.trim(),
        state: stateName.trim(),
        location: fullLocation,
        googleMaps: googleMapsUrl.trim(),
        google_maps_url: googleMapsUrl.trim(),

        // 3. Venue Details
        guestCapacity: guestCapacity.trim(),
        capacity: guestCapacity.trim(),
        roomsCount: roomsCount.trim(),
        numberOfRooms: roomsCount.trim(),
        parkingCapacity: parkingCapacity.trim(),
        hasIndoorSpace,
        hasOutdoorSpace,
        hasRooftopSpace,
        hasBridalRoom,
        hasGroomRoom,

        // 4. Pricing Information
        vegPrice: vegPrice.trim(),
        veg_price: vegPrice.trim(),
        nonVegPrice: nonVegPrice.trim(),
        non_veg_price: nonVegPrice.trim(),
        decorStartingPrice: decorStartingPrice.trim(),
        decor_starting_price: decorStartingPrice.trim(),
        startingPrice: contactForPricing ? "Contact for Pricing" : vegPrice.trim() ? `₹${vegPrice.trim()} / plate` : "Contact for Pricing",
        contactForPricing,

        // 5. Portfolio Images
        coverImage: coverUrl.trim() || galleryImages[0] || "",
        cover_image: coverUrl.trim() || galleryImages[0] || "",
        logo: logoUrl.trim(),
        logo_url: logoUrl.trim(),
        galleryImages,
        gallery_images: galleryImages,

        // 6. Facilities & Offers
        facilities,
        venue_facilities: facilities,

        // 7. Policies
        policySwitches,
        policy_switches: policySwitches,
        decorationPolicy: decorationPolicy.trim(),
        cancellationPolicyText: cancellationPolicyText.trim(),
        cancellation_policy: cancellationPolicyText.trim(),

        // 8. Frequently Asked Questions
        faqs,
        faq_items: faqs,

        // 9. Availability & Timings
        availabilityNote: availabilityNote.trim(),
        blockedDates: blockedDates.trim(),
        openingTime: openingTime.trim(),
        closingTime: closingTime.trim(),
        weeklyOff: weeklyOff.trim(),
        working_hours: `${openingTime} - ${closingTime} (${weeklyOff})`,

        // 10. Contact Preferences
        contactPreferences,
        contact_preferences: contactPreferences,
      };

      // 1. Instantly save to local storage for immediate updates across all views
      try {
        const updatedVendor = { ...activeVendor, ...payload };
        localStorage.setItem("cloche_active_vendor_identity", JSON.stringify(updatedVendor));
        localStorage.setItem(`cloche_vendor_customization_${targetId}`, JSON.stringify(updatedVendor));
        localStorage.setItem("cloche_venue_customization", JSON.stringify(updatedVendor));
        window.dispatchEvent(new CustomEvent("cloche_vendor_profile_updated", { detail: updatedVendor }));
      } catch (e) {}

      // 2. Persist to Supabase Database
      await syncVendorProfileWithDatabase(payload);

      showVendorToast("✓ Venue Store Customization saved successfully!", "success");
    } catch (err: any) {
      console.error("Save error:", err);
      showVendorToast(err?.message || "Failed to save venue customization", "error");
    } finally {
      setIsSaving(false);
    }
  };

  const displayNameHeader = venueNameState.trim() || vendorName || "Royal Orchid Palace & Banquets";
  const displayLocationHeader = [district, stateName].filter(Boolean).join(", ") || "Kochi, Kerala";

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-24">
      
      {/* ── STICKY TOP BAR ── */}
      <div className="bg-white rounded-3xl p-5 border border-gold/15 shadow-sm sticky top-4 z-30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {onBack && (
            <button
              onClick={onBack}
              className="p-2 rounded-xl bg-[#FAF7F2] hover:bg-[#F3EDE2] text-charcoal transition-colors shrink-0"
              title="Back to Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-[10px] font-extrabold uppercase tracking-widest">
                Venue Customization Dashboard
              </span>
              <span className="text-xs text-charcoal/50 font-medium hidden sm:inline">• Live Supabase Sync</span>
            </div>
            <h1 className="text-lg sm:text-xl font-serif font-bold text-charcoal truncate">
              {displayNameHeader}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <a
            href={`/venues/${vendorData?.id || "venue-1"}`}
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2.5 rounded-2xl bg-[#FAF7F2] hover:bg-[#F3EDE2] border border-gold/20 text-[#0F4C45] text-xs font-bold transition-all flex items-center justify-center gap-1.5 shrink-0"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Preview Live Profile</span>
          </a>

          <button
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2.5 rounded-2xl bg-[#0F4C45] hover:bg-[#072B27] text-ivory text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2 shrink-0 disabled:opacity-50 cursor-pointer"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : <Save className="w-4 h-4 text-gold" />}
            <span>{isSaving ? "Saving..." : "Save Changes"}</span>
          </button>
        </div>
      </div>

      {/* ── SECTION 1: BASIC INFORMATION ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("basicInfo")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">1. Basic Information</h2>
              <p className="text-xs text-charcoal/60">Venue name, tagline, type, year started, and about story</p>
            </div>
          </div>
          {openAccordions.basicInfo ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.basicInfo && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Venue Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={venueNameState}
                  onChange={(e) => setVenueNameState(e.target.value)}
                  placeholder="e.g. Royal Orchid Palace & Banquets"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Venue Type
                </label>
                <select
                  value={venueType}
                  onChange={(e) => setVenueType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                >
                  {VENUE_TYPE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Short Tagline
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Royal celebrations, lush lawns & 5-star wedding hospitality"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Year Established / Started
                </label>
                <input
                  type="text"
                  value={yearStarted}
                  onChange={(e) => setYearStarted(e.target.value)}
                  placeholder="e.g. 2014"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                Short Subtitle Description
              </label>
              <input
                type="text"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="e.g. Grand banquet halls, lush outdoor lawns and 5-star wedding experiences."
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                Detailed About Content
              </label>
              <textarea
                rows={4}
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Provide complete description of your venue, architecture, ambiance, capacity, and legacy..."
                className="w-full px-4 py-3 rounded-2xl bg-white border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45] leading-relaxed"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 2: CONTACT & LOCATION ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("contactLocation")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">2. Contact & Location</h2>
              <p className="text-xs text-charcoal/60">Phone number, WhatsApp, email, street address, district, state & map</p>
            </div>
          </div>
          {openAccordions.contactLocation ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.contactLocation && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Contact Number
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  WhatsApp Number
                </label>
                <input
                  type="text"
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. events@royalpalace.com"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  District / City
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="e.g. Ernakulam / Kochi"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  State
                </label>
                <input
                  type="text"
                  value={stateName}
                  onChange={(e) => setStateName(e.target.value)}
                  placeholder="e.g. Kerala"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Google Maps URL
                </label>
                <input
                  type="text"
                  value={googleMapsUrl}
                  onChange={(e) => setGoogleMapsUrl(e.target.value)}
                  placeholder="e.g. https://maps.google.com/..."
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                Full Street Address
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="e.g. Marine Drive Bypass, Near Rainbow Bridge, Kochi"
                className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
              />
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 3: VENUE DETAILS ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("venueDetails")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">3. Venue Details & Spaces</h2>
              <p className="text-xs text-charcoal/60">Capacity, guest rooms, parking, indoor, outdoor & rooftop spaces</p>
            </div>
          </div>
          {openAccordions.venueDetails ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.venueDetails && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Guest Capacity (Max)
                </label>
                <input
                  type="text"
                  value={guestCapacity}
                  onChange={(e) => setGuestCapacity(e.target.value)}
                  placeholder="e.g. 1,500 Guests"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Number of Guest Rooms
                </label>
                <input
                  type="text"
                  value={roomsCount}
                  onChange={(e) => setRoomsCount(e.target.value)}
                  placeholder="e.g. 24 Rooms"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Parking Capacity
                </label>
                <input
                  type="text"
                  value={parkingCapacity}
                  onChange={(e) => setParkingCapacity(e.target.value)}
                  placeholder="e.g. 350 Cars & Valet"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-gold/10">
              <span className="block text-xs font-bold text-charcoal mb-3 uppercase tracking-wider">
                Space Toggles & Dedicated Rooms
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasIndoorSpace}
                    onChange={(e) => setHasIndoorSpace(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  <span className="text-xs font-bold text-charcoal">Indoor Space</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasOutdoorSpace}
                    onChange={(e) => setHasOutdoorSpace(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  <span className="text-xs font-bold text-charcoal">Outdoor Space</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasRooftopSpace}
                    onChange={(e) => setHasRooftopSpace(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  <span className="text-xs font-bold text-charcoal">Rooftop Space</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasBridalRoom}
                    onChange={(e) => setHasBridalRoom(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  <span className="text-xs font-bold text-charcoal">Bridal Room</span>
                </label>

                <label className="flex items-center gap-2.5 p-3 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={hasGroomRoom}
                    onChange={(e) => setHasGroomRoom(e.target.checked)}
                    className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                  />
                  <span className="text-xs font-bold text-charcoal">Groom Room</span>
                </label>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 4: PRICING INFORMATION ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("pricing")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">4. Pricing Information</h2>
              <p className="text-xs text-charcoal/60">Veg price per plate, non-veg price per plate, decor starting price & quote toggle</p>
            </div>
          </div>
          {openAccordions.pricing ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.pricing && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20">
              <div>
                <h4 className="text-xs font-bold text-amber-900 uppercase tracking-wider">Contact For Pricing Mode</h4>
                <p className="text-[11px] text-amber-800">If enabled, numerical prices will be hidden on public profile</p>
              </div>
              <button
                type="button"
                onClick={() => setContactForPricing(!contactForPricing)}
                className={`p-1.5 rounded-full transition-colors cursor-pointer ${contactForPricing ? "bg-[#0F4C45] text-gold" : "bg-gray-200 text-gray-400"}`}
              >
                {contactForPricing ? <ToggleRight className="w-8 h-8" /> : <ToggleLeft className="w-8 h-8" />}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Veg Price Per Plate (₹)
                </label>
                <input
                  type="text"
                  value={vegPrice}
                  onChange={(e) => setVegPrice(e.target.value)}
                  placeholder="e.g. 1,200"
                  disabled={contactForPricing}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45] disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Non-Veg Price Per Plate (₹)
                </label>
                <input
                  type="text"
                  value={nonVegPrice}
                  onChange={(e) => setNonVegPrice(e.target.value)}
                  placeholder="e.g. 1,500"
                  disabled={contactForPricing}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45] disabled:opacity-40"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Decoration Starting Price (₹)
                </label>
                <input
                  type="text"
                  value={decorStartingPrice}
                  onChange={(e) => setDecorStartingPrice(e.target.value)}
                  placeholder="e.g. 50,000"
                  disabled={contactForPricing}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45] disabled:opacity-40"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 5: PORTFOLIO (GALLERY & IMAGES) ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("portfolio")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <ImageIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">5. Portfolio & Gallery Manager</h2>
              <p className="text-xs text-charcoal/60">Upload venue photos, reorder images, select cover photo, or delete</p>
            </div>
          </div>
          {openAccordions.portfolio ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.portfolio && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-5 bg-[#FAF7F2]/30">
            
            {/* Upload Buttons */}
            <div className="flex flex-wrap gap-3">
              <input
                ref={galleryInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleGalleryUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                disabled={isUploadingGallery}
                className="px-5 py-2.5 rounded-2xl bg-[#0F4C45] text-ivory text-xs font-bold hover:bg-[#072B27] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isUploadingGallery ? <Loader2 className="w-4 h-4 animate-spin text-gold" /> : <Upload className="w-4 h-4 text-gold" />}
                <span>Upload Venue Gallery Images</span>
              </button>

              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => coverInputRef.current?.click()}
                disabled={isUploadingCover}
                className="px-5 py-2.5 rounded-2xl bg-white border border-gold/30 text-[#0F4C45] text-xs font-bold hover:bg-[#FAF7F2] transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-50"
              >
                {isUploadingCover ? <Loader2 className="w-4 h-4 animate-spin text-[#0F4C45]" /> : <ImageIcon className="w-4 h-4 text-[#0F4C45]" />}
                <span>Upload Primary Cover Banner</span>
              </button>
            </div>

            {/* Gallery Grid */}
            <div>
              <span className="block text-xs font-bold text-charcoal mb-3 uppercase tracking-wider">
                Venue Gallery ({galleryImages.length} Photos)
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {galleryImages.map((img, idx) => {
                  const isCover = coverUrl === img;
                  return (
                    <div key={idx} className="relative group rounded-2xl overflow-hidden border border-gold/15 bg-gray-100 aspect-video">
                      <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                      
                      {isCover && (
                        <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#0F4C45] text-[#C8A96A] text-[9px] font-extrabold uppercase tracking-wider flex items-center gap-1 shadow-md">
                          <Star className="w-3 h-3 fill-[#C8A96A]" /> Primary Cover
                        </div>
                      )}

                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                        {!isCover && (
                          <button
                            type="button"
                            onClick={() => handleSelectCoverFromGallery(img)}
                            className="p-2 rounded-xl bg-white/90 text-[#0F4C45] hover:bg-white text-[10px] font-bold shadow-md cursor-pointer"
                            title="Set as Cover Banner"
                          >
                            Set Cover
                          </button>
                        )}
                        
                        {idx > 0 && (
                          <button
                            type="button"
                            onClick={() => handleMoveGalleryImage(idx, "left")}
                            className="p-2 rounded-xl bg-white/90 text-charcoal hover:bg-white shadow-md cursor-pointer"
                            title="Move Left"
                          >
                            <ArrowLeft className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDeleteGalleryImage(idx)}
                          className="p-2 rounded-xl bg-red-500 text-white hover:bg-red-600 shadow-md cursor-pointer"
                          title="Delete Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 6: ABOUT & FACILITIES / OFFERS ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("facilities")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">6. Offers & Facilities Checkboxes</h2>
              <p className="text-xs text-charcoal/60">Checkboxes that automatically populate the Facilities card on public profile</p>
            </div>
          </div>
          {openAccordions.facilities ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.facilities && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {VENUE_FACILITIES_OPTIONS.map((fac) => {
                const checked = facilities.includes(fac.id);
                return (
                  <label
                    key={fac.id}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border transition-all cursor-pointer ${
                      checked ? "bg-[#0F4C45]/10 border-[#0F4C45] text-[#0F4C45]" : "bg-white border-gold/15 text-charcoal"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFacility(fac.id)}
                      className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                    />
                    <span className="text-xs font-bold">{fac.label}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 7: POLICIES ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("policies")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">7. Venue Policies & Guidelines</h2>
              <p className="text-xs text-charcoal/60">Yes/No policy switches and rules for catering, decoration & alcohol</p>
            </div>
          </div>
          {openAccordions.policies ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.policies && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { key: "inhouseCatering", label: "In-house Catering" },
                { key: "outsideCatering", label: "Outside Catering" },
                { key: "outsideDecorator", label: "Outside Decorator" },
                { key: "outsideAlcohol", label: "Outside Alcohol" },
                { key: "inhouseDj", label: "In-house DJ" },
                { key: "outsideDj", label: "Outside DJ" },
                { key: "lessThan50Pax", label: "Less Than 50 Pax Permitted" },
              ].map((pol) => {
                const val = (policySwitches as any)[pol.key];
                return (
                  <div key={pol.key} className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gold/15">
                    <span className="text-xs font-bold text-charcoal">{pol.label}</span>
                    <button
                      type="button"
                      onClick={() =>
                        setPolicySwitches((prev) => ({
                          ...prev,
                          [pol.key]: !val,
                        }))
                      }
                      className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider transition-colors cursor-pointer ${
                        val ? "bg-[#0F4C45] text-ivory" : "bg-gray-200 text-gray-600"
                      }`}
                    >
                      {val ? "YES" : "NO"}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="space-y-4 pt-3 border-t border-gold/10">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Decoration Policy Text
                </label>
                <textarea
                  rows={2}
                  value={decorationPolicy}
                  onChange={(e) => setDecorationPolicy(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Cancellation Policy Text
                </label>
                <textarea
                  rows={2}
                  value={cancellationPolicyText}
                  onChange={(e) => setCancellationPolicyText(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 8: FREQUENTLY ASKED QUESTIONS (FAQ MANAGER) ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("faqs")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">8. Dynamic FAQ Manager</h2>
              <p className="text-xs text-charcoal/60">Add, edit, reorder, or delete questions & answers on the public profile</p>
            </div>
          </div>
          {openAccordions.faqs ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.faqs && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-charcoal uppercase tracking-wider">
                Venue FAQs ({faqs.length})
              </span>
              <button
                type="button"
                onClick={handleAddFaq}
                className="px-4 py-2 rounded-2xl bg-[#0F4C45] text-ivory text-xs font-bold hover:bg-[#072B27] transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-gold" />
                <span>Add FAQ</span>
              </button>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div key={faq.id} className="p-4 rounded-2xl bg-white border border-gold/15 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-[#0F4C45]">Question #{idx + 1}</span>
                    <div className="flex items-center gap-1">
                      {idx > 0 && (
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(idx, "up")}
                          className="p-1.5 rounded-lg bg-gray-100 text-charcoal hover:bg-gray-200 text-xs"
                          title="Move Up"
                        >
                          <ArrowUp className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {idx < faqs.length - 1 && (
                        <button
                          type="button"
                          onClick={() => handleMoveFaq(idx, "down")}
                          className="p-1.5 rounded-lg bg-gray-100 text-charcoal hover:bg-gray-200 text-xs"
                          title="Move Down"
                        >
                          <ArrowDown className="w-3.5 h-3.5" />
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-1.5 rounded-lg bg-red-100 text-red-600 hover:bg-red-200 text-xs cursor-pointer ml-1"
                        title="Delete FAQ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => handleUpdateFaq(faq.id, "question", e.target.value)}
                      placeholder="Question..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>

                  <div>
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => handleUpdateFaq(faq.id, "answer", e.target.value)}
                      placeholder="Answer..."
                      className="w-full px-3.5 py-2 rounded-xl bg-[#FAF7F2] border border-gold/20 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 9: AVAILABILITY ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("availability")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">9. Availability & Working Hours</h2>
              <p className="text-xs text-charcoal/60">Available dates, blocked dates, and working hours for site visits</p>
            </div>
          </div>
          {openAccordions.availability ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.availability && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-4 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Available Booking Dates Note
                </label>
                <input
                  type="text"
                  value={availabilityNote}
                  onChange={(e) => setAvailabilityNote(e.target.value)}
                  placeholder="e.g. Open for 2026-2027 Wedding Season"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Blocked Dates / Maintenance
                </label>
                <input
                  type="text"
                  value={blockedDates}
                  onChange={(e) => setBlockedDates(e.target.value)}
                  placeholder="e.g. Mon-Wed Maintenance"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Opening Time
                </label>
                <input
                  type="text"
                  value={openingTime}
                  onChange={(e) => setOpeningTime(e.target.value)}
                  placeholder="09:00 AM"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Closing Time
                </label>
                <input
                  type="text"
                  value={closingTime}
                  onChange={(e) => setClosingTime(e.target.value)}
                  placeholder="10:00 PM"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal mb-1.5 uppercase tracking-wider">
                  Weekly Off / Off Days
                </label>
                <input
                  type="text"
                  value={weeklyOff}
                  onChange={(e) => setWeeklyOff(e.target.value)}
                  placeholder="Open All 7 Days"
                  className="w-full px-4 py-2.5 rounded-2xl bg-white border border-gold/20 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 10: CONTACT PREFERENCES ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs">
        <button
          onClick={() => toggleAccordion("preferences")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-white hover:bg-[#FAF7F2]/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#0F4C45]/10 text-[#0F4C45] flex items-center justify-center shrink-0">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-charcoal">10. Contact Preferences & Action Buttons</h2>
              <p className="text-xs text-charcoal/60">Enable or disable Call, WhatsApp, and Inquiry action buttons</p>
            </div>
          </div>
          {openAccordions.preferences ? <ChevronUp className="w-5 h-5 text-charcoal/40" /> : <ChevronDown className="w-5 h-5 text-charcoal/40" />}
        </button>

        {openAccordions.preferences && (
          <div className="p-5 sm:p-6 border-t border-gold/10 space-y-3 bg-[#FAF7F2]/30">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                <span className="text-xs font-bold text-charcoal">Call Button</span>
                <input
                  type="checkbox"
                  checked={contactPreferences.enableCallButton}
                  onChange={(e) =>
                    setContactPreferences((prev) => ({
                      ...prev,
                      enableCallButton: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                <span className="text-xs font-bold text-charcoal">WhatsApp Button</span>
                <input
                  type="checkbox"
                  checked={contactPreferences.enableWhatsappButton}
                  onChange={(e) =>
                    setContactPreferences((prev) => ({
                      ...prev,
                      enableWhatsappButton: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                />
              </label>

              <label className="flex items-center justify-between p-3.5 rounded-2xl bg-white border border-gold/15 cursor-pointer">
                <span className="text-xs font-bold text-charcoal">Send Inquiry Button</span>
                <input
                  type="checkbox"
                  checked={contactPreferences.enableMessageButton}
                  onChange={(e) =>
                    setContactPreferences((prev) => ({
                      ...prev,
                      enableMessageButton: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded text-[#0F4C45] focus:ring-[#0F4C45]"
                />
              </label>
            </div>
          </div>
        )}
      </div>

      {/* ── SECTION 11: UNEDITABLE SYSTEM FIELDS (READ ONLY DISPLAY) ── */}
      <div className="bg-white rounded-3xl border border-gold/15 overflow-hidden shadow-xs opacity-90">
        <button
          onClick={() => toggleAccordion("systemFields")}
          className="w-full p-5 sm:p-6 flex items-center justify-between text-left bg-gray-50 hover:bg-gray-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-200 text-gray-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-gray-800 flex items-center gap-2">
                <span>System-Controlled Fields</span>
                <span className="px-2 py-0.5 rounded-full bg-gray-200 text-gray-700 text-[10px] uppercase font-bold tracking-wider">
                  Read Only
                </span>
              </h2>
              <p className="text-xs text-gray-500">System metrics, ratings, verified badge & customer reviews</p>
            </div>
          </div>
          {openAccordions.systemFields ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </button>

        {openAccordions.systemFields && (
          <div className="p-5 sm:p-6 border-t border-gray-200 bg-gray-50 space-y-4">
            <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-center gap-2">
              <Info className="w-4 h-4 shrink-0 text-blue-600" />
              <span>
                These properties are automatically computed by Cloche and cannot be edited manually.
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Overall Rating</span>
                <span className="font-bold text-charcoal flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-gold text-gold" /> {(vendorData as any)?.rating || 4.9} / 5.0
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Review Count</span>
                <span className="font-bold text-charcoal">{(vendorData as any)?.reviews || (vendorData as any)?.reviewsCount || 156} Reviews</span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Verified Badge</span>
                <span className="font-bold text-[#0F4C45] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#0F4C45]" /> Verified Partner
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-white border border-gray-200 space-y-1">
                <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider block">Enquiries Last Week</span>
                <span className="font-bold text-charcoal">42 Inquiries</span>
              </div>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
