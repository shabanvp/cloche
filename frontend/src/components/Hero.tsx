import Image from "next/image";
import { Button } from "./Button";
import { Search } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  return (
    <div className="relative w-full h-[600px] bg-ivory flex items-center">
      {/* Background with slight dark overlay to ensure text readability */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent z-10"></div>
        {/* Using a high-quality Kerala wedding image */}
        <Image 
          src={imageUrl || "https://images.unsplash.com/photo-1583391733981-849840f3f1c2?q=80&w=2000&auto=format&fit=crop"}
          alt={title || "Kerala Wedding"}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white mb-6 leading-tight drop-shadow-md">
            {title ? title : (
              <>
                <span className="font-light">Curate your</span><br/>
                <span className="font-light">perfect wedding,</span><br/>
                <span className="font-display">the Kerala way.</span>
              </>
            )}
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-12 font-light max-w-sm drop-shadow-md">
            {subtitle || "Discover the finest boutiques, curated collections & trusted experts."}
          </p>
          
          {/* Advanced Search Bar Container */}
          <div className="bg-white p-4 md:p-6 rounded-2xl shadow-2xl max-w-2xl mt-4">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 border border-gray-200 rounded-lg md:rounded-full p-2 mb-4">
              <div className="flex-1 px-4 py-2 md:py-0">
                <input 
                  type="text" 
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-none focus:outline-none text-charcoal placeholder-charcoal/50 text-sm md:text-base"
                />
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>
              <div className="px-4 py-2 md:py-0 border-t md:border-t-0 border-gray-100 md:border-none">
                <select 
                  aria-label="Category select"
                  className="bg-transparent border-none focus:outline-none text-charcoal text-sm font-medium cursor-pointer w-full md:w-auto"
                >
                  <option>All Categories</option>
                  <option>Bridal Wear</option>
                  <option>Groom Wear</option>
                  <option>Jewellery</option>
                </select>
              </div>
              <Button size="icon" className="w-full md:w-12 h-10 md:h-10 rounded-lg md:rounded-full bg-emerald hover:bg-emerald/90 flex justify-center items-center shrink-0">
                <Search className="w-4 h-4 text-white" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-charcoal/70 font-medium px-2">
              <span>Popular searches:</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 rounded-full transition-colors">Bridal wear</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 rounded-full transition-colors">Jewellery</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 rounded-full transition-colors">Wedding planners</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 rounded-full transition-colors">Makeup artists</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 border border-gray-200 px-3 py-1 rounded-full transition-colors">Venues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
