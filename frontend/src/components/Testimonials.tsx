import Image from "next/image";
import { Star } from "lucide-react";
import Link from "next/link";

const TESTIMONIALS = [
  {
    name: "Anagha Nair",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop",
    text: "Panache Bridal made my dream wedding look come true! The detailing and fit were absolutely perfect.",
    rating: 5,
  },
  {
    name: "Devika Menon",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    text: "The team is super professional and made the whole experience so special and stress-free.",
    rating: 5,
  },
  {
    name: "Aiswarya Raj",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    text: "Their collection is exquisite. I received countless compliments on my big day!",
    rating: 5,
  }
];

interface TestimonialsProps {
  title?: string;
  subtitle?: string;
}

export function Testimonials({ title, subtitle }: TestimonialsProps) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto bg-ivory">
      <div className="flex justify-between items-end mb-12">
        <div>
          <span className="text-gold tracking-[0.4em] uppercase text-xs mb-3 block font-bold">{subtitle || "What Our Brides Say"}</span>
          <h2 className="text-3xl md:text-4xl font-display text-charcoal">{title || "Real experiences"}</h2>
        </div>
        <Link href="/reviews" className="text-sm font-medium text-emerald hover:text-gold transition-colors hidden sm:block">
          View all reviews
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {TESTIMONIALS.map((testimonial, idx) => (
          <div key={idx} className="bg-white p-8 rounded-2xl shadow-sm border border-gold/10 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 mb-6">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image src={testimonial.avatar} alt={testimonial.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-medium text-charcoal">{testimonial.name}</h4>
                <div className="flex text-gold">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-gold" />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-charcoal/70 text-sm leading-relaxed italic">
              &quot;{testimonial.text}&quot;
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
