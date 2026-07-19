import { CheckCircle2, Crown, ShieldCheck, HeartHandshake } from "lucide-react";

export function TrustBadges() {
  return (
    <section className="bg-emerald py-9 md:py-10 lg:py-12">
      <div className="mx-auto w-full max-w-[1728px] px-5 sm:px-7 lg:px-10 xl:px-12 2xl:px-14">
        <div className="grid grid-cols-2 gap-x-4 gap-y-7 text-white sm:gap-x-8 lg:grid-cols-4 lg:gap-10 xl:gap-14">
          <div className="flex items-start gap-3 text-left sm:gap-4">
            <CheckCircle2 className="h-7 w-7 shrink-0 text-gold sm:h-8 sm:w-8 lg:h-9 lg:w-9" strokeWidth={1.35} />
            <div>
              <h4 className="mb-1 text-[14px] font-semibold md:text-[15px]">Verified boutiques</h4>
              <p className="text-[12px] font-light text-white/74 md:text-[13px]">Trusted by millions</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left sm:gap-4">
            <Crown className="h-7 w-7 shrink-0 text-gold sm:h-8 sm:w-8 lg:h-9 lg:w-9" strokeWidth={1.35} />
            <div>
              <h4 className="mb-1 text-[14px] font-semibold md:text-[15px]">Exclusive collections</h4>
              <p className="text-[12px] font-light text-white/74 md:text-[13px]">Handpicked for you</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left sm:gap-4">
            <ShieldCheck className="h-7 w-7 shrink-0 text-gold sm:h-8 sm:w-8 lg:h-9 lg:w-9" strokeWidth={1.35} />
            <div>
              <h4 className="mb-1 text-[14px] font-semibold md:text-[15px]">Secure & seamless</h4>
              <p className="text-[12px] font-light text-white/74 md:text-[13px]">Your privacy, our priority</p>
            </div>
          </div>
          <div className="flex items-start gap-3 text-left sm:gap-4">
            <HeartHandshake className="h-7 w-7 shrink-0 text-gold sm:h-8 sm:w-8 lg:h-9 lg:w-9" strokeWidth={1.35} />
            <div>
              <h4 className="mb-1 text-[14px] font-semibold md:text-[15px]">Wedding experts</h4>
              <p className="text-[12px] font-light text-white/74 md:text-[13px]">Here to help you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
