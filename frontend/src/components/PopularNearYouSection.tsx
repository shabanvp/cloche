"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { 
  Sparkles, 
  ArrowRight, 
  Navigation, 
  ChevronDown, 
  Check, 
  LocateFixed, 
  Loader2,
  SlidersHorizontal
} from "lucide-react";
import { HomepageVendorCard, VendorCardItem } from "@/components/HomepageVendorCard";
import { VendorCardSkeleton } from "@/components/skeletons/VendorCardSkeleton";
import { fetchAuthenticatedUserProfile } from "@/lib/userStore";

interface PopularNearYouSectionProps {
  vendors: VendorCardItem[];
  loading?: boolean;
}

interface GeoCoord {
  lat: number;
  lng: number;
}

interface UserLocation {
  name: string;
  lat: number;
  lng: number;
  isGps: boolean;
}

// Comprehensive coordinates database for Kerala districts and wedding destinations
const KERALA_CITY_COORDINATES: Record<string, GeoCoord> = {
  // Major Districts & Hubs
  "kochi": { lat: 9.9816, lng: 76.2999 },
  "ernakulam": { lat: 9.9816, lng: 76.2999 },
  "thrissur": { lat: 10.5276, lng: 76.2144 },
  "trichur": { lat: 10.5276, lng: 76.2144 },
  "calicut": { lat: 11.2588, lng: 75.7804 },
  "kozhikode": { lat: 11.2588, lng: 75.7804 },
  "trivandrum": { lat: 8.5241, lng: 76.9366 },
  "thiruvananthapuram": { lat: 8.5241, lng: 76.9366 },
  "kottayam": { lat: 9.5916, lng: 76.5222 },
  "malappuram": { lat: 11.0510, lng: 76.0711 },
  "perinthalmanna": { lat: 10.9760, lng: 76.2254 },
  "perithalmanna": { lat: 10.9760, lng: 76.2254 },
  "mannaarkad": { lat: 10.9890, lng: 76.4587 },
  "mannarkkad": { lat: 10.9890, lng: 76.4587 },
  "koppam": { lat: 10.8789, lng: 76.1555 },
  "pattambi": { lat: 10.8066, lng: 76.1963 },
  "nilambur": { lat: 11.2774, lng: 76.2272 },
  "oachira": { lat: 9.1287, lng: 76.5057 },
  "ochira": { lat: 9.1287, lng: 76.5057 },
  "kollam": { lat: 8.8932, lng: 76.6141 },
  "quilon": { lat: 8.8932, lng: 76.6141 },
  "alappuzha": { lat: 9.4981, lng: 76.3388 },
  "alleppey": { lat: 9.4981, lng: 76.3388 },
  "palakkad": { lat: 10.7867, lng: 76.6548 },
  "palghat": { lat: 10.7867, lng: 76.6548 },
  "kannur": { lat: 11.8745, lng: 75.3704 },
  "wayanad": { lat: 11.6050, lng: 76.0820 },
  "kalpetta": { lat: 11.6050, lng: 76.0820 },
  "kasaragod": { lat: 12.4996, lng: 74.9869 },
  "pathanamthitta": { lat: 9.2648, lng: 76.7870 },
  "idukki": { lat: 9.8959, lng: 76.7184 },
  "munnar": { lat: 10.0889, lng: 77.0595 },
  "thodupuzha": { lat: 9.8959, lng: 76.7184 },

  // Common Wedding Towns & Suburbs
  "angamaly": { lat: 10.1960, lng: 76.3860 },
  "aluva": { lat: 10.1076, lng: 76.3516 },
  "edappally": { lat: 10.0236, lng: 76.3116 },
  "kakkanad": { lat: 10.0159, lng: 76.3419 },
  "panampilly nagar": { lat: 9.9657, lng: 76.2990 },
  "maradu": { lat: 9.9328, lng: 76.3314 },
  "tripunithura": { lat: 9.9490, lng: 76.3486 },
  "fort kochi": { lat: 9.9658, lng: 76.2426 },
  "changanassery": { lat: 9.4447, lng: 76.5447 },
  "pala": { lat: 9.7118, lng: 76.6836 },
  "tirur": { lat: 10.9146, lng: 75.9228 },
  "manjeri": { lat: 11.1215, lng: 76.1213 },
  "kottakkal": { lat: 11.0003, lng: 75.9982 },
  "ponnani": { lat: 10.7672, lng: 75.9254 },
  "guruvayur": { lat: 10.5946, lng: 76.0416 },
  "chalakudy": { lat: 10.3070, lng: 76.3333 },
  "irinjalakuda": { lat: 10.3427, lng: 76.2030 },
  "kunnamkulam": { lat: 10.6517, lng: 76.0747 },
  "kayamkulam": { lat: 9.1724, lng: 76.5013 },
  "karunagappally": { lat: 9.0560, lng: 76.5332 },
  "cherthala": { lat: 9.6844, lng: 76.3317 },
  "varkala": { lat: 8.7379, lng: 76.7163 },
  "attingal": { lat: 8.6961, lng: 76.8143 },
  "thalassery": { lat: 11.7491, lng: 75.4890 },
  "payyanur": { lat: 12.1026, lng: 75.2046 },
};

