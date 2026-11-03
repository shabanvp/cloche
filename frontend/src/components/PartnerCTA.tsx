import { Button } from "./Button";
import { CheckCircle2 } from "lucide-react";
import Link from "next/link";

export function PartnerCTA() {
  return (
    <section className="bg-emerald py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-display text-white mb-4">Grow your boutique with Cloche</h2>
            <p className="text-white/80 mb-8 font-light max-w-md leading-relaxed">
              Join Kerala&apos;s most premium wedding marketplace. Reach thousands of brides, manage your collections effortlessly, and elevate your brand.
            </p>
            <ul className="space-y-3 mb-8">
              {['Exclusive exposure to premium clientele', 'Zero commission on leads', 'Dedicated partner dashboard', 'Priority support'].map((benefit, idx) => (
                <li key={idx} className="flex items-center gap-3 text-white/90 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-gold" />
                  {benefit}
                </li>
              ))}
            </ul>
            <a href="/partner?mode=create" className="inline-block">
              <Button variant="secondary" size="lg" className="font-semibold px-8 rounded-full">
                Register as Partner
              </Button>
            </a>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-4xl font-display text-gold mb-2">500+</div>
              <div className="text-sm text-white/80">Trusted Boutiques</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm translate-y-4">
              <div className="text-4xl font-display text-gold mb-2">50k+</div>
              <div className="text-sm text-white/80">Monthly Brides</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm -translate-y-4">
              <div className="text-4xl font-display text-gold mb-2">12k+</div>
              <div className="text-sm text-white/80">Collections Listed</div>
            </div>
            <div className="bg-white/5 p-6 rounded-2xl border border-white/10 backdrop-blur-sm">
              <div className="text-4xl font-display text-gold mb-2">100%</div>
              <div className="text-sm text-white/80">Verified Leads</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
