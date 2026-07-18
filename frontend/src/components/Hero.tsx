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
      {/* Background with slight gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/90 via-emerald/60 to-transparent z-10"></div>
        {/* Replace with high-quality wedding image from cloudinary or unsplash for now */}
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
          <h1 className="text-5xl md:text-6xl font-display text-white mb-6 leading-tight">
            {title ? title : <>Curate your perfect wedding, <br/><span className="text-gold italic">the Kerala way.</span></>}
          </h1>
          <p className="text-lg text-white/90 mb-10 font-light max-w-xl">
            {subtitle || "Discover the finest boutiques, curated collections & trusted experts."}
          </p>
          
          {/* Advanced Search Bar */}
          <div className="bg-white p-2 rounded-2xl md:rounded-full flex flex-col md:flex-row items-stretch md:items-center shadow-2xl max-w-xl gap-2 md:gap-0">
            <div className="flex-1 px-4 py-2 md:py-0">
              <input 
                type="text" 
                placeholder="What are you looking for?"
                className="w-full bg-transparent border-none focus:outline-none text-charcoal placeholder-charcoal/50 text-sm md:text-base"
              />
            </div>
            <div className="hidden md:block h-8 w-px bg-gray-200 mx-2"></div>
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
            <Button size="icon" className="w-full md:w-10 rounded-xl md:rounded-full bg-emerald hover:bg-emerald/90 mt-2 md:mt-0 flex justify-center items-center">
              <Search className="w-4 h-4 text-white" />
            </Button>
          </div>
          
          <div className="mt-6 flex gap-4 text-xs text-white/80 font-medium">
            <span>Popular searches:</span>
            <span className="cursor-pointer hover:text-gold transition-colors">Bridal Wear</span>
            <span className="cursor-pointer hover:text-gold transition-colors">Jewellery</span>
            <span className="cursor-pointer hover:text-gold transition-colors">Makeup Artists</span>
          </div>
        </div>
      </div>
    </div>
  );
}
