import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBoutiqueDetails, getBoutiqueProducts } from "@/services/api";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/Button";
import { MapPin, Star, Phone, MessageCircle, Share2, Heart } from "lucide-react";
import { BookingModal } from "@/components/BookingModal";

interface Props {
  params: { id: string };
}

export default async function BoutiqueProfilePage({ params }: Props) {
  const { id } = await params;
  const boutique = await getBoutiqueDetails(id);

  if (!boutique) {
    notFound();
  }

  const collections = await getBoutiqueProducts(id);

  return (
    <div className="min-h-screen bg-ivory">
      <Header />
      
      <main>
        {/* Luxury Hero */}
        <section className="relative w-full h-[50vh] md:h-[60vh] bg-emerald">
          <Image 
            src={boutique.image_url || "https://images.unsplash.com/photo-1594938298596-70f594f74246?q=80&w=2000&auto=format&fit=crop"}
            alt={boutique.boutique_name}
            fill
            className="object-cover opacity-60 mix-blend-overlay"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/40 to-transparent"></div>
          
          <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="text-white">
              <div className="flex items-center gap-3 mb-2">
                {boutique.is_featured && (
                  <span className="bg-gold text-white text-[10px] uppercase tracking-wider px-2 py-1 rounded-full font-semibold">
                    Verified Premium
                  </span>
                )}
                {boutique.rating && (
                  <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full text-xs">
                    <Star className="w-3 h-3 fill-gold text-gold" />
                    <span>{boutique.rating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-medium mb-3">{boutique.boutique_name}</h1>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {boutique.area ? `${boutique.area}, ` : ""}{boutique.city || boutique.district}</span>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Actions Bar */}
        <div className="bg-white border-b border-gold/10 sticky top-20 z-40 shadow-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex overflow-x-auto hide-scrollbar gap-4 justify-between items-center">
            <div className="flex gap-3 shrink-0">
              <Button className="rounded-full flex items-center gap-2 bg-emerald hover:bg-emerald/90 text-white">
                <MessageCircle className="w-4 h-4" /> WhatsApp
              </Button>
              <BookingModal boutiqueId={Number(boutique.id)} boutiqueName={boutique.boutique_name} />
            </div>
            <div className="flex gap-2 shrink-0 text-charcoal">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gold/10 hover:text-gold"><Phone className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gold/10 hover:text-gold"><Share2 className="w-4 h-4" /></Button>
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gold/10 hover:text-gold"><Heart className="w-4 h-4" /></Button>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-16">
            
            {/* About */}
            <section>
              <h2 className="text-2xl font-display text-charcoal mb-6 flex items-center gap-3">
                About {boutique.boutique_name}
                <span className="h-px bg-gold/30 flex-1"></span>
              </h2>
              <div className="prose prose-emerald max-w-none text-charcoal/80 font-light leading-relaxed">
                <p>Welcome to {boutique.boutique_name}, a premier destination for luxury wedding wear located in the heart of {boutique.city || boutique.district}. We specialize in curating the finest bridal and groom collections, ensuring your special day is nothing short of perfect.</p>
                {boutique.tags && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {boutique.tags.split(',').map((tag, idx) => (
                      <span key={idx} className="bg-ivory border border-gold/20 text-charcoal text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Collections */}
            <section>
              <h2 className="text-2xl font-display text-charcoal mb-8 flex items-center gap-3">
                Signature Collections
                <span className="h-px bg-gold/30 flex-1"></span>
              </h2>
              
              {collections.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                  {collections.map(product => (
                    <Link key={product.id} href={`/collections/${product.id}`} className="group block">
                      <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 shadow-md group-hover:shadow-xl transition-all duration-300">
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
                        <h3 className="font-display text-base md:text-lg font-medium text-charcoal mb-1 truncate">{product.product_name}</h3>
                        <p className="text-sm font-semibold text-emerald">₹{product.price.toLocaleString('en-IN')}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="bg-white p-8 rounded-2xl border border-gold/10 text-center">
                  <p className="text-charcoal/60 italic">No collections listed yet.</p>
                </div>
              )}
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gold/10">
              <h3 className="font-display text-xl text-charcoal mb-4">Contact Info</h3>
              <ul className="space-y-4 text-sm text-charcoal/80">
                <li className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                  <span>
                    {boutique.shop_location || `${boutique.area || ''}, ${boutique.city || boutique.district}, Kerala`}
                  </span>
                </li>
                {boutique.phone && (
                  <li className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-gold shrink-0" />
                    <a href={`tel:${boutique.phone}`} className="hover:text-emerald transition-colors">{boutique.phone}</a>
                  </li>
                )}
              </ul>
              
              <div className="mt-6 pt-6 border-t border-gray-100">
                <h3 className="font-display text-xl text-charcoal mb-4">Working Hours</h3>
                <ul className="space-y-2 text-sm text-charcoal/80">
                  <li className="flex justify-between"><span>Mon - Sat</span> <span>10:00 AM - 8:00 PM</span></li>
                  <li className="flex justify-between"><span>Sunday</span> <span className="text-emerald">By Appointment</span></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  );
}