function getCityCoordinates(city: string): GeoCoord | null {
  const normalizedCity = city.toLowerCase().trim();
  if (!normalizedCity) return null;

  for (const [key, coords] of Object.entries(KERALA_CITY_COORDINATES)) {
    if (normalizedCity.includes(key)) return coords;
  }
  return null;
}

// Preset Kerala destination options for quick switching
const KERALA_LOCATION_PRESETS = [
  { name: "Kochi / Ernakulam", cityKey: "kochi", lat: 9.9816, lng: 76.2999 },
  { name: "Thrissur", cityKey: "thrissur", lat: 10.5276, lng: 76.2144 },
  { name: "Kozhikode / Calicut", cityKey: "calicut", lat: 11.2588, lng: 75.7804 },
  { name: "Thiruvananthapuram", cityKey: "trivandrum", lat: 8.5241, lng: 76.9366 },
  { name: "Kottayam", cityKey: "kottayam", lat: 9.5916, lng: 76.5222 },
  { name: "Malappuram / Perinthalmanna", cityKey: "perinthalmanna", lat: 10.9760, lng: 76.2254 },
  { name: "Kollam / Oachira", cityKey: "oachira", lat: 9.1287, lng: 76.5057 },
  { name: "Alappuzha", cityKey: "alappuzha", lat: 9.4981, lng: 76.3388 },
  { name: "Palakkad", cityKey: "palakkad", lat: 10.7867, lng: 76.6548 },
  { name: "Kannur", cityKey: "kannur", lat: 11.8745, lng: 75.3704 },
];

// Distance filter tabs in kilometres
const DISTANCE_FILTERS = [
  { key: "15", label: "Within 15 km", maxKm: 15 },
  { key: "30", label: "Within 30 km", maxKm: 30 },
  { key: "50", label: "Within 50 km", maxKm: 50 },
  { key: "100", label: "Within 100 km", maxKm: 100 },
  { key: "all", label: "All Kerala", maxKm: Infinity },
];

// Helper: Haversine distance formula
function calculateHaversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const dist = R * c;
  return dist < 10 ? Math.round(dist * 10) / 10 : Math.round(dist);
}

// Helper: Resolve coordinates for a vendor
function getVendorCoordinates(vendor: VendorCardItem): GeoCoord | null {
  return getCityCoordinates(vendor.city || "");
}

// Helper: Identify closest Kerala hub for GPS coords
function findClosestKeralaHubName(lat: number, lng: number): string {
  let closestName = "Kerala";
  let minDistance = Infinity;

  for (const preset of KERALA_LOCATION_PRESETS) {
    const d = calculateHaversineKm(lat, lng, preset.lat, preset.lng);
    if (d < minDistance) {
      minDistance = d;
      closestName = preset.name.split("/")[0].trim();
    }
  }

  return minDistance <= 35 ? closestName : "Current Location";
}

