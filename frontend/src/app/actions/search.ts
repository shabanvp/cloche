"use server";

import { Product, Boutique } from "@/types";

const rawBaseUrl = process.env.NEXT_PUBLIC_API_URL || "https://cloche-backend.onrender.com";
const API_BASE_URL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const SEED_PRODUCTS: Product[] = [
  {
    id: "p-101",
    product_name: "Imperial Crimson Heritage Zardozi Lehenga",
    price: 185000,
    category: "Bridal Wear",
    district: "Ernakulam",
    image_url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
    description: "Handcrafted raw silk bridal lehenga with royal Zardozi and dabka embroidery.",
    boutique_id: "aurora-bridal-couture",
    boutique_name: "Aurora Bridal Couture",
  },
  {
    id: "p-102",
    product_name: "Pastel Blossom Silk Organza Lehenga",
    price: 145000,
    category: "Bridal Wear",
    district: "Kozhikode",
    image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    description: "Lightweight pastel pink organza lehenga with hand-painted floral motifs.",
    boutique_id: "v-21",
    boutique_name: "Velvet Bloom Couture",
  },
  {
    id: "p-103",
    product_name: "Royal Velvet Nawabi Sherwani Set",
    price: 85000,
    category: "Groom Wear",
    district: "Malappuram",
    image_url: "/images/groom-wear-cover.png",
    description: "Deep emerald velvet sherwani with antique gold threadwork.",
    boutique_id: "v-26",
    boutique_name: "Aurora Menswear Couture",
  },
  {
    id: "p-104",
    product_name: "Heritage Temple Gold Necklace Set",
    price: 295000,
    category: "Jewellery",
    district: "Kozhikode",
    image_url: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80",
    description: "22K yellow gold handcrafted temple jewellery set with rubies and pearls.",
    boutique_id: "v-malabar",
    boutique_name: "Kalyan Heritage Jewellery",
  },
  {
    id: "p-105",
    product_name: "Waterfront Lawn Royal Wedding Package",
    price: 450000,
    category: "Traditional",
    district: "Ernakulam",
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    description: "100,000 sq.ft waterfront backwater lawn package for up to 1500 guests.",
    boutique_id: "v-solitaire",
    boutique_name: "Grand Solitaire Island Resort",
  },
  {
    id: "p-106",
    product_name: "Lakeside Palace Heritage Wedding Package",
    price: 500000,
    category: "Couture",
    district: "Thiruvananthapuram",
    image_url: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
    description: "Royal lakefront courtyard ceremony package with floating stage.",
    boutique_id: "sapphire-lake-palace",
    boutique_name: "Sapphire Lake Palace",
  },
  {
    id: "p-107",
    product_name: "Bridal HD Airbrush Glam Makeup Package",
    price: 25000,
    category: "Makeup",
    district: "Ernakulam",
    image_url: "/images/makeup-cover.png",
    description: "HD Airbrush bridal makeup including hairstyling, saree draping, and lashes.",
    boutique_id: "v-15",
    boutique_name: "Faces by Leena Bhushan",
  },
  {
    id: "p-108",
    product_name: "Cinematic Wedding Film & Portraiture",
    price: 75000,
    category: "Photography",
    district: "Kozhikode",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    description: "Full-day 4K 60fps drone cinematic teaser, candid photos, and luxury album.",
    boutique_id: "v-30",
    boutique_name: "Memory Lanes Photography",
  },
];

