import Link from "next/link";

export function BottomNavBar() {
  return (
    <>
      {/* BottomNavBar */}
      <nav className="mobile-bottom-nav fixed bottom-0 w-full z-50 bg-surface/95 backdrop-blur-lg border-t border-outline-variant/15 h-16 flex md:hidden justify-around items-center shadow-[0_-10px_30px_rgba(0,0,0,0.04)] pb-safe">
        <Link className="flex flex-col items-center justify-center text-primary font-bold active:scale-90 transition-all" href="/">
          <span className="material-symbols-outlined" style={{fontVariationSettings: 'FILL 1'}}>home</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Home</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="/categories">
          <span className="material-symbols-outlined">location_on</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Venues</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="/boutiques">
          <span className="material-symbols-outlined">group</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Vendors</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="/inspiration">
          <span className="material-symbols-outlined">photo_library</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Photos</span>
        </Link>
        <Link className="flex flex-col items-center justify-center text-on-surface-variant hover:text-primary transition-all active:scale-90" href="/real-weddings">
          <span className="material-symbols-outlined">auto_stories</span>
          <span className="text-[10px] uppercase tracking-wider mt-1">Blogs</span>
        </Link>
      </nav>
      {/* Contextual FAB */}
      <button className="mobile-menu-floating-action fixed bottom-20 right-6 z-40 md:hidden bg-secondary text-primary w-14 h-14 rounded-full shadow-2xl flex items-center justify-center group active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-3xl group-hover:rotate-12 transition-transform">magic_button</span>
      </button>
    </>
  );
}
