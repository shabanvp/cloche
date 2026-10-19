export type JewelleryVendor = {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  image: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  isPremium?: boolean;
  about: string;
  portfolio: string[];
  collections: { name: string; itemsCount: number; image: string }[];
  packages: { name: string; tag?: string; description: string; price: string; image?: string }[];
  services: { name: string; icon: string }[];
  userReviews: { author: string; date: string; rating: number; text: string }[];
};

export const jewelleryVendors: JewelleryVendor[] = [
  {
    id: "house-of-vaasu",
    name: "House of Vaasu",
    subtitle: "Luxury Bridal Jewellery",
    rating: 4.8,
    reviews: 128,
    location: "Mumbai, Maharashtra",
    price: "₹ 1,25,000",
    image: "/images/jewellery-cover.png",
    isFeatured: true,
    isVerified: true,
    isPremium: true,
    about: "Curating timeless bridal jewellery with unmatched craftsmanship and premium gemstones for your most cherished moments.",
    portfolio: [
      "/images/jewellery-cover.png",
      "https://images.unsplash.com/photo-1611591475140-02a806c9a7ce?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    ],
    collections: [
      { name: "Bridal Sets", itemsCount: 24, image: "/images/jewellery-cover.png" },
      { name: "Polki Collection", itemsCount: 18, image: "https://images.unsplash.com/photo-1611591475140-02a806c9a7ce?auto=format&fit=crop&w=400&q=80" },
      { name: "Diamond Sets", itemsCount: 16, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80" },
      { name: "Temple Jewellery", itemsCount: 20, image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=400&q=80" },
    ],
    packages: [
      {
        name: "Royal Bridal Package",
        tag: "Best Seller",
        description: "Complete bridal jewellery set with necklace, earrings, maang tikka & bangles.",
        price: "₹ 2,45,000",
        image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=400&q=80",
      },
    ],
    services: [
      { name: "Custom Design", icon: "edit" },
      { name: "Try at Home", icon: "home" },
      { name: "Worldwide Shipping", icon: "local_shipping" },
      { name: "Lifetime Maintenance", icon: "build" },
      { name: "Buy Back Guarantee", icon: "verified" },
    ],
    userReviews: [
      {
        author: "Radhika Parekh",
        date: "1 month ago",
        rating: 5.0,
        text: "The Polki choker set took everyone's breath away! Truly royal craftsmanship.",
      },
    ],
  },
  {
    id: "kundan-heritage",
    name: "Kundan Heritage",
    subtitle: "Polki & Kundan Specialists",
    rating: 4.7,
    reviews: 96,
    location: "Jaipur, Rajasthan",
    price: "₹ 85,000",
    image: "https://images.unsplash.com/photo-1611591475140-02a806c9a7ce?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    isPremium: true,
    about: "Heritage Rajasthani Kundan and uncut diamond sets crafted by master artisans.",
    portfolio: [
      "https://images.unsplash.com/photo-1611591475140-02a806c9a7ce?auto=format&fit=crop&w=800&q=80",
    ],
    collections: [
      { name: "Jaipur Polki", itemsCount: 15, image: "https://images.unsplash.com/photo-1611591475140-02a806c9a7ce?auto=format&fit=crop&w=400&q=80" },
    ],
    packages: [
      {
        name: "Classic Kundan Set",
        description: "Heavy necklace set with matching jhumkas.",
        price: "₹ 85,000",
      },
    ],
    services: [
      { name: "Custom Design", icon: "edit" },
      { name: "Worldwide Shipping", icon: "local_shipping" },
    ],
    userReviews: [],
  },
  {
    id: "the-diamond-atelier",
    name: "The Diamond Atelier",
    subtitle: "Diamond Jewellery Experts",
    rating: 4.9,
    reviews: 210,
    location: "Delhi, India",
    price: "₹ 1,50,000",
    image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Certified Solitaire and fine diamond cocktail necklaces designed for high-end celebrations.",
    portfolio: [
      "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80",
    ],
    collections: [
      { name: "Solitaire Collection", itemsCount: 30, image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=400&q=80" },
    ],
    packages: [],
    services: [],
    userReviews: [],
  },
];
