import Image from "next/image";
import { Button } from "./Button";
import { Search } from "lucide-react";

export function Hero() {
  return (
    <div className="relative w-full h-[600px] bg-ivory flex items-center">
      {/* Background with slight gradient overlay */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-r from-emerald/90 via-emerald/60 to-transparent z-10"></div>
        {/* Replace with high-quality wedding image from cloudinary or unsplash for now */}
        <Image 
          src="https://images.unsplash.com/photo-1583391733981-849840f3f1c2?q=80&w=2000&auto=format&fit=crop"
          alt="Kerala Wedding"
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-display text-white mb-6 leading-tight">
            Curate your perfect wedding, <br/>
            <span className="text-gold italic">the Kerala way.</span>
          </h1>
          <p className="text-lg text-white/90 mb-10 font-light max-w-xl">
            Discover the finest boutiques, curated collections & trusted experts.
          </p>
          
          {/* Advanced Search Bar */}
          <div className="bg-white p-2 rounded-full flex items-center shadow-2xl max-w-xl">
            <div className="flex-1 px-4">
              <input 
                type="text" 
                placeholder="What are you looking for?"
                className="w-full bg-transparent border-none focus:outline-none text-charcoal placeholder-charcoal/50"
              />
            </div>
            <div className="h-8 w-px bg-gray-200 mx-2"></div>
            <div className="px-4">
              <select className="bg-transparent border-none focus:outline-none text-charcoal text-sm font-medium cursor-pointer">
                <option>All Categories</option>
                <option>Bridal Wear</option>
                <option>Groom Wear</option>
                <option>Jewellery</option>
              </select>
            </div>
            <Button size="icon" className="rounded-full bg-emerald hover:bg-emerald/90">
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
