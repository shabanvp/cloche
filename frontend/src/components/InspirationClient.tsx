"use client";

import {
  useState, useEffect, useMemo, useCallback, useRef,
} from "react";
import Link from "next/link";
import {
  Sparkles, Search, Bookmark, Share2, X, Plus, Check,
  Download, FolderPlus, ExternalLink, CheckCircle2,
  AlertCircle, ArrowRight, Heart, Eye, ChevronRight,
  TrendingUp, Clock, Flame
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuraAssistantDrawer } from "@/components/AuraAssistantDrawer";
import {
  INSPIRATION_CATEGORIES, DYNAMIC_CATEGORIES, STATIC_COLOR_THEMES,
  AURA_INSPIRATION_PROMPTS, INSPIRATION_COLLECTIONS, CATEGORY_VENDOR_LINKS,
  DEFAULT_BOARDS, DynamicInspirationPhoto, StaticColorTheme, InspirationItem,
  InspirationCollection, isStaticColorTheme, ColorSwatch, InspirationCategory,
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
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getAspectClass(w: number, h: number) {
  const r = h / w;
  if (r >= 1.6) return "aspect-[9/16]";
  if (r >= 1.2) return "aspect-[3/4]";
  if (r >= 0.9) return "aspect-[1/1]";
  return "aspect-[4/3]";
}

// ─────────────────────────────────────────────────────────────────────────────
// SKELETON
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard({ idx }: { idx: number }) {
  const heights = ["h-64", "h-48", "h-80", "h-56", "h-72", "h-52"];
  return (
    <div className={`break-inside-avoid rounded-2xl bg-gradient-to-b from-gray-200 to-gray-100 ${heights[idx % 6]} mb-4 animate-pulse relative overflow-hidden`}>
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />
      <div className="absolute bottom-3 left-3 right-3 space-y-1.5">
        <div className="h-2 bg-white/40 rounded-full w-1/3" />
        <div className="h-1.5 bg-white/30 rounded-full w-2/3" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PHOTO CARD
// ─────────────────────────────────────────────────────────────────────────────
function PhotoCard({ item, saved, recentlyViewed, onClick, onSave, onShare }: {
  item: DynamicInspirationPhoto; saved: boolean; recentlyViewed?: boolean;
  onClick: () => void; onSave: (e: React.MouseEvent) => void; onShare: (e: React.MouseEvent) => void;
}) {
  const [imgLoaded, setImgLoaded] = useState(false);
  const aspectClass = getAspectClass(item.width, item.height);
  const caption = item.alt || item.category;

  return (
    <div onClick={onClick} className="break-inside-avoid mb-4 relative group cursor-pointer">
      <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${aspectClass} shadow-sm group-hover:shadow-xl transition-all duration-300`}>
        {/* Shimmer placeholder */}
        {!imgLoaded && <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-100 animate-pulse" />}
        <img
          src={item.src.large}
          alt={caption}
          loading="lazy"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-[1.04] ${imgLoaded ? "opacity-100" : "opacity-0"}`}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top: category + actions */}
        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#D4B66E] px-2.5 py-1 rounded-full">
            {item.category}
          </span>
          <div className="flex gap-1.5">
            <button onClick={onSave} className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${saved ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-black/60 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"}`}>
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button onClick={onShare} className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Bottom: caption */}
        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <p className="text-white text-xs font-medium line-clamp-2 leading-snug drop-shadow">{caption}</p>
        </div>

        {/* Pexels attribution (always visible, small) */}
        <div className="absolute bottom-0 left-0 right-0 px-2.5 py-1.5 bg-gradient-to-t from-black/50 to-transparent group-hover:opacity-0 transition-opacity duration-300">
          <span className="text-[9px] text-white/60 font-medium truncate block">📷 {item.photographer} / Pexels</span>
        </div>

        {/* Saved badge */}
        {saved && (
          <div className="absolute top-2.5 left-2.5">
            <span className="bg-[#C8A96A] text-[#0F4C45] text-[9px] font-bold px-2 py-0.5 rounded-full">Saved</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR THEME CARD
// ─────────────────────────────────────────────────────────────────────────────
function ColorThemeCard({ item, saved, onClick, onSave, onShare }: {
  item: StaticColorTheme; saved: boolean;
  onClick: () => void; onSave: (e: React.MouseEvent) => void; onShare: (e: React.MouseEvent) => void;
}) {
  const aspectMap = { tall: "aspect-[9/16]", portrait: "aspect-[3/4]", square: "aspect-[1/1]", landscape: "aspect-[4/3]" };
  return (
    <div onClick={onClick} className="break-inside-avoid mb-4 relative group cursor-pointer">
      <div className={`relative w-full overflow-hidden rounded-2xl bg-gray-100 ${aspectMap[item.aspectRatio]} shadow-sm group-hover:shadow-xl transition-all duration-300`}>
        <img src={item.image} alt={item.title} loading="lazy" className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="absolute top-0 left-0 right-0 p-3 flex items-start justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-[10px] font-bold uppercase tracking-wider bg-black/60 backdrop-blur-md text-[#D4B66E] px-2.5 py-1 rounded-full">🎨 Color Theme</span>
          <div className="flex gap-1.5">
            <button onClick={onSave} className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${saved ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-black/60 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"}`}>
              <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
            </button>
            <button onClick={onShare} className="p-2 rounded-full bg-black/60 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer">
              <Share2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <h4 className="text-white text-xs font-bold line-clamp-1 mb-1.5">{item.title}</h4>
          <div className="flex gap-1">
            {item.colorTheme.slice(0, 5).map((c, i) => (
              <span key={i} style={{ backgroundColor: c.hex }} className="w-4 h-4 rounded-full border border-white/50 shadow-xs" />
            ))}
          </div>
        </div>
      </div>
      {/* Below-card mini palette strip */}
      <div className="flex gap-1 mt-2 px-0.5">
        {item.colorTheme.slice(0, 5).map((c, i) => (
          <span key={i} style={{ backgroundColor: c.hex }} className="flex-1 h-1.5 rounded-full" />
        ))}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COLLECTION CARD
// ─────────────────────────────────────────────────────────────────────────────
function CollectionCard({ col, onClick }: { col: InspirationCollection; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex-shrink-0 w-32 sm:w-36 h-20 sm:h-24 rounded-2xl bg-gradient-to-br ${col.gradient} text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden group`}
    >
      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
      {col.badge && (
        <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-white/25 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
          {col.badge}
        </span>
      )}
      <div className="relative z-10 p-3 flex flex-col justify-end h-full">
        <span className="text-lg leading-none mb-0.5">{col.emoji}</span>
        <span className="text-[11px] font-bold leading-tight text-left">{col.label}</span>
      </div>
    </button>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function InspirationClient() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"explore" | "saved">("explore");
  const [activeBoardId, setActiveBoardId] = useState("all");
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [auraInitialQuery, setAuraInitialQuery] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [itemToSave, setItemToSave] = useState<InspirationItem | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Default boards pre-populated
  const [boards, setBoards] = useState<Board[]>(
    DEFAULT_BOARDS.map((b, i) => ({ ...b, createdAt: Date.now() - i }))
  );
  const [savedMap, setSavedMap] = useState<Record<string, string[]>>({});

  const photoCache = useRef<Record<string, DynamicInspirationPhoto[]>>({});
  const [fetchState, setFetchState] = useState<FetchState>({ photos: [], loading: false, error: null, noApiKey: false });

  // Load from localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const b = localStorage.getItem("cloche_insp_boards_v2");
      if (b) { const p = JSON.parse(b); if (Array.isArray(p) && p.length > 0) setBoards(p); }
      const s = localStorage.getItem("cloche_insp_saves_v2");
      if (s) { const p = JSON.parse(s); if (typeof p === "object") setSavedMap(p); }
      const rv = localStorage.getItem("cloche_insp_recent");
      if (rv) setRecentlyViewed(JSON.parse(rv).slice(0, 8));
    } catch {}
  }, []);

  const persist = (key: string, val: unknown) => {
    try { localStorage.setItem(key, JSON.stringify(val)); } catch {}
  };
  const saveBoards = (v: Board[]) => { setBoards(v); persist("cloche_insp_boards_v2", v); };
  const saveSaves = (v: Record<string, string[]>) => { setSavedMap(v); persist("cloche_insp_saves_v2", v); };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2600);
  };

  const isItemSaved = (id: string) => Boolean(savedMap[id]?.length);

  const handleQuickSave = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = item.id;
    if (savedMap[id]?.length) {
      const next = { ...savedMap }; delete next[id]; saveSaves(next);
      showToast("Removed from saved");
    } else {
      saveSaves({ ...savedMap, [id]: [boards[0]?.id || "dream-wedding"] });
      showToast(`Saved to ${boards[0]?.name || "Dream Wedding"} ❤️`);
    }
  };

  const handleToggleBoardSave = (boardId: string) => {
    if (!itemToSave) return;
    const id = itemToSave.id;
    const curr = savedMap[id] || [];
    const next = curr.includes(boardId) ? curr.filter(b => b !== boardId) : [...curr, boardId];
    const updated = { ...savedMap };
    if (next.length === 0) delete updated[id]; else updated[id] = next;
    saveSaves(updated);
  };

  const handleCreateBoard = () => {
    const name = newBoardName.trim();
    if (!name) return;
    const nb: Board = { id: `board-${Date.now()}`, name, createdAt: Date.now() };
    saveBoards([...boards, nb]);
    setNewBoardName(""); setIsCreatingBoard(false);
    if (itemToSave) {
      saveSaves({ ...savedMap, [itemToSave.id]: [...(savedMap[itemToSave.id] || []), nb.id] });
      showToast(`Created "${name}" and saved!`);
    } else {
      showToast(`Created board "${name}"`);
    }
  };

  const handleShare = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const url = `${window.location.origin}/inspiration?id=${item.id}`;
    navigator.clipboard?.writeText(url);
    showToast("Link copied! 📋");
  };

  const handleCopyHex = (hex: string, name: string) => {
    navigator.clipboard?.writeText(hex);
    showToast(`Copied ${name} (${hex}) ✨`);
  };

  const handleDownloadPalette = (item: StaticColorTheme) => {
    const txt = `${item.title}\n` + item.colorTheme.map(c => `${c.name}: ${c.hex}`).join("\n");
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([txt], { type: "text/plain" })),
      download: `${item.id}-palette.txt`,
    });
    a.click();
    showToast("Palette downloaded! 🎨");
  };

  const openItem = (item: InspirationItem) => {
    setSelectedItem(item);
    const rv = [item.id, ...recentlyViewed.filter(id => id !== item.id)].slice(0, 8);
    setRecentlyViewed(rv);
    persist("cloche_insp_recent", rv);
  };

  const handleOpenAura = (prompt: string) => {
    setAuraInitialQuery(prompt);
    setIsAuraOpen(true);
  };

  // ── Fetch photos ──
  const fetchPhotos = useCallback(async (key: string) => {
    if (key === "Color Themes") { setFetchState({ photos: [], loading: false, error: null, noApiKey: false }); return; }
    const target = key === "All" ? "Wedding Photos" : key;
    if (photoCache.current[target]) {
      setFetchState({ photos: photoCache.current[target], loading: false, error: null, noApiKey: false });
      return;
    }
    setFetchState(p => ({ ...p, loading: true, error: null }));
    try {
      const res = await fetch(`/api/v1/inspiration/photos?category=${encodeURIComponent(target)}&per_page=24`);
      const json = await res.json();
      if (!json.success) {
        if (json.error === "PEXELS_NOT_CONFIGURED") { setFetchState({ photos: [], loading: false, error: null, noApiKey: true }); return; }
        setFetchState({ photos: [], loading: false, error: json.message || "Failed to load photos", noApiKey: false });
        return;
      }
      const photos: DynamicInspirationPhoto[] = (json.photos || []).map((p: any) => ({ ...p, category: target as InspirationCategory, pexels_url: p.url }));
      photoCache.current[target] = photos;
      setFetchState({ photos, loading: false, error: null, noApiKey: false });
    } catch {
      setFetchState({ photos: [], loading: false, error: "Network error — please try again.", noApiKey: false });
    }
  }, []);

  useEffect(() => { fetchPhotos(activeCategory); }, [activeCategory, fetchPhotos]);

  // ── Display items ──
  const displayItems = useMemo<InspirationItem[]>(() => {
    const dynamic = fetchState.photos;
    const statics = STATIC_COLOR_THEMES;
    const all = activeCategory === "All"
      ? [...dynamic, ...statics]
      : activeCategory === "Color Themes"
        ? statics
        : dynamic;
    if (!searchQuery.trim()) return all;
    const q = searchQuery.toLowerCase();
    return all.filter(item =>
      isStaticColorTheme(item)
        ? item.title.toLowerCase().includes(q) || item.tags.some(t => t.toLowerCase().includes(q))
        : (item.alt || "").toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [activeCategory, fetchState.photos, searchQuery]);

  // ── Saved view ──
  const savedItemsList = useMemo<InspirationItem[]>(() => {
    const all: InspirationItem[] = [...STATIC_COLOR_THEMES, ...Object.values(photoCache.current).flat()];
    return all.filter(item => {
      const bs = savedMap[item.id] || [];
      return activeBoardId === "all" ? bs.length > 0 : bs.includes(activeBoardId);
    });
  }, [savedMap, activeBoardId]);

  const totalSavedCount = useMemo(() => Object.keys(savedMap).length, [savedMap]);

  // ── Related items in lightbox ──
  const relatedItems = useMemo<InspirationItem[]>(() => {
    if (!selectedItem) return [];
    const all: InspirationItem[] = [...STATIC_COLOR_THEMES, ...Object.values(photoCache.current).flat()];
    return all.filter(i => i.id !== selectedItem.id && i.category === selectedItem.category).slice(0, 6);
  }, [selectedItem]);

  const vendorLinks = selectedItem ? CATEGORY_VENDOR_LINKS[selectedItem.category] || [] : [];
  const activeCollectionForVendors = CATEGORY_VENDOR_LINKS[activeCategory] || [];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2520] antialiased flex flex-col selection:bg-[#C8A96A]/30">
      <style>{`
        @keyframes shimmer { from { transform: translateX(-100%); } to { transform: translateX(200%); } }
        .line-clamp-2 { overflow: hidden; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; }
        .scrollbar-none { scrollbar-width: none; -ms-overflow-style: none; }
        .scrollbar-none::-webkit-scrollbar { display: none; }
      `}</style>

      {/* ── TOAST ── */}
      {toastMessage && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[100] bg-[#0F4C45] text-white text-xs font-bold px-5 py-2.5 rounded-full shadow-xl flex items-center gap-2 border border-[#C8A96A]/30 animate-in fade-in slide-in-from-bottom-4 duration-150">
          <CheckCircle2 className="w-4 h-4 text-[#C8A96A]" />
          {toastMessage}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          1. PREMIUM HERO
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="relative bg-[#0A2E2A] text-white overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#C8A96A]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#0F4C45]/50 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-emerald-900/30 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-10 pt-12 sm:pt-16 pb-10 sm:pb-14 text-center space-y-5">
          {/* Top badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-[#C8A96A]/30 text-xs font-semibold text-[#D4B66E]">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>India's Premium Wedding Inspiration Hub</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-7xl font-serif font-black text-white tracking-tight leading-[1.05]">
            Wedding<br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C8A96A] via-[#E8C878] to-[#C8A96A]"> Inspiration</span>
          </h1>

          <p className="max-w-xl mx-auto text-sm sm:text-base text-white/70 leading-relaxed font-light">
            Discover beautiful wedding ideas, Kerala traditions, luxury decor, bridal looks, and real weddings.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white/10 backdrop-blur-xl rounded-2xl border border-white/20 p-2 shadow-2xl hover:bg-white/15 transition-colors focus-within:ring-2 focus-within:ring-[#C8A96A]/50">
              <Search className="w-5 h-5 text-white/50 ml-3 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search wedding ideas (e.g. Luxury Mandap, Kasavu Bridal, Pastel Wedding)..."
                className="w-full bg-transparent border-none px-3 py-2.5 text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-2 rounded-xl text-white/50 hover:text-white hover:bg-white/10 cursor-pointer mr-1">
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                onClick={() => {}}
                className="bg-gradient-to-r from-[#C8A96A] to-[#E8C878] text-[#0F4C45] font-bold text-xs px-4 py-2.5 rounded-xl shrink-0 hover:opacity-90 transition-opacity cursor-pointer"
              >
                Search
              </button>
            </div>

            {/* Quick searches */}
            <div className="flex flex-wrap justify-center gap-2 mt-3">
              {["Luxury Mandap", "Royal Reception", "Kasavu Bridal", "Pastel Wedding", "Traditional Kerala", "Outdoor Reception"].map(tag => (
                <button key={tag} onClick={() => setSearchQuery(tag)} className="text-[11px] text-white/60 hover:text-white bg-white/8 hover:bg-white/15 border border-white/15 px-3 py-1 rounded-full transition-all cursor-pointer">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-6 pt-2 text-[11px] text-white/50">
            <span className="flex items-center gap-1.5"><TrendingUp className="w-3.5 h-3.5 text-[#C8A96A]" /> 10,000+ ideas</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> Updated daily</span>
            <span className="w-px h-3 bg-white/20" />
            <span className="flex items-center gap-1.5"><Heart className="w-3.5 h-3.5 text-rose-400" /> Save your ideas</span>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          2. CURATED COLLECTIONS ROW
      ══════════════════════════════════════════════════════════════════════ */}
      <section className="bg-white border-b border-gold/10 py-5 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <h2 className="text-sm font-bold text-charcoal">Top Collections</h2>
            <span className="text-xs text-charcoal/50">Browse curated wedding inspirations</span>
          </div>
          <div className="flex gap-3 overflow-x-auto scrollbar-none pb-1">
            {INSPIRATION_COLLECTIONS.map(col => (
              <CollectionCard
                key={col.id}
                col={col}
                onClick={() => {
                  setActiveTab("explore");
                  setActiveCategory(col.category === "Color Themes" ? "Color Themes" : col.category);
                  window.scrollTo({ top: 400, behavior: "smooth" });
                }}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════════
          3. STICKY FILTER BAR
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold/15 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-3 flex flex-col gap-3">
          {/* Tabs */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-[#FAF7F2] p-1 rounded-xl border border-gold/20 w-fit">
              <button onClick={() => setActiveTab("explore")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${activeTab === "explore" ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/70 hover:text-charcoal"}`}>
                Explore
              </button>
              <button onClick={() => setActiveTab("saved")} className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "saved" ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/70 hover:text-charcoal"}`}>
                <Bookmark className="w-3.5 h-3.5" />
                My Boards
                {totalSavedCount > 0 && <span className="bg-[#C8A96A] text-[#0F4C45] text-[10px] font-extrabold px-1.5 rounded-full">{totalSavedCount}</span>}
              </button>
            </div>

            {/* Aura quick button */}
            <button
              onClick={() => handleOpenAura(AURA_INSPIRATION_PROMPTS[0])}
              className="hidden sm:flex items-center gap-2 text-xs font-bold bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white px-4 py-2 rounded-xl cursor-pointer hover:opacity-90 transition-opacity"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C8A96A]" />
              Ask Aura
            </button>
          </div>

          {/* Category pills */}
          {activeTab === "explore" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              {INSPIRATION_CATEGORIES.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer shrink-0 transition-all ${
                    activeCategory === cat.id
                      ? "bg-[#0F4C45] text-[#C8A96A] shadow-xs border border-[#0F4C45]"
                      : "bg-white text-charcoal/80 border border-gold/20 hover:border-gold/50 hover:bg-[#FAF7F2]"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          )}

          {/* Saved board pills */}
          {activeTab === "saved" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
              <button onClick={() => setActiveBoardId("all")} className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer shrink-0 ${activeBoardId === "all" ? "bg-[#0F4C45] text-white" : "bg-white text-charcoal/80 border border-gold/20"}`}>
                All ({totalSavedCount})
              </button>
              {boards.map(b => (
                <button key={b.id} onClick={() => setActiveBoardId(b.id)} className={`text-xs font-semibold px-3.5 py-1.5 rounded-full whitespace-nowrap cursor-pointer shrink-0 ${activeBoardId === b.id ? "bg-[#0F4C45] text-white" : "bg-white text-charcoal/80 border border-gold/20"}`}>
                  {b.name}
                </button>
              ))}
              <button onClick={() => { setItemToSave(null); setIsCreatingBoard(true); }} className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-dashed border-[#0F4C45]/40 flex items-center gap-1 shrink-0 cursor-pointer">
                <Plus className="w-3 h-3" /> Board
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          4. AURA CONTEXTUAL STRIP
      ══════════════════════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-5">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#0F4C45] to-[#072B27] border border-[#C8A96A]/20 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_right,rgba(200,169,106,0.1),transparent_60%)]" />
          <div className="relative flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#C8A96A]/20 border border-[#C8A96A]/30 flex items-center justify-center shrink-0">
              <Sparkles className="w-4.5 h-4.5 text-[#C8A96A]" />
            </div>
            <div>
              <p className="text-xs font-bold text-[#C8A96A]">✨ Need personalized wedding ideas?</p>
              <p className="text-[11px] text-white/60">Ask Aura AI to find decor, themes, and budget plans</p>
            </div>
          </div>
          <div className="relative flex items-center gap-2 overflow-x-auto scrollbar-none">
            {AURA_INSPIRATION_PROMPTS.slice(0, 3).map((p, i) => (
              <button key={i} onClick={() => handleOpenAura(p)} className="text-[11px] whitespace-nowrap bg-white/10 hover:bg-white/20 text-white border border-white/20 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 font-medium">
                &ldquo;{p}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          5. MAIN CONTENT
      ══════════════════════════════════════════════════════════════════════ */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full">

        {/* No API key notice */}
        {activeTab === "explore" && fetchState.noApiKey && activeCategory !== "Color Themes" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-xs font-bold text-amber-800">Live photos require a Pexels API key</p>
              <p className="text-xs text-amber-700">Add <code className="bg-amber-100 px-1 rounded font-mono">PEXELS_API_KEY=your_key_here</code> to <code className="bg-amber-100 px-1 rounded font-mono">.env.local</code></p>
              <a href="https://www.pexels.com/api/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:underline">
                Get a free key at pexels.com/api <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-[11px] text-amber-600">Color Themes below are still available.</p>
            </div>
          </div>
        )}

        {/* Error */}
        {activeTab === "explore" && fetchState.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
            <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700">{fetchState.error}</p>
              <button onClick={() => fetchPhotos(activeCategory)} className="text-xs text-red-600 underline cursor-pointer">Retry</button>
            </div>
          </div>
        )}

        {/* ── EXPLORE FEED ── */}
        {activeTab === "explore" && (
          <>
            {/* Section header */}
            {!fetchState.loading && displayItems.length > 0 && (
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-base font-bold text-charcoal">
                    {searchQuery ? `Results for "${searchQuery}"` : activeCategory === "All" ? "✨ All Inspirations" : `${INSPIRATION_CATEGORIES.find(c => c.id === activeCategory)?.emoji || ""} ${activeCategory}`}
                  </h2>
                  <p className="text-xs text-charcoal/50 mt-0.5">{displayItems.length} inspirations</p>
                </div>
                {/* Vendor discovery bar */}
                {activeCollectionForVendors.length > 0 && (
                  <div className="hidden md:flex items-center gap-2">
                    <span className="text-xs text-charcoal/50 font-medium">Discover real vendors:</span>
                    {activeCollectionForVendors.map(link => (
                      <Link key={link.href} href={link.href} className="text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] border border-gold/20 px-3 py-1.5 rounded-full hover:bg-gold/15 transition-colors flex items-center gap-1">
                        {link.emoji} {link.label} <ChevronRight className="w-3 h-3" />
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Loading skeletons */}
            {fetchState.loading && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {Array.from({ length: 15 }).map((_, i) => <SkeletonCard key={i} idx={i} />)}
              </div>
            )}

            {/* Empty state */}
            {!fetchState.loading && displayItems.length === 0 && !fetchState.noApiKey && (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-4 p-8">
                <Search className="w-10 h-10 text-charcoal/30 mx-auto" />
                <h3 className="font-serif font-bold text-xl text-charcoal">No inspirations found</h3>
                <p className="text-xs text-charcoal/50">Try a different search or browse all categories</p>
                <button onClick={() => { setActiveCategory("All"); setSearchQuery(""); }} className="bg-[#0F4C45] text-white text-xs font-bold px-5 py-2.5 rounded-full cursor-pointer">
                  Browse All
                </button>
              </div>
            )}

            {/* Masonry Grid */}
            {!fetchState.loading && displayItems.length > 0 && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {displayItems.map(item => {
                  const saved = isItemSaved(item.id);
                  if (isStaticColorTheme(item)) {
                    return <ColorThemeCard key={item.id} item={item} saved={saved} onClick={() => openItem(item)} onSave={e => { e.stopPropagation(); setItemToSave(item); }} onShare={e => handleShare(item, e)} />;
                  }
                  return <PhotoCard key={item.id} item={item} saved={saved} onClick={() => openItem(item)} onSave={e => { e.stopPropagation(); setItemToSave(item); }} onShare={e => handleShare(item, e)} />;
                })}
              </div>
            )}

            {/* Pexels ToS footer */}
            {!fetchState.loading && !fetchState.noApiKey && activeCategory !== "Color Themes" && fetchState.photos.length > 0 && (
              <div className="mt-10 text-center">
                <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[11px] text-charcoal/40 hover:text-[#0F4C45] transition-colors">
                  Photos provided by Pexels · Click any photo to see photographer credit
                </a>
              </div>
            )}
          </>
        )}

        {/* ── MY SAVED BOARDS ── */}
        {activeTab === "saved" && (
          <div className="space-y-6">
            {/* Board cards at top */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {boards.map(b => {
                const count = Object.values(savedMap).filter(bds => bds.includes(b.id)).length;
                return (
                  <button key={b.id} onClick={() => setActiveBoardId(b.id)} className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${activeBoardId === b.id ? "bg-[#0F4C45] text-white border-[#0F4C45]" : "bg-white border-gold/15 hover:border-gold/40"}`}>
                    <p className="text-sm font-bold mb-0.5 line-clamp-1">{b.name}</p>
                    <p className={`text-[11px] ${activeBoardId === b.id ? "text-white/70" : "text-charcoal/50"}`}>{count} saved</p>
                  </button>
                );
              })}
              <button onClick={() => { setItemToSave(null); setIsCreatingBoard(true); }} className="p-4 rounded-2xl border border-dashed border-[#0F4C45]/30 hover:border-[#0F4C45] text-[#0F4C45] transition-all cursor-pointer text-left">
                <Plus className="w-5 h-5 mb-1 opacity-60" />
                <p className="text-sm font-bold">New Board</p>
              </button>
            </div>

            {savedItemsList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-4 p-8">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-gold/20 flex items-center justify-center text-[#C8A96A] mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl">Your board is empty</h3>
                <p className="text-xs text-charcoal/50">Start exploring and save ideas to this board</p>
                <button onClick={() => setActiveTab("explore")} className="bg-[#0F4C45] text-white text-xs font-bold px-6 py-2.5 rounded-full cursor-pointer">
                  Start Exploring
                </button>
              </div>
            ) : (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4">
                {savedItemsList.map(item => {
                  if (isStaticColorTheme(item)) {
                    return <ColorThemeCard key={item.id} item={item} saved onClick={() => openItem(item)} onSave={e => handleQuickSave(item, e)} onShare={e => handleShare(item, e)} />;
                  }
                  return <PhotoCard key={item.id} item={item} saved onClick={() => openItem(item)} onSave={e => handleQuickSave(item, e)} onShare={e => handleShare(item, e)} />;
                })}
              </div>
            )}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════════════════════════════════════
          6. DETAIL LIGHTBOX
      ══════════════════════════════════════════════════════════════════════ */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={() => setSelectedItem(null)}>
          <div className="bg-white w-full sm:max-w-4xl sm:rounded-3xl max-h-[95vh] overflow-hidden shadow-2xl flex flex-col md:flex-row relative animate-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {/* Image */}
            <div className="md:w-[45%] bg-black flex items-center justify-center relative min-h-[280px] sm:min-h-[500px]">
              <img
                src={isStaticColorTheme(selectedItem) ? selectedItem.image : selectedItem.src.large2x}
                alt={isStaticColorTheme(selectedItem) ? selectedItem.title : (selectedItem.alt || selectedItem.category)}
                className="w-full h-full max-h-[500px] md:max-h-full object-cover"
              />
              {!isStaticColorTheme(selectedItem) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between">
                  <span className="text-[11px] text-white/90">📷 {selectedItem.photographer}</span>
                  <a href={selectedItem.pexels_url} target="_blank" rel="noopener noreferrer" className="text-[10px] text-white/60 hover:text-white flex items-center gap-0.5" onClick={e => e.stopPropagation()}>
                    Pexels <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="md:w-[55%] flex flex-col overflow-y-auto max-h-[60vh] md:max-h-[90vh]">
              <div className="p-5 sm:p-7 space-y-5 flex-1">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                    {INSPIRATION_CATEGORIES.find(c => c.id === selectedItem.category)?.emoji} {selectedItem.category}
                  </span>
                  <div className="flex items-center gap-2 shrink-0">
                    <button onClick={() => handleShare(selectedItem)} className="p-2 rounded-full bg-[#FAF7F2] text-charcoal border border-gold/20 cursor-pointer hover:bg-gold/15 transition-colors">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button onClick={() => setItemToSave(selectedItem)} className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer ${isItemSaved(selectedItem.id) ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-[#0F4C45] text-white hover:bg-[#135951]"}`}>
                      <Bookmark className={`w-3.5 h-3.5 ${isItemSaved(selectedItem.id) ? "fill-current" : ""}`} />
                      {isItemSaved(selectedItem.id) ? "Saved" : "Save"}
                    </button>
                  </div>
                </div>

                {/* Title */}
                <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal leading-snug">
                  {isStaticColorTheme(selectedItem) ? selectedItem.title : (selectedItem.alt || selectedItem.category)}
                </h2>

                {/* Description (static themes only) */}
                {isStaticColorTheme(selectedItem) && (
                  <p className="text-sm text-charcoal/70 leading-relaxed">{selectedItem.description}</p>
                )}

                {/* Photographer credit (dynamic photos) */}
                {!isStaticColorTheme(selectedItem) && (
                  <div className="bg-[#FAF7F2] rounded-xl p-3 flex items-center justify-between border border-gold/15">
                    <span className="text-xs text-charcoal/70">Photo by <span className="font-semibold text-charcoal">{selectedItem.photographer}</span></span>
                    <a href={selectedItem.photographer_url} target="_blank" rel="noopener noreferrer" className="text-[11px] text-[#0F4C45] font-bold hover:underline flex items-center gap-0.5">
                      Profile <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Color palette (editorial themes only) */}
                {isStaticColorTheme(selectedItem) && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">🎨 Color Palette</span>
                      <button onClick={() => handleDownloadPalette(selectedItem)} className="text-[11px] font-bold text-[#0F4C45] flex items-center gap-1 cursor-pointer hover:underline">
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {selectedItem.colorTheme.map((c, i) => (
                        <button key={i} onClick={() => handleCopyHex(c.hex, c.name)} className="flex flex-col items-center gap-1 cursor-pointer group/s">
                          <div style={{ backgroundColor: c.hex }} className="w-full h-9 rounded-xl border border-black/10 group-hover/s:scale-105 transition-transform" />
                          <span className="text-[9px] font-semibold text-charcoal/70 truncate w-full text-center">{c.name}</span>
                          <span className="text-[8px] font-mono text-charcoal/40">{c.hex}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-charcoal/40 italic text-center">Click any swatch to copy HEX</p>
                  </div>
                )}

                {/* Tags (static themes) */}
                {isStaticColorTheme(selectedItem) && selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.tags.map(t => (
                      <span key={t} className="text-[11px] bg-[#FAF7F2] text-charcoal/70 px-2.5 py-1 rounded-full border border-gold/15">#{t}</span>
                    ))}
                  </div>
                )}

                {/* VENDOR DISCOVERY — show real Cloche vendor links */}
                {vendorLinks.length > 0 && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-bold text-charcoal uppercase tracking-wider">Discover Real Vendors</p>
                    <div className="grid grid-cols-2 gap-2">
                      {vendorLinks.map(link => (
                        <Link key={link.href} href={link.href} onClick={() => setSelectedItem(null)} className="flex items-center gap-2 bg-[#FAF7F2] hover:bg-[#0F4C45] hover:text-white border border-gold/15 hover:border-[#0F4C45] text-charcoal px-3 py-2.5 rounded-xl text-xs font-semibold transition-all group">
                          <span className="text-base">{link.emoji}</span>
                          <span className="flex-1 line-clamp-1">{link.label}</span>
                          <ChevronRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {/* Ask Aura */}
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    handleOpenAura(`Tell me about "${isStaticColorTheme(selectedItem) ? selectedItem.title : selectedItem.category}" style for a Kerala wedding`);
                  }}
                  className="w-full py-3 rounded-2xl bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white text-sm font-bold flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 transition-opacity"
                >
                  <Sparkles className="w-4 h-4 text-[#C8A96A]" />
                  Ask Aura to plan this style
                </button>
              </div>

              {/* More Like This */}
              {relatedItems.length > 0 && (
                <div className="border-t border-gold/10 p-5 sm:p-7 space-y-3">
                  <p className="text-xs font-bold text-charcoal uppercase tracking-wider">More Like This</p>
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {relatedItems.map(rel => (
                      <div key={rel.id} onClick={() => setSelectedItem(rel)} className="aspect-square rounded-xl overflow-hidden bg-gray-100 cursor-pointer hover:opacity-80 transition-opacity border border-gold/10">
                        <img src={isStaticColorTheme(rel) ? rel.image : rel.src.medium} alt={isStaticColorTheme(rel) ? rel.title : (rel.alt || rel.category)} className="w-full h-full object-cover" />
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
          7. SAVE TO BOARD MODAL
      ══════════════════════════════════════════════════════════════════════ */}
      {itemToSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={() => setItemToSave(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4 border border-gold/20" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2"><Bookmark className="w-4 h-4 text-[#0F4C45]" /> Save to Board</h3>
              <button onClick={() => setItemToSave(null)} className="p-1 text-charcoal/40 hover:text-charcoal cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {boards.map(b => {
                const inBoard = (savedMap[itemToSave.id] || []).includes(b.id);
                return (
                  <button key={b.id} onClick={() => handleToggleBoardSave(b.id)} className="w-full p-3 rounded-2xl border border-gold/15 bg-[#FAF7F2] hover:bg-gold/10 flex items-center justify-between text-xs font-semibold text-charcoal cursor-pointer">
                    {b.name}
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${inBoard ? "bg-[#0F4C45] text-[#C8A96A] border-[#0F4C45]" : "border-charcoal/30 bg-white"}`}>
                      {inBoard && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {isCreatingBoard ? (
              <div className="space-y-2 border-t border-gold/10 pt-2">
                <input type="text" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} placeholder="Board name..." className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]" autoFocus />
                <div className="flex gap-2">
                  <button onClick={handleCreateBoard} disabled={!newBoardName.trim()} className="flex-1 bg-[#0F4C45] disabled:opacity-40 text-white font-bold text-xs py-2 rounded-xl cursor-pointer">Create & Save</button>
                  <button onClick={() => setIsCreatingBoard(false)} className="px-3 py-2 rounded-xl text-xs text-charcoal/60 cursor-pointer">Cancel</button>
                </div>
              </div>
            ) : (
              <button onClick={() => setIsCreatingBoard(true)} className="w-full py-2.5 rounded-2xl border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] text-[#0F4C45] font-bold text-xs flex items-center justify-center gap-1.5 bg-[#FAF7F2] cursor-pointer">
                <Plus className="w-4 h-4" /> Create New Board
              </button>
            )}
            <button onClick={() => { setItemToSave(null); showToast("Saved! ❤️"); }} className="w-full bg-[#0F4C45] hover:bg-[#135951] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">Done</button>
          </div>
        </div>
      )}

      {/* ── STANDALONE CREATE BOARD ── */}
      {!itemToSave && isCreatingBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold/20 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base flex items-center gap-2"><FolderPlus className="w-4 h-4 text-[#0F4C45]" /> Create Board</h3>
              <button onClick={() => setIsCreatingBoard(false)} className="p-1 text-charcoal/40 hover:text-charcoal cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" value={newBoardName} onChange={e => setNewBoardName(e.target.value)} placeholder="e.g. 💐 Decor Ideas, 👰 Bridal Looks..." className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-4 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]" autoFocus />
            <div className="flex gap-2">
              <button onClick={handleCreateBoard} disabled={!newBoardName.trim()} className="flex-1 bg-[#0F4C45] disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">Create Board</button>
              <button onClick={() => setIsCreatingBoard(false)} className="px-4 py-2.5 rounded-xl text-xs text-charcoal/60 cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Aura */}
      <AuraAssistantDrawer isOpen={isAuraOpen} onClose={() => { setIsAuraOpen(false); setAuraInitialQuery(""); }} initialQuery={auraInitialQuery} />

      <Footer />
      <BottomNavBar activeTab="photos" />
    </div>
  );
}
