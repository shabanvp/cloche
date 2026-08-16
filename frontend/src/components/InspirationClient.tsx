"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Bookmark, Share2, X, Plus, Check,
  Download, FolderPlus, ExternalLink, CheckCircle2,
  AlertCircle, ChevronRight, Wand2, DollarSign, Palette,
  MapPin, ShieldCheck, Copy, CheckSquare, RefreshCw,
  Flame, Clock, ArrowUpDown
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
  const heights = ["h-72", "h-56", "h-84", "h-60", "h-76", "h-64"];
  return (
    <div className={`break-inside-avoid rounded-3xl bg-white border border-gold/10 ${heights[idx % 6]} mb-5 animate-pulse relative overflow-hidden shadow-xs`}>
      <div className="w-full h-full bg-gradient-to-b from-gray-100 to-gray-200" />
      <div className="absolute top-3 left-3 w-16 h-4 bg-white/60 rounded-full" />
      <div className="absolute bottom-3 left-3 right-3 space-y-2">
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
  saved,
  onClick,
  onSave,
  onShare,
}: {
  item: DynamicInspirationPhoto;
  saved: boolean;
  onClick: () => void;
  onSave: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const aspectClass = getAspectClass(item.width, item.height);
  const caption = item.alt || item.category;
  const profile = getInspirationPlanningProfile(item);

  return (
    <div onClick={onClick} className="break-inside-avoid mb-5 relative group cursor-pointer select-none">
      <div className={`relative w-full overflow-hidden rounded-3xl bg-gray-100 ${aspectClass} shadow-xs group-hover:shadow-2xl transition-all duration-500 ease-out border border-gold/15 group-hover:-translate-y-1`}>
        {!imgLoaded && (
          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
        )}
        <img
          src={item.src.large}
          alt={caption}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-700 ease-out group-hover:scale-105 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

        {/* Top Badges & Actions */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between z-10">
          <div className="flex flex-col gap-1.5 items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#D4B66E] px-3 py-1 rounded-full border border-white/20 shadow-xs">
              {item.category}
            </span>
            <span className="text-[9px] font-semibold bg-[#0F4C45]/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-gold/30 shadow-xs flex items-center gap-1 opacity-90 group-hover:opacity-100 transition-opacity">
              <DollarSign className="w-2.5 h-2.5 text-[#C8A96A]" /> {profile.estimatedCostRange}
            </span>
          </div>

          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onSave}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                saved ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-black/60 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"
              }`}
              title={saved ? "Saved" : "Save to Board"}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={onShare}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer shadow-md"
              title="Share Inspiration"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom Context Info on Hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 space-y-1.5">
          <p className="text-white text-xs font-bold line-clamp-2 leading-snug drop-shadow-md">
            {profile.styleName}
          </p>
          <div className="flex items-center justify-between text-[10px] text-white/80">
            <span className="truncate max-w-[150px]">{caption}</span>
            <span className="text-[#D4B66E] font-semibold flex items-center gap-0.5">
              Plan <ChevronRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Pexels Attribution */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
          <span className="text-[9px] text-white/75 font-medium truncate block">
            📷 {item.photographer} / Pexels
          </span>
        </div>

        {/* Saved badge */}
        {saved && (
          <div className="absolute top-3 right-3 group-hover:opacity-0 transition-opacity">
            <span className="bg-[#C8A96A] text-[#0F4C45] text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              Saved ❤️
            </span>
          </div>
        )}
      </div>

      {/* Under-card Planning Strip */}
      <div className="pt-2 px-1 flex items-center justify-between text-[11px] text-charcoal/70">
        <span className="font-semibold text-charcoal truncate max-w-[130px]">{profile.styleName}</span>
        <span className="font-bold text-[#0F4C45] text-[10px] bg-[#FAF7F2] px-2 py-0.5 rounded-md border border-gold/20">
          {profile.estimatedCostRange}
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// STATIC COLOR THEME CARD
// ─────────────────────────────────────────────────────────────────────────────
function ColorThemeCard({
  item,
  saved,
  onClick,
  onSave,
  onShare,
}: {
  item: StaticColorTheme;
  saved: boolean;
  onClick: () => void;
  onSave: (e: React.MouseEvent) => void;
  onShare: (e: React.MouseEvent) => void;
}) {
  const aspectMap = {
    tall: "aspect-[9/16]",
    portrait: "aspect-[3/4]",
    square: "aspect-[1/1]",
    landscape: "aspect-[4/3]",
  };

  return (
    <div onClick={onClick} className="break-inside-avoid mb-5 relative group cursor-pointer select-none">
      <div className={`relative w-full overflow-hidden rounded-3xl bg-gray-100 ${aspectMap[item.aspectRatio]} shadow-xs group-hover:shadow-2xl transition-all duration-500 ease-out border border-gold/20 group-hover:-translate-y-1`}>
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between z-10">
          <div className="flex flex-col gap-1.5 items-start">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#D4B66E] px-3 py-1 rounded-full border border-white/20">
              🎨 Color Theme
            </span>
            <span className="text-[9px] font-semibold bg-[#0F4C45]/90 backdrop-blur-md text-white px-2.5 py-0.5 rounded-full border border-gold/30">
              {item.estimatedBudget}
            </span>
          </div>

          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={onSave}
              className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer shadow-md ${
                saved ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-black/60 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"
              }`}
            >
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button
              onClick={onShare}
              className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer shadow-md"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 space-y-2">
          <h4 className="text-white text-xs font-bold line-clamp-1">{item.title}</h4>
          <div className="flex items-center gap-1.5">
            {item.colorTheme.slice(0, 5).map((c, i) => (
              <span
                key={i}
                style={{ backgroundColor: c.hex }}
                className="w-4 h-4 rounded-full border border-white/60 shadow-xs"
                title={`${c.name} (${c.hex})`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="pt-2 px-1 space-y-1">
        <div className="flex items-center justify-between text-[11px]">
          <span className="font-bold text-charcoal truncate max-w-[150px]">{item.title}</span>
          <span className="text-[10px] text-[#0F4C45] font-semibold">{item.styleTag}</span>
        </div>
        <div className="flex gap-1">
          {item.colorTheme.slice(0, 5).map((c, i) => (
            <span key={i} style={{ backgroundColor: c.hex }} className="flex-1 h-1.5 rounded-full border border-black/5" />
          ))}
        </div>
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

  const isItemSaved = (id: string) => Boolean(savedMap[id]?.length);

  const handleQuickSave = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = item.id;
    if (savedMap[id]?.length) {
      const next = { ...savedMap };
      delete next[id];
      saveSaves(next);
      showToast("Removed from saved boards");
    } else {
      const firstBoardId = boards[0]?.id || "dream-wedding";
      saveSaves({ ...savedMap, [id]: [firstBoardId] });
      showToast(`Saved to ${boards[0]?.name || "Dream Wedding"} ❤️`);
    }
  };

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

  // ── Filter & Sort Display Items ──
  const displayItems = useMemo<InspirationItem[]>(() => {
    const dynamic = fetchState.photos;
    const statics = STATIC_COLOR_THEMES;
    let all: InspirationItem[] =
      activeCategory === "All"
        ? [...dynamic, ...statics]
        : activeCategory === "Color Themes"
        ? statics
        : dynamic;

    // Filter by budget tier if active
    if (budgetFilter !== "all") {
      all = all.filter((item) => {
        const prof = getInspirationPlanningProfile(item);
        return prof.costTier === budgetFilter;
      });
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      all = all.filter((item) => {
        const prof = getInspirationPlanningProfile(item);
        const isTheme = isStaticColorTheme(item);
        const textMatch = isTheme
          ? item.title.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
          : (item.alt || "").toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        const styleMatch = prof.styleName.toLowerCase().includes(q) || prof.vibe.toLowerCase().includes(q);
        return textMatch || styleMatch;
      });
    }

    // Apply sorting
    if (sortBy === "latest") {
      return [...all].reverse();
    }

    return all;
  }, [activeCategory, fetchState.photos, searchQuery, budgetFilter, sortBy]);

  // ── Saved View Items ──
  const savedItemsList = useMemo<InspirationItem[]>(() => {
    const all: InspirationItem[] = [...STATIC_COLOR_THEMES, ...Object.values(photoCache.current).flat()];
    return all.filter((item) => {
      const bs = savedMap[item.id] || [];
      return activeBoardId === "all" ? bs.length > 0 : bs.includes(activeBoardId);
    });
  }, [savedMap, activeBoardId]);

  const totalSavedCount = useMemo(() => Object.keys(savedMap).length, [savedMap]);

  // ── Related Items in Lightbox ──
  const relatedItems = useMemo<InspirationItem[]>(() => {
    if (!selectedItem) return [];
    const all: InspirationItem[] = [...STATIC_COLOR_THEMES, ...Object.values(photoCache.current).flat()];
    return all
      .filter((i) => i.id !== selectedItem.id && i.category === selectedItem.category)
      .slice(0, 6);
  }, [selectedItem]);

  const selectedProfile = selectedItem ? getInspirationPlanningProfile(selectedItem) : null;

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

      {/* ══════════════════════════════════════════════════════════════════════
          1. COMPACT WEDMEGOOD-STYLE HEADER & BREADCRUMB
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gold/15 pt-4 pb-2 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-3">
          {/* Breadcrumb line */}
          <div className="flex items-center gap-1.5 text-xs text-charcoal/50">
            <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
            <span>/</span>
            <span className="text-charcoal font-semibold">Wedding Inspiration</span>
          </div>

          {/* Compact Page Title Row */}
          <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-serif font-black text-charcoal tracking-tight flex items-baseline gap-2.5">
                <span>Wedding Inspiration, Trends &amp; Photos</span>
                <span className="text-xs sm:text-sm font-sans font-medium text-charcoal/50">
                  ({displayItems.length ? `${displayItems.length * 40}+ Photos` : "1,200+ Photos"})
                </span>
              </h1>
              <p className="text-xs text-charcoal/60 mt-0.5 font-light">
                Discover trending decor ideas, bridal looks, and real Kerala wedding moments.
              </p>
            </div>

            {/* Quick Action Buttons: AI Mood Board & Saved Boards */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => {
                  handleGenerateMoodBoard();
                  setIsMoodBoardOpen(true);
                }}
                className="inline-flex items-center gap-1.5 text-xs font-extrabold bg-[#0F4C45] hover:bg-[#12584E] text-white px-3.5 py-2 rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>AI Mood Board</span>
              </button>

              <button
                onClick={() => setActiveTab(activeTab === "saved" ? "explore" : "saved")}
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3.5 py-2 rounded-xl transition-all cursor-pointer border ${
                  activeTab === "saved"
                    ? "bg-[#0F4C45] text-white border-[#0F4C45] shadow-xs"
                    : "bg-[#FAF7F2] text-charcoal/80 border-gold/20 hover:border-gold"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5 text-[#C8A96A]" />
                <span>My Boards</span>
                {totalSavedCount > 0 && (
                  <span className="bg-[#C8A96A] text-[#0F4C45] text-[10px] font-black px-1.5 rounded-full">
                    {totalSavedCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* ──────────────────────────────────────────────────────────────────
              2. HORIZONTAL SCROLLABLE CATEGORY THUMBNAILS (WedMeGood Reference)
          ────────────────────────────────────────────────────────────────── */}
          <div className="pt-2 pb-1 overflow-x-auto scrollbar-none">
            <div className="flex items-center gap-4 sm:gap-6 min-w-max pb-1">
              {INSPIRATION_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id && activeTab === "explore";
                return (
                  <button
                    key={cat.id}
                    onClick={() => {
                      setActiveTab("explore");
                      setActiveCategory(cat.id);
                    }}
                    className="flex flex-col items-center gap-1.5 cursor-pointer group transition-all"
                  >
                    {/* Rounded Image Thumbnail */}
                    <div
                      className={`relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden transition-all duration-300 ${
                        isActive
                          ? "ring-2 ring-[#0F4C45] ring-offset-2 scale-105 shadow-md border-2 border-white"
                          : "border border-gold/25 group-hover:border-gold group-hover:scale-105 opacity-85 group-hover:opacity-100 shadow-xs"
                      }`}
                    >
                      <img
                        src={cat.image}
                        alt={cat.label}
                        className="w-full h-full object-cover"
                      />
                      <div className={`absolute inset-0 bg-black/15 group-hover:bg-transparent transition-colors ${isActive ? "bg-transparent" : ""}`} />
                      {isActive && (
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#C8A96A] rounded-full ring-2 ring-white" />
                      )}
                    </div>

                    {/* Category Label */}
                    <span
                      className={`text-[11px] sm:text-xs text-center max-w-[76px] leading-tight transition-colors line-clamp-1 ${
                        isActive
                          ? "font-extrabold text-[#0F4C45]"
                          : "font-medium text-charcoal/75 group-hover:text-charcoal"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. SLIM CONTROL ROW: SORT, BUDGET & COMPACT SEARCH
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="bg-[#FAF7F2] border-b border-gold/15 py-2.5 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Left: Sort By & Budget Filter Pills */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Sort Toggle */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-gold/20 shadow-xs">
              <span className="text-[11px] font-bold text-charcoal/50 px-2 flex items-center gap-1">
                <ArrowUpDown className="w-3 h-3" /> Sort:
              </span>
              <button
                onClick={() => setSortBy("trending")}
                className={`text-[11px] font-extrabold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  sortBy === "trending"
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Flame className="w-3 h-3 text-[#C8A96A]" />
                <span>Trending</span>
              </button>
              <button
                onClick={() => setSortBy("latest")}
                className={`text-[11px] font-extrabold px-3 py-1 rounded-lg transition-all cursor-pointer flex items-center gap-1 ${
                  sortBy === "latest"
                    ? "bg-[#0F4C45] text-white shadow-xs"
                    : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Clock className="w-3 h-3 text-[#C8A96A]" />
                <span>Latest</span>
              </button>
            </div>

            {/* Budget Filters */}
            {activeTab === "explore" && (
              <div className="flex items-center gap-1 overflow-x-auto scrollbar-none">
                {[
                  { id: "all", label: "All Budgets" },
                  { id: "budget", label: "< ₹2 Lakhs" },
                  { id: "mid", label: "₹2L – ₹5L" },
                  { id: "luxury", label: "₹5L+ Luxury" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudgetFilter(b.id as any)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      budgetFilter === b.id
                        ? "bg-[#C8A96A] text-[#0F4C45] shadow-xs font-black"
                        : "bg-white text-charcoal/70 border border-gold/15 hover:border-gold shadow-xs"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Slim Search Input */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 10,000+ ideas..."
              className="w-full bg-white border border-gold/20 rounded-xl pl-9 pr-8 py-1.5 text-xs text-charcoal placeholder:text-charcoal/45 focus:outline-none focus:border-[#0F4C45] shadow-xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. MASONRY PHOTO GRID (STARTS IMMEDIATELY BELOW CONTROLS)
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 w-full">
        {/* Error notification if any */}
        {activeTab === "explore" && fetchState.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center justify-between shadow-xs">
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
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <SkeletonCard key={i} idx={i} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!fetchState.loading && displayItems.length === 0 && !fetchState.noApiKey && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-4 p-8 shadow-xs">
                <Search className="w-12 h-12 text-charcoal/25 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-charcoal">No matching inspirations found</h3>
                <p className="text-xs text-charcoal/60">
                  Try adjusting your search query, changing the budget filter, or exploring all categories.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                    setBudgetFilter("all");
                  }}
                  className="bg-[#0F4C45] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer shadow-md"
                >
                  Clear Filters &amp; Browse All
                </button>
              </div>
            )}

            {/* Responsive Pinterest Masonry Grid */}
            {!fetchState.loading && displayItems.length > 0 && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-5">
                {displayItems.map((item) => {
                  const saved = isItemSaved(item.id);
                  if (isStaticColorTheme(item)) {
                    return (
                      <ColorThemeCard
                        key={item.id}
                        item={item}
                        saved={saved}
                        onClick={() => openItem(item)}
                        onSave={(e) => {
                          e.stopPropagation();
                          setItemToSave(item);
                        }}
                        onShare={(e) => handleShare(item, e)}
                      />
                    );
                  }
                  return (
                    <PhotoCard
                      key={item.id}
                      item={item}
                      saved={saved}
                      onClick={() => openItem(item)}
                      onSave={(e) => {
                        e.stopPropagation();
                        setItemToSave(item);
                      }}
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
                          saved={true}
                          onClick={() => openItem(item)}
                          onSave={(e) => handleQuickSave(item, e)}
                          onShare={(e) => handleShare(item, e)}
                        />
                      );
                    }
                    return (
                      <PhotoCard
                        key={item.id}
                        item={item}
                        saved={true}
                        onClick={() => openItem(item)}
                        onSave={(e) => handleQuickSave(item, e)}
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
          5. LIGHTBOX DETAIL MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedItem && selectedProfile && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-200 p-0 sm:p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white w-full sm:max-w-5xl sm:rounded-3xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 border border-gold/30"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-30 p-2.5 rounded-full bg-black/70 hover:bg-black text-white cursor-pointer shadow-lg transition-transform hover:scale-105"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Column: Image */}
            <div className="md:w-1/2 bg-black flex flex-col justify-between relative min-h-[300px] sm:min-h-[500px]">
              <img
                src={isStaticColorTheme(selectedItem) ? selectedItem.image : selectedItem.src.large2x}
                alt={isStaticColorTheme(selectedItem) ? selectedItem.title : selectedItem.alt || selectedItem.category}
                className="w-full h-full max-h-[450px] md:max-h-full object-cover"
              />

              {!isStaticColorTheme(selectedItem) ? (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md px-4 py-2.5 flex items-center justify-between z-10 text-white">
                  <span className="text-xs">
                    📷 Photo by <span className="font-bold">{selectedItem.photographer}</span>
                  </span>
                  <a
                    href={selectedItem.pexels_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] text-[#D4B66E] hover:underline flex items-center gap-1 font-semibold"
                  >
                    Pexels Profile <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ) : (
                <div className="absolute bottom-0 left-0 right-0 bg-black/70 backdrop-blur-md px-4 py-2.5 flex items-center justify-between z-10 text-white">
                  <span className="text-xs font-bold text-[#D4B66E]">✦ Cloche Editorial Master Collection</span>
                </div>
              )}
            </div>

            {/* Right Column: Planning Intelligence Dashboard */}
            <div className="md:w-1/2 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[92vh] bg-white">
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pt-1 border-b border-gold/15 pb-4">
                  <div>
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20 inline-block mb-1">
                      {selectedItem.category}
                    </span>
                    <h2 className="font-serif font-black text-xl sm:text-2xl text-charcoal leading-snug">
                      {isStaticColorTheme(selectedItem) ? selectedItem.title : selectedProfile.styleName}
                    </h2>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleShare(selectedItem)}
                      className="p-2.5 rounded-full bg-[#FAF7F2] text-charcoal border border-gold/20 hover:bg-gold/10 cursor-pointer shadow-xs"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setItemToSave(selectedItem)}
                      className={`px-4 py-2 rounded-full text-xs font-extrabold flex items-center gap-1.5 cursor-pointer shadow-md transition-all ${
                        isItemSaved(selectedItem.id)
                          ? "bg-[#C8A96A] text-[#0F4C45]"
                          : "bg-[#0F4C45] hover:bg-[#12584E] text-white"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isItemSaved(selectedItem.id) ? "fill-current" : ""}`} />
                      <span>{isItemSaved(selectedItem.id) ? "Saved" : "Save Idea"}</span>
                    </button>
                  </div>
                </div>

                {/* 1. Style & Concept */}
                <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>1. Style &amp; Aesthetic Concept</span>
                  </div>
                  <p className="text-xs text-charcoal/80 leading-relaxed">
                    {selectedProfile.vibe}
                  </p>
                  <div className="text-[11px] text-[#0F4C45] font-semibold flex items-center gap-1.5 pt-1">
                    <span>🌴 Kerala Touch:</span>
                    <span className="text-charcoal/80 font-normal">{selectedProfile.keralaTouch}</span>
                  </div>
                </div>

                {/* 2. Budget Breakdown */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-gold/20 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#C8A96A]" />
                      <span>2. Estimated Budget</span>
                    </span>
                    <span className="text-xs font-black bg-[#0F4C45] text-[#C8A96A] px-3 py-1 rounded-full">
                      {selectedProfile.estimatedCostRange}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedProfile.breakdown.map((b, i) => (
                      <div key={i} className="bg-[#FAF7F2] p-2.5 rounded-xl flex items-center justify-between border border-gold/10">
                        <span className="text-charcoal/75 text-[11px] font-medium">{b.item}</span>
                        <span className="font-extrabold text-[#0F4C45] text-[11px]">{b.cost}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Palette for Color Themes */}
                {isStaticColorTheme(selectedItem) && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1">
                        <Palette className="w-3.5 h-3.5 text-[#C8A96A]" /> Color Palette
                      </span>
                      <button
                        onClick={() => handleDownloadPalette(selectedItem)}
                        className="text-[11px] font-extrabold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" /> Export Swatches
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {selectedItem.colorTheme.map((c, i) => (
                        <button
                          key={i}
                          onClick={() => handleCopyHex(c.hex, c.name)}
                          className="flex flex-col items-center gap-1 cursor-pointer group/s"
                          title={`Copy ${c.name} (${c.hex})`}
                        >
                          <div
                            style={{ backgroundColor: c.hex }}
                            className="w-full h-10 rounded-xl border border-black/10 shadow-xs group-hover/s:scale-105 transition-transform"
                          />
                          <span className="text-[9px] font-semibold text-charcoal/80 truncate w-full text-center">{c.name}</span>
                          <span className="text-[8px] font-mono text-charcoal/40">{c.hex}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 3. Verified Vendors */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0F4C45]" />
                      <span>3. Verified Kerala Vendors</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#0F4C45] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-gold/20">
                      Direct Quotes Ready
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {selectedProfile.recommendedVendors.map((v) => (
                      <Link
                        key={v.href}
                        href={v.href}
                        onClick={() => setSelectedItem(null)}
                        className="bg-white hover:bg-[#0F4C45] hover:text-white border border-gold/20 hover:border-[#0F4C45] text-charcoal p-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between shadow-xs group"
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-lg">{v.emoji}</span>
                          <div>
                            <p className="font-extrabold leading-none">{v.label}</p>
                            <p className="text-[10px] opacity-70 mt-1 font-normal group-hover:text-white/80">{v.subtitle}</p>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 opacity-40 group-hover:opacity-100 transition-opacity" />
                      </Link>
                    ))}
                  </div>
                </div>

                {/* 4. Aura CTA */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      handleOpenAura(selectedProfile.auraPrompt);
                    }}
                    className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#0F4C45] via-[#12584E] to-[#0A2E2A] text-white text-xs sm:text-sm font-extrabold flex items-center justify-center gap-2.5 shadow-xl hover:scale-[1.01] transition-transform cursor-pointer border border-[#C8A96A]/30"
                  >
                    <Sparkles className="w-4 h-4 text-[#C8A96A] animate-pulse" />
                    <span>✨ Ask Aura to Plan &amp; Replicate This Look</span>
                  </button>
                </div>
              </div>

              {/* Similar Inspirations */}
              {relatedItems.length > 0 && (
                <div className="border-t border-gold/15 p-6 bg-[#FAF7F2]/60 space-y-3">
                  <span className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider">
                    Similar Inspiration Concepts
                  </span>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
                    {relatedItems.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => setSelectedItem(rel)}
                        className="aspect-square rounded-2xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-85 transition-opacity border border-gold/20 shadow-xs"
                      >
                        <img
                          src={isStaticColorTheme(rel) ? rel.image : rel.src.medium}
                          alt={isStaticColorTheme(rel) ? rel.title : rel.alt || rel.category}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
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
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150"
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
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
