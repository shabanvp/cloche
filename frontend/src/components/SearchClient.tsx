"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Product, Boutique } from "@/types";
import { Search, MapPin, Filter, Star, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "./Button";
import { searchProducts, searchBoutiques } from "@/app/actions/search";

export function SearchClient() {
  const [activeTab, setActiveTab] = useState<"collections" | "boutiques">("collections");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedDistrict, setSelectedDistrict] = useState("All");
  
  // Results & Pagination
  const [products, setProducts] = useState<Product[]>([]);
  const [boutiques, setBoutiques] = useState<Boutique[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const categories = [
    { label: "All", value: "All" },
    { label: "Bridal Wear", value: "Bridal" },
    { label: "Groom Wear", value: "Groom" },
    { label: "Couture", value: "Couture" },
    { label: "Traditional", value: "Traditional" },
    { label: "Jewellery", value: "Jewellery" },
    { label: "Makeup & Hair", value: "Makeup" },
    { label: "Photography", value: "Photography" }
  ];
  const districts = ["All", "Ernakulam", "Trivandrum", "Kozhikode", "Thrissur", "Kottayam"];

  const fetchResults = useCallback(async (isBoutique: boolean, currentPage: number) => {
    setIsLoading(true);
    
    if (isBoutique) {
      const res = await searchBoutiques({
        keyword: searchQuery,
        district: selectedDistrict,
        page: currentPage,
        limit: 12
      });
      if (res.success) {
        setBoutiques(res.data);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalResults(res.pagination.total || 0);
      } else {
        setBoutiques([]);
      }
    } else {
      const res = await searchProducts({
        keyword: searchQuery,
        district: selectedDistrict,
        category: selectedCategory,
        page: currentPage,
        limit: 12
      });
      if (res.success) {
        setProducts(res.data);
        setTotalPages(res.pagination.totalPages || 1);
        setTotalResults(res.pagination.total || 0);
      } else {
        setProducts([]);
      }
    }
    
    setIsLoading(false);
  }, [searchQuery, selectedDistrict, selectedCategory]);

  useEffect(() => {
    // Reset page on filter change
    setPage(1);
    const timeoutId = setTimeout(() => {
      fetchResults(activeTab === "boutiques", 1);
    }, 400); // 400ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery, selectedCategory, selectedDistrict, activeTab, fetchResults]);

  // When page explicitly changes
  useEffect(() => {
    if (page > 1) {
      fetchResults(activeTab === "boutiques", page);
    }
  }, [page, activeTab, fetchResults]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedDistrict("All");
    setPage(1);
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Filters Sidebar */}
      <div className="w-full md:w-64 shrink-0 space-y-8">
        
        {/* Search */}
        <div>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gold/20 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-emerald transition-colors shadow-sm"
            />
            <Search className="w-4 h-4 text-charcoal/40 absolute left-4 top-1/2 -translate-y-1/2" />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex bg-white rounded-full p-1 border border-gold/10 shadow-sm">
          <button 
            onClick={() => setActiveTab("collections")}
            className={cn("flex-1 text-xs font-semibold uppercase tracking-wider py-2 rounded-full transition-colors", activeTab === "collections" ? "bg-emerald text-white" : "text-charcoal hover:bg-ivory")}
          >
            Collections
          </button>
          <button 
            onClick={() => setActiveTab("boutiques")}
            className={cn("flex-1 text-xs font-semibold uppercase tracking-wider py-2 rounded-full transition-colors", activeTab === "boutiques" ? "bg-emerald text-white" : "text-charcoal hover:bg-ivory")}
          >
            Boutiques
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10 space-y-6">
          <div className="flex items-center gap-2 text-charcoal font-display text-lg mb-4">
            <Filter className="w-4 h-4 text-gold" /> Filters
          </div>

          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">District</h4>
            <select 
              value={selectedDistrict} 
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="w-full bg-ivory border border-gold/20 rounded-lg p-2 text-sm text-charcoal focus:outline-none"
            >
              {districts.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>

          {activeTab === "collections" && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-charcoal mb-3">Category</h4>
              <div className="space-y-2">
                {categories.map(c => (
                  <label key={c.value} className="flex items-center gap-2 cursor-pointer group">
                    <input 
                      type="radio" 
                      name="category" 
                      checked={selectedCategory === c.value}
                      onChange={() => setSelectedCategory(c.value)}
                      className="accent-emerald w-3 h-3"
                    />
                    <span className={cn("text-sm transition-colors", selectedCategory === c.value ? "text-emerald font-medium" : "text-charcoal/70 group-hover:text-charcoal")}>{c.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1">
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-display text-charcoal flex items-center gap-3">
            {activeTab === "collections" ? "Discover Collections" : "Discover Boutiques"}
            {isLoading && <Loader2 className="w-5 h-5 text-emerald animate-spin" />}
          </h2>
          <span className="text-sm text-charcoal/50">
            {totalResults} results
          </span>
        </div>

        {activeTab === "collections" ? (
          products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map(product => (
                <Link key={product.id} href={`/collections/${product.id}`} className="group block">
                  <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-sm group-hover:shadow-xl transition-all duration-300">
                    <Image
                      src={product.image_url || "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"}
                      alt={product.product_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider text-charcoal shadow-sm">
                      {product.category}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-display text-sm md:text-base font-medium text-charcoal mb-1 truncate">{product.product_name}</h3>
                    <p className="text-xs font-semibold text-emerald">₹{product.price.toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 border-dashed">
                <Search className="w-8 h-8 text-gold mx-auto mb-4 opacity-50" />
                <p className="text-charcoal font-medium mb-1">No collections found</p>
                <p className="text-sm text-charcoal/50">Try adjusting your filters or search query.</p>
                <Button variant="outline" className="mt-4 border-emerald text-emerald hover:bg-emerald hover:text-white rounded-full" onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )
          )
        ) : (
          boutiques.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {boutiques.map(boutique => (
                <Link key={boutique.id} href={`/boutiques/${boutique.id}`} className="group block bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-gold/10">
                  <div className="relative aspect-[4/3] w-full">
                    <Image
                      src={boutique.image_url || "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=800&auto=format&fit=crop"}
                      alt={boutique.boutique_name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 to-transparent opacity-80"></div>
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-display text-lg font-medium mb-1 truncate flex items-center gap-2">
                        {boutique.boutique_name}
                        {boutique.plan === 'premium' && <CheckCircle2 className="w-3.5 h-3.5 text-gold fill-white" />}
                      </h3>
                      <div className="flex items-center justify-between text-xs text-white/90">
                        <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {boutique.city || boutique.district || 'Kerala'}</span>
                        {boutique.rating ? (
                          <span className="flex items-center gap-1 bg-black/20 px-1.5 py-0.5 rounded backdrop-blur-md">
                            <Star className="w-3 h-3 text-gold fill-gold" /> {boutique.rating.toFixed(1)}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            !isLoading && (
              <div className="text-center py-20 bg-white rounded-2xl border border-gold/10 border-dashed">
                <Search className="w-8 h-8 text-gold mx-auto mb-4 opacity-50" />
                <p className="text-charcoal font-medium mb-1">No boutiques found</p>
                <p className="text-sm text-charcoal/50">Try adjusting your filters or search query.</p>
                <Button variant="outline" className="mt-4 border-emerald text-emerald hover:bg-emerald hover:text-white rounded-full" onClick={handleClearFilters}>Clear Filters</Button>
              </div>
            )
          )
        )}

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1 || isLoading}
              className="p-2 h-10 w-10 rounded-full flex items-center justify-center border-gold/20 text-charcoal disabled:opacity-50"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="text-sm font-medium text-charcoal px-4">
              Page {page} of {totalPages}
            </div>

            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || isLoading}
              className="p-2 h-10 w-10 rounded-full flex items-center justify-center border-gold/20 text-charcoal disabled:opacity-50"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
