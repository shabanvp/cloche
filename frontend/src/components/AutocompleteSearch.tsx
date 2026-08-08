"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Loader2, ChevronRight, Store, MapPin, Sparkles, Building2, Camera, ArrowRight, AlertCircle } from "lucide-react";

interface SearchResultItem {
  id: string | number;
  name: string;
  category: string;
  city: string;
  logo: string;
  href: string;
}

interface GroupedResults {
  [key: string]: SearchResultItem[];
}

const POPULAR_QUICK_SEARCHES = [
  { label: "Photographers", query: "Photographer" },
  { label: "Venues", query: "Venue" },
  { label: "Makeup Artists", query: "Makeup" },
  { label: "Bridal Wear", query: "Bridal" },
  { label: "Catering", query: "Catering" },
];

function resolveDetailHref(id: string | number, category: string): string {
  const cat = (category || "").toLowerCase();
  const idStr = String(id);
  if (cat.includes("venue")) return `/venues/${idStr}`;
  if (cat.includes("photo")) return `/photographers/${idStr}`;
  if (cat.includes("makeup")) return `/makeup-artists/${idStr}`;
  if (cat.includes("decor") || cat.includes("planner")) return `/decor-planning/${idStr}`;
  if (cat.includes("cater")) return `/catering/${idStr}`;
  if (cat.includes("jewel")) return `/jewellery/${idStr}`;
  if (cat.includes("invitat")) return `/invitations/${idStr}`;
  if (cat.includes("mehendi")) return `/mehendi-artists/${idStr}`;
  if (cat.includes("bridal")) return `/bridal-wear/${idStr}`;
  if (cat.includes("groom")) return `/groom-wear/${idStr}`;
  return `/boutiques/${idStr}`;
}

