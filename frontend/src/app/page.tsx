
import Image from "next/image";

export default function Home() {
  return (
    <>
<header className="sticky top-0 z-50 w-full bg-surface/90 backdrop-blur-md border-b border-outline-variant/30 flex justify-between items-center px-4 py-4">
<div className="flex items-center gap-3">
<button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined">menu</span>
</button>
<img alt="CLOCHE Logo" className="h-8 w-auto" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCDqVgJoQurUXZG2V7fKyBEnHcmvjEo8_OtfnMiMMZCq3fMibSvSs5XUboCPm3UbMM9s9S97aFDfrdRW4mDknscdzQ8vhaqS62NStbOuxhElxWE19KmHilAarh-RUdkvAwV9aBmbx9NK4qZ0ON79ewJwh5L7cGSZp7-6vBPQ9MAZUZx5fLCb3SxTDowUsz9aDCIQbBj3YDrZsZRROq35vHYo-LSaySU6yUApA7YgQWXnWy4xhR24j5TXcMlnrz9DD7_WB1_Diq01UwG"/>
</div>
<div className="flex items-center gap-4">
<div className="hidden md:flex items-center gap-1 text-primary text-label-md font-label-md cursor-pointer hover:opacity-80">
<span>All Cities</span>
<span className="material-symbols-outlined text-[18px]">arrow_drop_down</span>
</div>
<button className="text-primary hover:opacity-80 transition-opacity active:scale-95">
<span className="material-symbols-outlined">account_circle</span>
</button>
</div>
</header>
<main className="pb-20">
{/* Hero Section */}
<section className="relative h-[480px] w-full flex flex-col justify-end overflow-hidden">
<div className="absolute inset-0 bg-cover bg-center" data-alt="A luxury wedding scene featuring a happy couple in elegant traditional Indian attire under a shower of golden confetti. The setting is a grand, whitewashed heritage palace with intricate architecture, bathed in soft afternoon sunlight. The atmosphere is celebratory, upscale, and filled with joy, reflecting a high-end Cloche wedding event." style={{backgroundImage: 'url(https://lh3.googleusercontent.com/aida-public/AB6AXuDkuPHXhU7sXzDUvYbDriFUJ917zikz7COlOrOswDvuY6_7v5cQOlZuew5k-nQKjcfUP1uCWfNAZ_E3pzW0ZhxB3iG_Qgee-9xeWqV3kmcxYZjS4lZH63iptxjO4EQc-c1trOo4OB45RTiLcgN_4gKPeu41g5AiHIMElHe-KXqWqvejj3L13jYUx7jf5JgJ76IE74Db2TjqXh0ocXwWUZwTja1cDHAcysRGBp85vCe6HOhaQ8V2U10qxMCfXK6vEIuyz0bq1Y5eq9PQ)'}}>
</div>
<div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
<div className="relative z-10 p-6 space-y-4">
<h1 className="text-white text-4xl font-extrabold tracking-tight">Your Wedding, Your Way</h1>
<p className="text-white/90 text-lg">Find the best wedding vendors with thousands of trusted reviews</p>
<div className="flex bg-white rounded-lg overflow-hidden shadow-xl mt-6">
<div className="bg-primary w-16 flex items-center justify-center">
<span className="material-symbols-outlined text-white">search</span>
</div>
<button className="flex-1 px-4 py-4 text-left text-on-surface-variant font-medium flex justify-between items-center group">
<span>Find Vendors</span>
<span className="material-symbols-outlined text-primary group-active:translate-x-1 transition-transform">chevron_right</span>
</button>
</div>
</div>
</section>
{/* Popular Searches */}
<section className="py-8">
<div className="px-6 mb-4">
<h2 className="text-xl font-bold text-on-surface">Popular Searches</h2>
</div>
<div className="flex overflow-x-auto hide-scrollbar gap-4 px-6">
{/* Circular Cards */}
<div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-20 h-20 rounded-xl overflow-hidden shadow-md ring-2 ring-transparent group-hover:ring-secondary transition-all">
<img className="w-full h-full object-cover" data-alt="Close-up of a professional photographer using a high-end mirrorless camera at a lavish wedding venue. The background is softly blurred with fairy lights and elegant decor. Cinematic lighting, deep greens and gold accents." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhu3icOJFqvCTS0Yc-P5E3dS49T9gfcnLUGMEJUhz1FH0rWgdSyks60a9D_mvFEwxqsDf-7NZqI2xdlVSWq7JNTdhk55a9ApAXK3tSrQ0LuAKMF_ERJTfXOe_plw1o4cWStgv3avsNJmKjj0TMI7Qh58nWN7PXxcshFJWIXmlUuaJM70m2qvh9dYeyCNM8tnlyWufnjAyXgQK3b0GDo5eomlGyLjh1VFgmzxgJx1sy5BxDx8uBwxXCpuwKcZjZkw6S_C_Tyd_KWhRG"/>
</div>
<span className="text-label-md font-label-md text-on-surface">Photographers</span>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-20 h-20 rounded-xl overflow-hidden shadow-md ring-2 ring-transparent group-hover:ring-secondary transition-all">
<img className="w-full h-full object-cover" data-alt="Elegant cream and gold wedding invitations laid out on a silk fabric background. Detailed foil embossing and sophisticated typography. The style is classic luxury, clean and high-end." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZAPbI_YUAMNRWikML7wsySzfjqEypSebODZuEtNr3ZGtyb6q_i5zWAfnhu5c76vzUNisHAj9nGpYaOro-C8D97o9kwmiYH7F9MtyqUWawQPDlHBNyTreVuBhB6JViI9JhamJ_6-okzLqjL5ZZOiJHQ3NRv3MQoYMaMcZ_L3HGRmxHD6IYa08ijWYMuTk6GUN6O-U1Sd0v-2RdUFoC9DObKocGyGm_zLg5T3q3QLDST-MD3cnfXaPhxA0k8qgUQG6JrbAstOv951YD"/>
</div>
<span className="text-label-md font-label-md text-on-surface">Invitations</span>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-20 h-20 rounded-xl overflow-hidden shadow-md ring-2 ring-transparent group-hover:ring-secondary transition-all">
<img className="w-full h-full object-cover" data-alt="A grand multi-tiered white wedding cake adorned with delicate edible gold leaves and ivory roses. Placed on a marble pedestal in a sunlit reception hall. High-key lighting, minimalist and modern." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAIttErFBHy9QscHEJk0OBcJyKoRuebpySjvFYxChzwBGdF0_CkESZFpAz7RwTeD47dIGBsebzVOM7njZsd3DIrvBXKh0Fnp8TIns3bKInyycQ5URRN8M-lQ-4gHSayBikcseL_SS7X8HPen8XdGz4b5KuheFjT3QYrN64ogJ0w4iYaaTUIOq0Fqc_uA7ed6IiNT5xz4zF2hQOjD_CNhCdT_4z7AdZ6GDEucyEYoVM_oM9xqSKVyWfhHh-jbFiuepkEs-ayDg8RQRgV"/>
</div>
<span className="text-label-md font-label-md text-on-surface">Catering</span>
</div>
<div className="flex-shrink-0 flex flex-col items-center gap-2 group cursor-pointer">
<div className="w-20 h-20 rounded-xl overflow-hidden shadow-md ring-2 ring-transparent group-hover:ring-secondary transition-all">
<img className="w-full h-full object-cover" data-alt="Bespoke bridal lehenga in deep emerald and gold hanging against a minimalist arched window. Cinematic architectural shadows and soft silk textures. Premium high-fashion photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEsY487mYFYvQkZCNfBcXsTzh1p5Yw4tRBQd_WTibQv72oGWZf2uTN8XzzW_Gv54COfSRIcj4brm8yydAp-aU43QT-AnIhikqUubUlu0TlLArULUjbT-lGAJbiYHlcAo85I3afH1s7monPfzLPp-11EVvmfl5CIZS3nyVlGTIZbozNQFrAKpDAFyy_8giP4chciVm0kfKj8XWC_ublaoicYNcafYSjpEXCSMZlZ8MA-RdOPuD-hbUJFoC7URHDwuD1pWjOz1Po3l2D"/>
</div>
<span className="text-label-md font-label-md text-on-surface">Bridal Wear</span>
</div>
</div>
</section>
{/* Wedding Categories (Split Layout) */}
<section className="px-4 py-4 space-y-4">
<h2 className="text-xl font-bold text-on-surface px-2 mb-2">Wedding Categories</h2>
<div className="bg-[#E3EAF3] rounded-2xl overflow-hidden flex h-36 shadow-sm">
<div className="flex-1 p-5 flex flex-col justify-center">
<div className="flex items-center gap-1 font-bold text-on-primary-container text-lg">
                        Venues <span className="material-symbols-outlined">expand_more</span>
</div>
<p className="text-on-surface-variant text-sm mt-1">Banquet Halls, Lawns...</p>
</div>
<div className="w-1/2 relative">
<img className="w-full h-full object-cover rounded-l-[40%]" data-alt="Wide shot of an outdoor luxury wedding venue at dusk with symmetrical rows of seating and ambient warm lighting. Deep teal sky and ivory decor. Clean, symmetrical composition." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwImcvhKSNtY87jO7yUWDMGtC2wvA3zoPaGIT3jcrypuyx5VXIDR6QO2_N2252Yn5fh7UP4Hvwwu15tAYkGwVd65vIRmMZtjMrCFWMR8fmdQUy9Lr9E02Dd7ULRUKFoL0rh4BvtIUHiS_LV3mbhjdbd65tgwEGVwbXIHOITSxmU6sOk1GSjoTaNsTiToKmb2IrC4YnTSN-xeFiBq02iS1bts-wz5YLu9d6jMR1jB2AXrfS23xcT9V9zsyr5iEzT4Xxkdo9VgP3trFh"/>
</div>
</div>
<div className="bg-[#FCEFE3] rounded-2xl overflow-hidden flex h-36 shadow-sm">
<div className="flex-1 p-5 flex flex-col justify-center">
<div className="flex items-center gap-1 font-bold text-on-primary-container text-lg">
                        Photographers <span className="material-symbols-outlined">expand_more</span>
</div>
<p className="text-on-surface-variant text-sm mt-1">Wedding Photographers</p>
</div>
<div className="w-1/2 relative">
<img className="w-full h-full object-cover rounded-l-[40%]" data-alt="A cinematic portrait of a wedding couple laughing together in a garden. The lighting is warm and golden, capturing a candid, high-quality moment. Professional wedding photography aesthetic." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAXFaF6d056sykk48Tz6L5q9m1bVeLNZLe9rnljhUzM9UeIMi1Px322dGknokkhTOoF8LYbSEKq71TcBIjp9sXQiWXf40yP6gfdIjBlRSZFnKgwSB3nsdN2Ss1hdte3lNz9j_p-SCXGvq0tW5DCYm6bGgqsWLnQnFYgqx_TyxehrfezZ3ci1bLZ3gmFuAfaroY0BgHbhGVP9bHx2WmeeoPm45MQYdogWmzMfGuOY-pDhvXBXeiaravjlgykew9aGeueN_nH4dBq0lJr"/>
</div>
</div>
<div className="bg-[#F6E5E5] rounded-2xl overflow-hidden flex h-36 shadow-sm">
<div className="flex-1 p-5 flex flex-col justify-center">
<div className="flex items-center gap-1 font-bold text-on-primary-container text-lg">
                        Makeup <span className="material-symbols-outlined">expand_more</span>
</div>
<p className="text-on-surface-variant text-sm mt-1">Bridal Makeup, Family...</p>
</div>
<div className="w-1/2 relative">
<img className="w-full h-full object-cover rounded-l-[40%]" data-alt="Extreme close-up of a bride's eyes with exquisite shimmering makeup. Warm tones, professional lighting, focus on detail and luxury beauty standards. High-end cosmetic photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEYzOP_1Ub5JM0qYXF-kaJm2njnRsiVDwCImcpFQaRm-QwUwmvdjYzb-ua-KBG67BZvPTxJI0DqCS6VYnthiW-FUrcIpSnXFeQaOvfDkadu6a3WJnHmCZhve8oBlJ2cI5vDhQbq4C3VLHLPbjZMS61WB93IZGpFiCVtuWSbJHdpzT3f3BY8sNllRsxJhp2UmbppTGSyo9wlK_iRiOTMP7g5fQNBm-65h4XJQXdZFi20hbgOkfTDgf_8v7QMhQLKy0Z6iWbzSxOW29p"/>
</div>
</div>
<button className="w-full text-center py-4 text-primary font-bold text-sm flex items-center justify-center gap-1">
                View All Categories <span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</section>
{/* In-house Services Grid */}
<section className="py-8 bg-surface-dim/50">
<div className="px-6 mb-6">
<h2 className="text-xl font-bold text-on-surface">CLOCHE Inhouse Services</h2>
</div>
<div className="grid grid-cols-2 gap-4 px-4">
<div className="bg-white p-3 rounded-xl shadow-sm border border-outline-variant/20 group hover:shadow-md transition-all">
<img className="w-full aspect-[4/3] object-cover rounded-lg mb-3" data-alt="A group of bridesmaids in coordinated pastel silk saris sitting on a plush sofa in a luxury suite. They are smiling and talking, creating a warm, celebratory atmosphere. Sophisticated lifestyle photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuC983QCwzoBbPjpm9Zznnun6gn-EB-wYrmIhc00lbhmpI-FTxPqwXxP2F7jLxu7rrw8Jtm2xCWGDBK7YmmbngAnZzGGiqUUwkBf2FeTSYvP63hxfYMJQ-4CJJ-Sjrm51rZ5XJi_Gm6t_VTrmx-VkoVxu_utvUK3vFcwoUmJmzuPMG1PCvANSr4DlKywgMBtO1wXbCFP-SlgrTBsmj3sLVh5DeuRTsBxtDEC6YxRhAQSpp-PYQvp5ByYVtnf3ARlIemRmd45PU6wi70i"/>
<h3 className="font-bold text-on-surface text-center">Wedsta</h3>
<p className="text-[11px] text-center text-outline leading-tight mt-1">At Home, Family Makeup Services</p>
</div>
<div className="bg-white p-3 rounded-xl shadow-sm border border-outline-variant/20 group hover:shadow-md transition-all">
<img className="w-full aspect-[4/3] object-cover rounded-lg mb-3" data-alt="A luxury wedding planner reviewing digital checklists on a tablet at a beautifully decorated marble table. Beside the tablet are color swatches in champagne gold and emerald. High-end, professional vibe." src="https://lh3.googleusercontent.com/aida-public/AB6AXuABl_Ywl89hmmsujcwC-WF0OMTRRI3bbpHV8YfU9YPIxElnclEVGbDjccF1Bzdmg3ZYCFApqzP2DmEYDCI8SL4JB8bMgKWPuY2gY5CCovLBvR0o63pE2XUdDHZUVK95vEFxvd4A3GqNwRk_uVR7CK_t477O8JMhTM46yu9dXY844AeN4-qHDFE1RhBvA5lXiKe2d2T_GMPVlwudC-KxhD518L0qAMCTsOz9OtI0OT1bL5-OlSIniccN_sSlzFAoRIaLdroWjE3Q7aLM"/>
<h3 className="font-bold text-on-surface text-center">Genie Services</h3>
<p className="text-[11px] text-center text-outline leading-tight mt-1">Plan your dream wedding in budget</p>
</div>
<div className="bg-white p-3 rounded-xl shadow-sm border border-outline-variant/20 group hover:shadow-md transition-all">
<img className="w-full aspect-[4/3] object-cover rounded-lg mb-3" data-alt="A grand indoor banquet hall with crystal chandeliers, floral centerpieces, and white tablecloths. The lighting is warm and inviting. Symmetric wide-angle shot." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAqptFpOh387e6OXFJ4fisIHEri1Lsb9UuqUuqjc9GWPDretbefCzIrZDt8dnZYnkN3B7rLYsAlvyWmw46_rl20mhXiD9l8kKFdAvK10IBIWhov6I-S43Ex_0AXH0YM5TpNTogUEsRj85Vmt5ZXphtVZu14grZXrzdRFyS0Gb4nOUVHVQcchDNdacy5i-ENW6n-jFynIo_uGODZX_Bvv2waWo1bxE7Ay8NsSwLLab3efewn6lR2TyoO-ehBK9oUW12BSsTxamHm7TgW"/>
<h3 className="font-bold text-on-surface text-center">Venue Booking</h3>
<p className="text-[11px] text-center text-outline leading-tight mt-1">Best Price Guaranteed</p>
</div>
</div>
</section>
{/* App Banner */}
<section className="mx-4 my-8 p-6 rounded-3xl bg-primary text-white relative overflow-hidden">
<div className="relative z-10 space-y-6">
<h2 className="text-2xl font-bold leading-tight">Download The CLOCHE Mobile App Today!</h2>
<ul className="space-y-3">
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">flare</span>
<span className="text-sm font-medium">Save Wedding Ideas</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">favorite</span>
<span className="text-sm font-medium">Shortlist Vendors</span>
</li>
<li className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary">checklist</span>
<span className="text-sm font-medium">Get Free Wedding Checklist</span>
</li>
</ul>
<button className="bg-secondary text-primary px-8 py-3 rounded-full font-bold text-sm shadow-lg active:scale-95 transition-transform">
                    Download App
                </button>
<div className="flex gap-4 pt-2">
<span className="material-symbols-outlined text-3xl">apps</span>
<span className="material-symbols-outlined text-3xl">android</span>
</div>
</div>
{/* Mockup device abstract element */}
<div className="absolute -right-12 -bottom-12 w-48 h-80 bg-surface/10 rounded-[3rem] rotate-12 border-4 border-white/20"></div>
</section>
{/* Featured Vendors */}
<section className="py-8">
<div className="px-6 mb-4 flex justify-between items-end">
<h2 className="text-xl font-bold text-on-surface">Featured Vendors</h2>
<span className="text-primary text-sm font-bold">View All</span>
</div>
<div className="flex overflow-x-auto hide-scrollbar gap-4 px-6">
<div className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
<div className="relative h-44">
<img className="w-full h-full object-cover" data-alt="Beautifully decorated garden wedding altar with pastel floral arrangements and elegant wooden chairs. Sun-drenched morning light. High-end garden wedding photography." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAEVqgHsiLSkZxXDg9lZQdQ2fTPFR5V8lLcuHmefPBRdMQNLe7DaNIoSBMDs-TSNQGmqfAtssE4J--SOQxWjq7wkGDdxYVBNbm0OTuHdJ3w3xNBTdbMqW78GJjhIvnF-lOipqY-3sm_s6h3uWydOcqo0AS-iQmi6b9dkhBX90G8s7rj70Ezy4-SF50TMXr3WS3XoOGVt9oKy4bGHthPojLDYTly5luPhH83fWUVH7svHPLOX4DXF44G0Dbc6zeguczDCK1Zp2_klw92"/>
<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-yellow-500 text-[14px]" style={{fontVariationSettings: 'FILL 1'}}>star</span>
<span className="text-[12px] font-bold">5.0</span>
</div>
</div>
<div className="p-4">
<h3 className="font-bold text-lg">YAAN Udaipur</h3>
<p className="text-outline text-sm">Wedding Venues, Udaipur</p>
<p className="text-primary font-bold mt-2">? 2500 <span className="text-[12px] text-outline font-normal">onwards per plate</span></p>
</div>
</div>
<div className="flex-shrink-0 w-72 bg-white rounded-2xl overflow-hidden shadow-sm border border-outline-variant/10">
<div className="relative h-44">
<img className="w-full h-full object-cover" data-alt="Stunning close-up bridal portrait showing detailed jewelry and flawless makeup. Soft-focus background. High-fashion wedding beauty editorial." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDDZrXk8w7Jm5zSye-40lOKoE1m_Bo60PY2TvXxl9Fjth9bqLBSC2S2ppFjnymMrhAM8LGBq1odmw-SqU6bDvxSD5u_aLGw0mJbkiLUuCEZJhohjh9H6gsy7m3e5xdRtDgRHpsB4D8gYHfEYTHyeJt7Yu2DEOYq1i39XavHu6kIjbRdP491Z7XnbNqfJMItjqFxsVHuhhlDC3sBL3Rv6opkON-QP18z8KLdAn-EUqXu2KvyWFL-AO7Ob_80mvQ_jdqpQ-_8bj4rGy2i"/>
<div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded flex items-center gap-1 shadow-sm">
<span className="material-symbols-outlined text-yellow-500 text-[14px]" style={{fontVariationSettings: 'FILL 1'}}>star</span>
<span className="text-[12px] font-bold">4.9</span>
</div>
</div>
<div className="p-4">
<h3 className="font-bold text-lg">ROYAL MAKEUP ART</h3>
<p className="text-outline text-sm">Bridal Makeup, Delhi</p>
<p className="text-primary font-bold mt-2">? 20,000 <span className="text-[12px] text-outline font-normal">starting price</span></p>
</div>
</div>
</div>
</section>
{/* Blogs/Stories Carousel */}
<section className="py-8">
<div className="px-6 mb-4">
<h2 className="text-xl font-bold text-on-surface">Real Wedding Stories</h2>
</div>
<div className="flex overflow-x-auto hide-scrollbar gap-4 px-6">
<div className="flex-shrink-0 w-80">
<div className="rounded-2xl overflow-hidden h-52 shadow-md">
<img className="w-full h-full object-cover" data-alt="Split image showing a traditional wedding ceremony under a golden dome and a modern couple walking through a floral garden. The lighting transitions from warm amber to bright daylight." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDybVNqcPesLD5TJ7kU9ktSMRShli2bgr5sdljfio0SWnaL97ugJeG5NsgA-mLNOMmOWJFMXxIm8Cq0OVUqip0XseKaqm8oRYpFn9rVaXA9cjCD-SDGwxjuRlriALzXa3J-yi7BB4rlT_7lg9HvntbRnwlCgC56Nh2DE8CO_MNWiZsqHJabXtiHyQDUH_uQaCYIdNH0dQzaZIAJhC1V2j2QFn2xmPnNG2cPP8zqQx9aPk6CWxsgx94Gl-KVZ1lik28hVY-SJexudags"/>
</div>
<div className="py-4">
<h3 className="font-bold text-on-surface leading-tight">Gayatri and Ayush</h3>
<p className="text-sm text-outline mt-1">A Jaipur Wedding That Delivered One Stunning Setup After Another!</p>
</div>
</div>
<div className="flex-shrink-0 w-80">
<div className="rounded-2xl overflow-hidden h-52 shadow-md">
<img className="w-full h-full object-cover" data-alt="A scenic beach wedding setup at sunset with a minimalist bamboo mandap and soft drapes. Deep blues and warm oranges of the sky. Peaceful and luxurious atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAlIY3Rsu77h9JhRfLXKWhl7uY5PHM8h9xVxmI_mqGehxB9rM5xAhOV97FZ-KIBEAVoSfZ2yUzYqrQP2ekudMlla5kZeNhyCpXH7z_nIIz_SRmWGLg5ZuibsDA6i1wJnbbADnytZPvYR8MVfl8OctX3XWNreNdozLPiqRD4RXQwt9pIBn_maMAoWjVTKO4UNrvIqoe-A9jetFAt-ppdexODCU8-XefMAttsQRTbVnm1eF4Zv_EF_MVTo-_D_MwrpZEoYJcV-oxdRscx"/>
</div>
<div className="py-4">
<h3 className="font-bold text-on-surface leading-tight">The Rise of Asia-First Weddings</h3>
<p className="text-sm text-outline mt-1">Destination weddings are entering a new era. What was once reserved for lavish...</p>
</div>
</div>
</div>
</section>
{/* Footer Contact Info */}
<section className="py-10 px-6 bg-surface border-t border-outline-variant/20">
<h2 className="text-xl font-bold text-on-surface mb-6">CLOCHE - Your Personal Wedding Planner</h2>
<p className="text-sm text-on-surface-variant leading-relaxed mb-8">
                CLOCHE is a luxury wedding planning platform designed for modern couples. We curate the finest vendors, venues, and inspirations to ensure your special day is handled with bespoke care and timeless elegance.
            </p>
<div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
<div>
<h3 className="font-bold text-on-surface mb-2">For Vendors</h3>
<p className="text-sm text-primary">partners@cloche.luxury</p>
<p className="text-sm text-outline">0124-6812346</p>
</div>
<div>
<h3 className="font-bold text-on-surface mb-2">For Users</h3>
<p className="text-sm text-primary">bespoke@cloche.luxury</p>
<p className="text-sm text-outline">0124-6812345</p>
</div>
</div>
<div className="mb-10">
<h3 className="font-bold text-on-surface mb-2">Registered Office</h3>
<p className="text-sm text-outline leading-relaxed">
                    12th Floor, Elegance Tower, 45 Heritage Road, Sector-62, Gurgaon, Haryana, India, 122011
                </p>
</div>
<div className="flex flex-col gap-4">
<button className="w-full py-4 border border-primary text-primary font-bold rounded-lg hover:bg-primary/5 transition-colors">
                    Register as a Vendor
                </button>
<div className="relative flex items-center">
<input className="w-full px-4 py-4 rounded-lg bg-surface-dim border-none focus:ring-2 focus:ring-primary" placeholder="Email*" type="email"/>
<button className="absolute right-2 bg-secondary text-primary font-bold px-4 py-2 rounded-md text-xs">
                        Subscribe
                    </button>
</div>
</div>
</section>
</main>
{/* BottomNavBar */}
<nav className="fixed bottom-0 w-full z-50 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/15 h-16 flex justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.04)] pb-safe">
<a className="flex flex-col items-center justify-center text-primary font-bold active:scale-90 transition-all" href="#">
<span className="material-symbols-outlined" style={{fontVariationSettings: 'FILL 1'}}>home</span>
<span className="text-[10px] uppercase tracking-wider mt-1">Home</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="#">
<span className="material-symbols-outlined">location_on</span>
<span className="text-[10px] uppercase tracking-wider mt-1">Venues</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="#">
<span className="material-symbols-outlined">group</span>
<span className="text-[10px] uppercase tracking-wider mt-1">Vendors</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="#">
<span className="material-symbols-outlined">photo_library</span>
<span className="text-[10px] uppercase tracking-wider mt-1">Photos</span>
</a>
<a className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="#">
<span className="material-symbols-outlined">auto_stories</span>
<span className="text-[10px] uppercase tracking-wider mt-1">Blogs</span>
</a>
</nav>
{/* Contextual FAB */}
<button className="fixed bottom-20 right-6 z-40 bg-secondary text-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group active:scale-90 transition-transform">
<span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">magic_button</span>
</button>

    </>
  );
}
