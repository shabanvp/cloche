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
      <div className="relative h-[600px] overflow-hidden sm:h-[630px] md:h-[620px] lg:h-[650px] xl:h-[690px] 2xl:h-[720px]">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/62 via-black/30 to-black/10" />
          <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
          <div className="absolute inset-y-0 left-0 z-10 hidden w-[58%] bg-[#6a5534]/20 md:block" />
        <img 
            src={imageUrl || "https://lh3.googleusercontent.com/aida-public/AB6AXuA0wfsJA6L2AZn8ts_o01Itg8tyJMHwQvs-OVIkVJsp3Veg0AN83-jebgYChIDTUgKs1AltoiZdriG42HhR8XgLXEAD38DsYgQ8_PZ08WEZZXJzWL4TNf8pgawKzyPSNXkx-Lc-AWmfhesyOIouI_RXvat44ZAs5ser7su1EdtdjVQc6d88qJThiCqatqsxrYscWB2juxyBoYBwyB0L_BmIFd9M09rN0rRfeSba-NLIP9TbihI2dNvrAmRSRGznmOH9JzWFNqYl0Yw"}
          alt={title || "Kerala Wedding"}
            className="h-full w-full object-cover object-[60%_42%]"
        />
      </div>

        <div className="relative z-20 mx-auto flex h-full w-full max-w-[1728px] flex-col px-5 sm:px-7 md:justify-center lg:px-10 xl:px-12 2xl:px-14">
          <div className="pt-12 sm:pt-16 md:max-w-[570px] md:pt-0 lg:max-w-[650px] xl:max-w-[710px]">
            <h1 className="font-display text-[43px] font-normal leading-[1.18] text-white drop-shadow-md sm:text-[50px] md:text-[56px] lg:text-[62px] xl:text-[70px] 2xl:text-[78px]">
            {title ? title : (
              <>
                Curate your<br/>
                perfect wedding,<br/>
                the Kerala way.
              </>
            )}
          </h1>
            <p className="mt-6 max-w-[390px] text-[15px] font-light leading-relaxed text-white/90 drop-shadow sm:text-base lg:text-[18px]">
            {subtitle || "Discover the finest boutiques, curated collections & trusted experts."}
          </p>
          
            <Flower2 className="mt-9 hidden h-[62px] w-[62px] text-gold opacity-90 sm:block lg:mt-12 lg:h-[74px] lg:w-[74px]" strokeWidth={1} />
          </div>

          <div className="mt-auto pb-5 sm:pb-7 md:absolute md:bottom-[8%] md:left-1/2 md:mt-0 md:w-[min(74vw,980px)] md:-translate-x-1/2 md:pb-0 lg:left-[18%] lg:w-[min(72vw,1040px)] lg:translate-x-0 xl:left-[18%] 2xl:left-[18%]">
            <div className="rounded-[12px] bg-white p-4 shadow-[0_18px_42px_rgba(40,31,18,0.22)] sm:p-5 md:p-6">
              <div className="grid gap-3 rounded-[8px] border border-[#e4ded4] bg-white p-0 md:grid-cols-[1fr_210px_64px] md:gap-0">
                <div className="flex min-h-[50px] items-center px-4 md:min-h-[64px] md:px-6">
                <input 
                  type="text" 
                  placeholder="What are you looking for?"
                    className="h-full w-full border-none bg-transparent text-[14px] text-charcoal placeholder:text-charcoal/45 focus:outline-none sm:text-[15px]"
                />
              </div>
                <div className="relative flex min-h-[50px] items-center border-t border-[#e4ded4] px-4 md:min-h-[64px] md:border-l md:border-t-0 md:px-5">
                <select 
                  aria-label="Category select"
                    className="h-full w-full cursor-pointer appearance-none border-none bg-transparent pr-8 text-[14px] font-medium text-charcoal focus:outline-none sm:text-[15px]"
                >
                  <option>All Categories</option>
                  <option>Bridal Wear</option>
                  <option>Groom Wear</option>
                  <option>Jewellery</option>
                    <option>Wedding Planners</option>
                </select>
                  <ChevronDown className="pointer-events-none absolute right-5 h-4 w-4 text-charcoal/55" strokeWidth={1.7} />
              </div>
                <div className="p-0 md:p-2">
                  <Button size="icon" className="flex h-[50px] w-full shrink-0 items-center justify-center rounded-[8px] bg-emerald hover:bg-emerald/90 md:h-12 md:w-12">
                    <Search className="h-5 w-5 text-white" strokeWidth={1.8} />
              </Button>
            </div>
              </div>
            
              <div className="mt-4 flex flex-wrap items-center gap-2 px-1 text-[12px] font-medium text-charcoal/65 sm:gap-3">
                <span className="mr-1 text-charcoal/65">Popular searches:</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-4 py-2 transition-colors hover:bg-[#eee8df]">Bridal wear</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-4 py-2 transition-colors hover:bg-[#eee8df]">Jewellery</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-4 py-2 transition-colors hover:bg-[#eee8df]">Wedding planners</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-4 py-2 transition-colors hover:bg-[#eee8df]">Makeup artists</span>
                <span className="cursor-pointer rounded-full bg-[#f7f4ef] px-4 py-2 transition-colors hover:bg-[#eee8df]">Venues</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
