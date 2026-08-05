import { convertCmsToVenueDetail } from "@/lib/venueCmsStore";

export type Package = {
  name: string;
  price: string;
  guests: string;
  tag?: string;
};

export type Review = {
  couple: string;
  date: string;
  rating: number;
  text: string;
  avatar: string;
};

export type SimilarVenue = {
  id: string;
  name: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
};

export type VenueDetail = {
  id: string;
  name: string;
  location: string;
  city: string;
  rating: number;
  reviews: number;
  image: string;
  images: string[];
  totalPhotos: number;
  tags: string[];
  capacity: string;
  spaceType: string;
  startingPrice: string;
  verified: boolean;
  amenities: { icon: string; label: string }[];
  packages: Package[];
  review: Review;
  similar: SimilarVenue[];
};

export const venues: VenueDetail[] = [
  {
    id: "palace-estate",
    name: "The Palace Estate",
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.8,
    reviews: 138,
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 24,
    tags: ["Luxury", "Destination"],
    capacity: "500 – 1200 Guests",
    spaceType: "Outdoor & Indoor",
    startingPrice: "₹8,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "liquor", label: "Alcohol" },
      { icon: "auto_awesome", label: "Fireworks" },
    ],
    packages: [
      { name: "Royal Affair", price: "₹8,00,000", guests: "500 Guests", tag: "Most Loved" },
      { name: "Palace Celebration", price: "₹12,00,000", guests: "800 Guests" },
      { name: "Maharaja Experience", price: "₹20,00,000", guests: "1200 Guests" },
    ],
    review: {
      couple: "Priya & Arjun",
      date: "Apr 2025",
      rating: 5,
      text: "The Palace Estate turned our dream wedding into reality. Every detail was beyond perfect. The team is extremely professional and warm.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "royal-orchid-estate", name: "Royal Orchid Estate", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "moonstone-fort-resort", name: "Moonstone Fort Resort", city: "Udaipur", rating: 4.6, reviews: 70, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "sapphire-lake-palace",
    name: "Sapphire Lake Palace",
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.9,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 32,
    tags: ["Luxury", "Destination", "Indoor"],
    capacity: "200 – 800 Guests",
    spaceType: "Indoor & Lake View",
    startingPrice: "₹15,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "liquor", label: "Alcohol" },
      { icon: "water", label: "Lake View" },
    ],
    packages: [
      { name: "Lake Affair", price: "₹15,00,000", guests: "200 Guests", tag: "Most Loved" },
      { name: "Royal Celebration", price: "₹25,00,000", guests: "500 Guests" },
      { name: "Palace Experience", price: "₹45,00,000", guests: "800 Guests" },
    ],
    review: {
      couple: "Devika & Siddharth",
      date: "May 2026",
      rating: 5,
      text: "Sapphire Lake Palace is pure magic. The floating palace setting made our wedding utterly ethereal. World-class service and unforgettable memories.",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "palace-estate", name: "The Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
      { id: "royal-orchid-estate", name: "Royal Orchid Estate", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "moonstone-fort-resort", name: "Moonstone Fort Resort", city: "Rajasthan", rating: 4.8, reviews: 81, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "celestia-grand-palace",
    name: "Celestia Grand Palace",
    location: "New Delhi, India",
    city: "Delhi",
    rating: 4.7,
    reviews: 110,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 28,
    tags: ["Luxury", "Indoor"],
    capacity: "300 – 1000 Guests",
    spaceType: "Indoor",
    startingPrice: "₹10,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "liquor", label: "Alcohol" },
      { icon: "spa", label: "Spa" },
    ],
    packages: [
      { name: "Delhi Grandeur", price: "₹10,00,000", guests: "300 Guests", tag: "Most Loved" },
      { name: "Imperial Affair", price: "₹18,00,000", guests: "600 Guests" },
      { name: "Celestia Extravaganza", price: "₹30,00,000", guests: "1000 Guests" },
    ],
    review: {
      couple: "Neha & Vikram",
      date: "Feb 2025",
      rating: 5,
      text: "Celestia Grand Palace Delhi exceeded every expectation. The grand ballroom is absolutely stunning and the staff attention to detail is impeccable.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
      { id: "golden-crest-manor", name: "Golden Crest Manor", city: "Chennai", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
      { id: "amber-crown-retreat", name: "Amber Crown Retreat", city: "Agra", rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "moonstone-fort-resort",
    name: "Moonstone Fort Resort",
    location: "Sawai Madhopur, Rajasthan",
    city: "Rajasthan",
    rating: 4.8,
    reviews: 81,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 20,
    tags: ["Luxury", "Destination", "Outdoor"],
    capacity: "100 – 400 Guests",
    spaceType: "Outdoor & Indoor",
    startingPrice: "₹20,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "auto_awesome", label: "Fireworks" },
      { icon: "spa", label: "Wellness" },
    ],
    packages: [
      { name: "Fort Romance", price: "₹20,00,000", guests: "100 Guests", tag: "Most Loved" },
      { name: "Heritage Celebration", price: "₹35,00,000", guests: "250 Guests" },
      { name: "Royal Fort Experience", price: "₹55,00,000", guests: "400 Guests" },
    ],
    review: {
      couple: "Kavya & Ishaan",
      date: "May 2025",
      rating: 5,
      text: "Moonstone Fort Resort is unlike any venue we visited. The 14th-century fort backdrop, lush gardens and impeccable service created magic.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "royal-orchid-estate", name: "Royal Orchid Estate", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
      { id: "amber-crown-retreat", name: "Amber Crown Retreat", city: "Agra", rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "royal-orchid-estate",
    name: "Royal Orchid Heritage Estate",
    location: "Jodhpur, Rajasthan",
    city: "Rajasthan",
    rating: 4.9,
    reviews: 62,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 40,
    tags: ["Luxury", "Destination", "Outdoor"],
    capacity: "200 – 600 Guests",
    spaceType: "Outdoor & Indoor",
    startingPrice: "₹30,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "liquor", label: "Alcohol" },
      { icon: "auto_awesome", label: "Fireworks" },
    ],
    packages: [
      { name: "Jodhpur Royale", price: "₹30,00,000", guests: "200 Guests", tag: "Most Loved" },
      { name: "Maharaja Grand", price: "₹50,00,000", guests: "400 Guests" },
      { name: "Royal Extravaganza", price: "₹75,00,000", guests: "600 Guests" },
    ],
    review: {
      couple: "Sanya & Dev",
      date: "Jan 2025",
      rating: 5,
      text: "Royal Orchid Heritage Estate is simply breathtaking. Getting married here was a childhood dream come true. The grandeur and regal charm is unmatched.",
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "moonstone-fort-resort", name: "Moonstone Fort Resort", city: "Rajasthan", rating: 4.8, reviews: 81, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "golden-crest-manor",
    name: "Golden Crest Manor",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    rating: 4.6,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 35,
    tags: ["Indoor", "Luxury"],
    capacity: "400 – 1500 Guests",
    spaceType: "Indoor",
    startingPrice: "₹6,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "liquor", label: "Alcohol" },
      { icon: "ac_unit", label: "AC Halls" },
    ],
    packages: [
      { name: "Crest Classic", price: "₹6,00,000", guests: "400 Guests", tag: "Most Loved" },
      { name: "Grand Celebration", price: "₹12,00,000", guests: "900 Guests" },
      { name: "Crest Extravaganza", price: "₹20,00,000", guests: "1500 Guests" },
    ],
    review: {
      couple: "Deepa & Rajan",
      date: "Jun 2025",
      rating: 5,
      text: "Golden Crest Manor is a landmark Chennai venue. The majestic interiors and seamless event management made our big day absolutely perfect.",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "amber-crown-retreat", name: "Amber Crown Retreat", city: "Agra", rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80" },
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
      { id: "golden-tulip-lawn", name: "Golden Tulip", city: "Pune", rating: 4.4, reviews: 201, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "amber-crown-retreat",
    name: "Amber Crown Retreat",
    location: "Agra, Uttar Pradesh",
    city: "Agra",
    rating: 4.8,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 18,
    tags: ["Luxury", "Destination"],
    capacity: "150 – 500 Guests",
    spaceType: "Outdoor & Indoor",
    startingPrice: "₹18,00,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "liquor", label: "Alcohol" },
      { icon: "landscape", label: "Crown View" },
    ],
    packages: [
      { name: "Amber Romance", price: "₹18,00,000", guests: "150 Guests", tag: "Most Loved" },
      { name: "Crown Celebration", price: "₹30,00,000", guests: "300 Guests" },
      { name: "Grand Agra Experience", price: "₹45,00,000", guests: "500 Guests" },
    ],
    review: {
      couple: "Meera & Rahul",
      date: "Mar 2025",
      rating: 5,
      text: "Getting married with royal gardens as our backdrop at Amber Crown Retreat was surreal. The romance and luxury is unmatched anywhere.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
      { id: "royal-orchid-estate", name: "Royal Orchid Estate", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "moonstone-fort-resort", name: "Moonstone Fort Resort", city: "Rajasthan", rating: 4.8, reviews: 81, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "golden-tulip-lawn",
    name: "Golden Tulip Lawns",
    location: "Pune, Maharashtra",
    city: "Pune",
    rating: 4.4,
    reviews: 201,
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 15,
    tags: ["Outdoor", "Lawn"],
    capacity: "200 – 800 Guests",
    spaceType: "Outdoor Lawn",
    startingPrice: "₹3,00,000",
    verified: false,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Parking" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "auto_awesome", label: "Fireworks" },
      { icon: "chair", label: "Seating" },
      { icon: "light_mode", label: "Lighting" },
    ],
    packages: [
      { name: "Garden Soiree", price: "₹3,00,000", guests: "200 Guests", tag: "Most Loved" },
      { name: "Lawn Celebration", price: "₹5,00,000", guests: "500 Guests" },
      { name: "Grand Lawn Affair", price: "₹9,00,000", guests: "800 Guests" },
    ],
    review: {
      couple: "Pooja & Amit",
      date: "Apr 2025",
      rating: 4,
      text: "Golden Tulip Lawns gave us a beautiful outdoor wedding at a great price. The green sprawling lawns and fairy lights created a romantic atmosphere.",
      avatar: "https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "golden-crest-manor", name: "Golden Crest Manor", city: "Chennai", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
      { id: "celestia-grand-palace", name: "Celestia Grand Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
      { id: "sapphire-lake-palace", name: "Sapphire Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "shifa-convention-centre",
    name: "Shifa Convention Centre",
    location: "Taliparamba, Kannur, Kerala",
    city: "Kannur",
    rating: 5.0,
    reviews: 188,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 24,
    tags: ["Luxury", "Outdoor", "Indoor"],
    capacity: "500 – 2500 Guests",
    spaceType: "Indoor & Lawn",
    startingPrice: "₹3,50,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "ac_unit", label: "AC Halls" },
    ],
    packages: [
      { name: "Royal Grand Banquet", price: "₹3,50,000", guests: "800 Guests", tag: "Most Loved" },
      { name: "Lawn & Convention Package", price: "₹5,00,000", guests: "1500 Guests" },
    ],
    review: {
      couple: "Rahul & Ananya",
      date: "May 2025",
      rating: 5,
      text: "The backwater lawn view for our reception was magical! World class hospitality by Shifa team.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "palace-estate", name: "The Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "shifa-covention-centre",
    name: "Shifa Convention Centre",
    location: "Taliparamba, Kannur, Kerala",
    city: "Kannur",
    rating: 5.0,
    reviews: 188,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
    ],
    totalPhotos: 24,
    tags: ["Luxury", "Outdoor", "Indoor"],
    capacity: "500 – 2500 Guests",
    spaceType: "Indoor & Lawn",
    startingPrice: "₹3,50,000",
    verified: true,
    amenities: [
      { icon: "restaurant", label: "Catering" },
      { icon: "celebration", label: "Decor" },
      { icon: "local_parking", label: "Valet Parking" },
      { icon: "bed", label: "Bridal Suite" },
      { icon: "music_note", label: "DJ & Sound" },
      { icon: "ac_unit", label: "AC Halls" },
    ],
    packages: [
      { name: "Royal Grand Banquet", price: "₹3,50,000", guests: "800 Guests", tag: "Most Loved" },
      { name: "Lawn & Convention Package", price: "₹5,00,000", guests: "1500 Guests" },
    ],
    review: {
      couple: "Rahul & Ananya",
      date: "May 2025",
      rating: 5,
      text: "The backwater lawn view for our reception was magical! World class hospitality by Shifa team.",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "palace-estate", name: "The Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=400&q=80" },
    ],
  },
];

export function transformRegisteredToVenueDetail(id: string, data: any): VenueDetail {
  const rawDefaultImages = [
    data.image,
    data.coverImage,
    data.heroImage,
    ...(Array.isArray(data.images) ? data.images : []),
    ...(Array.isArray(data.galleryImages) ? data.galleryImages : []),
  ].filter((url): url is string => Boolean(url && typeof url === "string" && (url.startsWith("http") || url.startsWith("/") || url.startsWith("data:"))));

  const fallbackImages = [
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
  ];

  const finalImages = rawDefaultImages.length > 0 ? rawDefaultImages : fallbackImages;
  const otherVenues = venues.filter((v) => v.id !== id).slice(0, 4);

  const formattedFallbackName = id && !/^\d+$/.test(id)
    ? id.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())
    : "Grand Wedding Venue";

  const resolvedName = data.name && !/^\d+$/.test(data.name)
    ? data.name
    : data.boutique_name && !/^\d+$/.test(data.boutique_name)
    ? data.boutique_name
    : data.businessName && !/^\d+$/.test(data.businessName)
    ? data.businessName
    : formattedFallbackName;

  return {
    id: id,
    name: resolvedName,
    location: data.location || `${data.city || "Kochi"}, ${data.district || data.state || "Ernakulam"}`,
    city: data.city || "Kochi",
    rating: data.rating || 4.9,
    reviews: data.reviewsCount || data.reviews || 15,
    image: finalImages[0],
    images: finalImages,
    totalPhotos: data.totalPhotos || finalImages.length,
    tags: data.tags || ["Luxury", "Wedding Venue", data.spaceType || "Outdoor & Indoor"],
    capacity: data.capacity || (data.minGuests ? `${data.minGuests} – ${data.maxGuests || 2000} Guests` : "250 – 2000 Guests"),
    spaceType: data.spaceType || data.venueType || "Outdoor & Indoor",
    startingPrice: data.startingPrice ? (String(data.startingPrice).startsWith("₹") ? data.startingPrice : `₹${data.startingPrice}`) : "₹50,000 / day",
    verified: data.verified ?? true,
    amenities: data.amenities && Array.isArray(data.amenities) && data.amenities.length > 0
      ? data.amenities.map((a: any) => typeof a === "string" ? { icon: "check_circle", label: a } : { icon: a.icon || "check_circle", label: a.label || a.name })
      : [
          { icon: "restaurant", label: "Catering" },
          { icon: "celebration", label: "Decor" },
          { icon: "local_parking", label: "Valet Parking" },
          { icon: "bed", label: "Bridal Suite" },
          { icon: "music_note", label: "DJ & Sound" },
          { icon: "liquor", label: "Alcohol" },
          { icon: "auto_awesome", label: "Fireworks" },
        ],
    packages: data.packages && Array.isArray(data.packages) && data.packages.length > 0
      ? data.packages.map((pkg: any) => ({
          name: pkg.name || "Special Wedding Package",
          price: pkg.price ? (String(pkg.price).startsWith("₹") ? pkg.price : `₹${pkg.price}`) : "₹50,000 / day",
          guests: pkg.guests || pkg.description || "500 Guests",
          tag: pkg.tag || pkg.isPopular ? "Most Loved" : undefined,
        }))
      : [
          { name: "Silver Wedding Package", price: data.startingPrice || "₹50,000 / day", guests: "500 Guests", tag: "Most Loved" },
          { name: "Royal Gold Package", price: "₹1,50,000 / day", guests: "1000 Guests" },
        ],
    review: data.review || (data.reviewsList && data.reviewsList[0] ? {
      couple: data.reviewsList[0].author,
      date: data.reviewsList[0].date || "Recent",
      rating: data.reviewsList[0].rating || 5,
      text: data.reviewsList[0].text,
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
    } : {
      couple: "Fathima & Sameer",
      date: "Recent",
      rating: 5,
      text: "Hosting our wedding here was a dream come true! Exceptional management, beautiful ambiance, and impeccable service throughout.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    }),
    similar: otherVenues.map((v) => ({
      id: v.id,
      name: v.name,
      city: v.city,
      rating: v.rating,
      reviews: v.reviews,
      image: v.image,
    })),
  };
}

export function getDynamicVenues(): VenueDetail[] {
  if (typeof window === "undefined") return [];
  const results: VenueDetail[] = [];
  const seenIds = new Set<string>();
  const seenNames = new Set<string>();

  try {
    // 1. Scan for published venue CMS entries in localStorage (highest priority)
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith("cloche_venue_cms_") && !key.startsWith("cloche_venue_cms_versions_")) {
        const vId = key.replace("cloche_venue_cms_", "");
        if (vId && vId !== "data_v1") {
          const cmsRaw = localStorage.getItem(key);
          if (cmsRaw) {
            try {
              const cmsData = JSON.parse(cmsRaw);
              if (cmsData && cmsData.businessProfile && cmsData.businessProfile.businessName) {
                const venueDetail = convertCmsToVenueDetail(cmsData);
                const normName = venueDetail.name.toLowerCase().trim();
                const normId = venueDetail.id;
                const normVendorId = (cmsData.vendorId || "").toLowerCase();

                if (!seenNames.has(normName) && !seenIds.has(normId) && (!normVendorId || !seenIds.has(normVendorId))) {
                  seenNames.add(normName);
                  seenIds.add(normId);
                  if (normVendorId) seenIds.add(normVendorId);
                  results.push(venueDetail);
                }
              }
            } catch (e) {}
          }
        }
      }
    }

    // 2. Read registered venue vendor submissions
    const raw = localStorage.getItem("cloche_registered_venues");
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) {
        list.forEach((item: any) => {
          const vId = item.id || item.slug || item.boutique_name?.toLowerCase().replace(/[^a-z0-9]+/g, "-");
          const vName = (item.name || item.boutique_name || item.businessName || "").toLowerCase().trim();

          if (vId && vName && !seenIds.has(vId) && !seenNames.has(vName)) {
            seenIds.add(vId);
            seenNames.add(vName);
            results.push(transformRegisteredToVenueDetail(vId, item));
          }
        });
      }
    }
  } catch (e) {
    console.error("Error reading registered venues", e);
  }
  return results;
}

export function getAllVenues(): VenueDetail[] {
  const dynamic = getDynamicVenues();
  const dynamicIds = new Set(dynamic.map((d) => d.id));
  const dynamicNames = new Set(dynamic.map((d) => d.name.toLowerCase().trim()));
  const filteredStatic = venues.filter((v) => !dynamicIds.has(v.id) && !dynamicNames.has(v.name.toLowerCase().trim()));
  return [...dynamic, ...filteredStatic];
}

export function getVenueById(id: string): VenueDetail | undefined {
  if (!id) return undefined;

  // 1. Check published CMS data in localStorage for this specific venue ID / vendor ID
  if (typeof window !== "undefined") {
    try {
      // Check specific venue CMS key by ID
      const cmsRaw = localStorage.getItem(`cloche_venue_cms_${id}`);
      if (cmsRaw) {
        const cmsData = JSON.parse(cmsRaw);
        if (cmsData && cmsData.businessProfile) {
          return convertCmsToVenueDetail(cmsData);
        }
      }

      // Check registered venues list in localStorage
      const regRaw = localStorage.getItem("cloche_registered_venues");
      if (regRaw) {
        const regList = JSON.parse(regRaw);
        if (Array.isArray(regList)) {
          const match = regList.find(
            (v: any) => v.id === id || v.vendorId === id || v.slug === id
          );
          if (match) {
            return match.businessProfile ? convertCmsToVenueDetail(match) : match;
          }
        }
      }

      // Check global CMS key
      const globalCmsRaw = localStorage.getItem("cloche_venue_cms_data_v1");
      if (globalCmsRaw) {
        const globalCms = JSON.parse(globalCmsRaw);
        if (
          globalCms &&
          (globalCms.id === id ||
            globalCms.vendorId === id ||
            ((id.includes("solitaire") || id.includes("hyatt")) && (globalCms.vendorId === "v-solitaire" || globalCms.vendorId === "v-hyatt")))
        ) {
          return convertCmsToVenueDetail(globalCms);
        }
      }

      // Check single registered venue record
      const singleRaw = localStorage.getItem(`cloche_venue_${id}`);
      if (singleRaw) {
        return transformRegisteredToVenueDetail(id, JSON.parse(singleRaw));
      }
    } catch (e) {}
  }

  // 2. Predefined static list lookup (flexible ID & slug matching)
  const normId = id.toLowerCase().trim();
  const found = venues.find(
    (v) =>
      v.id.toLowerCase() === normId ||
      v.id.toLowerCase() === normId.replace(/^the-/, "") ||
      normId.includes(v.id.toLowerCase()) ||
      v.id.toLowerCase().includes(normId)
  );
  if (found) return found;

  // 3. Dynamic list lookup
  if (typeof window !== "undefined") {
    const dynamicList = getDynamicVenues();
    const dynamicFound = dynamicList.find((v) => v.id === id || (v as any).vendorId === id);
    if (dynamicFound) return dynamicFound;
  }

  // 4. Server-Side & Client Fallback: Generate valid venue payload so SSR never 404s before client hydration
  const formattedName = id
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return transformRegisteredToVenueDetail(id, {
    id,
    name: formattedName,
    businessName: formattedName,
  });
}