interface AutocompleteSearchProps {
  placeholder?: string;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

export function AutocompleteSearch({
  placeholder = "Search for vendors, venues, or boutiques...",
  className = "",
  inputClassName = "",
  autoFocus = false,
}: AutocompleteSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [groupedResults, setGroupedResults] = useState<GroupedResults>({});
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Search API fetch with 250ms debounce
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setResults([]);
      setGroupedResults({});
      setHasError(false);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/v1/search/autocomplete?q=${encodeURIComponent(trimmed)}`);
        let apiResults: SearchResultItem[] = [];

        if (!res.ok) {
          setHasError(true);
        } else {
          const data = await res.json();
          if (data.success && Array.isArray(data.results)) {
            apiResults = data.results;
          } else if (data.success === false) {
            setHasError(true);
          }
        }

        // Merge local storage registered vendors
        const localList: SearchResultItem[] = [];
        if (typeof window !== "undefined") {
          try {
            const rawVendors = localStorage.getItem("cloche_registered_vendors");
            const rawBoutiques = localStorage.getItem("cloche_registered_boutiques");
            const rawUserData = localStorage.getItem("cloche_user_data");
            const combinedRaw: any[] = [];
            if (rawUserData) combinedRaw.push(JSON.parse(rawUserData));
            if (rawVendors) combinedRaw.push(...JSON.parse(rawVendors));
            if (rawBoutiques) combinedRaw.push(...JSON.parse(rawBoutiques));

            combinedRaw.forEach((item, idx) => {
              const name = (item.boutique_name || item.name || item.businessName || "").trim();
              const category = item.category || item.tags || "Bridal Wear";
              const city = item.city || item.district || item.location || "Kochi";
              const logo = item.logo_url || item.logo || item.profile_logo || item.image || "";

              if (name) {
                const nameLower = name.toLowerCase();
                const catLower = category.toLowerCase();
                const cityLower = city.toLowerCase();

                if (nameLower.includes(trimmed) || catLower.includes(trimmed) || cityLower.includes(trimmed)) {
                  localList.push({
                    id: item.id || item.slug || `local-${idx}`,
                    name: name,
                    category: category,
                    city: city,
                    logo: logo,
                    href: resolveDetailHref(item.id || item.slug || `local-${idx}`, category),
                  });
                }
              }
            });
          } catch (e) {}
        }

        // Deduplicate and rank combined items
        const mergedMap = new Map<string, SearchResultItem>();
        [...apiResults, ...localList].forEach((item) => {
          const key = String(item.id || item.name).toLowerCase();
          if (!mergedMap.has(key)) {
            mergedMap.set(key, item);
          }
        });

        const finalResults = Array.from(mergedMap.values()).slice(0, 8);

        // Group final items
        const groups: GroupedResults = {
          Venues: [],
          Boutiques: [],
          "Vendors & Studios": [],
        };

        finalResults.forEach((item) => {
          const catLower = item.category.toLowerCase();
          if (catLower.includes("venue")) {
            groups.Venues.push(item);
          } else if (
            catLower.includes("boutique") ||
            catLower.includes("bridal") ||
            catLower.includes("groom") ||
            catLower.includes("jewel") ||
            catLower.includes("store") ||
            catLower.includes("wear")
          ) {
            groups.Boutiques.push(item);
          } else {
            groups["Vendors & Studios"].push(item);
          }
        });

        Object.keys(groups).forEach((key) => {
          if (!groups[key] || groups[key].length === 0) delete groups[key];
        });

        setResults(finalResults);
        setGroupedResults(groups);
        setSelectedIndex(-1);
      } catch (err) {
        console.error("Autocomplete search error:", err);
        setHasError(true);
      } finally {
        setIsLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectResult = useCallback(
    (item: SearchResultItem) => {
      setIsOpen(false);
      setQuery("");
      router.push(item.href);
    },
    [router]
  );

  const handleSeeAllResults = useCallback(() => {
    if (!query.trim()) return;
    setIsOpen(false);
    router.push(`/vendors?search=${encodeURIComponent(query.trim())}`);
  }, [query, router]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Escape") {
      setIsOpen(false);
      inputRef.current?.blur();
      return;
    }

    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        setIsOpen(true);
      }
      return;
    }

    if (results.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleSelectResult(results[selectedIndex]);
        } else {
          handleSeeAllResults();
        }
      }
    } else if (e.key === "Enter") {
      e.preventDefault();
      handleSeeAllResults();
    }
  };

  let globalItemCounter = -1;

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Field Container */}
      <div className="relative flex items-center w-full">
        <Search className="absolute left-4 w-5 h-5 text-charcoal/40 pointer-events-none" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`w-full bg-white border border-gold/20 rounded-2xl pl-12 pr-10 py-3.5 text-sm sm:text-base text-charcoal placeholder:text-charcoal/40 focus:outline-none focus:border-[#0F4C45] focus:ring-2 focus:ring-[#0F4C45]/15 shadow-xs transition-all ${inputClassName}`}
        />

        {/* Loading Spinner */}
        {isLoading && (
          <div className="absolute right-4 flex items-center justify-center">
            <Loader2 className="w-5 h-5 text-[#0F4C45] animate-spin" />
          </div>
        )}
      </div>

      {/* Floating Autocomplete Suggestions Panel */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-2xl shadow-2xl border border-gold/20 overflow-hidden backdrop-blur-xl transition-all duration-200">
          {/* Active Search Results */}
          {query.trim().length > 0 ? (
            <div className="py-2">
              {isLoading && results.length === 0 ? (
                <div className="px-5 py-6 text-center text-xs sm:text-sm text-charcoal/60 flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-[#0F4C45] animate-spin" />
                  Searching Cloche marketplace...
                </div>
              ) : hasError ? (
                <div className="px-6 py-6 text-center text-xs sm:text-sm text-amber-700 flex flex-col items-center justify-center gap-1.5">
                  <AlertCircle className="w-5 h-5 text-amber-600" />
                  <span className="font-bold">Something went wrong, please try again.</span>
                </div>
              ) : results.length > 0 ? (
                <div className="max-h-[420px] overflow-y-auto divide-y divide-gold/10">
                  {Object.entries(groupedResults).map(([groupTitle, items]) => {
                    if (!Array.isArray(items) || items.length === 0) return null;

                    return (
                      <div key={groupTitle} className="py-1">
                        {/* Group Section Header */}
                        <div className="px-4 py-1.5 text-[11px] font-bold tracking-wider text-[#0F4C45] uppercase bg-[#FAF7F2] flex items-center gap-1.5">
                          {groupTitle === "Venues" ? (
                            <Building2 className="w-3.5 h-3.5 text-[#0F4C45]" />
                          ) : groupTitle === "Boutiques" ? (
                            <Store className="w-3.5 h-3.5 text-[#0F4C45]" />
                          ) : (
                            <Camera className="w-3.5 h-3.5 text-[#0F4C45]" />
                          )}
                          {groupTitle} ({items.length})
                        </div>

                        {/* Group Items */}
                        {items.map((item) => {
                          globalItemCounter += 1;
                          const currentIndex = globalItemCounter;
                          const isHighlighted = currentIndex === selectedIndex;

                          return (
                            <div
                              key={item.id}
                              onClick={() => handleSelectResult(item)}
                              onMouseEnter={() => setSelectedIndex(currentIndex)}
                              className={`flex items-center gap-3.5 px-4 py-3 cursor-pointer transition-colors ${
                                isHighlighted ? "bg-[#FAF7F2]" : "hover:bg-[#FAF7F2]/60"
                              }`}
                            >
                              {/* Thumbnail Image / Logo */}
                              <div className="w-11 h-11 rounded-xl bg-[#0F4C45] shrink-0 border border-gold/15 relative overflow-hidden flex items-center justify-center shadow-2xs">
                                {item.logo ? (
                                  <img
                                    src={item.logo}
                                    alt={item.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLElement;
                                      target.style.display = "none";
                                      if (target.parentElement) {
                                        const fallback = target.parentElement.querySelector(".fallback-avatar");
                                        if (fallback) (fallback as HTMLElement).style.display = "flex";
                                      }
                                    }}
                                  />
                                ) : null}
                                <span
                                  className="fallback-avatar font-serif font-bold text-white text-base flex items-center justify-center"
                                  style={{ display: item.logo ? "none" : "flex" }}
                                >
                                  {item.name.charAt(0).toUpperCase()}
                                </span>
                              </div>

                              {/* Entity Details */}
                              <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm text-charcoal truncate flex items-center gap-1.5">
                                  {item.name}
                                </h4>
                                <p className="text-xs text-charcoal/60 truncate flex items-center gap-1 mt-0.5">
                                  <span>{item.category}</span>
                                  <span className="text-gold">•</span>
                                  <MapPin className="w-3 h-3 text-gold shrink-0" />
                                  <span>{item.city}</span>
                                </p>
                              </div>

                              <ChevronRight className="w-4 h-4 text-charcoal/30 shrink-0" />
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}

                  {/* See All Results Link */}
                  <div
                    onClick={handleSeeAllResults}
                    className="px-4 py-3 bg-[#FAF7F2] hover:bg-gold/15 cursor-pointer text-xs font-bold text-[#0F4C45] flex items-center justify-between transition-colors border-t border-gold/15"
                  >
                    <span>See all results for "{query.trim()}"</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              ) : (
                <div className="px-6 py-8 text-center space-y-1.5">
                  <p className="font-bold text-sm text-charcoal">
                    No results found for "{query.trim()}"
                  </p>
                  <p className="text-xs text-charcoal/60">
                    Try searching for a different vendor, venue, or boutique name.
                  </p>
                </div>
              )}
            </div>
          ) : (
            /* Empty Query Quick Category Discovery */
            <div className="p-4 space-y-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-charcoal/60 uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                Popular Quick Searches
              </div>
              <div className="flex flex-wrap gap-2">
                {POPULAR_QUICK_SEARCHES.map((searchItem) => (
                  <button
                    key={searchItem.label}
                    type="button"
                    onClick={() => setQuery(searchItem.query)}
                    className="px-3.5 py-1.5 bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white rounded-full text-xs font-bold text-charcoal/80 transition-all border border-gold/15"
                  >
                    {searchItem.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
