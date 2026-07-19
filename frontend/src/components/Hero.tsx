import Image from "next/image";
import { Button } from "./Button";
import { ChevronDown, Flower2, Search } from "lucide-react";

interface HeroProps {
  title?: string;
  subtitle?: string;
  imageUrl?: string;
}

export function Hero({ title, subtitle, imageUrl }: HeroProps) {
  return (
    <section className="relative w-full bg-ivory">
      <div className="relative h-[650px] max-w-full overflow-hidden sm:h-[630px] md:h-[620px] lg:h-[650px] xl:h-[690px] 2xl:h-[720px]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/62 via-black/30 to-black/10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-y-0 left-0 z-10 hidden w-[58%] bg-[#6a5534]/20 md:block" />
          <Image 
            src={imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuA0wfsJA6L2AZn8ts_o01Itg8tyJMHwQvs-OVIkVJsp3Veg0AN83-jebgYChIDTUgKs1AltoiZdriG42HhR8XgLXEAD38DsYgQ8_PZ08WEZZXJzWL4TNf8pgawKzyPSNXkx-Lc-AWmfhesyOIouI_RXvat44ZAs5ser7su1EdtdjVQc6d88qJThiCqatqsxrYscWB2juxyBoYBwyB0L_BmIFd9M09rN0rRfeSba-NLIP9TbihI2dNvrAmRSRGznmOH9JzWFNqYl0Yw"}
            alt={title || "Kerala Wedding"}
            fill
            priority
            sizes="100vw"
            className="object-cover object-[60%_42%]"
          />
        </div>

        <div className="relative z-20 mx-auto flex h-full w-full max-w-[1728px] flex-col overflow-hidden px-4 sm:px-7 md:justify-center lg:px-10 xl:px-12 2xl:px-14">
          <div className="max-w-full pt-[72px] sm:pt-16 md:max-w-[570px] md:pt-0 lg:max-w-[650px] xl:max-w-[710px]">
            <h1 className="max-w-full font-display text-[36px] font-normal leading-[1.16] text-white drop-shadow-md sm:text-[50px] md:text-[56px] lg:text-[62px] xl:text-[70px] 2xl:text-[78px]">
              {title ? title : (
                <>
                  Curate your<br/>
                  perfect wedding,<br/>
                  the Kerala way.
                </>
              )}
            </h1>
            <p className="mt-5 max-w-[330px] text-[15px] font-light leading-relaxed text-white/95 drop-shadow sm:mt-6 sm:max-w-[390px] sm:text-base lg:text-[18px]">
              {subtitle || "Discover the finest boutiques, curated collections & trusted experts."}
            </p>
          
            <Flower2 className="mt-9 hidden h-[62px] w-[62px] text-gold opacity-90 sm:block lg:mt-12 lg:h-[74px] lg:w-[74px]" strokeWidth={1} />
          </div>

          <div className="mx-auto mt-auto w-full max-w-[calc(100vw-32px)] pb-5 sm:w-full sm:max-w-full sm:pb-7 md:absolute md:bottom-[8%] md:left-1/2 md:mt-0 md:w-[min(74vw,980px)] md:-translate-x-1/2 md:pb-0 lg:left-[18%] lg:w-[min(72vw,1040px)] lg:translate-x-0 xl:left-[18%] 2xl:left-[18%]">
            <div className="max-w-full rounded-[12px] bg-white p-3 shadow-[0_18px_42px_rgba(40,31,18,0.22)] sm:p-5 md:p-6">
              <div className="grid max-w-full gap-2.5 rounded-[8px] bg-white sm:gap-3 md:grid-cols-[1fr_210px_64px] md:gap-0 md:border md:border-[#e4ded4]">
                <div className="flex min-h-[50px] items-center rounded-[8px] border border-[#e4ded4] px-4 md:min-h-[64px] md:rounded-none md:border-none md:px-6">
                  <input
                    type="text"
                    placeholder="What are you looking for?"
                    className="h-full w-full min-w-0 border-none bg-transparent text-[14px] text-charcoal placeholder:text-charcoal/45 focus:outline-none sm:text-[15px]"
                  />
                </div>
                <div className="relative flex min-h-[50px] items-center rounded-[8px] border border-[#e4ded4] px-4 md:min-h-[64px] md:rounded-none md:border-b-0 md:border-l md:border-r-0 md:border-t-0 md:px-5">
                  <select
                    aria-label="Category select"
                    className="h-full w-full min-w-0 cursor-pointer appearance-none border-none bg-transparent pr-8 text-[14px] font-medium text-charcoal focus:outline-none sm:text-[15px]"
                  >
                    <option>All Categories</option>
                    <option>Bridal Wear</option>
                    <option>Groom Wear</option>
                    <option>Jewellery</option>
                    <option>Wedding Planners</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 h-5 w-5 text-charcoal/55 md:right-5 md:h-4 md:w-4" strokeWidth={1.7} />
                </div>
                <div className="p-0 md:p-2">
                  <Button size="icon" className="flex h-[50px] w-full shrink-0 items-center justify-center rounded-[8px] bg-emerald hover:bg-emerald/90 md:h-12 md:w-12">
                    <Search className="h-5 w-5 text-white" strokeWidth={1.8} />
                  </Button>
                </div>
              </div>
            
              <div className="mt-3 grid max-w-full grid-cols-2 gap-2 px-0.5 text-center text-[11px] font-medium text-charcoal/65 sm:mt-4 sm:flex sm:flex-wrap sm:items-center sm:gap-3 sm:text-left sm:text-[12px]">
                <span className="col-span-2 text-left text-charcoal/65 sm:col-span-1 sm:mr-1">Popular searches:</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-3 py-1.5 transition-colors hover:bg-[#eee8df] sm:shrink-0 sm:px-4 sm:py-2">Bridal wear</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-3 py-1.5 transition-colors hover:bg-[#eee8df] sm:shrink-0 sm:px-4 sm:py-2">Jewellery</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-3 py-1.5 transition-colors hover:bg-[#eee8df] sm:shrink-0 sm:px-4 sm:py-2">Wedding planners</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-3 py-1.5 transition-colors hover:bg-[#eee8df] sm:shrink-0 sm:px-4 sm:py-2">Makeup artists</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-3 py-1.5 transition-colors hover:bg-[#eee8df] sm:shrink-0 sm:px-4 sm:py-2">Venues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
