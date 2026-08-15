"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  Sparkles,
  Search,
  Bookmark,
  Share2,
  X,
  Plus,
  Check,
  Download,
  FolderPlus,
  Info,
  ExternalLink,
  CheckCircle2,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuraAssistantDrawer } from "@/components/AuraAssistantDrawer";
import {
  INSPIRATION_CATEGORIES,
  DYNAMIC_CATEGORIES,
  STATIC_COLOR_THEMES,
  AURA_INSPIRATION_PROMPTS,
  DynamicInspirationPhoto,
  StaticColorTheme,
  InspirationItem,
  isStaticColorTheme,
  ColorSwatch,
  InspirationCategory,
} from "@/lib/inspirationData";

// ─────────────────────────────────────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────────────────────────────────────
interface Board {
  id: string;
  name: string;
  createdAt: number;
}

interface FetchState {
  photos: DynamicInspirationPhoto[];
  loading: boolean;
  error: string | null;
  noApiKey: boolean;
}

// ─────────────────────────────────────────────────────────────────────────────
// SHIMMER SKELETON CARD
// ─────────────────────────────────────────────────────────────────────────────
function SkeletonCard({ tall }: { tall?: boolean }) {
  return (
    <div
      className={`break-inside-avoid bg-white rounded-3xl overflow-hidden border border-gray-100 ${
        tall ? "h-80" : "h-52"
      } relative animate-pulse`}
    >
      <div className="w-full h-full bg-gradient-to-b from-gray-200 to-gray-100" />
      <div className="absolute bottom-0 left-0 right-0 p-3 space-y-1.5">
        <div className="h-2.5 bg-gray-200 rounded-full w-1/3" />
        <div className="h-2 bg-gray-100 rounded-full w-2/3" />
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ASPECT RATIO HELPER — derive from Pexels width/height
// ─────────────────────────────────────────────────────────────────────────────
function getAspectClass(width: number, height: number): string {
  const ratio = height / width;
  if (ratio >= 1.6) return "aspect-[9/16]";
  if (ratio >= 1.2) return "aspect-[3/4]";
  if (ratio >= 0.9) return "aspect-[1/1]";
  return "aspect-[4/3]";
}

// ─────────────────────────────────────────────────────────────────────────────
// COLOR PALETTE CARD (Static editorial)
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
  return (
    <div
      onClick={onClick}
      className="break-inside-avoid relative group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gold/15 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div
        className={`relative w-full overflow-hidden bg-gray-100 ${
          item.aspectRatio === "tall"
            ? "aspect-[9/16]"
            : item.aspectRatio === "portrait"
            ? "aspect-[3/4]"
            : item.aspectRatio === "landscape"
            ? "aspect-[4/3]"
            : "aspect-[1/1]"
        }`}
      >
        <img
          src={item.image}
          alt={item.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-[#D4B66E] px-2.5 py-1 rounded-full border border-white/20">
              Color Theme
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSave}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  saved ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-black/50 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={onShare}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="space-y-1.5 text-white">
            <h3 className="font-serif font-bold text-xs sm:text-sm line-clamp-2">{item.title}</h3>
            <div className="flex items-center gap-1">
              {item.colorTheme.slice(0, 5).map((c, i) => (
                <span
                  key={i}
                  style={{ backgroundColor: c.hex }}
                  className="w-3 h-3 rounded-full border border-white/50"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="p-3.5 space-y-1">
        <span className="text-[11px] font-semibold text-[#0F4C45]">Color Theme</span>
        <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal line-clamp-1">{item.title}</h4>
        <div className="flex gap-1 pt-0.5">
          {item.colorTheme.slice(0, 5).map((c, i) => (
            <span key={i} style={{ backgroundColor: c.hex }} className="w-4 h-2 rounded-sm" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DYNAMIC PEXELS PHOTO CARD
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
  const aspectClass = getAspectClass(item.width, item.height);
  const caption = item.alt || item.category;

  return (
    <div
      onClick={onClick}
      className="break-inside-avoid relative group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gold/15 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      <div className={`relative w-full overflow-hidden bg-gray-100 ${aspectClass}`}>
        <img
          src={item.src.large}
          alt={caption}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
        />

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-[#D4B66E] px-2.5 py-1 rounded-full border border-white/20">
              {item.category}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={onSave}
                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                  saved ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-black/50 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"
                }`}
              >
                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
              </button>
              <button
                onClick={onShare}
                className="p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer"
              >
                <Share2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <div className="text-white">
            <p className="text-xs line-clamp-2 font-medium leading-snug">{caption}</p>
          </div>
        </div>

        {/* Always-visible Pexels attribution (required by ToS) */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-2 py-1.5 pointer-events-none group-hover:opacity-0 transition-opacity">
          <span className="text-[9px] text-white/70 font-medium truncate block">
            📷 {item.photographer} / Pexels
          </span>
        </div>
      </div>

      <div className="p-3.5 space-y-0.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#0F4C45]">{item.category}</span>
          {saved && (
            <span className="text-[10px] font-bold text-[#C8A96A] flex items-center gap-0.5">
              <Bookmark className="w-3 h-3 fill-current" /> Saved
            </span>
          )}
        </div>
        {/* Caption = Pexels alt text, never invented */}
        {caption && (
          <p className="text-[11px] text-charcoal/60 line-clamp-1">{caption}</p>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export function InspirationClient() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"explore" | "saved">("explore");
  const [activeBoardId, setActiveBoardId] = useState<string>("all");

  // Selected item for Lightbox
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);

  // Aura
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [auraInitialQuery, setAuraInitialQuery] = useState<string>("");

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to board modal
  const [itemToSave, setItemToSave] = useState<InspirationItem | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  // Boards — localStorage
  const [boards, setBoards] = useState<Board[]>([
    { id: "default", name: "My Saved Ideas", createdAt: Date.now() },
  ]);
  const [savedMap, setSavedMap] = useState<Record<string, string[]>>({});

  // ── Dynamic photo fetch state (per category) ──
  // Cache fetched photos in memory during session keyed by category
  const photoCache = useRef<Record<string, DynamicInspirationPhoto[]>>({});
  const [fetchState, setFetchState] = useState<FetchState>({
    photos: [],
    loading: false,
    error: null,
    noApiKey: false,
  });

  // ── Load boards from localStorage ──
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const b = localStorage.getItem("cloche_inspiration_boards");
      if (b) {
        const p = JSON.parse(b);
        if (Array.isArray(p) && p.length > 0) setBoards(p);
      }
      const s = localStorage.getItem("cloche_saved_inspirations");
      if (s) {
        const p = JSON.parse(s);
        if (typeof p === "object" && p !== null) setSavedMap(p);
      }
    } catch {}
  }, []);

  const saveBoardsToStorage = (updated: Board[]) => {
    setBoards(updated);
    try { localStorage.setItem("cloche_inspiration_boards", JSON.stringify(updated)); } catch {}
  };

  const saveSavesToStorage = (updated: Record<string, string[]>) => {
    setSavedMap(updated);
    try { localStorage.setItem("cloche_saved_inspirations", JSON.stringify(updated)); } catch {}
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2800);
  };

  // ── Fetch photos from our server route ──
  const fetchPhotosForCategory = useCallback(async (cat: string) => {
    // Color Themes are always static — nothing to fetch
    if (cat === "Color Themes") {
      setFetchState({ photos: [], loading: false, error: null, noApiKey: false });
      return;
    }
    // "All" — fetch from first dynamic category to populate initial view
    const target = cat === "All" ? "Wedding Photos" : cat;

    // Session cache hit
    if (photoCache.current[target]) {
      setFetchState({ photos: photoCache.current[target], loading: false, error: null, noApiKey: false });
      return;
    }

    setFetchState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(
        `/api/v1/inspiration/photos?category=${encodeURIComponent(target)}&per_page=24`,
        { cache: "no-store" }
      );
      const json = await res.json();

      if (!json.success) {
        if (json.error === "PEXELS_NOT_CONFIGURED") {
          setFetchState({ photos: [], loading: false, error: null, noApiKey: true });
          return;
        }
        setFetchState({ photos: [], loading: false, error: json.message || "Could not load photos", noApiKey: false });
        return;
      }

      // Tag each photo with its category
      const photos: DynamicInspirationPhoto[] = (json.photos || []).map((p: any) => ({
        ...p,
        category: target as InspirationCategory,
        pexels_url: p.url,
      }));

      photoCache.current[target] = photos;
      setFetchState({ photos, loading: false, error: null, noApiKey: false });
    } catch (err: any) {
      setFetchState({ photos: [], loading: false, error: "Network error — please try again.", noApiKey: false });
    }
  }, []);

  // Trigger fetch when active category changes
  useEffect(() => {
    fetchPhotosForCategory(activeCategory);
  }, [activeCategory, fetchPhotosForCategory]);

  // ── Build display list for Explore Feed ──
  const displayItems = useMemo<InspirationItem[]>(() => {
    const staticThemes: StaticColorTheme[] = STATIC_COLOR_THEMES;
    const dynamicPhotos: DynamicInspirationPhoto[] = fetchState.photos;

    if (activeCategory === "All") {
      // Mix static Color Themes into dynamic photos
      const mixed: InspirationItem[] = [...dynamicPhotos, ...staticThemes];
      if (!searchQuery.trim()) return mixed;
      const q = searchQuery.toLowerCase();
      return mixed.filter((item) =>
        isStaticColorTheme(item)
          ? item.title.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
          : (item.alt || item.category).toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
      );
    }

    if (activeCategory === "Color Themes") {
      if (!searchQuery.trim()) return staticThemes;
      const q = searchQuery.toLowerCase();
      return staticThemes.filter((item) =>
        item.title.toLowerCase().includes(q) || item.tags.some((t) => t.toLowerCase().includes(q))
      );
    }

    // Dynamic category
    if (!searchQuery.trim()) return dynamicPhotos;
    const q = searchQuery.toLowerCase();
    return dynamicPhotos.filter((item) =>
      (item.alt || "").toLowerCase().includes(q) || item.category.toLowerCase().includes(q)
    );
  }, [activeCategory, fetchState.photos, searchQuery]);

  // ── Save helpers ──
  const isItemSaved = (id: string) => Boolean(savedMap[id]?.length);

  const handleQuickSave = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const id = item.id;
    if (savedMap[id]?.length) {
      const next = { ...savedMap };
      delete next[id];
      saveSavesToStorage(next);
      showToast("Removed from saved");
    } else {
      const defaultId = boards[0]?.id || "default";
      saveSavesToStorage({ ...savedMap, [id]: [defaultId] });
      showToast(`Saved to ${boards[0]?.name || "My Saved Ideas"} ❤️`);
    }
  };

  const handleToggleBoardSave = (boardId: string) => {
    if (!itemToSave) return;
    const id = itemToSave.id;
    const curr = savedMap[id] || [];
    const next = curr.includes(boardId) ? curr.filter((b) => b !== boardId) : [...curr, boardId];
    const updated = { ...savedMap };
    if (next.length === 0) delete updated[id]; else updated[id] = next;
    saveSavesToStorage(updated);
  };

  const handleCreateBoard = () => {
    const trimmed = newBoardName.trim();
    if (!trimmed) return;
    const nb: Board = { id: `board-${Date.now()}`, name: trimmed, createdAt: Date.now() };
    const updated = [...boards, nb];
    saveBoardsToStorage(updated);
    setNewBoardName("");
    setIsCreatingBoard(false);
    if (itemToSave) {
      saveSavesToStorage({ ...savedMap, [itemToSave.id]: [...(savedMap[itemToSave.id] || []), nb.id] });
      showToast(`Created board "${trimmed}" and saved!`);
    } else {
      showToast(`Created board "${trimmed}"`);
    }
  };

  const handleShare = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window === "undefined") return;
    const shareUrl = `${window.location.origin}/inspiration?id=${item.id}`;
    navigator.clipboard?.writeText(shareUrl);
    showToast("Link copied to clipboard! 📋");
  };

  const handleCopyHex = (hex: string, name: string) => {
    navigator.clipboard?.writeText(hex);
    showToast(`Copied ${name} (${hex}) ✨`);
  };

  const handleDownloadPalette = (item: StaticColorTheme) => {
    const content = `${item.title} — Color Palette\n` +
      item.colorTheme.map((c) => `${c.name}: ${c.hex}`).join("\n") +
      "\n\nCurated on Cloche Wedding Inspiration Hub";
    const a = Object.assign(document.createElement("a"), {
      href: URL.createObjectURL(new Blob([content], { type: "text/plain" })),
      download: `${item.id}-palette.txt`,
    });
    a.click();
    showToast("Color palette downloaded! 🎨");
  };

  const handleOpenAura = (prompt: string) => {
    setAuraInitialQuery(prompt);
    setIsAuraOpen(true);
  };

  const totalSavedCount = useMemo(() => Object.keys(savedMap).length, [savedMap]);

  // Saved items for "My Saved" view
  const savedItemsList = useMemo<InspirationItem[]>(() => {
    const allItems: InspirationItem[] = [
      ...STATIC_COLOR_THEMES,
      ...Object.values(photoCache.current).flat(),
    ];
    return allItems.filter((item) => {
      const boards = savedMap[item.id] || [];
      if (activeBoardId === "all") return boards.length > 0;
      return boards.includes(activeBoardId);
    });
  }, [savedMap, activeBoardId]);

  // Related items in lightbox
  const relatedItems = useMemo<InspirationItem[]>(() => {
    if (!selectedItem) return [];
    const allDynamic = Object.values(photoCache.current).flat();
    const allItems: InspirationItem[] = [...STATIC_COLOR_THEMES, ...allDynamic];
    return allItems.filter((i) => i.id !== selectedItem.id && i.category === selectedItem.category).slice(0, 4);
  }, [selectedItem]);

  const SEARCH_SUGGESTIONS = [
    "Bridal Saree", "Mandap", "Stage Decoration", "Haldi", "Mehendi", "Reception", "Royal Wedding", "Minimal Wedding",
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2520] font-sans antialiased flex flex-col selection:bg-[#C8A96A]/30">

      {/* Toast */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-gold/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ── HERO ── */}
      <section className="relative bg-gradient-to-b from-[#0B3B36] via-[#0F4C45] to-[#0A332E] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-10 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,169,106,0.18),transparent_60%)] pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#D4B66E]">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Cloche Trend Lookbook &amp; Ideas Hub</span>
          </div>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">Wedding Inspiration</h1>
          <p className="max-w-2xl mx-auto text-xs sm:text-base text-white/80 leading-relaxed">
            Discover thousands of wedding ideas, trending styles, decor inspirations, bridal looks and real Kerala wedding moments.
          </p>
          <div className="max-w-2xl mx-auto pt-3">
            <div className="relative flex items-center bg-white rounded-full p-1.5 sm:p-2 shadow-2xl border border-gold/30">
              <Search className="w-5 h-5 text-charcoal/40 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search (e.g. Mandap, Kasavu, Haldi, Mehendi)..."
                className="w-full bg-transparent border-none px-3 py-2 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="p-1 rounded-full text-charcoal/40 hover:text-charcoal mr-1 cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex items-center justify-center gap-2 flex-wrap pt-3 text-[11px] text-white/70">
              <span className="font-semibold text-[#D4B66E]">Popular:</span>
              {SEARCH_SUGGESTIONS.slice(0, 6).map((tag) => (
                <button key={tag} onClick={() => setSearchQuery(tag)} className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4 cursor-pointer">
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── STICKY TAB + CATEGORY BAR ── */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold/15 shadow-xs py-3 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Tab toggle */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-full border border-gold/20 shrink-0 w-fit">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${activeTab === "explore" ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/70 hover:text-charcoal"}`}
            >
              Explore Ideas
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${activeTab === "saved" ? "bg-[#0F4C45] text-white shadow-xs" : "text-charcoal/70 hover:text-charcoal"}`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Saved</span>
              {totalSavedCount > 0 && (
                <span className="bg-[#C8A96A] text-[#0F4C45] text-[10px] font-extrabold px-1.5 rounded-full">{totalSavedCount}</span>
              )}
            </button>
          </div>

          {/* Category pills */}
          {activeTab === "explore" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {INSPIRATION_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    activeCategory === cat.id
                      ? "bg-[#0F4C45] text-[#C8A96A] font-bold shadow-xs border border-[#0F4C45]"
                      : "bg-white text-charcoal/80 border border-gold/20 hover:border-gold/50 hover:bg-[#FAF7F2]"
                  }`}
                >
                  {cat.label}
                  {cat.isStatic && <span className="ml-1 text-[9px] opacity-60">✦</span>}
                </button>
              ))}
            </div>
          )}

          {/* Board selector for "My Saved" */}
          {activeTab === "saved" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => setActiveBoardId("all")}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${activeBoardId === "all" ? "bg-[#0F4C45] text-white font-bold" : "bg-white text-charcoal/80 border border-gold/20"}`}
              >
                All Boards ({totalSavedCount})
              </button>
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBoardId(b.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${activeBoardId === b.id ? "bg-[#0F4C45] text-white font-bold" : "bg-white text-charcoal/80 border border-gold/20"}`}
                >
                  {b.name}
                </button>
              ))}
              <button
                onClick={() => { setItemToSave(null); setIsCreatingBoard(true); }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Board</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── AURA CONTEXTUAL BAR ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
        <div className="bg-gradient-to-r from-[#0F4C45]/10 via-[#FAF7F2] to-[#C8A96A]/15 border border-gold/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0F4C45] flex items-center justify-center text-[#C8A96A] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F4C45] block">✨ Need personalized wedding ideas?</span>
              <span className="text-[11px] text-charcoal/60">Ask Aura AI to curate custom themes, budgets, and decor</span>
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {AURA_INSPIRATION_PROMPTS.slice(0, 3).map((prompt, i) => (
              <button
                key={i}
                onClick={() => handleOpenAura(prompt)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-gold/15 text-charcoal border border-gold/25 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 font-medium"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ── MAIN FEED ── */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full">

        {/* ── API key not configured — friendly notice ── */}
        {activeTab === "explore" && fetchState.noApiKey && activeCategory !== "Color Themes" && (
          <div className="mb-6 bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-xs font-bold text-amber-800 mb-1">Pexels API key not configured</p>
              <p className="text-xs text-amber-700">
                To enable live wedding photo browsing, add your free Pexels API key to <code className="bg-amber-100 px-1 rounded">.env.local</code>:
              </p>
              <code className="block mt-1.5 text-xs bg-amber-100 text-amber-900 rounded px-2 py-1 font-mono">
                PEXELS_API_KEY=your_key_here
              </code>
              <a
                href="https://www.pexels.com/api/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-1.5 text-xs font-bold text-amber-700 hover:underline"
              >
                Get a free API key at pexels.com/api <ExternalLink className="w-3 h-3" />
              </a>
              <p className="text-[11px] text-amber-600 mt-1">
                Color Themes below are still available — they are static editorial content.
              </p>
            </div>
          </div>
        )}

        {/* ── API Error ── */}
        {activeTab === "explore" && fetchState.error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
            <div>
              <p className="text-xs font-bold text-red-700">{fetchState.error}</p>
              <button onClick={() => fetchPhotosForCategory(activeCategory)} className="text-xs text-red-600 underline mt-0.5 cursor-pointer">Retry</button>
            </div>
          </div>
        )}

        {/* ── EXPLORE FEED ── */}
        {activeTab === "explore" && (
          <>
            {/* Loading skeletons */}
            {fetchState.loading && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-5 [column-fill:_balance] space-y-4 md:space-y-5">
                {Array.from({ length: 12 }).map((_, i) => (
                  <SkeletonCard key={i} tall={i % 3 === 0} />
                ))}
              </div>
            )}

            {/* Empty state */}
            {!fetchState.loading && displayItems.length === 0 && !fetchState.noApiKey && (
              <div className="text-center py-16 bg-white rounded-3xl border border-gold/15 max-w-md mx-auto space-y-3 p-8">
                <Search className="w-10 h-10 text-charcoal/30 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-charcoal">No matching inspirations found</h3>
                <button
                  onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
                  className="mt-2 text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-4 py-2 rounded-full border border-gold/20 hover:bg-gold/15 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            )}

            {/* Masonry Grid */}
            {!fetchState.loading && displayItems.length > 0 && (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-5 [column-fill:_balance] space-y-4 md:space-y-5">
                {displayItems.map((item) => {
                  const saved = isItemSaved(item.id);
                  if (isStaticColorTheme(item)) {
                    return (
                      <ColorThemeCard
                        key={item.id}
                        item={item}
                        saved={saved}
                        onClick={() => setSelectedItem(item)}
                        onSave={(e) => { e.stopPropagation(); setItemToSave(item); }}
                        onShare={(e) => handleShare(item, e)}
                      />
                    );
                  }
                  return (
                    <PhotoCard
                      key={item.id}
                      item={item}
                      saved={saved}
                      onClick={() => setSelectedItem(item)}
                      onSave={(e) => { e.stopPropagation(); setItemToSave(item); }}
                      onShare={(e) => handleShare(item, e)}
                    />
                  );
                })}
              </div>
            )}

            {/* Pexels attribution footer note (required by ToS) */}
            {!fetchState.loading && !fetchState.noApiKey && activeCategory !== "Color Themes" && fetchState.photos.length > 0 && (
              <div className="mt-8 text-center">
                <a
                  href="https://www.pexels.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] text-charcoal/50 hover:text-[#0F4C45] transition-colors"
                >
                  <Info className="w-3.5 h-3.5" />
                  Photos provided by Pexels · Click any photo to see full photographer credit
                </a>
              </div>
            )}
          </>
        )}

        {/* ── MY SAVED VIEW ── */}
        {activeTab === "saved" && (
          <>
            {savedItemsList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 p-8 max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-gold/20 flex items-center justify-center text-[#C8A96A] mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Your Inspiration Board is Empty</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Save your favourite decor concepts, bridal styling looks, and stage designs to build your personalised wedding moodboard.
                </p>
                <button
                  onClick={() => setActiveTab("explore")}
                  className="bg-[#0F4C45] hover:bg-[#135951] text-white text-xs font-bold px-6 py-2.5 rounded-full shadow-xs transition-all cursor-pointer"
                >
                  Start Exploring Ideas
                </button>
              </div>
            ) : (
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-5 [column-fill:_balance] space-y-4 md:space-y-5">
                {savedItemsList.map((item) => {
                  if (isStaticColorTheme(item)) {
                    return (
                      <ColorThemeCard
                        key={item.id}
                        item={item}
                        saved={true}
                        onClick={() => setSelectedItem(item)}
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
                      onClick={() => setSelectedItem(item)}
                      onSave={(e) => handleQuickSave(item, e)}
                      onShare={(e) => handleShare(item, e)}
                    />
                  );
                })}
              </div>
            )}
          </>
        )}
      </main>

      {/* ── DETAIL LIGHTBOX ── */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gold/20 flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white cursor-pointer">
              <X className="w-5 h-5" />
            </button>

            {/* Image panel */}
            <div className="md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              <img
                src={isStaticColorTheme(selectedItem) ? selectedItem.image : selectedItem.src.large2x}
                alt={isStaticColorTheme(selectedItem) ? selectedItem.title : (selectedItem.alt || selectedItem.category)}
                className="w-full h-full max-h-[500px] md:max-h-[90vh] object-cover"
              />
              {/* Pexels attribution on image (required by ToS) */}
              {!isStaticColorTheme(selectedItem) && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-3 py-2 flex items-center justify-between">
                  <span className="text-[11px] text-white/90">
                    📷 {selectedItem.photographer}
                  </span>
                  <a
                    href={selectedItem.pexels_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-white/60 hover:text-white flex items-center gap-0.5 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    View on Pexels <ExternalLink className="w-2.5 h-2.5" />
                  </a>
                </div>
              )}
            </div>

            {/* Info panel */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh] space-y-6">
              <div className="space-y-4">
                {/* Category + action buttons */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                    {selectedItem.category}
                  </span>
                  <div className="flex items-center gap-2">
                    <button onClick={() => handleShare(selectedItem)} className="p-2 rounded-full bg-[#FAF7F2] hover:bg-gold/20 text-charcoal border border-gold/20 cursor-pointer">
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setItemToSave(selectedItem)}
                      className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer ${isItemSaved(selectedItem.id) ? "bg-[#C8A96A] text-[#0F4C45]" : "bg-[#0F4C45] hover:bg-[#135951] text-white"}`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isItemSaved(selectedItem.id) ? "fill-current" : ""}`} />
                      {isItemSaved(selectedItem.id) ? "Saved" : "Save Idea"}
                    </button>
                  </div>
                </div>

                {/* Title / Caption */}
                <div>
                  {isStaticColorTheme(selectedItem) ? (
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">{selectedItem.title}</h2>
                  ) : (
                    <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal">
                      {selectedItem.alt || selectedItem.category}
                    </h2>
                  )}
                </div>

                {/* Description (static only) */}
                {isStaticColorTheme(selectedItem) && (
                  <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">{selectedItem.description}</p>
                )}

                {/* Photographer credit in info panel (required) */}
                {!isStaticColorTheme(selectedItem) && (
                  <div className="bg-[#FAF7F2] rounded-xl p-3 flex items-center justify-between border border-gold/15">
                    <span className="text-xs text-charcoal/70">
                      Photo by <span className="font-semibold text-charcoal">{selectedItem.photographer}</span>
                    </span>
                    <a
                      href={selectedItem.photographer_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] text-[#0F4C45] font-bold hover:underline flex items-center gap-0.5"
                    >
                      View profile <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                )}

                {/* Color palette (static Color Themes only) */}
                {isStaticColorTheme(selectedItem) && selectedItem.colorTheme && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">🎨 Curated Color Palette</span>
                      <button onClick={() => handleDownloadPalette(selectedItem)} className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer">
                        <Download className="w-3 h-3" /> Export
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-2">
                      {selectedItem.colorTheme.map((c, i) => (
                        <button key={i} onClick={() => handleCopyHex(c.hex, c.name)} className="flex flex-col items-center gap-1 cursor-pointer" title={`Copy ${c.hex}`}>
                          <div style={{ backgroundColor: c.hex }} className="w-full h-10 rounded-xl border border-black/10 shadow-xs hover:scale-105 transition-transform" />
                          <span className="text-[9px] font-semibold text-charcoal/80 truncate w-full text-center">{c.name}</span>
                          <span className="text-[8px] text-charcoal/50 font-mono">{c.hex}</span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-charcoal/50 italic text-center">Click any swatch to copy its HEX code</p>
                  </div>
                )}

                {/* Tags (static only) */}
                {isStaticColorTheme(selectedItem) && selectedItem.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedItem.tags.map((t) => (
                      <span key={t} className="text-[11px] bg-[#FAF7F2] text-charcoal/70 px-2.5 py-1 rounded-full border border-gold/15">#{t}</span>
                    ))}
                  </div>
                )}

                {/* Ask Aura */}
                <button
                  onClick={() => {
                    setSelectedItem(null);
                    handleOpenAura(`Tell me more about "${isStaticColorTheme(selectedItem) ? selectedItem.title : selectedItem.category}" and how to plan this style in Kerala`);
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:from-[#072B27] hover:to-[#0F4C45] transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-gold" />
                  <span>Ask Aura to plan this style</span>
                </button>
              </div>

              {/* More Like This */}
              {relatedItems.length > 0 && (
                <div className="border-t border-gold/15 pt-4 space-y-2.5">
                  <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">More Like This</span>
                  <div className="grid grid-cols-4 gap-2">
                    {relatedItems.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => setSelectedItem(rel)}
                        className="aspect-square rounded-xl overflow-hidden border border-gold/15 cursor-pointer hover:opacity-80 transition-opacity bg-gray-100"
                      >
                        <img
                          src={isStaticColorTheme(rel) ? rel.image : rel.src.medium}
                          alt={isStaticColorTheme(rel) ? rel.title : (rel.alt || rel.category)}
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

      {/* ── SAVE TO BOARD MODAL ── */}
      {itemToSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150" onClick={() => setItemToSave(null)}>
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold/20 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#0F4C45]" /> Save to Board
              </h3>
              <button onClick={() => setItemToSave(null)} className="p-1 rounded-full text-charcoal/40 hover:text-charcoal cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {boards.map((b) => {
                const inBoard = (savedMap[itemToSave.id] || []).includes(b.id);
                return (
                  <button key={b.id} onClick={() => handleToggleBoardSave(b.id)} className="w-full p-3 rounded-2xl border border-gold/15 bg-[#FAF7F2] hover:bg-gold/15 transition-colors flex items-center justify-between text-xs font-semibold text-charcoal cursor-pointer">
                    <span>{b.name}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${inBoard ? "bg-[#0F4C45] text-[#C8A96A] border-[#0F4C45]" : "border-charcoal/30 bg-white"}`}>
                      {inBoard && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
            {isCreatingBoard ? (
              <div className="space-y-2 border-t border-gold/10 pt-2">
                <input type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="Board name..." className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]" autoFocus />
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
            <button onClick={() => { setItemToSave(null); showToast("Saved!"); }} className="w-full bg-[#0F4C45] hover:bg-[#135951] text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">Done</button>
          </div>
        </div>
      )}

      {/* ── STANDALONE CREATE BOARD ── */}
      {!itemToSave && isCreatingBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold/20 space-y-4" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2"><FolderPlus className="w-4 h-4 text-[#0F4C45]" /> Create New Board</h3>
              <button onClick={() => setIsCreatingBoard(false)} className="p-1 rounded-full text-charcoal/40 hover:text-charcoal cursor-pointer"><X className="w-4 h-4" /></button>
            </div>
            <input type="text" value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="e.g. Mandap Concepts, Stage Designs..." className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]" autoFocus />
            <div className="flex gap-2 pt-2">
              <button onClick={handleCreateBoard} disabled={!newBoardName.trim()} className="flex-1 bg-[#0F4C45] disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">Create Board</button>
              <button onClick={() => setIsCreatingBoard(false)} className="px-4 py-2.5 rounded-xl text-xs text-charcoal/60 cursor-pointer">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Aura Drawer */}
      <AuraAssistantDrawer isOpen={isAuraOpen} onClose={() => { setIsAuraOpen(false); setAuraInitialQuery(""); }} initialQuery={auraInitialQuery} />

      <Footer />
      <BottomNavBar activeTab="photos" />
    </div>
  );
}
