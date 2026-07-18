import Image from "next/image";
import { Button } from "./Button";
import { Search, Flower2 } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  return (
    <div className="relative w-full bg-ivory flex items-center min-h-[480px] md:min-h-[640px] lg:min-h-[760px] xl:min-h-[850px] pb-16 md:pb-24">
      {/* Background with slight dark overlay to ensure text readability */}
      <div className="absolute inset-0 z-0 h-[85%]">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent z-10"></div>
        {/* Using a local fallback SVG until the user provides the actual photograph */}
        <img 
          src={imageUrl || "/hero.svg"}
          alt={title || "Kerala Wedding"}
          className="object-cover w-full h-full object-top"
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full h-full flex flex-col justify-center">
        <div className="max-w-2xl mt-12 md:mt-0">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display text-white mb-6 leading-[1.15] drop-shadow-lg">
            {title ? title : (
              <>
                Curate your<br/>
                perfect wedding,<br/>
                the Kerala way.
              </>
            )}
          </h1>
          <p className="text-base md:text-lg text-white/90 mb-8 font-light max-w-sm drop-shadow-md leading-relaxed">
            {subtitle || "Discover the finest boutiques, curated collections & trusted experts."}
          </p>
          
          <Flower2 className="w-12 h-12 text-gold mb-12 opacity-80" strokeWidth={1} />
          
          {/* Advanced Search Bar Container - overlaps the bottom edge */}
          <div className="absolute -bottom-16 left-4 right-4 md:left-1/2 md:-translate-x-1/2 lg:left-8 lg:-translate-x-0 lg:right-auto w-auto md:w-[700px] lg:w-[800px] bg-white p-4 md:p-5 rounded-2xl shadow-xl z-20">
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 md:gap-0 border border-gray-200 rounded-lg md:rounded-full p-1.5 mb-3">
              <div className="flex-1 px-4 py-2 md:py-0">
                <input 
                  type="text" 
                  placeholder="What are you looking for?"
                  className="w-full bg-transparent border-none focus:outline-none text-charcoal placeholder-charcoal/50 text-sm md:text-base"
                />
              </div>
              <div className="hidden md:block h-6 w-px bg-gray-200 mx-2"></div>
              <div className="px-4 py-2 md:py-0 border-t md:border-t-0 border-gray-100 md:border-none w-full md:w-48">
                <select 
                  aria-label="Category select"
                  className="bg-transparent border-none focus:outline-none text-charcoal text-sm font-medium cursor-pointer w-full"
                >
                  <option>All Categories</option>
                  <option>Bridal Wear</option>
                  <option>Groom Wear</option>
                  <option>Jewellery</option>
                </select>
              </div>
              <Button size="icon" className="w-full md:w-12 h-10 md:h-10 rounded-lg md:rounded-full bg-emerald hover:bg-emerald/90 flex justify-center items-center shrink-0">
                <Search className="w-5 h-5 text-white" />
              </Button>
            </div>
            
            <div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs text-charcoal/60 font-medium px-2">
              <span className="mr-1">Popular searches:</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">Bridal wear</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">Jewellery</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">Wedding planners</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">Makeup artists</span>
              <span className="cursor-pointer bg-gray-50 hover:bg-gray-100 px-3 py-1.5 rounded-md transition-colors">Venues</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
