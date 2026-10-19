"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Bookmark, Share2, X, Plus, Check,
  Download, FolderPlus, ExternalLink, CheckCircle2,
  AlertCircle, ChevronRight, ChevronLeft, Wand2, DollarSign, Palette,
  MapPin, ShieldCheck, Copy, CheckSquare, RefreshCw,
  Flame, Clock, ArrowUpDown, Heart
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuraAssistantDrawer } from "@/components/AuraAssistantDrawer";
import {
  INSPIRATION_CATEGORIES,
  STATIC_COLOR_THEMES,
  AURA_INSPIRATION_PROMPTS,
  CATEGORY_VENDOR_LINKS,
  DEFAULT_BOARDS,
  MOODBOARD_OPTIONS,
  generateAIMoodBoard,
  getInspirationPlanningProfile,
  DynamicInspirationPhoto,
  StaticColorTheme,
  InspirationItem,
  AIMoodBoardResult,
  isStaticColorTheme,
  ColorSwatch,
  InspirationCategory,
} from "@/lib/inspirationData";
import {
  toggleSaveInspiration,
  isItemSavedInspiration,
  getSavedInspirations,
  SavedInspirationItem,
} from "@/lib/inspirationStore";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Board { id: string; name: string; createdAt: number }
interface FetchState {
  photos: DynamicInspirationPhoto[];
  loading: boolean;
  error: string | null;
  noApiKey: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// ASPECT RATIO HELPER
// ─────────────────────────────────────────────────────────────────────────────
function getAspectClass(w: number, h: number) {
  const r = h / w;
  if (r >= 1.6) return "aspect-[9/16]";
  if (r >= 1.2) return "aspect-[3/4]";
  if (r >= 0.9) return "aspect-[1/1]";
  return "aspect-[4/3]";
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard({ idx }: { idx: number }) {
  const heights = ["h-64 md:h-72", "h-48 md:h-56", "h-72 md:h-84", "h-52 md:h-60", "h-68 md:h-76", "h-56 md:h-64"];
  return (
    <div className={`break-inside-avoid rounded-[18px] md:rounded-3xl bg-white border border-gold/10 ${heights[idx % 6]} mb-2.5 md:mb-5 animate-pulse relative overflow-hidden shadow-xs`}>
      <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200" />
      <div className="hidden md:block absolute top-3 left-3 w-16 h-4 bg-white/60 rounded-full" />
      <div className="hidden md:block absolute bottom-3 left-3 right-3 space-y-2">
        <div className="h-3 bg-white/70 rounded-full w-2/3" />
        <div className="h-2 bg-white/50 rounded-full w-1/3" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC PHOTO CARD
// ─────────────────────────────────────────────────────────────────────────────
function PhotoCard({
  item,
  liked,
  onClick,
  onLike,
}: {
  item: DynamicInspirationPhoto;
  liked: boolean;
  onClick: () => void;
  onLike: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const aspectClass = getAspectClass(item.width, item.height);

  return (
    <div
      onClick={onClick}
      className="break-inside-avoid mb-2.5 sm:mb-4 md:mb-5 relative group cursor-pointer select-none active:scale-[0.98] transition-transform duration-200"
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 ${aspectClass} shadow-xs hover:shadow-xl transition-all duration-300 ease-out border border-gold/10 md:group-hover:-translate-y-1`}
      >
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        )}
        <img
          src={item.src.large}
          alt={item.alt || item.category || "Wedding Inspiration"}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 ease-out md:group-hover:scale-105 ${
            imgLoaded ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Like Button */}
        <button
          type="button"
          onClick={onLike}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center justify-center min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] active:scale-90 z-10 ${
            liked
              ? "bg-white text-rose-500 opacity-100 border border-rose-200 shadow-rose-500/20 shadow-md"
              : "bg-black/45 hover:bg-white text-white hover:text-rose-500 border border-white/20 sm:opacity-0 group-hover:opacity-100 opacity-90"
          }`}
          title={liked ? "Liked" : "Like"}
          aria-label={liked ? "Unlike inspiration" : "Like inspiration"}
        >
          <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${liked ? "fill-rose-500 text-rose-500 scale-110" : "stroke-[2]"}`} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC COLOR THEME CARD
// ─────────────────────────────────────────────────────────────────────────────
function ColorThemeCard({
  item,
  liked,
  onClick,
  onLike,
}: {
  item: StaticColorTheme;
  liked: boolean;
  onClick: () => void;
  onLike: (e: React.MouseEvent) => void;
  onShare?: (e: React.MouseEvent) => void;
}) {
  const aspectMap = {
    tall: "aspect-[9/16]",
    portrait: "aspect-[3/4]",
    square: "aspect-[1/1]",
    landscape: "aspect-[4/3]",
  };

  return (
    <div
      onClick={onClick}
      className="break-inside-avoid mb-2.5 sm:mb-4 md:mb-5 relative group cursor-pointer select-none active:scale-[0.98] transition-transform duration-200"
    >
      <div
        className={`relative w-full overflow-hidden rounded-2xl md:rounded-3xl bg-gray-100 ${aspectMap[item.aspectRatio]} shadow-xs hover:shadow-xl transition-all duration-300 ease-out border border-gold/10 md:group-hover:-translate-y-1`}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover md:group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Like Button */}
        <button
          type="button"
          onClick={onLike}
          className={`absolute top-2.5 right-2.5 sm:top-3 sm:right-3 p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md flex items-center justify-center min-w-[34px] min-h-[34px] sm:min-w-[38px] sm:min-h-[38px] active:scale-90 z-10 ${
            liked
              ? "bg-white text-rose-500 opacity-100 border border-rose-200 shadow-rose-500/20 shadow-md"
              : "bg-black/45 hover:bg-white text-white hover:text-rose-500 border border-white/20 sm:opacity-0 group-hover:opacity-100 opacity-90"
          }`}
          title={liked ? "Liked" : "Like"}
          aria-label={liked ? "Unlike inspiration" : "Like inspiration"}
        >
          <Heart className={`w-4 h-4 sm:w-4.5 sm:h-4.5 transition-transform ${liked ? "fill-rose-500 text-rose-500 scale-110" : "stroke-[2]"}`} />
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INSPIRATION CLIENT COMPONENT (COMPACT WEDMEGOOD-STYLE HEADER)
// ─────────────────────────────────────────────────────────────────────────────
export function InspirationClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"trending" | "latest">("trending");
  const [budgetFilter, setBudgetFilter] = useState<"all" | "budget" | "mid" | "luxury">("all");
  const [activeTab, setActiveTab] = useState<"explore" | "saved">("explore");
  const [activeBoardId, setActiveBoardId] = useState("all");

  // Detail Lightbox
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);

  // Aura Drawer
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [auraInitialQuery, setAuraInitialQuery] = useState("");

  // AI Mood Board Generator Modal State
  const [isMoodBoardOpen, setIsMoodBoardOpen] = useState(false);
  const [moodBoardInput, setMoodBoardInput] = useState({
    weddingType: "kerala-hindu",
    colorTheme: "emerald-gold",
    budgetTier: "grand",
    venueSetting: "backwater-lawn",
  });
  const [generatedMoodBoard, setGeneratedMoodBoard] = useState<AIMoodBoardResult | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Boards
  const [itemToSave, setItemToSave] = useState<InspirationItem | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);
  const [boards, setBoards] = useState<Board[]>(
    DEFAULT_BOARDS.map((b, i) => ({ ...b, createdAt: Date.now() - i * 1000 }))
  );
  const [savedMap, setSavedMap] = useState<Record<string, string[]>>({});

  // Dynamic Pexels Photos Cache & Fetch
  const photoCache = useRef<Record<string, DynamicInspirationPhoto[]>>({});
  const [fetchState, setFetchState] = useState<FetchState>({
    photos: [],
    loading: false,
    error: null,
    noApiKey: false,
  });

  // Load Saved data from LocalStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const b = localStorage.getItem("cloche_insp_boards_v3");
      if (b) {
        const parsed = JSON.parse(b);
        if (Array.isArray(parsed) && parsed.length > 0) setBoards(parsed);
      }
      const s = localStorage.getItem("cloche_insp_saves_v3");
      if (s) {
        const parsed = JSON.parse(s);
        if (typeof parsed === "object") setSavedMap(parsed);
      }
      const rv = localStorage.getItem("cloche_insp_recent_v3");
      if (rv) setRecentlyViewed(JSON.parse(rv).slice(0, 8));
    } catch {}
  }, []);

  const persist = (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };

  const saveBoards = (v: Board[]) => {
    setBoards(v);
    persist("cloche_insp_boards_v3", v);
  };

  const saveSaves = (v: Record<string, string[]>) => {
    setSavedMap(v);
    persist("cloche_insp_saves_v3", v);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  const convertToSavedItem = (item: InspirationItem): SavedInspirationItem => {
    if (isStaticColorTheme(item)) {
      return {
        id: String(item.id),
        title: item.title,
        category: item.category || "Color Theme",
        image: item.image,
      };
    }
    const profile = getInspirationPlanningProfile(item);
    return {
      id: String(item.id),
      title: profile.styleName || item.alt || `${item.category} Concept`,
      category: item.category || "Inspiration",
      image: item.src?.large || item.src?.medium || item.src?.large2x || "",
    };
  };

  // Synchronized Saved/Liked Inspirations Store (Single Source of Truth)
  const [savedInspirations, setSavedInspirations] = useState<SavedInspirationItem[]>([]);

  useEffect(() => {
    const syncInspirations = () => {
      const items = getSavedInspirations();
      setSavedInspirations(items);
      const map: Record<string, string[]> = {};
      items.forEach((item) => {
        map[String(item.id)] = ["dream-wedding"];
      });
      setSavedMap(map);
    };
    syncInspirations();
    window.addEventListener("cloche_saved_inspirations_updated", syncInspirations);
    return () => {
      window.removeEventListener("cloche_saved_inspirations_updated", syncInspirations);
    };
  }, []);

  const isItemLiked = useCallback(
    (id: string | number) => {
      const targetId = String(id);
      return savedInspirations.some((i) => String(i.id) === targetId);
    },
    [savedInspirations]
  );

  const isItemSaved = isItemLiked; // Alias for backward compatibility

  const handleLikeInspiration = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const savedItem = convertToSavedItem(item);
    const nowSaved = toggleSaveInspiration(savedItem);
    const id = String(item.id);
    const firstBoardId = boards[0]?.id || "dream-wedding";
    let nextMap = { ...savedMap };
    if (!nowSaved) {
      delete nextMap[id];
      showToast("Removed from your saved inspirations");
    } else {
      nextMap[id] = [firstBoardId];
      showToast("Liked and added to your Saved Inspirations! ❤️");
    }
    saveSaves(nextMap);
    setSavedInspirations(getSavedInspirations());
  };

  const handleSaveInspiration = handleLikeInspiration;
  const handleQuickSave = handleLikeInspiration;

  const handleToggleBoardSave = (boardId: string) => {
    if (!itemToSave) return;
    const id = itemToSave.id;
    const curr = savedMap[id] || [];
    const next = curr.includes(boardId) ? curr.filter((b) => b !== boardId) : [...curr, boardId];
    const updated = { ...savedMap };
    if (next.length === 0) delete updated[id]; else updated[id] = next;
    saveSaves(updated);
  };

  const handleCreateBoard = () => {
    const name = newBoardName.trim();
    if (!name) return;
    const nb: Board = { id: `board-${Date.now()}`, name, createdAt: Date.now() };
    saveBoards([...boards, nb]);
    setNewBoardName("");
    setIsCreatingBoard(false);
    if (itemToSave) {
      saveSaves({ ...savedMap, [itemToSave.id]: [...(savedMap[itemToSave.id] || []), nb.id] });
      showToast(`Created board "${name}" and saved! ✨`);
    } else {
      showToast(`Created board "${name}" ✨`);
    }
  };

  const handleShare = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/inspiration?id=${item.id}`;
    navigator.clipboard?.writeText(url);
    showToast("Link copied to clipboard! 📋");
  };

  const handleCopyHex = (hex: string, name: string) => {
    navigator.clipboard?.writeText(hex);
    showToast(`Copied ${name} (${hex}) ✨`);
  };

  const handleDownloadPalette = (item: StaticColorTheme) => {
    const txt =
      `${item.title} — Wedding Color Palette\n` +
      `Curated by Cloche Luxury Wedding Platform\n\n` +
      item.colorTheme.map((c) => `${c.name}: ${c.hex}`).join("\n") +
      `\n\nEstimated Budget: ${item.estimatedBudget}\nStyle: ${item.styleTag}`;
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })),
      download: `${item.id}-palette.txt`,
    });
    a.click();
    showToast("Color Palette Downloaded! 🎨");
  };

  const openItem = (item: InspirationItem) => {
    setSelectedItem(item);
    const rv = [item.id, ...recentlyViewed.filter((id) => id !== item.id)].slice(0, 8);
    setRecentlyViewed(rv);
    persist("cloche_insp_recent_v3", rv);
  };

  const handleOpenAura = (prompt: string) => {
    setAuraInitialQuery(prompt);
    setIsAuraOpen(true);
  };

  // ── Fetch dynamic photos from Pexels API server route ──
  const fetchPhotos = useCallback(async (key: string) => {
    if (key === "Color Themes") {
      setFetchState({ photos: [], loading: false, error: null, noApiKey: false });
      return;
    }
    const target = key === "All" ? "Wedding Photos" : key;
    if (photoCache.current[target]) {
      setFetchState({ photos: photoCache.current[target], loading: false, error: null, noApiKey: false });
      return;
    }

    setFetchState((p) => ({ ...p, loading: true, error: null }));
    try {
      const res = await fetch(`/api/pexels?category=${encodeURIComponent(target)}&per_page=32`);
      const json = await res.json();
      if (!json.success) {
        setFetchState({ photos: [], loading: false, error: json.message || "Failed to load photos", noApiKey: false });
        return;
      }
      const photos: DynamicInspirationPhoto[] = (json.photos || []).map((p: any) => ({
        ...p,
        category: target as InspirationCategory,
        pexels_url: p.url,
      }));
      photoCache.current[target] = photos;
      setFetchState({ photos, loading: false, error: null, noApiKey: false });
    } catch {
      setFetchState({ photos: [], loading: false, error: "Network error — please check your connection and retry.", noApiKey: false });
    }
  }, []);

  useEffect(() => {
    fetchPhotos(activeCategory);
  }, [activeCategory, fetchPhotos]);

  // ── Lock Body Scroll when Detail Lightbox is Open ──
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedItem]);

  // ── All Inspiration Photos ──
  const displayItems = useMemo<InspirationItem[]>(() => {
    return [...fetchState.photos, ...STATIC_COLOR_THEMES];
  }, [fetchState.photos]);

  // ── Saved View Items ──
  const savedItemsList = useMemo<InspirationItem[]>(() => {
    const all: InspirationItem[] = [...STATIC_COLOR_THEMES, ...Object.values(photoCache.current).flat()];
    return all.filter((item) => {
      const bs = savedMap[item.id] || [];
      return activeBoardId === "all" ? bs.length > 0 : bs.includes(activeBoardId);
    });
  }, [savedMap, activeBoardId]);

  const totalSavedCount = useMemo(() => Object.keys(savedMap).length, [savedMap]);

  // ── Current Active Inspiration List for Lightbox Slide Roll ──
  const currentList = useMemo<InspirationItem[]>(() => {
    return activeTab === "saved" ? savedItemsList : displayItems;
  }, [activeTab, savedItemsList, displayItems]);

  const currentIndex = useMemo(() => {
    if (!selectedItem) return -1;
    return currentList.findIndex((item) => String(item.id) === String(selectedItem.id));
  }, [selectedItem, currentList]);

  const handlePrev = useCallback(() => {
    if (currentList.length === 0) return;
    const idx = currentIndex >= 0 ? currentIndex : 0;
    const prevIdx = (idx - 1 + currentList.length) % currentList.length;
    setSelectedItem(currentList[prevIdx]);
  }, [currentIndex, currentList]);

  const handleNext = useCallback(() => {
    if (currentList.length === 0) return;
    const idx = currentIndex >= 0 ? currentIndex : 0;
    const nextIdx = (idx + 1) % currentList.length;
    setSelectedItem(currentList[nextIdx]);
  }, [currentIndex, currentList]);

  // Keyboard Navigation (ArrowLeft, ArrowRight, Escape)
  useEffect(() => {
    if (!selectedItem) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      } else if (e.key === "Escape") {
        e.preventDefault();
        setSelectedItem(null);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedItem, handlePrev, handleNext]);

  // ── Trigger Mood Board Generation ──
  const handleGenerateMoodBoard = () => {
    const res = generateAIMoodBoard(moodBoardInput);
    setGeneratedMoodBoard(res);
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2520] antialiased flex flex-col selection:bg-[#C8A96A]/30">
      <style>{`
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── TOAST NOTIFICATION ── */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-[#0F4C45] text-white text-xs font-bold px-5 py-3 rounded-full shadow-2xl flex items-center gap-2.5 border border-[#C8A96A]/40 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── CLEAN MINIMAL INSPIRATION HEADER ── */}
      <section className="bg-white border-b border-gold/15 py-5 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-charcoal">
              Wedding Inspiration Gallery
            </h1>
            <p className="text-xs text-charcoal/60 mt-0.5 font-light">
              Explore real wedding moments, bridal styling, and decor concepts
            </p>
          </div>
          <Link
            href="/user/dashboard/saved-inspirations"
            className="inline-flex items-center gap-2 text-xs font-bold px-4 py-2 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-gold/25 hover:border-[#0F4C45] hover:bg-rose-50/50 transition-all self-start sm:self-auto group"
          >
            <Heart className={`w-3.5 h-3.5 transition-colors ${savedInspirations.length > 0 ? "fill-rose-500 text-rose-500" : "text-rose-500"}`} />
            <span>Saved Inspirations</span>
            {savedInspirations.length > 0 && (
              <span className="bg-[#0F4C45] text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                {savedInspirations.length}
              </span>
            )}
          </Link>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MASONRY PHOTO GRID (STARTS IMMEDIATELY BELOW CONTROLS)
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-10 py-3 md:py-6 w-full">
        {/* Error notification if any */}
        {activeTab === "explore" && fetchState.error && (
          <div className="mb-4 md:mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-xs font-semibold text-red-800">{fetchState.error}</p>
            </div>
            <button
              onClick={() => fetchPhotos(activeCategory)}
              className="text-xs font-bold text-red-700 bg-white border border-red-200 px-3 py-1.5 rounded-xl hover:bg-red-50 cursor-pointer transition-colors shrink-0"
            >
              Retry
            </button>
          </div>
        )}

        {/* ── EXPLORE TAB FEED ── */}
        {activeTab === "explore" && (
          <>

            {/* Skeletons while loading */}
            {fetchState.loading && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2.5 sm:gap-3 md:gap-5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <SkeletonCard key={i} idx={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!fetchState.loading && displayItems.length === 0 && !fetchState.noApiKey && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-4 p-8 shadow-xs">
                <Search className="w-12 h-12 text-charcoal/25 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-charcoal">No inspirations available</h3>
                <p className="text-xs text-charcoal/60">
                  Please check your connection and reload to view curated wedding inspirations.
                </p>
                <button
                  onClick={() => fetchPhotos("All")}
                  className="bg-[#0F4C45] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-md"
                >
                  Reload Inspirations
                </button>
              </div>
            )}

            {/* Responsive Pinterest Masonry Grid */}
            {!fetchState.loading && displayItems.length > 0 && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-2.5 sm:gap-3 md:gap-5">
                {displayItems.map((item) => {
                  const liked = isItemLiked(item.id);
                  if (isStaticColorTheme(item)) {
                    return (
                      <ColorThemeCard
                        key={item.id}
                        item={item}
                        liked={liked}
                        onClick={() => openItem(item)}
                        onLike={(e) => handleLikeInspiration(item, e)}
                        onShare={(e) => handleShare(item, e)}
                      />
                    );
                  }
                  return (
                    <PhotoCard
                      key={item.id}
                      item={item}
                      liked={liked}
                      onClick={() => openItem(item)}
                      onLike={(e) => handleLikeInspiration(item, e)}
                      onShare={(e) => handleShare(item, e)}
                    />
                  );
                })}
              </div>
            )}

            {/* Pexels Attribution Footer Note */}
            {!fetchState.loading && !fetchState.noApiKey && activeCategory !== "Color Themes" && fetchState.photos.length > 0 && (
              <div className="mt-12 text-center border-t border-gold/10 pt-6">
                <a
                  href="https://www.pexels.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-charcoal/50 hover:text-[#0F4C45] transition-colors"
                >
                  <span>Photos provided by Pexels</span>
                  <span>•</span>
                  <span>Click any photo for photographer credits</span>
                </a>
              </div>
            )}
          </>
        )}

        {/* ── MY SAVED BOARDS VIEW ── */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif font-black text-xl text-charcoal">My Saved Wedding Boards</h3>
                <p className="text-xs text-charcoal/60">Organize and save your favorite inspirations by celebration</p>
              </div>
              <button
                onClick={() => {
                  setItemToSave(null);
                  setIsCreatingBoard(true);
                }}
                className="bg-[#0F4C45] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shadow-xs"
              >
                <Plus className="w-4 h-4" /> Create Board
              </button>
            </div>

            {/* Board Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5">
              {boards.map((b) => {
                const count = Object.values(savedMap).filter((bds) => bds.includes(b.id)).length;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoardId(b.id)}
                    className={`p-4 rounded-3xl border text-left transition-all cursor-pointer shadow-xs ${
                      activeBoardId === b.id
                        ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-lg"
                        : "bg-white border-gold/15 hover:border-gold/50"
                    }`}
                  >
                    <p className="text-sm font-extrabold mb-1 truncate">{b.name}</p>
                    <p className={`text-[11px] ${activeBoardId === b.id ? "text-white/80" : "text-charcoal/50"}`}>
                      {count} saved ideas
                    </p>
                  </button>
                );
              })}
            </div>

            {/* Empty Saved State */}
            {savedItemsList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-4 p-8 shadow-xs">
                <div className="w-16 h-16 rounded-full bg-[#FAF7F2] border border-gold/20 flex items-center justify-center text-[#C8A96A] mx-auto">
                  <Bookmark className="w-7 h-7" />
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Your Board is Empty</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Browse thousands of decor concepts, bridal styling ideas, and mandaps, then click the bookmark button to build your custom wedding moodboard.
                </p>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-bold px-6 py-3 rounded-full cursor-pointer shadow-md transition-all"
                >
                  Start Exploring Ideas
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                  <h3 className="font-serif font-bold text-base text-charcoal">
                    {activeBoardId === "all" ? "All Saved Inspirations" : boards.find((b) => b.id === activeBoardId)?.name}
                  </h3>
                  <button
                    onClick={() => {
                      const url = `${window.location.origin}/inspiration`;
                      navigator.clipboard?.writeText(url);
                      showToast("Board link copied to clipboard! 📋");
                    }}
                    className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] border border-gold/20 px-3.5 py-1.5 rounded-full hover:bg-gold/10 transition-colors flex items-center gap-1.5 cursor-pointer"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                    <span>Share Board</span>
                  </button>
                </div>

                <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5">
                  {savedItemsList.map((item) => {
                    if (isStaticColorTheme(item)) {
                      return (
                        <ColorThemeCard
                          key={item.id}
                          item={item}
                          liked={true}
                          onClick={() => openItem(item)}
                          onLike={(e) => handleLikeInspiration(item, e)}
                          onShare={(e) => handleShare(item, e)}
                        />
                      );
                    }
                    return (
                      <PhotoCard
                        key={item.id}
                        item={item}
                        liked={true}
                        onClick={() => openItem(item)}
                        onLike={(e) => handleLikeInspiration(item, e)}
                        onShare={(e) => handleShare(item, e)}
                      />
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          5. DEDICATED FULL-SCREEN DETAIL VIEW (MOBILE FULLSCREEN & DESKTOP MODAL)
      ══════════════════════════════════════════════════════════════════════ */}
      {/* ══════════════════════════════════════════════════════════════════════
          5. FULL-SCREEN INSPIRATION IMAGE VIEWER (SLIDE ROLL CAROUSEL)
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-[120] bg-black/95 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200 select-none"
          onClick={() => setSelectedItem(null)}
        >
          {/* Top Bar: Counter & Quick Actions */}
          <div className="absolute top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-50 pointer-events-none">
            {/* Image Counter */}
            {currentIndex >= 0 && currentList.length > 0 ? (
              <div className="pointer-events-auto bg-black/60 backdrop-blur-md text-white/90 text-xs font-semibold px-3.5 py-1.5 rounded-full border border-white/20 shadow-lg">
                <span>{currentIndex + 1}</span>
                <span className="text-white/40 mx-1.5">/</span>
                <span>{currentList.length}</span>
              </div>
            ) : <div />}

            {/* Right Controls: Save Bookmark & Close */}
            <div className="pointer-events-auto flex items-center gap-2.5 ml-auto">
              {/* Like Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeInspiration(selectedItem, e);
                }}
                aria-label={isItemLiked(selectedItem.id) ? "Unlike inspiration" : "Like inspiration"}
                className={`min-w-[44px] min-h-[44px] w-11 h-11 rounded-full flex items-center justify-center cursor-pointer shadow-xl border transition-all active:scale-95 ${
                  isItemLiked(selectedItem.id)
                    ? "bg-white text-rose-500 border-rose-200 shadow-rose-500/30"
                    : "bg-black/60 hover:bg-white text-white hover:text-rose-500 border-white/25"
                }`}
                title={isItemLiked(selectedItem.id) ? "Liked" : "Like Inspiration"}
              >
                <Heart
                  className={`w-5 h-5 transition-transform ${
                    isItemLiked(selectedItem.id) ? "fill-rose-500 text-rose-500 scale-110" : "stroke-[2]"
                  }`}
                />
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setSelectedItem(null)}
                aria-label="Close image viewer"
                className="min-w-[44px] min-h-[44px] w-11 h-11 rounded-full bg-black/60 hover:bg-black/85 text-white flex items-center justify-center cursor-pointer shadow-xl border border-white/25 active:scale-95 transition-all"
                title="Close (Esc)"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Left Slide Roll Button */}
          {currentList.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              aria-label="Previous inspiration image"
              className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-50 min-w-[46px] min-h-[46px] w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer shadow-2xl border border-white/20 active:scale-90 hover:scale-105 transition-all backdrop-blur-md"
              title="Previous (Left Arrow)"
            >
              <ChevronLeft className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}

          {/* Main Selected Image Only */}
          <div
            className="relative flex items-center justify-center max-w-[92vw] max-h-[88vh] sm:max-h-[85vh] select-none"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={
                isStaticColorTheme(selectedItem)
                  ? selectedItem.image
                  : selectedItem.src.large2x || selectedItem.src.large
              }
              alt={
                isStaticColorTheme(selectedItem)
                  ? selectedItem.title
                  : selectedItem.alt || selectedItem.category
              }
              className="max-h-[85vh] max-w-[90vw] md:max-w-4xl lg:max-w-5xl w-auto h-auto object-contain rounded-2xl shadow-2xl transition-opacity duration-200"
            />
          </div>

          {/* Right Slide Roll Button */}
          {currentList.length > 1 && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              aria-label="Next inspiration image"
              className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-50 min-w-[46px] min-h-[46px] w-11 sm:w-14 h-11 sm:h-14 rounded-full bg-black/60 hover:bg-black/90 text-white flex items-center justify-center cursor-pointer shadow-2xl border border-white/20 active:scale-90 hover:scale-105 transition-all backdrop-blur-md"
              title="Next (Right Arrow)"
            >
              <ChevronRight className="w-6 h-6 sm:w-7 sm:h-7" />
            </button>
          )}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          6. AI MOOD BOARD GENERATOR MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {isMoodBoardOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setIsMoodBoardOpen(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 shadow-2xl border border-gold/30 space-y-6 relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-gold/15 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#0F4C45] text-[#C8A96A] flex items-center justify-center shadow-md">
                  <Wand2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg sm:text-xl text-charcoal">
                    Cloche Aura • AI Mood Board Generator
                  </h3>
                  <p className="text-xs text-charcoal/60">
                    Instant concept design, budget allocation &amp; verified Kerala vendor shortlist
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsMoodBoardOpen(false)}
                className="p-2 rounded-full text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider block">
                  1. Wedding Type &amp; Ceremony
                </label>
                <select
                  value={moodBoardInput.weddingType}
                  onChange={(e) => setMoodBoardInput({ ...moodBoardInput, weddingType: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/25 rounded-2xl p-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                >
                  {MOODBOARD_OPTIONS.weddingTypes.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.icon} {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider block">
                  2. Color Palette Theme
                </label>
                <select
                  value={moodBoardInput.colorTheme}
                  onChange={(e) => setMoodBoardInput({ ...moodBoardInput, colorTheme: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/25 rounded-2xl p-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                >
                  {MOODBOARD_OPTIONS.colorThemes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider block">
                  3. Total Target Budget
                </label>
                <select
                  value={moodBoardInput.budgetTier}
                  onChange={(e) => setMoodBoardInput({ ...moodBoardInput, budgetTier: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/25 rounded-2xl p-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                >
                  {MOODBOARD_OPTIONS.budgetTiers.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.label} ({b.range})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider block">
                  4. Setting / Location
                </label>
                <select
                  value={moodBoardInput.venueSetting}
                  onChange={(e) => setMoodBoardInput({ ...moodBoardInput, venueSetting: e.target.value })}
                  className="w-full bg-[#FAF7F2] border border-gold/25 rounded-2xl p-3 text-xs font-semibold text-charcoal focus:outline-none focus:border-[#0F4C45]"
                >
                  {MOODBOARD_OPTIONS.venueSettings.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.icon} {v.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <button
              onClick={handleGenerateMoodBoard}
              className="w-full py-3 rounded-2xl bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Update AI Mood Board</span>
            </button>

            {generatedMoodBoard && (
              <div className="bg-[#FAF7F2] p-5 sm:p-6 rounded-3xl border border-gold/25 space-y-6 animate-in fade-in duration-200">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#0F4C45] bg-white px-3 py-1 rounded-full border border-gold/20">
                      Generated Concept
                    </span>
                    <span className="text-xs font-black text-[#0F4C45] bg-[#C8A96A]/20 px-3 py-1 rounded-full border border-[#C8A96A]/30">
                      Budget: {generatedMoodBoard.totalEstimatedBudget}
                    </span>
                  </div>
                  <h4 className="font-serif font-black text-lg text-charcoal mt-2">
                    {generatedMoodBoard.title}
                  </h4>
                  <p className="text-xs text-charcoal/70 leading-relaxed mt-1 font-light">
                    {generatedMoodBoard.conceptDescription}
                  </p>
                </div>

                {/* Swatches */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                    Harmonious Palette Swatches
                  </span>
                  <div className="grid grid-cols-5 gap-2">
                    {generatedMoodBoard.palette.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => handleCopyHex(c.hex, c.name)}
                        className="flex flex-col items-center gap-1 cursor-pointer bg-white p-2 rounded-2xl border border-gold/20 hover:border-gold shadow-xs"
                      >
                        <div style={{ backgroundColor: c.hex }} className="w-full h-8 rounded-xl border border-black/10" />
                        <span className="text-[9px] font-bold text-charcoal truncate w-full text-center">{c.name}</span>
                        <span className="text-[8px] font-mono text-charcoal/50">{c.hex}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Budget Allocations */}
                <div className="space-y-2.5">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                    Recommended Budget Split
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {generatedMoodBoard.budgetAllocation.map((b, i) => (
                      <div key={i} className="bg-white p-3 rounded-2xl border border-gold/15 flex items-center justify-between text-xs">
                        <span className="font-medium text-charcoal flex items-center gap-1.5">
                          <span>{b.emoji}</span>
                          <span>{b.category}</span>
                        </span>
                        <div className="text-right">
                          <span className="font-extrabold text-[#0F4C45] block">{b.amount}</span>
                          <span className="text-[9px] text-charcoal/45">{b.percentage}% allocation</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Checklist */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-charcoal uppercase tracking-wider">
                    Essential Styling Checklist
                  </span>
                  <div className="space-y-1.5 bg-white p-4 rounded-2xl border border-gold/15">
                    {generatedMoodBoard.stylingChecklist.map((item, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs text-charcoal/80">
                        <CheckSquare className="w-3.5 h-3.5 text-[#0F4C45] shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CTAs */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                  <button
                    onClick={() => {
                      setIsMoodBoardOpen(false);
                      handleOpenAura(generatedMoodBoard.suggestedAuraPrompt);
                    }}
                    className="flex-1 bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white font-extrabold text-xs py-3.5 rounded-2xl flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                    <span>Plan Full Wedding with Aura AI</span>
                  </button>
                  <button
                    onClick={() => {
                      const txt =
                        `${generatedMoodBoard.title}\n` +
                        `Budget: ${generatedMoodBoard.totalEstimatedBudget}\n\n` +
                        `Checklist:\n` +
                        generatedMoodBoard.stylingChecklist.map((c) => `• ${c}`).join("\n");
                      navigator.clipboard?.writeText(txt);
                      showToast("Mood board summary copied! 📋");
                    }}
                    className="bg-white border border-gold/30 text-[#0F4C45] font-extrabold text-xs py-3.5 px-5 rounded-2xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-gold/10"
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy Summary</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── SAVE TO BOARD MODAL ── */}
      {itemToSave && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setItemToSave(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gold/25"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-charcoal">
                <Bookmark className="w-4 h-4 text-[#0F4C45]" />
                <span>Save to Board</span>
              </h3>
              <button onClick={() => setItemToSave(null)} className="p-1 text-charcoal/40 hover:text-charcoal cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {boards.map((b) => {
                const inBoard = (savedMap[itemToSave.id] || []).includes(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => handleToggleBoardSave(b.id)}
                    className="w-full p-3 rounded-2xl border border-gold/15 bg-[#FAF7F2] hover:bg-gold/10 flex items-center justify-between text-xs font-bold text-charcoal cursor-pointer transition-colors"
                  >
                    <span>{b.name}</span>
                    <span
                      className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                        inBoard ? "bg-[#0F4C45] text-[#C8A96A] border-[#0F4C45]" : "border-charcoal/30 bg-white"
                      }`}
                    >
                      {inBoard && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {isCreatingBoard ? (
              <div className="space-y-2 border-t border-gold/10 pt-2">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="e.g. Kasavu Saree Ideas, Mandap..."
                  className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleCreateBoard}
                    disabled={!newBoardName.trim()}
                    className="flex-1 bg-[#0F4C45] disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                  >
                    Create &amp; Save
                  </button>
                  <button
                    onClick={() => setIsCreatingBoard(false)}
                    className="px-3 py-2.5 rounded-xl text-xs text-charcoal/60 cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingBoard(true)}
                className="w-full py-2.5 rounded-2xl border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] text-[#0F4C45] font-bold text-xs flex items-center justify-center gap-1.5 bg-[#FAF7F2] cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Create New Board
              </button>
            )}

            <button
              onClick={() => {
                setItemToSave(null);
                showToast("Saved to Board! ❤️");
              }}
              className="w-full bg-[#0F4C45] hover:bg-[#12584E] text-white font-bold text-xs py-3 rounded-xl cursor-pointer shadow-md"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* ── STANDALONE CREATE BOARD MODAL ── */}
      {!itemToSave && isCreatingBoard && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
          onClick={() => setIsCreatingBoard(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold/25 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2 text-charcoal">
                <FolderPlus className="w-4 h-4 text-[#0F4C45]" />
                <span>Create New Board</span>
              </h3>
              <button onClick={() => setIsCreatingBoard(false)} className="p-1 text-charcoal/40 hover:text-charcoal cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>
            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="e.g. 💐 Mandap Florals, 👰 Bridal Kasavu..."
              className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
              autoFocus
            />
            <div className="flex gap-2 pt-2">
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim()}
                className="flex-1 bg-[#0F4C45] disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
              >
                Create Board
              </button>
              <button
                onClick={() => setIsCreatingBoard(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-charcoal/60 cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Aura AI Drawer Assistant */}
      <AuraAssistantDrawer
        isOpen={isAuraOpen}
        onClose={() => {
          setIsAuraOpen(false);
          setAuraInitialQuery("");
        }}
        initialQuery={auraInitialQuery}
      />

      <Footer />
      <BottomNavBar activeTab="photos" />
    </div>
  );
}
