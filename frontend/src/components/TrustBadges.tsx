import { CheckCircle2, Crown, ShieldCheck, HeartHandshake } from "lucide-react";

export function TrustBadges() {
  return (
    <section className="bg-emerald py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 text-white">
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <CheckCircle2 className="w-8 h-8 text-gold shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-medium text-sm md:text-base mb-1">Verified boutiques</h4>
              <p className="text-xs md:text-sm text-white/70 font-light">Trusted by millions</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <Crown className="w-8 h-8 text-gold shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-medium text-sm md:text-base mb-1">Exclusive collections</h4>
              <p className="text-xs md:text-sm text-white/70 font-light">Handpicked for you</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <ShieldCheck className="w-8 h-8 text-gold shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-medium text-sm md:text-base mb-1">Secure & seamless</h4>
              <p className="text-xs md:text-sm text-white/70 font-light">Your privacy, our priority</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-center md:items-start text-center md:text-left gap-4">
            <HeartHandshake className="w-8 h-8 text-gold shrink-0" strokeWidth={1.5} />
            <div>
              <h4 className="font-medium text-sm md:text-base mb-1">Wedding experts</h4>
              <p className="text-xs md:text-sm text-white/70 font-light">Here to help you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