export function PopularNearYouSection({
  vendors,
  loading = false,
}: PopularNearYouSectionProps) {
  // Kilometre-based filter selection (defaulting to 50 km or all)
  const [selectedRadiusKey, setSelectedRadiusKey] = useState<string>("50");

  // User location state
  const [userLocation, setUserLocation] = useState<UserLocation>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("cloche_user_location_v1");
        if (saved) {
          return JSON.parse(saved);
        }
      } catch (e) {}
    }
    return {
      name: "Kochi",
      lat: 9.9816,
      lng: 76.2999,
      isGps: false,
    };
  });

  const [isLocating, setIsLocating] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [locationMessage, setLocationMessage] = useState<string | null>(null);
  const locationMenuRef = useRef<HTMLDivElement>(null);

  // Close location menu on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (locationMenuRef.current && !locationMenuRef.current.contains(event.target as Node)) {
        setIsLocationMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Request browser GPS position
  const detectUserGpsLocation = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      setLocationMessage("Geolocation is not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationMessage("Allow location access to find vendors near you…");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const closestHub = findClosestKeralaHubName(latitude, longitude);
        const newLocation: UserLocation = {
          name: closestHub,
          lat: latitude,
          lng: longitude,
          isGps: true,
        };

        setUserLocation(newLocation);
        setIsLocating(false);
        setIsLocationMenuOpen(false);
        setLocationMessage(null);

        try {
          localStorage.setItem("cloche_user_location_v1", JSON.stringify(newLocation));
        } catch (e) {}
      },
      (error) => {
        setIsLocating(false);
        console.warn("Geolocation permission error:", error.message);
        setLocationMessage("Could not retrieve GPS location. Selected Kochi as default.");
        setTimeout(() => setLocationMessage(null), 4000);
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 300000 }
    );
  };

  // Prefer a previously selected location, then the signed-in profile city;
  // ask the browser for location access when neither is available.
  useEffect(() => {
    let isActive = true;

    async function initializeUserLocation() {
      try {
        const saved = localStorage.getItem("cloche_user_location_v1");
        const parsed = saved ? JSON.parse(saved) : null;
        if (
          parsed &&
          typeof parsed.name === "string" &&
          Number.isFinite(parsed.lat) &&
          Number.isFinite(parsed.lng)
        ) {
          if (isActive) setUserLocation(parsed);
          return;
        }
      } catch {}

      try {
        const profile = await fetchAuthenticatedUserProfile();
        if (!isActive) return;

        const profileCity = profile?.city || localStorage.getItem("userCity") || "";
        const coords = getCityCoordinates(profileCity);
        if (profileCity && coords) {
          const profileLocation: UserLocation = {
            name: profileCity.trim(),
            ...coords,
            isGps: false,
          };
          setUserLocation(profileLocation);
          localStorage.setItem("cloche_user_location_v1", JSON.stringify(profileLocation));
          return;
        }
      } catch {}

      if (isActive) detectUserGpsLocation();
    }

    initializeUserLocation();
    return () => {
      isActive = false;
    };
  // Location is initialized once when this homepage section mounts.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Change location preset manually
  const handleSelectPreset = (preset: typeof KERALA_LOCATION_PRESETS[0]) => {
    const newLocation: UserLocation = {
      name: preset.name.split("/")[0].trim(),
      lat: preset.lat,
      lng: preset.lng,
      isGps: false,
    };
    setUserLocation(newLocation);
    setIsLocationMenuOpen(false);
    setLocationMessage(null);

    try {
      localStorage.setItem("cloche_user_location_v1", JSON.stringify(newLocation));
    } catch (e) {}
  };

  // Calculate kilometre distance for every vendor relative to the user's location
  const vendorsWithDistance = useMemo(() => {
    if (!Array.isArray(vendors) || vendors.length === 0) return [];

    return vendors.map((vendor) => {
      const coords = getVendorCoordinates(vendor);
      const distanceKm = coords
        ? calculateHaversineKm(userLocation.lat, userLocation.lng, coords.lat, coords.lng)
        : undefined;

      return {
        ...vendor,
        distanceKm,
      };
    });
  }, [vendors, userLocation]);

  // Filter and sort vendors by kilometre radius (closest first)
  const { filteredVendors, currentFilter, hasRadiusMatches } = useMemo(() => {
    const filter = DISTANCE_FILTERS.find((f) => f.key === selectedRadiusKey) || DISTANCE_FILTERS[2];
    
    // Sort vendors by distance (ascending)
    const sorted = [...vendorsWithDistance].sort(
      (a, b) => (a.distanceKm ?? Infinity) - (b.distanceKm ?? Infinity)
    );

    if (filter.maxKm === Infinity) {
      return {
        filteredVendors: sorted,
        currentFilter: filter,
        hasRadiusMatches: sorted.length > 0,
      };
    }

    const matches = sorted.filter((v) => v.distanceKm !== undefined && v.distanceKm <= filter.maxKm);
    const hasMatches = matches.length > 0;

    return {
      filteredVendors: matches,
      currentFilter: filter,
      hasRadiusMatches: hasMatches,
    };
  }, [vendorsWithDistance, selectedRadiusKey]);

  return (
    <section className="pt-3 pb-6 md:pt-4 md:pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-3 md:mb-4">
          <div className="space-y-1.5">
            {/* User location selector */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Dynamic User Location Picker */}
              <div className="relative" ref={locationMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLocationMenuOpen((prev) => !prev)}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF9F6] border border-[#064E43]/20 hover:border-[#064E43] text-[#064E43] text-xs font-semibold shadow-2xs transition-all cursor-pointer group"
                  title="Change your current location"
                >
                  <Navigation className="w-3 h-3 text-[#C6A568] group-hover:scale-110 transition-transform" />
                  <span>Near: <strong>{userLocation.name}</strong></span>
                  {userLocation.isGps && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" title="Live GPS Active" />
                  )}
                  <ChevronDown className={`w-3.5 h-3.5 text-charcoal/40 transition-transform ${isLocationMenuOpen ? "rotate-180" : ""}`} />
                </button>

                {/* Location Selection Dropdown */}
                {isLocationMenuOpen && (
                  <div className="absolute left-0 top-full mt-1.5 w-64 bg-white rounded-2xl shadow-xl border border-[#C6A568]/25 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="p-2 border-b border-black/5 flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#C6A568]">
                        Your Location
                      </span>
                      <button
                        type="button"
                        onClick={detectUserGpsLocation}
                        disabled={isLocating}
                        className="text-[11px] font-bold text-[#064E43] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        {isLocating ? (
                          <>
                            <Loader2 className="w-3 h-3 animate-spin text-[#C6A568]" />
                            <span>Locating...</span>
                          </>
                        ) : (
                          <>
                            <LocateFixed className="w-3 h-3 text-[#C6A568]" />
                            <span>Use Live GPS</span>
                          </>
                        )}
                      </button>
                    </div>

                    <div className="max-h-56 overflow-y-auto py-1 space-y-0.5 hide-scrollbar">
                      {KERALA_LOCATION_PRESETS.map((preset) => {
                        const isCurrent = userLocation.name.toLowerCase().includes(preset.cityKey);
                        return (
                          <button
                            key={preset.cityKey}
                            type="button"
                            onClick={() => handleSelectPreset(preset)}
                            className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors cursor-pointer ${
                              isCurrent
                                ? "bg-[#064E43]/10 text-[#064E43] font-bold"
                                : "text-charcoal/80 hover:bg-[#FAF9F6] hover:text-[#064E43]"
                            }`}
                          >
                            <span>{preset.name}</span>
                            {isCurrent && <Check className="w-3.5 h-3.5 text-[#064E43]" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold font-serif text-[#242321]">
              Popular Near You
            </h2>
            {locationMessage && (
              <p role="status" className="text-xs text-[#064E43]/75">
                {locationMessage}
              </p>
            )}
          </div>

          {/* Right Header Navigation Link */}
          <Link
            href={`/boutiques?search=${encodeURIComponent(userLocation.name)}`}
            className="hidden md:inline-flex items-center gap-1 text-sm font-bold text-[#064E43] hover:text-[#C6A568] transition-colors"
          >
            <span>
              {currentFilter.maxKm === Infinity 
                ? "Explore all across Kerala" 
                : `Explore all ${currentFilter.label.toLowerCase()}`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Kilometre-based Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1 mb-4">
          {DISTANCE_FILTERS.map((filter) => {
            const isSelected = selectedRadiusKey === filter.key;
            return (
              <button
                key={filter.key}
                type="button"
                onClick={() => setSelectedRadiusKey(filter.key)}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 cursor-pointer border ${
                  isSelected
                    ? "bg-[#064E43] text-white border-[#064E43] shadow-xs"
                    : "bg-white text-[#242321]/70 border-[#C6A568]/20 hover:border-[#064E43] hover:text-[#064E43] shadow-2xs"
                }`}
              >
                {filter.label}
              </button>
            );
          })}
        </div>

        {/* Notification when radius has no exact matches */}
        {!hasRadiusMatches && currentFilter.maxKm !== Infinity && (
          <div className="mb-4 p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-amber-900 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <span>
                No vendors with a known location were found {currentFilter.label.toLowerCase()} of {userLocation.name}. Expand the distance or choose All Kerala.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setSelectedRadiusKey("all")}
              className="text-[#064E43] font-bold hover:underline shrink-0 text-[11px]"
            >
              Show All Kerala
            </button>
          </div>
        )}

        {/* Vendor Content */}
        {loading ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {[1, 2, 3, 4].map((i) => (
              <VendorCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredVendors.length > 0 ? (
          <div className="flex overflow-x-auto hide-scrollbar snap-x snap-mandatory gap-4 md:grid md:grid-cols-4 md:gap-6 md:overflow-visible pb-2">
            {filteredVendors.map((vendor) => (
              <HomepageVendorCard 
                key={vendor.id} 
                vendor={vendor} 
                distanceKm={vendor.distanceKm}
              />
            ))}
          </div>
        ) : (
          /* Graceful empty state */
          <div className="p-8 sm:p-10 rounded-2xl bg-white border border-[#C6A568]/20 text-center max-w-lg mx-auto space-y-3">
            <div className="w-12 h-12 rounded-full bg-[#FAF9F6] border border-[#C6A568]/30 flex items-center justify-center mx-auto text-[#064E43] shadow-xs">
              <Sparkles className="w-6 h-6 text-[#C6A568]" />
            </div>
            <div className="space-y-1">
              <h3 className="font-serif font-bold text-base text-[#242321]">
                No verified vendors within {currentFilter.label.toLowerCase()} yet
              </h3>
              <p className="text-xs text-[#242321]/60 leading-relaxed">
                We are continually onboarding wedding vendors across Kerala. You can expand your search distance to see top artisans in adjacent districts.
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => setSelectedRadiusKey("all")}
                className="px-4 py-2 rounded-full bg-[#064E43] text-white text-xs font-bold hover:bg-[#085C50] transition-colors shadow-2xs cursor-pointer"
              >
                Show All Kerala Vendors
              </button>
              <Link
                href="/boutiques"
                className="px-4 py-2 rounded-full bg-white border border-[#C6A568]/30 text-[#064E43] text-xs font-bold hover:bg-[#FAF9F6] transition-colors"
              >
                Browse Full Directory
              </Link>
            </div>
          </div>
        )}

        {/* Mobile View All Footer Link */}
        <div className="mt-6 text-center md:hidden">
          <Link
            href={`/boutiques?search=${encodeURIComponent(userLocation.name)}`}
            className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-white border border-[#C6A568]/20 text-[#064E43] font-bold text-xs"
          >
            <span>
              {currentFilter.maxKm === Infinity 
                ? "View All Across Kerala" 
                : `View All ${currentFilter.label}`}
            </span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

      </div>
    </section>
  );
}