const SEED_BOUTIQUES: Boutique[] = [
  {
    id: "v-solitaire",
    boutique_name: "Grand Solitaire Island Resort",
    city: "Kochi",
    district: "Ernakulam",
    rating: 5.0,
    plan: "premium",
    image_url: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=800&q=80",
    description: "Luxury Waterfront Island Wedding Destination",
    tags: "Venue, Resort, Lawn",
  },
  {
    id: "sapphire-lake-palace",
    boutique_name: "Sapphire Lake Palace",
    city: "Trivandrum",
    district: "Thiruvananthapuram",
    rating: 4.9,
    plan: "premium",
    image_url: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
    description: "Royal Lakefront Palace & Banquet Lawns",
    tags: "Venue, Palace, Heritage",
  },
  {
    id: "v-22",
    boutique_name: "Aurora Bridal Couture",
    city: "Kochi",
    district: "Ernakulam",
    rating: 4.9,
    plan: "premium",
    image_url: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
    description: "Luxury Couture Lehengas & Handcrafted Bridal Wear",
    tags: "Bridal Wear, Lehenga, Couture",
  },
  {
    id: "v-21",
    boutique_name: "Velvet Bloom Couture",
    city: "Kozhikode",
    district: "Kozhikode",
    rating: 4.8,
    plan: "standard",
    image_url: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80",
    description: "Heritage Silk & Organza Designer Bridal Studio",
    tags: "Bridal Wear, Saree, Lehenga",
  },
  {
    id: "v-15",
    boutique_name: "Faces by Leena Bhushan",
    city: "Kochi",
    district: "Ernakulam",
    rating: 5.0,
    plan: "premium",
    image_url: "/images/makeup-cover.png",
    description: "High-Definition Airbrush Bridal Makeup & Styling Studio",
    tags: "Makeup Artist, Hair, Beauty",
  },
  {
    id: "v-30",
    boutique_name: "Memory Lanes Photography",
    city: "Kozhikode",
    district: "Kozhikode",
    rating: 4.9,
    plan: "premium",
    image_url: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    description: "Award-winning Destination Wedding & Pre-wedding Cinematography",
    tags: "Photographer, Cinematography, Studio",
  },
  {
    id: "v-26",
    boutique_name: "Aurora Menswear Couture",
    city: "Malappuram",
    district: "Malappuram",
    rating: 4.8,
    plan: "standard",
    image_url: "/images/groom-wear-cover.png",
    description: "Bespoke Royal Sherwanis & Tuxedos for Grooms",
    tags: "Groom Wear, Sherwani, Tuxedo",
  },
  {
    id: "v-seaside",
    boutique_name: "Seaside Haven Resort",
    city: "Kovalam",
    district: "Thiruvananthapuram",
    rating: 4.9,
    plan: "premium",
    image_url: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
    description: "Beachfront Luxury Resort Destination Weddings",
    tags: "Venue, Beach Resort, Lawn",
  },
];

function filterSeedProducts(params: Record<string, any>): Product[] {
  let list = [...SEED_PRODUCTS];
  const { keyword, district, category } = params;

  if (keyword && String(keyword).trim()) {
    const k = String(keyword).toLowerCase().trim();
    list = list.filter((p) =>
      p.product_name.toLowerCase().includes(k) ||
      (p.category || "").toLowerCase().includes(k) ||
      (p.description || "").toLowerCase().includes(k) ||
      (p.boutique_name || "").toLowerCase().includes(k)
    );
  }

  if (district && district !== "All") {
    const d = String(district).toLowerCase().trim();
    list = list.filter((p) => (p.district || "").toLowerCase().includes(d));
  }

  if (category && category !== "All") {
    const c = String(category).toLowerCase().trim();
    list = list.filter((p) =>
      (p.category || "").toLowerCase().includes(c) ||
      p.product_name.toLowerCase().includes(c)
    );
  }

  return list;
}

function filterSeedBoutiques(params: Record<string, any>): Boutique[] {
  let list = [...SEED_BOUTIQUES];
  const { keyword, district } = params;

  if (keyword && String(keyword).trim()) {
    const k = String(keyword).toLowerCase().trim();
    list = list.filter((b) =>
      b.boutique_name.toLowerCase().includes(k) ||
      (b.description || "").toLowerCase().includes(k) ||
      (b.tags || "").toLowerCase().includes(k) ||
      (b.district || "").toLowerCase().includes(k)
    );
  }

  if (district && district !== "All") {
    const d = String(district).toLowerCase().trim();
    list = list.filter((b) =>
      (b.district || "").toLowerCase().includes(d) ||
      (b.city || "").toLowerCase().includes(d)
    );
  }

  return list;
}

export async function searchProducts(params: Record<string, any>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") {
        query.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE_URL}/products/search?${query.toString()}`, {
      cache: "no-store"
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error("API Search Products error, serving seed fallback:", err);
  }

  const filtered = filterSeedProducts(params);
  return {
    success: true,
    data: filtered,
    pagination: {
      total: filtered.length,
      page: params.page || 1,
      totalPages: 1,
    },
  };
}

export async function searchBoutiques(params: Record<string, any>) {
  try {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") {
        query.append(key, String(value));
      }
    });

    const res = await fetch(`${API_BASE_URL}/boutiques/search?${query.toString()}`, {
      cache: "no-store"
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
        return data;
      }
    }
  } catch (err) {
    console.error("API Search Boutiques error, serving seed fallback:", err);
  }

  const filtered = filterSeedBoutiques(params);
  return {
    success: true,
    data: filtered,
    pagination: {
      total: filtered.length,
      page: params.page || 1,
      totalPages: 1,
    },
  };
}
