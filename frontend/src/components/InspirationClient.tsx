"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import Link from "next/link";
import {
  Sparkles, Search, Bookmark, Share2, X, Plus, Check,
  Download, FolderPlus, ExternalLink, CheckCircle2,
  AlertCircle, ArrowRight, Heart, Eye, ChevronRight,
  TrendingUp, Clock, Flame, Wand2, DollarSign, Palette,
  MapPin, ShieldCheck, MessageSquare, Copy, ChevronDown,
  Layers, SlidersHorizontal, RefreshCw, Send, CheckSquare,
  FileText
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuraAssistantDrawer } from "@/components/AuraAssistantDrawer";
import {
  INSPIRATION_CATEGORIES,
  DYNAMIC_CATEGORIES,
  STATIC_COLOR_THEMES,
  AURA_INSPIRATION_PROMPTS,
  INSPIRATION_COLLECTIONS,
  CATEGORY_VENDOR_LINKS,
  DEFAULT_BOARDS,
  DAILY_INSPIRATION_SPOTLIGHT,
  SMART_SEARCH_SUGGESTIONS,
  MOODBOARD_OPTIONS,
  generateAIMoodBoard,
  getInspirationPlanningProfile,
  DynamicInspirationPhoto,
  StaticColorTheme,
  InspirationItem,
  InspirationCollection,
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
// DYNAMIC PHOTO CARD (WITH PLANNING INTELLIGENCE)
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
        {/* Shimmer Placeholder */}
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

        {/* Ambient Gradient Overlays */}
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

        {/* Pexels Attribution (Always visible gently, hides on hover) */}
        <div className="absolute bottom-0 left-0 right-0 px-3 py-1.5 bg-gradient-to-t from-black/60 to-transparent group-hover:opacity-0 transition-opacity duration-300 pointer-events-none">
          <span className="text-[9px] text-white/75 font-medium truncate block">
            📷 {item.photographer} / Pexels
          </span>
        </div>

        {/* Saved badge top left */}
        {saved && (
          <div className="absolute top-3 right-3 group-hover:opacity-0 transition-opacity">
            <span className="bg-[#C8A96A] text-[#0F4C45] text-[9px] font-extrabold px-2 py-0.5 rounded-full shadow-md">
              Saved ❤️
            </span>
          </div>
        )}
      </div>

      {/* Under-card Quick Planning Strip */}
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
// STATIC COLOR THEME CARD (EDITORIAL PALETTE)
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

        {/* Top Badges */}
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

        {/* Bottom Swatch overlay on hover */}
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

      {/* Under-card Mini Palette Strip */}
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
// COLLECTION CARD (CAROUSEL ITEM)
// ─────────────────────────────────────────────────────────────────────────────
function CollectionCard({
  col,
  onClick,
}: {
  col: InspirationCollection;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-36 sm:w-44 h-24 sm:h-28 rounded-3xl bg-gradient-to-br ${col.gradient} text-white shadow-md hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden group border border-white/20 text-left`}
    >
      <div className="absolute inset-0 bg-black/25 group-hover:bg-black/10 transition-colors" />
      {col.badge && (
        <span className="absolute top-2 right-2 text-[9px] font-extrabold bg-white/30 backdrop-blur-md px-2 py-0.5 rounded-full border border-white/30">
          {col.badge}
        </span>
      )}
      <div className="relative z-10 p-3.5 flex flex-col justify-end h-full">
        <span className="text-xl leading-none mb-1">{col.emoji}</span>
        <span className="text-xs font-bold leading-tight line-clamp-1">{col.label}</span>
        <span className="text-[10px] text-white/80 line-clamp-1 font-normal mt-0.5">{col.subtext}</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN INSPIRATION CLIENT COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function InspirationClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
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

  // Search Autocomplete State
  const [isSearchFocused, setIsSearchFocused] = useState(false);

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
      const res = await fetch(`/api/v1/inspiration/photos?category=${encodeURIComponent(target)}&per_page=28`);
      const json = await res.json();
      if (!json.success) {
        if (json.error === "PEXELS_NOT_CONFIGURED") {
          setFetchState({ photos: [], loading: false, error: null, noApiKey: true });
          return;
        }
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
      setFetchState({ photos: [], loading: false, error: "Network error — please try again.", noApiKey: false });
    }
  }, []);

  useEffect(() => {
    fetchPhotos(activeCategory);
  }, [activeCategory, fetchPhotos]);

  // ── Filter Display Items ──
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
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter((item) => {
      const prof = getInspirationPlanningProfile(item);
      const isTheme = isStaticColorTheme(item);
      const textMatch = isTheme
        ? item.title.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
        : (item.alt || "").toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
      const styleMatch = prof.styleName.toLowerCase().includes(q) || prof.vibe.toLowerCase().includes(q);
      return textMatch || styleMatch;
    });
  }, [activeCategory, fetchState.photos, searchQuery, budgetFilter]);

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
          1. LUXURY HERO SECTION & SMART SEARCH
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0A2E2A] text-white overflow-hidden border-b border-gold/15">
        {/* Ambient Gradient Glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-[#C8A96A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-[450px] h-[450px] bg-[#0F4C45]/60 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-12 sm:pb-16 text-center space-y-6">
          {/* Top Brand Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A96A]/30 text-xs font-semibold text-[#D4B66E] backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-[#C8A96A] animate-pulse" />
            <span>Cloche Aura • India's #1 AI Wedding Planning &amp; Discovery Hub</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-black text-white tracking-tight leading-[1.05]">
            Wedding<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] via-[#F3E5AB] to-[#C8A96A]">
              {" "}Inspiration &amp; Ideas
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-sm sm:text-base text-white/80 leading-relaxed font-light">
            Discover thousands of curated wedding concepts, Kerala Kasavu traditions, luxury mandaps, bridal looks, and realistic budget breakdowns.
          </p>

          {/* Smart Search Bar with Dropdown Autocomplete */}
          <div className="max-w-2xl mx-auto relative z-20">
            <div className="relative flex items-center bg-white/10 backdrop-blur-2xl rounded-2xl border border-white/25 p-2 shadow-2xl hover:bg-white/15 transition-all focus-within:ring-2 focus-within:ring-[#C8A96A] focus-within:bg-white/20">
              <Search className="w-5 h-5 text-white/60 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setTimeout(() => setIsSearchFocused(false), 200)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ideas, styles or budgets (e.g. Kasavu Bridal, Luxury Mandap, Beach)..."
                className="w-full bg-transparent border-none px-3.5 py-2.5 text-sm text-white placeholder:text-white/45 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-2 rounded-xl text-white/60 hover:text-white hover:bg-white/10 cursor-pointer mr-1"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {}}
                className="bg-gradient-to-r from-[#C8A96A] to-[#E8C878] text-[#0F4C45] font-extrabold text-xs px-5 py-2.5 rounded-xl shrink-0 hover:opacity-95 transition-opacity shadow-md cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Smart Autocomplete Dropdown */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0A2E2A]/95 backdrop-blur-2xl border border-[#C8A96A]/30 rounded-2xl p-3 shadow-2xl text-left z-30 animate-in fade-in slide-in-from-top-2 duration-150 space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#D4B66E] px-2 uppercase tracking-wider">
                  <span>Suggested Searches</span>
                  <span>Category</span>
                </div>
                <div className="divide-y divide-white/10">
                  {SMART_SEARCH_SUGGESTIONS.filter((s) =>
                    s.text.toLowerCase().includes(searchQuery.toLowerCase())
                  ).map((s) => (
                    <button
                      key={s.text}
                      onMouseDown={() => {
                        setSearchQuery(s.text);
                        setActiveCategory(s.category);
                      }}
                      className="w-full py-2 px-2.5 hover:bg-white/10 rounded-xl flex items-center justify-between text-xs text-white transition-colors cursor-pointer text-left"
                    >
                      <span className="flex items-center gap-2">
                        <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                        {s.text}
                      </span>
                      <span className="text-[10px] text-white/50 bg-white/10 px-2 py-0.5 rounded-md">
                        {s.type}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Keyword Pills */}
            <div className="flex flex-wrap justify-center gap-2 mt-3.5">
              {["Luxury Mandap", "Kasavu Bridal", "Pastel Themes", "Monsoon Glasshouse", "Malabar Mehendi", "Under ₹3L"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setSearchQuery(tag)}
                  className="text-[11px] text-white/70 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 px-3 py-1 rounded-full transition-all cursor-pointer backdrop-blur-md"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Action CTAs: AI Mood Board & Key Statistics */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => {
                handleGenerateMoodBoard();
                setIsMoodBoardOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-gradient-to-r from-[#C8A96A] via-[#E8C878] to-[#C8A96A] text-[#0F4C45] font-extrabold text-xs sm:text-sm flex items-center justify-center gap-2.5 shadow-xl hover:scale-105 transition-transform cursor-pointer"
            >
              <Wand2 className="w-4 h-4" />
              <span>✨ Generate AI Mood Board</span>
            </button>
            <button
              onClick={() => handleOpenAura("Plan a ₹10 Lakh Kerala luxury wedding budget with stage decor, bridal makeup, and photography")}
              className="w-full sm:w-auto px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/25 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 backdrop-blur-md transition-colors cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#C8A96A]" />
              <span>Ask Aura Wedding AI</span>
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. DAILY INSPIRATION SPOTLIGHT (CURATED KERALA WEDDING HIGHLIGHT)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 -mt-6 sm:-mt-8 relative z-20">
        <div className="bg-white rounded-3xl border border-gold/20 shadow-xl overflow-hidden flex flex-col lg:flex-row">
          {/* Spotlight Image with Gradient & Badge */}
          <div className="lg:w-1/2 relative min-h-[260px] sm:min-h-[340px] bg-black">
            <img
              src={DAILY_INSPIRATION_SPOTLIGHT.image}
              alt={DAILY_INSPIRATION_SPOTLIGHT.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-4 left-4">
              <span className="bg-[#C8A96A] text-[#0F4C45] text-xs font-black px-3.5 py-1 rounded-full shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5" />
                {DAILY_INSPIRATION_SPOTLIGHT.badge}
              </span>
            </div>
            <div className="absolute bottom-4 left-4 right-4 text-white space-y-1">
              <span className="text-[11px] text-[#D4B66E] font-bold uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {DAILY_INSPIRATION_SPOTLIGHT.location}
              </span>
              <h3 className="font-serif font-black text-lg sm:text-xl leading-snug drop-shadow-md">
                {DAILY_INSPIRATION_SPOTLIGHT.title}
              </h3>
            </div>
          </div>

          {/* Spotlight Planning Details */}
          <div className="lg:w-1/2 p-6 sm:p-8 flex flex-col justify-between space-y-5 bg-gradient-to-br from-white via-[#FAF7F2] to-white">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-gold/15 pb-3">
                <div>
                  <span className="text-[11px] font-bold text-[#0F4C45] uppercase tracking-wider block">Estimated Budget</span>
                  <span className="text-sm sm:text-base font-extrabold text-charcoal">{DAILY_INSPIRATION_SPOTLIGHT.estimatedBudget}</span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-[#0F4C45] uppercase tracking-wider block">Style Classification</span>
                  <span className="text-xs font-bold text-charcoal/80">{DAILY_INSPIRATION_SPOTLIGHT.styleName}</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed font-light">
                {DAILY_INSPIRATION_SPOTLIGHT.story}
              </p>

              {/* Color Palette Preview */}
              <div className="space-y-1.5">
                <span className="text-[10px] font-extrabold text-charcoal uppercase tracking-wider">Curated Palette</span>
                <div className="flex items-center gap-2">
                  {DAILY_INSPIRATION_SPOTLIGHT.palette.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => handleCopyHex(c.hex, c.name)}
                      className="group/swatch relative flex items-center gap-1 bg-white border border-gold/20 px-2 py-1 rounded-xl shadow-xs hover:border-gold cursor-pointer transition-colors"
                    >
                      <span style={{ backgroundColor: c.hex }} className="w-3.5 h-3.5 rounded-full border border-black/10" />
                      <span className="text-[10px] font-semibold text-charcoal/80">{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-2.5 pt-2">
              <button
                onClick={() => handleOpenAura(`Replicate "${DAILY_INSPIRATION_SPOTLIGHT.title}" in Kerala. Breakdown stage decor items, recommended florist vendors, and realistic timeline.`)}
                className="flex-1 bg-[#0F4C45] hover:bg-[#12584E] text-white font-extrabold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                <span>Replicate with Aura AI</span>
              </button>
              <Link
                href="/categories/decor-planning"
                className="bg-white hover:bg-gold/10 border border-gold/30 text-[#0F4C45] font-extrabold text-xs py-3 px-4 rounded-2xl flex items-center justify-center gap-1.5 transition-colors"
              >
                <span>Find Decorators</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. TOP COLLECTIONS & TRENDING IN KERALA (CAROUSEL)
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="py-8 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-charcoal flex items-center gap-2">
                <span>🔥 Trending Collections in Kerala</span>
              </h2>
              <p className="text-xs text-charcoal/60">Curated by Cloche wedding designers &amp; stylists</p>
            </div>
            <button
              onClick={() => {
                setActiveCategory("All");
                setBudgetFilter("all");
              }}
              className="text-xs font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
            >
              View All <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex gap-3.5 overflow-x-auto scrollbar-none pb-2 pt-1">
            {INSPIRATION_COLLECTIONS.map((col) => (
              <CollectionCard
                key={col.id}
                col={col}
                onClick={() => {
                  setActiveTab("explore");
                  setActiveCategory(col.category === "Color Themes" ? "Color Themes" : col.category);
                  setSearchQuery(col.label.includes("Kerala") ? "Kasavu" : col.label);
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          4. STICKY CONTROLS & SMART BUDGET FILTERS
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-xl border-b border-gold/15 shadow-xs py-3 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col gap-3">
          {/* Top Row: Tabs, Budget Filters & AI Button */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Explore vs My Saved Tabs */}
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-2xl border border-gold/20">
              <button
                onClick={() => setActiveTab("explore")}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  activeTab === "explore" ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                Explore Ideas
              </button>
              <button
                onClick={() => setActiveTab("saved")}
                className={`px-4 py-1.5 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
                  activeTab === "saved" ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/70 hover:text-charcoal"
                }`}
              >
                <Bookmark className="w-3.5 h-3.5" />
                <span>My Saved Boards</span>
                {totalSavedCount > 0 && (
                  <span className="bg-[#C8A96A] text-[#0F4C45] text-[10px] font-black px-1.5 rounded-full">
                    {totalSavedCount}
                  </span>
                )}
              </button>
            </div>

            {/* Budget Filters (Active in Explore mode) */}
            {activeTab === "explore" && (
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
                <span className="text-[11px] font-bold text-charcoal/50 mr-1 flex items-center gap-1">
                  <DollarSign className="w-3 h-3" /> Budget:
                </span>
                {[
                  { id: "all", label: "All Tiers" },
                  { id: "budget", label: "< ₹2 Lakhs" },
                  { id: "mid", label: "₹2L – ₹5L" },
                  { id: "luxury", label: "₹5L+ Luxury" },
                ].map((b) => (
                  <button
                    key={b.id}
                    onClick={() => setBudgetFilter(b.id as any)}
                    className={`text-[11px] font-bold px-3 py-1 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
                      budgetFilter === b.id
                        ? "bg-[#C8A96A] text-[#0F4C45] shadow-xs"
                        : "bg-[#FAF7F2] text-charcoal/70 border border-gold/15 hover:border-gold"
                    }`}
                  >
                    {b.label}
                  </button>
                ))}
              </div>
            )}

            {/* Launch AI Mood Board Button */}
            <button
              onClick={() => {
                handleGenerateMoodBoard();
                setIsMoodBoardOpen(true);
              }}
              className="hidden md:flex items-center gap-2 text-xs font-extrabold bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white px-4 py-2 rounded-xl shadow-xs hover:opacity-95 transition-opacity cursor-pointer"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>AI Mood Board</span>
            </button>
          </div>

          {/* Bottom Row: Category Pills (in Explore Tab) */}
          {activeTab === "explore" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
              {INSPIRATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#0F4C45] text-[#C8A96A] shadow-md border border-[#0F4C45]"
                      : "bg-white text-charcoal/80 border border-gold/20 hover:border-gold/60 hover:bg-[#FAF7F2]"
                  }`}
                >
                  {cat.emoji} {cat.label}
                  {cat.isStatic && <span className="ml-1 text-[9px] opacity-70">✦</span>}
                </button>
              ))}
            </div>
          )}

          {/* Bottom Row: Board Selector (in Saved Tab) */}
          {activeTab === "saved" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none pt-1">
              <button
                onClick={() => setActiveBoardId("all")}
                className={`text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer shrink-0 ${
                  activeBoardId === "all" ? "bg-[#0F4C45] text-white shadow-xs" : "bg-white text-charcoal/80 border border-gold/20"
                }`}
              >
                All Boards ({totalSavedCount})
              </button>
              {boards.map((b) => {
                const count = Object.values(savedMap).filter((bds) => bds.includes(b.id)).length;
                return (
                  <button
                    key={b.id}
                    onClick={() => setActiveBoardId(b.id)}
                    className={`text-xs font-bold px-4 py-1.5 rounded-full whitespace-nowrap cursor-pointer shrink-0 ${
                      activeBoardId === b.id ? "bg-[#0F4C45] text-white shadow-xs" : "bg-white text-charcoal/80 border border-gold/20"
                    }`}
                  >
                    {b.name} ({count})
                  </button>
                );
              })}
              <button
                onClick={() => {
                  setItemToSave(null);
                  setIsCreatingBoard(true);
                }}
                className="text-xs font-bold px-3.5 py-1.5 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Board</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MAIN CONTENT FEED
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 w-full">
        {/* Pexels API Key Notification if not set */}
        {activeTab === "explore" && fetchState.noApiKey && activeCategory !== "Color Themes" && (
          <div className="mb-8 bg-amber-50 border border-amber-200 rounded-3xl p-5 flex items-start gap-3.5 shadow-sm">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1 text-xs">
              <p className="font-bold text-amber-900">Live Pexels Wedding Photos API</p>
              <p className="text-amber-800">
                To enable infinite live photo browsing, add your free Pexels API key to <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code>:
              </p>
              <code className="block mt-1 bg-amber-100/80 text-amber-950 p-2 rounded-xl font-mono text-[11px]">
                PEXELS_API_KEY=your_key_here
              </code>
              <div className="pt-1 flex items-center gap-3">
                <a
                  href="https://www.pexels.com/api/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-amber-900 underline flex items-center gap-1"
                >
                  Get free API key at pexels.com/api <ExternalLink className="w-3 h-3" />
                </a>
                <span className="text-amber-700">✦ Editorial Color Themes are active below</span>
              </div>
            </div>
          </div>
        )}

        {/* ── EXPLORE TAB FEED ── */}
        {activeTab === "explore" && (
          <>
            {/* Feed Header */}
            {!fetchState.loading && displayItems.length > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-gold/15 pb-4">
                <div>
                  <h2 className="text-lg font-serif font-black text-charcoal flex items-center gap-2">
                    <span>
                      {searchQuery
                        ? `Results for "${searchQuery}"`
                        : activeCategory === "All"
                        ? "✨ All Wedding Inspirations"
                        : `${INSPIRATION_CATEGORIES.find((c) => c.id === activeCategory)?.emoji || ""} ${activeCategory}`}
                    </span>
                    <span className="text-xs font-sans font-normal text-charcoal/50 bg-[#FAF7F2] border border-gold/20 px-2 py-0.5 rounded-full">
                      {displayItems.length} concepts
                    </span>
                  </h2>
                  <p className="text-xs text-charcoal/60 mt-0.5">
                    Click any card for realistic budget estimates, vendor credits, and Aura AI replication
                  </p>
                </div>

                {/* Direct Vendor Shortcuts for Active Category */}
                {CATEGORY_VENDOR_LINKS[activeCategory]?.length > 0 && (
                  <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
                    <span className="text-[11px] font-bold text-charcoal/50">Kerala Vendors:</span>
                    {CATEGORY_VENDOR_LINKS[activeCategory].map((v) => (
                      <Link
                        key={v.href}
                        href={v.href}
                        className="text-xs font-bold text-[#0F4C45] bg-white hover:bg-[#0F4C45] hover:text-white border border-gold/25 px-3 py-1 rounded-full transition-all flex items-center gap-1 shadow-xs"
                      >
                        <span>{v.emoji}</span>
                        <span>{v.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

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
              <div className="text-center py-24 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-4 p-8 shadow-xs">
                <Search className="w-12 h-12 text-charcoal/25 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-charcoal">No matching inspirations found</h3>
                <p className="text-xs text-charcoal/60">
                  Try adjusting your search terms, changing the budget filter, or exploring all categories.
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

            {/* Pexels ToS Attribution Footer Note */}
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
                  <span>Click any photo for photographer portfolio &amp; high-res credits</span>
                </a>
              </div>
            )}
          </>
        )}

        {/* ── MY SAVED BOARDS VIEW ── */}
        {activeTab === "saved" && (
          <div className="space-y-8">
            {/* Top Board Cards */}
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
              <button
                onClick={() => {
                  setItemToSave(null);
                  setIsCreatingBoard(true);
                }}
                className="p-4 rounded-3xl border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] text-[#0F4C45] transition-all cursor-pointer text-left bg-[#FAF7F2] flex flex-col justify-center"
              >
                <Plus className="w-5 h-5 mb-1 opacity-70" />
                <p className="text-sm font-extrabold">Create Board</p>
              </button>
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
          6. LIGHTBOX DETAIL MODAL (ANSWERS ALL 6 CORE QUESTIONS)
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

            {/* Left Column: High-Res Image & Attribution */}
            <div className="md:w-1/2 bg-black flex flex-col justify-between relative min-h-[300px] sm:min-h-[500px]">
              <img
                src={isStaticColorTheme(selectedItem) ? selectedItem.image : selectedItem.src.large2x}
                alt={isStaticColorTheme(selectedItem) ? selectedItem.title : selectedItem.alt || selectedItem.category}
                className="w-full h-full max-h-[450px] md:max-h-full object-cover"
              />

              {/* Attribution Overlay */}
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

            {/* Right Column: 6 Core Questions Intelligence Dashboard */}
            <div className="md:w-1/2 flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[92vh] bg-white">
              <div className="p-6 sm:p-8 space-y-6 flex-1">
                {/* Header & Quick Action Buttons */}
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

                {/* ── QUESTION 1: WHAT IS THIS STYLE? ── */}
                <div className="space-y-2 bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
                    <span>1. Style &amp; Aesthetic Concept</span>
                  </div>
                  <p className="text-xs text-charcoal/80 leading-relaxed">
                    {selectedProfile.vibe}
                  </p>
                  <div className="text-[11px] text-[#0F4C45] font-semibold flex items-center gap-1.5 pt-1">
                    <span>🌴 Kerala Heritage Touch:</span>
                    <span className="text-charcoal/80 font-normal">{selectedProfile.keralaTouch}</span>
                  </div>
                </div>

                {/* ── QUESTION 2: HOW MUCH WILL IT COST? ── */}
                <div className="space-y-3 bg-white p-4 rounded-2xl border border-gold/20 shadow-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                      <DollarSign className="w-4 h-4 text-[#C8A96A]" />
                      <span>2. Realistic Budget Breakdown</span>
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

                {/* ── PALETTE FOR COLOR THEMES ── */}
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
                    <p className="text-[10px] text-charcoal/50 italic text-center">Click any swatch to copy HEX code</p>
                  </div>
                )}

                {/* ── QUESTION 3 & 6: RECOMMENDED VENDORS & IMMEDIATE CONTACT ── */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-charcoal uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-[#0F4C45]" />
                      <span>3. Verified Kerala Vendors</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#0F4C45] bg-[#FAF7F2] px-2 py-0.5 rounded-full border border-gold/20">
                      Direct Quote Ready
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

                {/* ── QUESTION 4: AURA AI REPLICATION CTA ── */}
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

              {/* Related / Similar Inspirations Section */}
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
          7. AI MOOD BOARD GENERATOR INTERACTIVE MODAL
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

            {/* Step 1 & 2 Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Wedding Style */}
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

              {/* Color Theme */}
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

              {/* Budget Tier */}
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

              {/* Venue Setting */}
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

            {/* Generate / Refresh Button */}
            <button
              onClick={handleGenerateMoodBoard}
              className="w-full py-3 rounded-2xl bg-[#0F4C45] hover:bg-[#12584E] text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#C8A96A]" />
              <span>Update AI Mood Board</span>
            </button>

            {/* Generated Mood Board Preview */}
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

                {/* Color Swatches */}
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

                {/* Styling Checklist */}
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

                {/* Actions */}
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

      {/* ══════════════════════════════════════════════════════════════════════
          8. SAVE TO BOARD MODAL
      ══════════════════════════════════════════════════════════════════════ */}
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
                  placeholder="e.g. Kasavu Saree Ideas, Mandap Setup..."
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
