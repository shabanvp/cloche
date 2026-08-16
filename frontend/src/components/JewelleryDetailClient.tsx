"use client";

import type { JewelleryVendor } from "@/lib/jewelleryData";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";

export function JewelleryDetailClient({ vendor }: { vendor: JewelleryVendor }) {
  const v = vendor as any;
  const profileData = {
    id: vendor.id,
    name: vendor.name,
    category: "jewellery",
    location: vendor.location,
    rating: vendor.rating,
    reviews: vendor.reviews,
    image: vendor.image || (vendor.portfolio && vendor.portfolio[0]) || "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=600&q=80",
    subtitle: v.tagline || "Certified gold, solitaire diamonds & royal heritage polki bridal sets.",
    about: vendor.about,
    phone: v.phone || "9876543210",
    whatsapp: v.whatsapp || v.phone || "9876543210",
    email: v.email || "concierge@cloche.com",
    address: v.address || vendor.location,
    experienceYears: v.experienceYears || v.experience_years || "8",
    rentalAvailable: v.rentalAvailable !== undefined ? v.rentalAvailable : true,
    homeTrialAvailable: v.homeTrialAvailable !== undefined ? v.homeTrialAvailable : true,
    homeDeliveryAvailable: v.homeDeliveryAvailable !== undefined ? v.homeDeliveryAvailable : true,
    customJewelleryAvailable: v.customJewelleryAvailable !== undefined ? v.customJewelleryAvailable : true,
    collectionsCount: v.collectionsCount || v.collections_count || "50+ Sets",
    citiesServed: v.citiesServed || v.cities_served || "Kochi, Calicut, Trivandrum",
    storeHighlights: v.storeHighlights || v.store_highlights || ["Verified Partner", "Bridal Specialist", "Rental Available", "Home Delivery"],
    featuredCollections: v.featuredCollections || v.featured_collections || ["Bridal Collection", "Temple Jewellery", "Antique Collection", "Diamond Collection"],
    actionButtons: v.actionButtons || v.action_buttons || { callNow: true, whatsapp: true, bookAppointment: true, viewCollection: true, getQuote: true, visitStore: true },
    workingHours: v.workingHours || v.working_hours || "Mon - Sat: 10:00 AM - 08:00 PM (Weekly Off: Sunday)",
    workingDays: v.workingDays || v.working_days || "Mon - Sat",
    openingTime: v.openingTime || v.opening_time || "10:00 AM",
    closingTime: v.closingTime || v.closing_time || "08:00 PM",
    weeklyOff: v.weeklyOff || v.weekly_off || "Sunday",
    holidayNotice: v.holidayNotice || v.holiday_notice || "Open on festive wedding dates by prior appointment",
    rentalPolicy: v.rentalPolicy || v.rental_policy || "Minimum 2-day rental with valid government ID verification.",
    returnPolicy: v.returnPolicy || v.return_policy || "Return by 05:00 PM on designated date. Late fee applies.",
    cancellationPolicy: v.cancellationPolicy || v.cancellation_policy || "Full refund 7+ days prior to event date.",
    securityDepositPolicy: v.securityDepositPolicy || v.security_deposit_policy || "100% refundable within 24 hours of safe return inspection.",
    damagePolicy: v.damagePolicy || v.damage_policy || "Normal wear & tear accepted. Missing stones/breakage deducted at actuals.",
    stats: [
      { icon: "sparkles", value: "100%", label: "Certified Jewels" },
      { icon: "building", value: "800+", label: "Unique Designs" },
      { icon: "star", value: `${vendor.rating}`, label: "Average Rating" }
    ],
    highlightsTitle: "Jewellery Highlights",
    highlights: (vendor.portfolio || []).map((img, i) => ({
      name: i === 0 ? "Heritage Polki Choker" : i === 1 ? "Temple Gold Set" : "Diamond Solitaire",
      image: img
    }))
  };

  return <VendorProfileLayout vendor={profileData} />;
}
