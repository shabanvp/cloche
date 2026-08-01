export type DecorVendor = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  image: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  about: string;
  portfolio: string[];
  services: { name: string; icon: string }[];
  packages: { name: string; price: string; isPopular?: boolean }[];
  userReviews: {
    author: string;
    date: string;
    rating: number;
    text: string;
    isVerified?: boolean;
    avatar: string;
    images?: string[];
  }[];
};

export const decorVendors: DecorVendor[] = [
  {
    id: "the-wedding-canvas",
    name: "The Wedding Canvas",
    subtitle: "Luxury Wedding Decor & Planning",
    category: "Decor & Planning Experts",
    rating: 4.9,
    reviews: 128,
    location: "Delhi NCR, India",
    price: "₹3,500,000",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isVerified: true,
    about: "The Wedding Canvas is a luxury wedding decor and planning company known for crafting breathtaking experiences with impeccable attention to detail and personalized service.",
    portfolio: [
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
    ],
    services: [
      { name: "Wedding Decor", icon: "church" },
      { name: "Floral Design", icon: "local_florist" },
      { name: "Stage Design", icon: "architecture" },
      { name: "Lighting", icon: "lightbulb" },
      { name: "Furniture", icon: "chair" },
    ],
    packages: [
      { name: "Silver", price: "₹2,00,000" },
      { name: "Gold", price: "₹3,50,000", isPopular: true },
      { name: "Platinum", price: "₹5,50,000" },
    ],
    userReviews: [
      {
        author: "Ananya & Rohan",
        date: "Mar 12, 2026",
        rating: 5.0,
        isVerified: true,
        text: "The Wedding Canvas turned our dream into a reality! The decor, flowers, and ambiance were beyond our expectations.",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        images: [
          "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=400&q=80",
          "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=400&q=80",
        ],
      },
    ],
  },
  {
    id: "petals-and-promise",
    name: "Petals & Promise",
    subtitle: "Wedding Decor & Floral Design",
    category: "Floral & Event Design",
    rating: 4.8,
    reviews: 96,
    location: "Mumbai, Maharashtra",
    price: "₹2,25,000",
    image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Specialized in exquisite floral entrance arches, whimsical mandap setups, and romantic candlelight dinner staging.",
    portfolio: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80",
    ],
    services: [
      { name: "Floral Design", icon: "local_florist" },
      { name: "Lighting", icon: "lightbulb" },
      { name: "Mandap Decor", icon: "temple_hindu" },
    ],
    packages: [
      { name: "Basic Floral", price: "₹1,50,000" },
      { name: "Grand Luxe", price: "₹2,25,000", isPopular: true },
    ],
    userReviews: [
      {
        author: "Priya M.",
        date: "Feb 20, 2026",
        rating: 4.8,
        isVerified: true,
        text: "The floral arches were stunning! Everyone was taking photos at the entrance all night.",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
      },
    ],
  },
  {
    id: "dream-makers",
    name: "Dream Makers",
    subtitle: "Decor & Planning Experts",
    category: "Decor & Planning Experts",
    rating: 4.7,
    reviews: 74,
    location: "Bengaluru, Karnataka",
    price: "₹2,00,000",
    image: "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Creating fairytale setups and bespoke wedding themes with full end-to-end production management.",
    portfolio: [
      "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&w=800&q=80",
    ],
    services: [
      { name: "Wedding Decor", icon: "church" },
      { name: "Stage Design", icon: "architecture" },
    ],
    packages: [
      { name: "Standard", price: "₹2,00,000", isPopular: true },
    ],
    userReviews: [],
  },
  {
    id: "elegant-affairs",
    name: "Elegant Affairs",
    subtitle: "Luxury Decor & Event Styling",
    category: "Event Styling Studio",
    rating: 4.9,
    reviews: 112,
    location: "Pune, Maharashtra",
    price: "₹2,75,000",
    image: "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isVerified: true,
    about: "Crafting ethereal pastels, romantic royal stage settings, and high-concept wedding celebrations.",
    portfolio: [
      "https://images.unsplash.com/photo-1544078751-58fee2d8a03b?auto=format&fit=crop&w=800&q=80",
    ],
    services: [
      { name: "Event Styling", icon: "palette" },
      { name: "Lighting", icon: "lightbulb" },
    ],
    packages: [
      { name: "Elite Elegance", price: "₹2,75,000", isPopular: true },
    ],
    userReviews: [],
  },
  {
    id: "shaadi-studios",
    name: "Shaadi Studios",
    subtitle: "Creative Wedding Decor",
    category: "Creative Decor Team",
    rating: 4.6,
    reviews: 58,
    location: "Hyderabad, Telangana",
    price: "₹1,80,000",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Budget-friendly yet royal decor setups designed for weddings, mehendi functions, and sangeet stages.",
    portfolio: [
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
    ],
    services: [
      { name: "Stage Design", icon: "architecture" },
    ],
    packages: [
      { name: "Classic", price: "₹1,80,000" },
    ],
    userReviews: [],
  },
];

export function getDecorVendorById(id: string) {
  return decorVendors.find((vendor) => vendor.id === id) || decorVendors[0];
}
