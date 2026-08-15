"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sparkles,
  Search,
  Bookmark,
  Heart,
  Share2,
  X,
  Plus,
  Check,
  Copy,
  Download,
  FolderPlus,
  Layers,
  ArrowRight,
  ChevronRight,
  Eye,
  SlidersHorizontal,
  CheckCircle2
} from "lucide-react";
import { Footer } from "@/components/Footer";
import { BottomNavBar } from "@/components/BottomNavBar";
import { AuraAssistantDrawer } from "@/components/AuraAssistantDrawer";
import {
  INSPIRATION_ITEMS,
  INSPIRATION_CATEGORIES,
  AURA_INSPIRATION_PROMPTS,
  InspirationItem,
  InspirationCategory,
  ColorSwatch
} from "@/lib/inspirationData";

interface Board {
  id: string;
  name: string;
  createdAt: number;
}

export function InspirationClient() {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"explore" | "saved">("explore");
  const [activeBoardId, setActiveBoardId] = useState<string>("all");

  // Selected item for Lightbox Detail View
  const [selectedItem, setSelectedItem] = useState<InspirationItem | null>(null);

  // Aura Assistant integration
  const [isAuraOpen, setIsAuraOpen] = useState(false);
  const [auraInitialQuery, setAuraInitialQuery] = useState<string>("");

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to board modal state
  const [itemToSave, setItemToSave] = useState<InspirationItem | null>(null);
  const [newBoardName, setNewBoardName] = useState("");
  const [isCreatingBoard, setIsCreatingBoard] = useState(false);

  // LocalStorage-backed Boards and Saved Map
  // savedMap: { [itemId: string]: string[] (array of board IDs) }
  const [boards, setBoards] = useState<Board[]>([
    { id: "default", name: "My Saved Ideas", createdAt: Date.now() },
  ]);
  const [savedMap, setSavedMap] = useState<Record<string, string[]>>({});

  // Load boards and saves from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      try {
        const storedBoards = localStorage.getItem("cloche_inspiration_boards");
        if (storedBoards) {
          const parsed = JSON.parse(storedBoards);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setBoards(parsed);
          }
        }
        const storedSaves = localStorage.getItem("cloche_saved_inspirations");
        if (storedSaves) {
          const parsed = JSON.parse(storedSaves);
          if (typeof parsed === "object" && parsed !== null) {
            setSavedMap(parsed);
          }
        }
      } catch (e) {}
    }
  }, []);

  // Sync boards to localStorage
  const saveBoardsToStorage = (updatedBoards: Board[]) => {
    setBoards(updatedBoards);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cloche_inspiration_boards", JSON.stringify(updatedBoards));
      } catch (e) {}
    }
  };

  // Sync saves to localStorage
  const saveSavesToStorage = (updatedSaves: Record<string, string[]>) => {
    setSavedMap(updatedSaves);
    if (typeof window !== "undefined") {
      try {
        localStorage.setItem("cloche_saved_inspirations", JSON.stringify(updatedSaves));
      } catch (e) {}
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  // Check if an item is saved to any board
  const isItemSaved = (itemId: string): boolean => {
    return Boolean(savedMap[itemId] && savedMap[itemId].length > 0);
  };

  // Toggle quick save (to default board) or open board selector
  const handleQuickSave = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const itemId = item.id;
    const currentBoardIds = savedMap[itemId] || [];

    if (currentBoardIds.length > 0) {
      // Remove from all boards
      const next = { ...savedMap };
      delete next[itemId];
      saveSavesToStorage(next);
      showToast(`Removed "${item.title.slice(0, 24)}..." from saved`);
    } else {
      // Save to default board
      const defaultId = boards[0]?.id || "default";
      const next = {
        ...savedMap,
        [itemId]: [defaultId],
      };
      saveSavesToStorage(next);
      showToast(`Saved to ${boards[0]?.name || "My Saved Ideas"} ❤️`);
    }
  };

  // Save to specific board
  const handleToggleBoardSave = (boardId: string) => {
    if (!itemToSave) return;
    const itemId = itemToSave.id;
    const currentBoards = savedMap[itemId] || [];
    let nextBoards: string[];

    if (currentBoards.includes(boardId)) {
      nextBoards = currentBoards.filter((id) => id !== boardId);
    } else {
      nextBoards = [...currentBoards, boardId];
    }

    const next = { ...savedMap };
    if (nextBoards.length === 0) {
      delete next[itemId];
    } else {
      next[itemId] = nextBoards;
    }

    saveSavesToStorage(next);
  };

  // Create new board
  const handleCreateBoard = () => {
    const trimmed = newBoardName.trim();
    if (!trimmed) return;
    const newBoard: Board = {
      id: `board-${Date.now()}`,
      name: trimmed,
      createdAt: Date.now(),
    };
    const updated = [...boards, newBoard];
    saveBoardsToStorage(updated);
    setNewBoardName("");
    setIsCreatingBoard(false);

    // If saving an item, auto-add to this new board
    if (itemToSave) {
      const current = savedMap[itemToSave.id] || [];
      saveSavesToStorage({
        ...savedMap,
        [itemToSave.id]: [...current, newBoard.id],
      });
      showToast(`Created board "${trimmed}" and saved!`);
    } else {
      showToast(`Created board "${trimmed}"`);
    }
  };

  // Copy share link
  const handleShare = (item: InspirationItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (typeof window !== "undefined") {
      const shareUrl = `${window.location.origin}/inspiration?id=${item.id}`;
      if (navigator.clipboard) {
        navigator.clipboard.writeText(shareUrl);
        showToast("Link copied to clipboard! 📋");
      }
    }
  };

  // Copy Color Hex
  const handleCopyHex = (hex: string, name: string) => {
    if (typeof window !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(hex);
      showToast(`Copied ${name} (${hex}) to clipboard! ✨`);
    }
  };

  // Download Color Palette as plain text / CSV
  const handleDownloadPalette = (item: InspirationItem) => {
    if (!item.colorTheme || item.colorTheme.length === 0) return;
    const content = `${item.title} — Color Palette\n` +
      item.colorTheme.map((c) => `${c.name}: ${c.hex}`).join("\n") +
      `\n\nCurated on Cloche Wedding Inspiration Hub`;
    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${item.title.toLowerCase().replace(/[^a-z0-9]/g, "-")}-palette.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("Color palette downloaded! 🎨");
  };

  // Launch Aura with pre-filled query
  const handleOpenAuraWithPrompt = (prompt: string) => {
    setAuraInitialQuery(prompt);
    setIsAuraOpen(true);
  };

  // Filter items for Explore Feed
  const filteredItems = useMemo(() => {
    return INSPIRATION_ITEMS.filter((item) => {
      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.tags.some((t) => t.toLowerCase().includes(q)) ||
        (item.city && item.city.toLowerCase().includes(q)) ||
        (item.style && item.style.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  // Saved items for "My Saved" view
  const savedItemsList = useMemo(() => {
    return INSPIRATION_ITEMS.filter((item) => {
      const boardIds = savedMap[item.id] || [];
      if (activeBoardId === "all") {
        return boardIds.length > 0;
      }
      return boardIds.includes(activeBoardId);
    });
  }, [savedMap, activeBoardId]);

  const totalSavedCount = useMemo(() => {
    return Object.keys(savedMap).length;
  }, [savedMap]);

  // Related items for modal "More Like This"
  const relatedItems = useMemo(() => {
    if (!selectedItem) return [];
    return INSPIRATION_ITEMS.filter(
      (item) => item.id !== selectedItem.id && item.category === selectedItem.category
    ).slice(0, 4);
  }, [selectedItem]);

  const searchSuggestions = [
    "Bridal Makeup",
    "Mandap",
    "Stage Decoration",
    "Haldi",
    "Mehendi",
    "Reception",
    "Royal Wedding",
    "Minimal Wedding",
    "Luxury Wedding",
    "Outdoor Wedding",
  ];

  return (
    <div className="min-h-screen bg-[#FAF7F2] text-[#2D2520] font-sans antialiased flex flex-col selection:bg-[#C8A96A]/30">
      
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 bg-[#0F4C45] text-white text-xs font-semibold px-4 py-2.5 rounded-full shadow-lg border border-gold/30 flex items-center gap-2 animate-in fade-in slide-in-from-bottom-4 duration-200">
          <CheckCircle2 className="w-4 h-4 text-gold" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* 1. HOME HERO SECTION */}
      <section className="relative bg-gradient-to-b from-[#0B3B36] via-[#0F4C45] to-[#0A332E] text-white pt-10 sm:pt-14 pb-12 sm:pb-16 px-4 sm:px-6 lg:px-10 overflow-hidden">
        {/* Background Ambient Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(200,169,106,0.18),transparent_60%)] pointer-events-none" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 border border-white/20 text-xs font-semibold text-[#D4B66E] shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold animate-pulse" />
            <span>Cloche Trend Lookbook & Ideas Hub</span>
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold text-white tracking-tight">
            Wedding Inspiration
          </h1>

          <p className="max-w-2xl mx-auto text-xs sm:text-base text-white/80 font-normal leading-relaxed">
            Discover thousands of wedding ideas, trending styles, decor inspirations, bridal looks and real Kerala wedding moments.
          </p>

          {/* Large Search Bar */}
          <div className="max-w-2xl mx-auto pt-3">
            <div className="relative flex items-center bg-white rounded-full p-1.5 sm:p-2 shadow-2xl border border-gold/30">
              <Search className="w-5 h-5 text-charcoal/40 ml-3.5 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by keyword (e.g. Lehenga, Mandap, Gold Choker, Haldi)..."
                className="w-full bg-transparent border-none px-3 py-2 text-xs sm:text-sm text-charcoal placeholder:text-charcoal/40 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="p-1 rounded-full text-charcoal/40 hover:text-charcoal hover:bg-gray-100 transition-colors mr-1 cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Instant Search Suggestions */}
            <div className="flex items-center justify-center gap-2 flex-wrap pt-3 text-[11px] text-white/70">
              <span className="font-semibold text-[#D4B66E]">Popular:</span>
              {searchSuggestions.slice(0, 6).map((tag, idx) => (
                <button
                  key={idx}
                  onClick={() => setSearchQuery(tag)}
                  className="hover:text-white transition-colors underline decoration-white/30 underline-offset-4 cursor-pointer"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. TAB TOGGLE & CATEGORY PILLS BAR */}
      <section className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gold/15 shadow-xs py-3 px-4 sm:px-6 lg:px-10">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Main Feed Tab Switcher */}
          <div className="flex items-center gap-2 bg-[#FAF7F2] p-1 rounded-full border border-gold/20 shrink-0 w-fit">
            <button
              onClick={() => setActiveTab("explore")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeTab === "explore"
                  ? "bg-[#0F4C45] text-white shadow-xs"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              Explore Ideas
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeTab === "saved"
                  ? "bg-[#0F4C45] text-white shadow-xs"
                  : "text-charcoal/70 hover:text-charcoal"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>My Saved</span>
              {totalSavedCount > 0 && (
                <span className="bg-[#C8A96A] text-[#0F4C45] text-[10px] font-extrabold px-1.5 py-0.2 rounded-full ml-0.5">
                  {totalSavedCount}
                </span>
              )}
            </button>
          </div>

          {/* Category Filter Pills (Horizontal Scroll) */}
          {activeTab === "explore" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              {INSPIRATION_CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`text-xs font-semibold px-4 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                      isActive
                        ? "bg-[#0F4C45] text-[#C8A96A] font-bold shadow-xs border border-[#0F4C45]"
                        : "bg-white text-charcoal/80 border border-gold/20 hover:border-gold/50 hover:bg-[#FAF7F2]"
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          )}

          {/* Boards Selector for "My Saved" tab */}
          {activeTab === "saved" && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
              <button
                onClick={() => setActiveBoardId("all")}
                className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                  activeBoardId === "all"
                    ? "bg-[#0F4C45] text-white font-bold"
                    : "bg-white text-charcoal/80 border border-gold/20 hover:bg-[#FAF7F2]"
                }`}
              >
                All Boards ({totalSavedCount})
              </button>
              {boards.map((b) => (
                <button
                  key={b.id}
                  onClick={() => setActiveBoardId(b.id)}
                  className={`text-xs font-semibold px-3.5 py-1.5 rounded-full transition-all whitespace-nowrap cursor-pointer shrink-0 ${
                    activeBoardId === b.id
                      ? "bg-[#0F4C45] text-white font-bold"
                      : "bg-white text-charcoal/80 border border-gold/20 hover:bg-[#FAF7F2]"
                  }`}
                >
                  {b.name}
                </button>
              ))}
              <button
                onClick={() => {
                  setItemToSave(null);
                  setIsCreatingBoard(true);
                }}
                className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#FAF7F2] text-[#0F4C45] border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] transition-all flex items-center gap-1 shrink-0 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Board</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* 3. AURA CONTEXTUAL INSPIRATION BAR */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 pt-6">
        <div className="bg-gradient-to-r from-[#0F4C45]/10 via-[#FAF7F2] to-[#C8A96A]/15 border border-gold/20 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0F4C45] flex items-center justify-center text-[#C8A96A] shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#0F4C45] block">✨ Need personalized wedding ideas?</span>
              <span className="text-[11px] text-charcoal/60">Ask Aura AI to curate custom color palettes, budget decor, and themes</span>
            </div>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
            {AURA_INSPIRATION_PROMPTS.slice(0, 3).map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => handleOpenAuraWithPrompt(prompt)}
                className="text-[11px] whitespace-nowrap bg-white hover:bg-gold/15 text-charcoal border border-gold/25 px-3 py-1.5 rounded-full transition-all cursor-pointer shrink-0 font-medium"
              >
                &ldquo;{prompt}&rdquo;
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PINTEREST-STYLE MASONRY FEED */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-6 sm:py-8 w-full">
        
        {/* EXPLORE FEED */}
        {activeTab === "explore" && (
          <>
            {filteredItems.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-3xl border border-gold/15 p-8 max-w-md mx-auto space-y-3">
                <Search className="w-10 h-10 text-charcoal/30 mx-auto" />
                <h3 className="font-serif font-bold text-lg text-charcoal">No matching inspirations found</h3>
                <p className="text-xs text-charcoal/60">
                  Try searching for general keywords like &ldquo;Mandap&rdquo;, &ldquo;Lehenga&rdquo;, or &ldquo;Stage&rdquo;.
                </p>
                <button
                  onClick={() => {
                    setActiveCategory("All");
                    setSearchQuery("");
                  }}
                  className="mt-2 text-xs font-bold text-[#0F4C45] bg-[#FAF7F2] px-4 py-2 rounded-full border border-gold/20 hover:bg-gold/15 cursor-pointer"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              /* Pinterest Multi-Column Masonry Layout */
              <div className="columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-4 md:gap-5 [column-fill:_balance] space-y-4 md:space-y-5">
                {filteredItems.map((item) => {
                  const saved = isItemSaved(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => setSelectedItem(item)}
                      className="break-inside-avoid relative group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gold/15 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                    >
                      {/* Image with Variable Height Aspect Ratio */}
                      <div className={`relative w-full overflow-hidden bg-gray-100 ${
                        item.aspectRatio === "tall"
                          ? "aspect-[9/16]"
                          : item.aspectRatio === "portrait"
                          ? "aspect-[3/4]"
                          : item.aspectRatio === "landscape"
                          ? "aspect-[4/3]"
                          : "aspect-[1/1]"
                      }`}>
                        <img
                          src={item.image}
                          alt={item.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                        />

                        {/* Top Action Overlay (Always visible on mobile, hover on desktop) */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-3 sm:p-4 flex flex-col justify-between">
                          
                          {/* Top Row: Category & Save */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/50 backdrop-blur-md text-[#D4B66E] px-2.5 py-1 rounded-full border border-white/20">
                              {item.category}
                            </span>

                            <div className="flex items-center gap-1.5">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setItemToSave(item);
                                }}
                                title="Save to Board"
                                className={`p-2 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                                  saved
                                    ? "bg-[#C8A96A] text-[#0F4C45] shadow-md"
                                    : "bg-black/50 text-white hover:bg-[#C8A96A] hover:text-[#0F4C45]"
                                }`}
                              >
                                <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
                              </button>

                              <button
                                onClick={(e) => handleShare(item, e)}
                                title="Share Inspiration"
                                className="p-2 rounded-full bg-black/50 text-white hover:bg-white hover:text-[#0F4C45] backdrop-blur-md transition-all cursor-pointer"
                              >
                                <Share2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* Bottom Row: Title & Palette preview */}
                          <div className="space-y-1.5 text-white">
                            <h3 className="font-serif font-bold text-xs sm:text-sm line-clamp-2 leading-snug">
                              {item.title}
                            </h3>
                            
                            {item.colorTheme && item.colorTheme.length > 0 && (
                              <div className="flex items-center gap-1 pt-1">
                                {item.colorTheme.slice(0, 5).map((color, cIdx) => (
                                  <span
                                    key={cIdx}
                                    style={{ backgroundColor: color.hex }}
                                    className="w-3 h-3 rounded-full border border-white/50 shadow-xs"
                                    title={color.name}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Card Caption (Visible below image) */}
                      <div className="p-3.5 space-y-1">
                        <div className="flex items-center justify-between text-[11px] text-charcoal/60">
                          <span className="font-semibold text-[#0F4C45]">{item.category}</span>
                          {saved && (
                            <span className="text-[10px] font-bold text-[#C8A96A] flex items-center gap-0.5">
                              <Bookmark className="w-3 h-3 fill-current" /> Saved
                            </span>
                          )}
                        </div>
                        <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal line-clamp-1 group-hover:text-[#0F4C45] transition-colors">
                          {item.title}
                        </h4>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

        {/* MY SAVED BOARDS VIEW */}
        {activeTab === "saved" && (
          <>
            {savedItemsList.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-3xl border border-gold/15 p-8 max-w-md mx-auto space-y-4">
                <div className="w-14 h-14 rounded-full bg-[#FAF7F2] border border-gold/20 flex items-center justify-center text-[#C8A96A] mx-auto">
                  <Bookmark className="w-6 h-6" />
                </div>
                <h3 className="font-serif font-bold text-xl text-charcoal">Your Inspiration Board is Empty</h3>
                <p className="text-xs text-charcoal/60 leading-relaxed">
                  Save your favorite decor concepts, bridal styling looks, and stage designs to build your personalized wedding moodboard.
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
                {savedItemsList.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className="break-inside-avoid relative group bg-white rounded-3xl overflow-hidden shadow-xs hover:shadow-xl border border-gold/15 transition-all duration-300 cursor-pointer"
                  >
                    <div className="relative w-full aspect-[3/4] overflow-hidden bg-gray-100">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3">
                        <button
                          onClick={(e) => handleQuickSave(item, e)}
                          title="Remove from saved"
                          className="p-2 rounded-full bg-[#C8A96A] text-[#0F4C45] shadow-md hover:bg-red-500 hover:text-white transition-colors cursor-pointer"
                        >
                          <Bookmark className="w-3.5 h-3.5 fill-current" />
                        </button>
                      </div>
                    </div>

                    <div className="p-3.5 space-y-1">
                      <span className="text-[10px] font-bold text-[#0F4C45] uppercase tracking-wider">{item.category}</span>
                      <h4 className="font-serif font-bold text-xs sm:text-sm text-charcoal line-clamp-1">{item.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>

      {/* 5. FULL DETAIL LIGHTBOX MODAL */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gold/20 flex flex-col md:flex-row relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 p-2 rounded-full bg-black/60 hover:bg-black text-white transition-colors cursor-pointer"
              aria-label="Close detail"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Left Image View */}
            <div className="md:w-1/2 bg-black flex items-center justify-center relative min-h-[300px] md:min-h-[500px]">
              <img
                src={selectedItem.image}
                alt={selectedItem.title}
                className="w-full h-full max-h-[500px] md:max-h-[90vh] object-cover"
              />
            </div>

            {/* Right Information & Palette Column */}
            <div className="md:w-1/2 p-6 sm:p-8 flex flex-col justify-between overflow-y-auto max-h-[60vh] md:max-h-[90vh] space-y-6">
              <div className="space-y-4">
                
                {/* Header Pills */}
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#0F4C45] bg-[#FAF7F2] px-3 py-1 rounded-full border border-gold/20">
                    {selectedItem.category}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleShare(selectedItem)}
                      className="p-2 rounded-full bg-[#FAF7F2] hover:bg-gold/20 text-charcoal border border-gold/20 transition-all cursor-pointer"
                      title="Share link"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setItemToSave(selectedItem)}
                      className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer ${
                        isItemSaved(selectedItem.id)
                          ? "bg-[#C8A96A] text-[#0F4C45]"
                          : "bg-[#0F4C45] hover:bg-[#135951] text-white"
                      }`}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isItemSaved(selectedItem.id) ? "fill-current" : ""}`} />
                      <span>{isItemSaved(selectedItem.id) ? "Saved in Board" : "Save Idea"}</span>
                    </button>
                  </div>
                </div>

                <h2 className="font-serif font-bold text-xl sm:text-2xl text-charcoal leading-snug">
                  {selectedItem.title}
                </h2>

                <p className="text-xs sm:text-sm text-charcoal/70 leading-relaxed">
                  {selectedItem.description}
                </p>

                {/* Color Palette Swatches */}
                {selectedItem.colorTheme && selectedItem.colorTheme.length > 0 && (
                  <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-gold/15 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider flex items-center gap-1.5">
                        <span>🎨 Curated Color Palette</span>
                      </span>
                      <button
                        onClick={() => handleDownloadPalette(selectedItem)}
                        className="text-[11px] font-bold text-[#0F4C45] hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <Download className="w-3 h-3" />
                        <span>Export</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {selectedItem.colorTheme.map((c, cIdx) => (
                        <button
                          key={cIdx}
                          onClick={() => handleCopyHex(c.hex, c.name)}
                          className="flex flex-col items-center gap-1 group/color cursor-pointer text-center"
                          title={`Click to copy ${c.hex}`}
                        >
                          <div
                            style={{ backgroundColor: c.hex }}
                            className="w-full h-10 rounded-xl border border-black/10 shadow-xs group-hover/color:scale-105 transition-transform"
                          />
                          <span className="text-[10px] font-semibold text-charcoal/80 truncate w-full">
                            {c.name}
                          </span>
                          <span className="text-[9px] text-charcoal/50 font-mono">
                            {c.hex}
                          </span>
                        </button>
                      ))}
                    </div>
                    <p className="text-[10px] text-charcoal/50 italic text-center">
                      Click any swatch to copy its HEX code
                    </p>
                  </div>
                )}

                {/* Tags */}
                {selectedItem.tags && selectedItem.tags.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-charcoal/50">Tags & Style:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedItem.tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="text-[11px] bg-[#FAF7F2] text-charcoal/70 px-2.5 py-1 rounded-full border border-gold/15"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Aura Context Button */}
                <div className="pt-2">
                  <button
                    onClick={() => {
                      setSelectedItem(null);
                      handleOpenAuraWithPrompt(`Tell me more about "${selectedItem.title}" style and how to plan it in Kerala`);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#0F4C45] to-[#12584E] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs hover:from-[#072B27] hover:to-[#0F4C45] transition-all cursor-pointer"
                  >
                    <Sparkles className="w-4 h-4 text-gold" />
                    <span>Ask Aura to plan this style</span>
                  </button>
                </div>
              </div>

              {/* Related "More Like This" */}
              {relatedItems.length > 0 && (
                <div className="border-t border-gold/15 pt-4 space-y-2.5">
                  <span className="text-xs font-bold text-[#0F4C45] uppercase tracking-wider">
                    More Like This
                  </span>
                  <div className="grid grid-cols-4 gap-2">
                    {relatedItems.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => setSelectedItem(rel)}
                        className="aspect-square rounded-xl overflow-hidden border border-gold/15 cursor-pointer hover:opacity-80 transition-opacity bg-gray-100"
                        title={rel.title}
                      >
                        <img src={rel.image} alt={rel.title} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 6. SAVE TO BOARD MODAL */}
      {itemToSave && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold/20 space-y-4 animate-in zoom-in-95 duration-150"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#0F4C45]" />
                <span>Save to Board</span>
              </h3>
              <button
                onClick={() => setItemToSave(null)}
                className="p-1 rounded-full text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Board List */}
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {boards.map((b) => {
                const isSavedInBoard = (savedMap[itemToSave.id] || []).includes(b.id);
                return (
                  <button
                    key={b.id}
                    onClick={() => handleToggleBoardSave(b.id)}
                    className="w-full p-3 rounded-2xl border border-gold/15 bg-[#FAF7F2] hover:bg-gold/15 transition-colors flex items-center justify-between text-xs font-semibold text-charcoal cursor-pointer"
                  >
                    <span>{b.name}</span>
                    <span className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                      isSavedInBoard
                        ? "bg-[#0F4C45] text-[#C8A96A] border-[#0F4C45]"
                        : "border-charcoal/30 bg-white"
                    }`}>
                      {isSavedInBoard && <Check className="w-3 h-3 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Create New Board Accordion */}
            {isCreatingBoard ? (
              <div className="space-y-2 pt-2 border-t border-gold/10">
                <input
                  type="text"
                  value={newBoardName}
                  onChange={(e) => setNewBoardName(e.target.value)}
                  placeholder="Board name (e.g. Stage Ideas)..."
                  className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-3 py-2 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
                  autoFocus
                />
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCreateBoard}
                    disabled={!newBoardName.trim()}
                    className="flex-1 bg-[#0F4C45] hover:bg-[#135951] disabled:opacity-40 text-white font-bold text-xs py-2 rounded-xl transition-colors cursor-pointer"
                  >
                    Create & Save
                  </button>
                  <button
                    onClick={() => setIsCreatingBoard(false)}
                    className="px-3 py-2 rounded-xl text-xs text-charcoal/60 hover:text-charcoal cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setIsCreatingBoard(true)}
                className="w-full py-2.5 rounded-2xl border border-dashed border-[#0F4C45]/40 hover:border-[#0F4C45] text-[#0F4C45] font-bold text-xs flex items-center justify-center gap-1.5 bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Board</span>
              </button>
            )}

            <button
              onClick={() => {
                setItemToSave(null);
                showToast("Inspirations saved to board!");
              }}
              className="w-full bg-[#0F4C45] hover:bg-[#135951] text-white font-bold text-xs py-2.5 rounded-xl shadow-xs transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* 7. STANDALONE CREATE BOARD MODAL */}
      {!itemToSave && isCreatingBoard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div
            className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl border border-gold/20 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-3">
              <h3 className="font-serif font-bold text-base text-charcoal flex items-center gap-2">
                <FolderPlus className="w-4 h-4 text-[#0F4C45]" />
                <span>Create New Board</span>
              </h3>
              <button
                onClick={() => setIsCreatingBoard(false)}
                className="p-1 rounded-full text-charcoal/40 hover:text-charcoal cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <input
              type="text"
              value={newBoardName}
              onChange={(e) => setNewBoardName(e.target.value)}
              placeholder="e.g. Mandap Concepts, Reception Styling..."
              className="w-full bg-[#FAF7F2] border border-gold/30 rounded-xl px-3.5 py-2.5 text-xs text-charcoal focus:outline-none focus:border-[#0F4C45]"
              autoFocus
            />

            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={handleCreateBoard}
                disabled={!newBoardName.trim()}
                className="flex-1 bg-[#0F4C45] hover:bg-[#135951] disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl transition-colors cursor-pointer"
              >
                Create Board
              </button>
              <button
                onClick={() => setIsCreatingBoard(false)}
                className="px-4 py-2.5 rounded-xl text-xs text-charcoal/60 hover:text-charcoal cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Aura AI Assistant Drawer */}
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
