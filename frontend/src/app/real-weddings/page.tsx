import Link from "next/link";
import Image from "next/image";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { MapPin, Camera } from "lucide-react";

export const metadata = {
  title: "Real Kerala Weddings | Cloche",
  description: "Explore breathtaking real wedding stories from across Kerala. Get inspired by real couples, their venues, photographers, and bridal looks.",
};

export default function RealWeddingsHub() {
  const weddings = [
    {
      id: "w-101",
      couple: "Aiswarya & Rahul",
      location: "Kumarakom Lake Resort",
      style: "Traditional Hindu Wedding",
      photographer: "Magic Motion Media",
      image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "w-102",
      couple: "Sarah & Mathew",
      location: "Bolgatty Palace, Kochi",
      style: "Elegant Christian Wedding",
      photographer: "Jackson James Photography",
      image: "https://images.unsplash.com/photo-1594223274500-111111111111?q=80&w=800&auto=format&fit=crop"
    },
    {
      id: "w-103",
      couple: "Fathima & Salman",
      location: "Taj Malabar, Kochi",
      style: "Royal Nikah",
      photographer: "Weva Photography",
      image: "https://images.unsplash.com/photo-1594223274501-222222222222?q=80&w=800&auto=format&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-ivory flex flex-col">
      <Header />
      
      <main className="flex-1 pb-24">
        
        {/* Header */}
        <div className="bg-emerald text-white py-24 px-4 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
          <div className="relative z-10">
            <h1 className="text-4xl md:text-6xl font-display mb-4">Real Kerala Weddings</h1>
            <p className="text-white/80 max-w-2xl mx-auto font-light text-lg">
              Get inspired by breathtaking real wedding stories, complete with vendor details and stunning galleries.
            </p>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-16">
          
          {/* Filters (Mock) */}
          <div className="flex flex-wrap justify-center gap-4 mb-16">
            {["All Weddings", "Hindu", "Christian", "Muslim", "Destination", "Intimate"].map((tab, i) => (
              <button key={tab} className={`px-6 py-2 rounded-full text-sm font-semibold uppercase tracking-wider transition-colors ${i === 0 ? 'bg-charcoal text-white' : 'bg-white border border-gold/20 text-charcoal/70 hover:border-emerald hover:text-emerald'}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {weddings.map(wedding => (
              <Link key={wedding.id} href={`/real-weddings/${wedding.id}`} className="group block bg-white rounded-3xl overflow-hidden shadow-sm border border-gold/10 hover:shadow-lg transition-all duration-300">
                <div className="relative aspect-[4/5] overflow-hidden">
                  <Image 
                    src={wedding.image}
                    alt={wedding.couple}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80"></div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-sm px-2 py-1 rounded-sm mb-3 inline-block">
                      {wedding.style}
                    </span>
                    <h2 className="text-2xl font-display mb-2">{wedding.couple}</h2>
                    <div className="flex flex-col gap-1 text-xs font-medium text-white/80">
                      <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5 text-gold" /> {wedding.location}</span>
                      <span className="flex items-center gap-1.5"><Camera className="w-3.5 h-3.5 text-gold" /> {wedding.photographer}</span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
