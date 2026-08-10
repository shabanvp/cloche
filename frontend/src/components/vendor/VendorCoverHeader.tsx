"use client";

interface VendorCoverHeaderProps {
  coverUrl: string;
  altText?: string;
  className?: string;
}

export function VendorCoverHeader({ coverUrl, altText = "Vendor Cover Photo", className = "" }: VendorCoverHeaderProps) {
  return (
    <div className="w-full lg:max-w-4xl lg:mx-auto lg:px-8 lg:pt-6">
      <div className={`relative h-64 sm:h-80 lg:h-72 w-full bg-[#0F4C45] overflow-hidden lg:rounded-3xl lg:border lg:border-gold/15 lg:shadow-sm ${className}`}>
        <img 
          src={coverUrl} 
          alt={altText} 
          className="w-full h-full object-cover object-[center_25%] opacity-100 transition-all duration-500"
        />
        {/* Subtle dark gradient overlay ONLY at top for header readability */}
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-black/55 via-black/15 to-transparent pointer-events-none lg:rounded-t-3xl" />
        
        {/* Subtle bottom edge gradient for smooth profile card contrast */}
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/35 to-transparent pointer-events-none lg:rounded-b-3xl" />
      </div>
    </div>
  );
}
