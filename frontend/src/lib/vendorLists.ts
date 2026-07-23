export type VendorDetail = {
  id: string;
  name: string;
  category: string;
  location: string;
  rating: number;
  reviews: number;
  followers: number;
  image: string;
  images: string[];
  about: string;
  phone?: string;
  email?: string;
  website?: string;
};

export const makeupArtists: VendorDetail[] = [
  {
    id: "makeup-parul-garg",
    name: "Makeup by Parul Garg",
    category: "Bridal Makeup Artist",
    location: "Delhi, India",
    rating: 4.9,
    reviews: 150,
    followers: 201,
    image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    ],
    about: "Enhancing natural beauty with elegant and long-lasting bridal looks.",
    phone: "9876543210",
    email: "info@parulgargmakeup.com",
  },
  {
    id: "makeup-meenakshi-dutt",
    name: "Meenakshi Dutt Makeovers",
    category: "Bridal Makeup Artist",
    location: "Delhi, India",
    rating: 4.8,
    reviews: 120,
    followers: 185,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80",
    ],
    about: "Creating signature bridal styles that ensure you look radiant on your special day.",
    phone: "9876543211",
    email: "meenakshi@duttmakeovers.com",
  },
];

export const photographers: VendorDetail[] = [
  {
    id: "photographer-wedding-frames",
    name: "The Wedding Frames",
    category: "Wedding Photographer",
    location: "Mumbai, Maharashtra",
    rating: 4.9,
    reviews: 210,
    followers: 312,
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
    ],
    about: "Capturing emotions, relationships and memories that last a lifetime.",
    phone: "9876543212",
    email: "hello@weddingframes.com",
  },
  {
    id: "photographer-candid-shutters",
    name: "Candid Shutters",
    category: "Wedding Photographer",
    location: "Mumbai, Maharashtra",
    rating: 4.8,
    reviews: 175,
    followers: 245,
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80",
    images: [
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    about: "Candid and cinematic style wedding films and photography that bring out the true essence of love.",
    phone: "9876543213",
    email: "contact@candidshutters.com",
  },
];
