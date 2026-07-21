import Link from "next/link";
import { MapPin, Mail, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-emerald text-white pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-3 mb-6">
              <div className="relative flex items-center justify-center w-[60px] h-[55px]">
                <img src="/logo.png" alt="Cloche Logo" className="absolute inset-0 w-full h-full object-contain scale-[1.9] drop-shadow-sm origin-center" />
              </div>
              <div className="flex flex-col">
                <span className="font-display text-3xl tracking-widest text-white font-bold uppercase">Cloche</span>
                <span className="text-[10px] uppercase tracking-[0.3em] text-gold mt-1">Weddings of Kerala</span>
              </div>
            </Link>
            <p className="text-white/70 text-sm font-light leading-relaxed mb-6">
              Curate your perfect wedding, the Kerala way. Discover the finest boutiques, curated collections & trusted experts all in one premium marketplace.
            </p>
            <div className="flex space-x-4 text-gold">
              <a href="#" className="hover:text-white transition-colors text-sm">Instagram</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Facebook</a>
              <a href="#" className="hover:text-white transition-colors text-sm">Twitter</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display text-lg mb-6 text-gold">Discover</h4>
            <ul className="space-y-4 text-sm text-white/80 font-light">
              <li><Link href="/boutiques" className="hover:text-white transition-colors">Featured Boutiques</Link></li>
              <li><Link href="/collections" className="hover:text-white transition-colors">Trending Collections</Link></li>
              <li><Link href="/categories" className="hover:text-white transition-colors">Browse Categories</Link></li>
              <li><Link href="/real-weddings" className="hover:text-white transition-colors">Real Kerala Weddings</Link></li>
              <li><Link href="/deals" className="hover:text-white transition-colors">Exclusive Offers</Link></li>
            </ul>
          </div>

          {/* For Partners */}
          <div>
            <h4 className="font-display text-lg mb-6 text-gold">For Partners</h4>
            <ul className="space-y-4 text-sm text-white/80 font-light">
              <li><Link href="/vendor/login" className="hover:text-white transition-colors">Partner Dashboard</Link></li>
              <li><Link href="/vendor/register" className="hover:text-white transition-colors">Register as Vendor</Link></li>
              <li><Link href="/content/vendor-agreement" className="hover:text-white transition-colors">Vendor Agreement</Link></li>
              <li><Link href="/content/pricing" className="hover:text-white transition-colors">Subscription Pricing</Link></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display text-lg mb-6 text-gold">Contact Us</h4>
            <ul className="space-y-4 text-sm text-white/80 font-light">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-gold shrink-0" />
                <span>Kochi, Kerala, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-gold shrink-0" />
                <a href="mailto:support@cloche.com" className="hover:text-white transition-colors">support@cloche.com</a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-gold shrink-0" />
                <a href="tel:+919876543210" className="hover:text-white transition-colors">+91 98765 43210</a>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-white/50 font-light">
          <p>&copy; {new Date().getFullYear()} Cloche. All rights reserved.</p>
          <div className="flex space-x-6">
            <Link href="/content/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="/content/terms" className="hover:text-white transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
