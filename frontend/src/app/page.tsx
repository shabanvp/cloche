"use client";

import Image from "next/image";
import Link from "next/link";
import { Footer } from "@/components/Footer";
import { AdBanner } from "@/components/AdBanner";
import { AutocompleteSearch } from "@/components/AutocompleteSearch";

export const dynamic = 'force-dynamic';

export default function Home() {
  const popularSearches = [
    {
      label: "Photographers",
      href: "/photographers",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAhu3icOJFqvCTS0Yc-P5E3dS49T9gfcnLUGMEJUhz1FH0rWgdSyks60a9D_mvFEwxqsDf-7NZqI2xdlVSWq7JNTdhk55a9ApAXK3tSrQ0LuAKMF_ERJTfXOe_plw1o4cWStgv3avsNJmKjj0TMI7Qh58nWN7PXxcshFJWIXmlUuaJM70m2qvh9dYeyCNM8tnlyWufnjAyXgQK3b0GDo5eomlGyLjh1VFgmzxgJx1sy5BxDx8uBwxXCpuwKcZjZkw6S_C_Tyd_KWhRG",
      alt: "Wedding Photographer"
    },
    {
      label: "Invitations",
      href: "/invitations",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCZAPbI_YUAMNRWikML7wsySzfjqEypSebODZuEtNr3ZGtyb6q_i5zWAfnhu5c76vzUNisHAj9nGpYaOro-C8D97o9kwmiYH7F9MtyqUWawQPDlHBNyTreVuBhB6JViI9JhamJ_6-okzLqjL5ZZOiJHQ3NRv3MQoYMaMcZ_L3HGRmxHD6IYa08ijWYMuTk6GUN6O-U1Sd0v-2RdUFoC9DObKocGyGm_zLg5T3q3QLDST-MD3cnfXaPhxA0k8qgUQG6JrbAstOv951YD",
      alt: "Wedding Invitations"
    },
    {
      label: "Catering",
      href: "/categories/catering",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAIttErFBHy9QscHEJk0OBcJyKoRuebpySjvFYxChzwBGdF0_CkESZFpAz7RwTeD47dIGBsebzVOM7njZsd3DIrvBXKh0Fnp8TIns3bKInyycQ5URRN8M-lQ-4gHSayBikcseL_SS7X8HPen8XdGz4b5KuheFjT3QYrN64ogJ0w4iYaaTUIOq0Fqc_uA7ed6IiNT5xz4zF2hQOjD_CNhCdT_4z7AdZ6GDEucyEYoVM_oM9xqSKVyWfhHh-jbFiuepkEs-ayDg8RQRgV",
      alt: "Wedding Catering"
    },
    {
      label: "Bridal Wear",
      href: "/categories/bridal-wear",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEsY487mYFYvQkZCNfBcXsTzh1p5Yw4tRBQd_WTibQv72oGWZf2uTN8XzzW_Gv54COfSRIcj4brm8yydAp-aU43QT-AnIhikqUubUlu0TlLArULUjbT-lGAJbiYHlcAo85I3afH1s7monPfzLPp-11EVvmfl5CIZS3nyVlGTIZbozNQFrAKpDAFyy_8giP4chciVm0kfKj8XWC_ublaoicYNcafYSjpEXCSMZlZ8MA-RdOPuD-hbUJFoC7URHDwuD1pWjOz1Po3l2D",
      alt: "Bridal Wear"
    },
    {
      label: "Venues",
      href: "/venues",
      img: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?q=80&w=400&auto=format&fit=crop",
      alt: "Wedding Venues"
    },
    {
      label: "Makeup",
      href: "/makeup",
      img: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=400&q=80",
      alt: "Bridal Makeup"
    },
    {
      label: "Groom Wear",
      href: "/categories/groom-wear",
      img: "https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=400&q=80",
      alt: "Groom Wear"
    },
    {
      label: "Decor",
      href: "/categories/decor-planning",
      img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=400&auto=format&fit=crop",
      alt: "Wedding Decor"
    }
  ];

  const categories = [
    {
      title: "Venues",
      subtitle: "Banquet Halls, Lawns, Resorts...",
      href: "/venues",
      bgColor: "bg-[#E3EAF3]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwImcvhKSNtY87jO7yUWDMGtC2wvA3zoPaGIT3jcrypuyx5VXIDR6QO2_N2252Yn5fh7UP4Hvwwu15tAYkGwVd65vIRmMZtjMrCFWMR8fmdQUy9Lr9E02Dd7ULRUKFoL0rh4BvtIUHiS_LV3mbhjdbd65tgwEGVwbXIHOITSxmU6sOk1GSjoTaNsTiToKmb2IrC4YnTSN-xeFiBq02iS1bts-wz5YLu9d6jMR1jB2AXrfS23xcT9V9zsyr5iEzT4Xxkdo9VgP3trFh",
      alt: "Wedding Venues"
    },
    {
      title: "Photographers",
      subtitle: "Wedding & Pre-wedding Photography",
      href: "/photographers",
      bgColor: "bg-[#FCEFE3]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAXFaF6d056sykk48Tz6L5q9m1bVeLNZLe9rnljhUzM9UeIMi1Px322dGknokkhTOoF8LYbSEKq71TcBIjp9sXQiWXf40yP6gfdIjBlRSZFnKgwSB3nsdN2Ss1hdte3lNz9j_p-SCXGvq0tW5DCYm6bGgqsWLnQnFYgqx_TyxehrfezZ3ci1bLZ3gmFuAfaroY0BgHbhGVP9bHx2WmeeoPm45MQYdogWmzMfGuOY-pDhvXBXeiaravjlgykew9aGeueN_nH4dBq0lJr",
      alt: "Wedding Photographers"
    },
    {
      title: "Makeup",
      subtitle: "Bridal Makeup, Hair & Family Styling",
      href: "/makeup",
      bgColor: "bg-[#F6E5E5]",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEYzOP_1Ub5JM0qYXF-kaJm2njnRsiVDwCImcpFQaRm-QwUwmvdjYzb-ua-KBG67BZvPTxJI0DqCS6VYnthiW-FUrcIpSnXFeQaOvfDkadu6a3WJnHmCZhve8oBlJ2cI5vDhQbq4C3VLHLPbjZMS61WB93IZGpFiCVtuWSbJHdpzT3f3BY8sNllRsxJhp2UmbppTGSyo9wlK_iRiOTMP7g5fQNBm-65h4XJQXdZFi20hbgOkfTDgf_8v7QMhQLKy0Z6iWbzSxOW29p",
      alt: "Bridal Makeup"
    },
    {
      title: "Bridal Wear",
      subtitle: "Lehengas, Kanchipuram Saris & Gowns",
      href: "/categories/bridal-wear",
      bgColor: "bg-[#EAF3E3]",
      img: "https://images.unsplash.com/photo-1594552072238-b8a33785b261?auto=format&fit=crop&w=800&q=80",
      alt: "Bridal Wear"
    },
    {
      title: "Catering",
      subtitle: "Traditional Sadya, Buffet & Feasts",
      href: "/categories/catering",
      bgColor: "bg-[#F3EAF6]",
      img: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=800&auto=format&fit=crop",
      alt: "Catering"
    },
    {
      title: "Decor & Planning",
      subtitle: "Stage Decor, Florals & Planners",
      href: "/categories/decor-planning",
      bgColor: "bg-[#F6F3E5]",
      img: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=800&auto=format&fit=crop",
      alt: "Decor and Planning"
    }
  ];

  const featuredVendors = [
    {
      id: "v-solitaire",
      name: "YAAN Udaipur",
      category: "Wedding Venues, Udaipur",
      price: "₹ 2,500",
      priceLabel: "onwards per plate",
      rating: "5.0",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAEVqgHsiLSkZxXDg9lZQdQ2fTPFR5V8lLcuHmefPBRdMQNLe7DaNIoSBMDs-TSNQGmqfAtssE4J--SOQxWjq7wkGDdxYVBNbm0OTuHdJ3w3xNBTdbMqW78GJjhIvnF-lOipqY-3sm_s6h3uWydOcqo0AS-iQmi6b9dkhBX90G8s7rj70Ezy4-SF50TMXr3WS3XoOGVt9oKy4bGHthPojLDYTly5luPhH83fWUVH7svHPLOX4DXF44G0Dbc6zeguczDCK1Zp2_klw92",
      href: "/boutiques/v-solitaire"
    },
    {
      id: "v-[#15]",
      name: "ROYAL MAKEUP ART",
      category: "Bridal Makeup, Kochi",
      price: "₹ 20,000",
      priceLabel: "starting price",
      rating: "4.9",
      img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDZrXk8w7Jm5zSye-40lOKoE1m_Bo60PY2TvXxl9Fjth9bqLBSC2S2ppFjnymMrhAM8LGBq1odmw-SqU6bDvxSD5u_aLGw0mJbkiLUuCEZJhohjh9H6gsy7m3e5xdRtDgRHpsB4D8gYHfEYTHyeJt7Yu2DEOYq1i39XavHu6kIjbRdP491Z7XnbNqfJMItjqFxsVHuhhlDC3sBL3Rv6opkON-QP18z8KLdAn-EUqXu2KvyWFL-AO7Ob_80mvQ_jdqpQ-_8bj4rGy2i",
      href: "/boutiques/v-[#15]"
    },
    {
      id: "v-[#22]",
      name: "Label M Boutique",
      category: "Bridal Wear, Kochi",
      price: "₹ 35,000",
      priceLabel: "starting price",
      rating: "4.9",
      img: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?q=80&w=800&auto=format&fit=crop",
      href: "/boutiques/v-[#22]"
    },
    {
      id: "v-30",
      name: "Memory Lanes",
      category: "Photography, Kozhikode",
      price: "₹ 50,000",
      priceLabel: "per day",
      rating: "4.8",
      img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop",
      href: "/boutiques/v-30"
    }
  ];

  return (
    <>
      <main className="pb-20">
        
        {/* Hero Section */}
        <section className="relative h-[480px] md:h-[520px] w-full flex flex-col justify-end">
          <div className="absolute inset-0 overflow-hidden rounded-b-3xl">
            <div 
              className="absolute inset-0 bg-cover bg-center" 
              style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkuPHXhU7sXzDUvYbDriFUJ917zikz7COlOrOswDvuY6_7v5cQOlZuew5k-nQKjcfUP1uCWfNAZ_E3pzW0ZhxB3iG_Qgee-9xeWqV3kmcxYZjS4lZH63iptxjO4EQc-c1trOo4OB45RTiLcgN_4gKPeu41g5AiHIMElHe-KXqWqvejj3L13jYUx7jf5JgJ76IE74Db2TjqXh0ocXwWUZwTja1cDHAcysRGBp85vCe6HOhaQ8V2U10qxMCfXK6vEIuyz0bq1Y5eq9PQ)'}}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent"></div>
          </div>
          
          <div className="relative z-10 max-w-7xl mx-auto w-full p-6 md:p-10 space-y-4">
            <h1 className="text-white text-4xl md:text-5xl font-extrabold tracking-tight font-display max-w-2xl">
              Where Every Wedding Begins
            </h1>
            <p className="text-white/90 text-lg md:text-xl max-w-xl font-light">
              Find the best wedding vendors with thousands of trusted reviews
            </p>
            
            <div className="mt-6 max-w-xl">
              <AutocompleteSearch placeholder="Search for vendors, venues, or boutiques..." />
            </div>
          </div>
        </section>

        {/* Popular Searches */}
        <section className="py-10 max-w-7xl mx-auto">
          <div className="px-6 mb-6">
            <h2 className="text-2xl font-bold text-on-surface font-display">Popular Searches</h2>
          </div>
          
          {/* Responsive Layout: Scrollable on mobile (< md), Full clean grid on Laptop/Desktop (>= md) */}
          <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 md:grid md:grid-cols-4 lg:grid-cols-8 md:gap-6 md:overflow-visible">
            {popularSearches.map((item) => (
              <Link key={item.label} href={item.href} className="flex-shrink-0 flex flex-col items-center gap-2.5 group cursor-pointer">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl overflow-hidden shadow-sm border border-gold/10 ring-2 ring-transparent group-hover:ring-primary group-hover:shadow-md transition-all">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={item.img} alt={item.alt} />
                </div>
                <span className="text-xs md:text-sm font-semibold text-on-surface text-center group-hover:text-primary transition-colors">
                  {item.label}
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Wedding Categories */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex justify-between items-center px-2 mb-6">
            <h2 className="text-2xl font-bold text-on-surface font-display">Wedding Categories</h2>
            <Link href="/categories" className="hidden md:flex items-center gap-1 text-primary font-bold text-sm hover:underline">
              View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </Link>
          </div>

          {/* Stacked on mobile, 2 or 3 columns grid on Laptop */}
          <div className="space-y-4 md:space-y-0 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-6">
            {categories.map((cat) => (
              <Link 
                key={cat.title} 
                href={cat.href} 
                className={`${cat.bgColor} rounded-2xl overflow-hidden flex h-36 md:h-44 shadow-sm hover:shadow-md transition-all group`}
              >
                <div className="flex-1 p-5 md:p-6 flex flex-col justify-center">
                  <div className="flex items-center gap-1 font-bold text-on-primary-container text-lg md:text-xl font-display group-hover:text-primary transition-colors">
                    {cat.title} <span className="material-symbols-outlined text-sm md:text-base">expand_more</span>
                  </div>
                  <p className="text-on-surface-variant text-xs md:text-sm mt-1.5 line-clamp-2">{cat.subtitle}</p>
                </div>
                <div className="w-1/2 relative overflow-hidden">
                  <img 
                    className="w-full h-full object-cover rounded-l-[40%] group-hover:scale-105 transition-transform duration-500" 
                    src={cat.img} 
                    alt={cat.alt} 
                  />
                </div>
              </Link>
            ))}
          </div>

          <Link href="/categories" className="md:hidden w-full text-center py-4 text-primary font-bold text-sm flex items-center justify-center gap-1 mt-4">
            View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
          </Link>
        </section>

        {/* Sponsored Homepage Banner */}
        <AdBanner placement="Homepage Between Categories" />

        {/* In-house Services Grid */}
        <section className="py-12 bg-[#F6F4EE] my-8">
          <div className="max-w-7xl mx-auto px-6">
            <div className="mb-8 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-gold block mb-1">Exclusive Experience</span>
              <h2 className="text-2xl md:text-3xl font-bold text-on-surface font-display">CLOCHE Inhouse Services</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 md:gap-8">
              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gold/10 group hover:shadow-lg transition-all">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC983QCwzoBbPjpm9Zznnun6gn-EB-wYrmIhc00lbhmpI-FTxPqwXxP2F7jLxu7rrw8Jtm2xCWGDBK7YmmbngAnZzGGiqUUwkBf2FeTSYvP63hxfYMJQ-4CJJ-Sjrm51rZ5XJi_Gm6t_VTrmx-VkoVxu_utvUK3vFcwoUmJmzuPMG1PCvANSr4DlKywgMBtO1wXbCFP-SlgrTBsmj3sLVh5DeuRTsBxtDEC6YxRhAQSpp-PYQvp5ByYVtnf3ARlIemRmd45PU6wi70i" alt="Wedsta" />
                </div>
                <h3 className="font-bold text-on-surface text-center text-base md:text-lg font-display">Wedsta</h3>
                <p className="text-xs md:text-sm text-center text-outline leading-tight mt-1.5">At Home, Family Makeup Services</p>
              </div>

              <Link href="/genie" className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gold/10 group hover:shadow-lg transition-all block">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuABl_Ywl89hmmsujcwC-WF0OMTRRI3bbpHV8YfU9YPIxElnclEVGbDjccF1Bzdmg3ZYCFApqzP2DmEYDCI8SL4JB8bMgKWPuY2gY5CCovLBvR0o63pE2XUdDHZUVK95vEFxvd4A3GqNwRk_uVR7CK_t477O8JMhTM46yu9dXY844AeN4-qHDFE1RhBvA5lXiKe2d2T_GMPVlwudC-KxhD518L0qAMCTsOz9OtI0OT1bL5-OlSIniccN_sSlzFAoRIaLdroWjE3Q7aLM" alt="Genie Services" />
                </div>
                <h3 className="font-bold text-on-surface text-center text-base md:text-lg font-display">Genie Services</h3>
                <p className="text-xs md:text-sm text-center text-outline leading-tight mt-1.5">Plan your dream wedding in budget</p>
              </Link>

              <div className="bg-white p-4 md:p-6 rounded-2xl shadow-sm border border-gold/10 group hover:shadow-lg transition-all col-span-2 md:col-span-1">
                <div className="relative aspect-[4/3] rounded-xl overflow-hidden mb-4">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqptFpOh387e6OXFJ4fisIHEri1Lsb9UuqUuqjc9GWPDretbefCzIrZDt8dnZYnkN3B7rLYsAlvyWmw46_rl20mhXiD9l8kKFdAvK10IBIWhov6I-S43Ex_0AXH0YM5TpNTogUEsRj85Vmt5ZXphtVZu14grZXrzdRFyS0Gb4nOUVHVQcchDNdacy5i-ENW6n-jFynIo_uGODZX_Bvv2waWo1bxE7Ay8NsSwLLab3efewn6lR2TyoO-ehBK9oUW12BSsTxamHm7TgW" alt="Venue Booking" />
                </div>
                <h3 className="font-bold text-on-surface text-center text-base md:text-lg font-display">Venue Booking</h3>
                <p className="text-xs md:text-sm text-center text-outline leading-tight mt-1.5">Best Price Guaranteed</p>
              </div>
            </div>
          </div>
        </section>

        {/* App Banner */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 my-12">
          <div className="p-8 md:p-14 rounded-3xl bg-primary text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="relative z-10 space-y-6 max-w-xl">
              <span className="bg-gold/20 text-gold px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-block">
                Mobile Convenience
              </span>
              <h2 className="text-3xl md:text-4xl font-bold font-display leading-tight">
                Download The CLOCHE Mobile App Today!
              </h2>
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">flare</span>
                  <span className="text-sm md:text-base font-medium">Save & Share Wedding Ideas</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">favorite</span>
                  <span className="text-sm md:text-base font-medium">Shortlist Top Boutiques & Vendors</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-gold">checklist</span>
                  <span className="text-sm md:text-base font-medium">Get Free Interactive Checklist</span>
                </li>
              </ul>
              <Link 
                href="/download" 
                className="inline-block bg-white text-primary px-8 py-3.5 rounded-full font-bold text-sm shadow-lg hover:bg-gray-100 transition-all hover:scale-105 active:scale-95"
              >
                Download App
              </Link>
            </div>

            <div className="relative z-10 hidden lg:flex flex-col items-center justify-center p-8 bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl text-center min-w-[260px]">
              <span className="material-symbols-outlined text-6xl text-gold mb-2">qr_code_2</span>
              <p className="font-bold text-sm">Scan to Install App</p>
              <p className="text-xs text-white/70 mt-1">Available on iOS & Android</p>
            </div>
          </div>
        </section>

        {/* Featured Vendors */}
        <section className="py-10 max-w-7xl mx-auto">
          <div className="px-6 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-display">Featured Vendors</h2>
              <p className="text-xs md:text-sm text-outline mt-1">Handpicked luxury boutiques & wedding experts</p>
            </div>
            <Link href="/boutiques" className="text-primary text-sm font-bold hover:underline">View All</Link>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 md:grid md:grid-cols-3 lg:grid-cols-4 md:gap-6 md:overflow-visible">
            {featuredVendors.map((vendor) => (
              <Link 
                key={vendor.id} 
                href={vendor.href} 
                className="flex-shrink-0 w-72 md:w-auto bg-white rounded-2xl overflow-hidden shadow-sm border border-gold/10 group hover:shadow-md transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" src={vendor.img} alt={vendor.name} />
                  <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                    <span className="material-symbols-outlined text-amber-500 text-[14px]" style={{fontVariationSettings: 'FILL 1'}}>star</span>
                    <span className="text-[12px] font-bold text-charcoal">{vendor.rating}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-lg font-display text-charcoal group-hover:text-primary transition-colors">{vendor.name}</h3>
                  <p className="text-outline text-xs mt-0.5">{vendor.category}</p>
                  <p className="text-primary font-bold mt-3 text-sm">{vendor.price} <span className="text-[11px] text-outline font-normal">{vendor.priceLabel}</span></p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Real Wedding Stories */}
        <section className="py-10 max-w-7xl mx-auto">
          <div className="px-6 mb-6 flex justify-between items-end">
            <div>
              <h2 className="text-2xl font-bold text-on-surface font-display">Real Wedding Stories</h2>
              <p className="text-xs md:text-sm text-outline mt-1">Get inspired by beautiful real wedding celebrations in Kerala</p>
            </div>
            <Link href="/real-weddings" className="text-primary text-sm font-bold hover:underline">View All Stories</Link>
          </div>

          <div className="flex overflow-x-auto hide-scrollbar gap-4 px-6 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible">
            <Link href="/real-weddings" className="flex-shrink-0 w-80 md:w-auto group">
              <div className="rounded-2xl overflow-hidden h-52 shadow-sm group-hover:shadow-md transition-all">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDybVNqcPesLD5TJ7kU9ktSMRShli2bgr5sdljfio0SWnaL97ugJeG5NsgA-mLNOMmOWJFMXxIm8Cq0OVUqip0XseKaqm8oRYpFn9rVaXA9cjCD-SDGwxjuRlriALzXa3J-yi7BB4rlT_7lg9HvntbRnwlCgC56Nh2DE8CO_MNWiZsqHJabXtiHyQDUH_uQaCYIdNH0dQzaZIAJhC1V2j2QFn2xmPnNG2cPP8zqQx9aPk6CWxsgx94Gl-KVZ1lik28hVY-SJexudags" alt="Gayatri and Ayush" />
              </div>
              <div className="py-4">
                <h3 className="font-bold text-on-surface text-base md:text-lg leading-tight font-display group-hover:text-primary transition-colors">Gayatri and Ayush</h3>
                <p className="text-xs md:text-sm text-outline mt-1 line-clamp-2">A Jaipur & Kochi Wedding That Delivered One Stunning Setup After Another!</p>
              </div>
            </Link>

            <Link href="/real-weddings" className="flex-shrink-0 w-80 md:w-auto group">
              <div className="rounded-2xl overflow-hidden h-52 shadow-sm group-hover:shadow-md transition-all">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlIY3Rsu77h9JhRfLXKWhl7uY5PHM8h9xVxmI_mqGehxB9rM5xAhOV97FZ-KIBEAVoSfZ2yUzYqrQP2ekudMlla5kZeNhyCpXH7z_nIIz_SRmWGLg5ZuibsDA6i1wJnbbADnytZPvYR8MVfl8OctX3XWNreNdozLPiqRD4RXQwt9pIBn_maMAoWjVTKO4UNrvIqoe-A9jetFAt-ppdexODCU8-XefMAttsQRTbVnm1eF4Zv_EF_MVTo-_D_MwrpZEoYJcV-oxdRscx" alt="Beach Wedding" />
              </div>
              <div className="py-4">
                <h3 className="font-bold text-on-surface text-base md:text-lg leading-tight font-display group-hover:text-primary transition-colors">The Rise of Coastal Kerala Weddings</h3>
                <p className="text-xs md:text-sm text-outline mt-1 line-clamp-2">Destination weddings in Kovalam and Bekal are entering a new era of luxury...</p>
              </div>
            </Link>

            <Link href="/real-weddings" className="flex-shrink-0 w-80 md:w-auto group">
              <div className="rounded-2xl overflow-hidden h-52 shadow-sm group-hover:shadow-md transition-all">
                <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop" alt="Backwater Wedding" />
              </div>
              <div className="py-4">
                <h3 className="font-bold text-on-surface text-base md:text-lg leading-tight font-display group-hover:text-primary transition-colors">Anand & Meera's Backwater Celebration</h3>
                <p className="text-xs md:text-sm text-outline mt-1 line-clamp-2">An elegant Kumarakom houseboat wedding filled with traditional flowers and serene views.</p>
              </div>
            </Link>
          </div>
        </section>

        {/* Mobile Sticky Sponsored Banner */}
        <AdBanner placement="Mobile Sticky Banner" />

      </main>
      <Footer />
    </>
  );
}
