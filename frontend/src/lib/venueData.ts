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
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "leela-palace", name: "Leela Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "umaid-bhawan", name: "Umaid Bhawan", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "six-senses-fort-barwara", name: "Fateh Garh", city: "Udaipur", rating: 4.6, reviews: 70, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "taj-lake-palace",
    name: "Taj Lake Palace",
    location: "Udaipur, Rajasthan",
    city: "Udaipur",
    rating: 4.9,
    reviews: 94,
    image:
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
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
      couple: "Ananya & Rohan",
      date: "Mar 2025",
      rating: 5,
      text: "Taj Lake Palace is pure magic. The floating palace setting made our wedding utterly ethereal. World-class service and unforgettable memories.",
      avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "palace-estate", name: "The Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "umaid-bhawan", name: "Umaid Bhawan", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "leela-palace", name: "Leela Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "six-senses-fort-barwara", name: "Six Senses", city: "Rajasthan", rating: 4.8, reviews: 81, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "leela-palace",
    name: "The Leela Palace",
    location: "New Delhi, India",
    city: "Delhi",
    rating: 4.7,
    reviews: 110,
    image:
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      { name: "Leela Extravaganza", price: "₹30,00,000", guests: "1000 Guests" },
    ],
    review: {
      couple: "Neha & Vikram",
      date: "Feb 2025",
      rating: 5,
      text: "The Leela Palace Delhi exceeded every expectation. The grand ballroom is absolutely stunning and the staff attention to detail is impeccable.",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "itc-grand-chola", name: "ITC Grand Chola", city: "Chennai", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
      { id: "oberoi-amarvilas", name: "Oberoi Amarvilas", city: "Agra", rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "six-senses-fort-barwara",
    name: "Six Senses Fort Barwara",
    location: "Sawai Madhopur, Rajasthan",
    city: "Rajasthan",
    rating: 4.8,
    reviews: 81,
    image:
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      text: "Six Senses Fort Barwara is unlike any venue we visited. The 14th-century fort backdrop, lush gardens and impeccable service created magic.",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "umaid-bhawan", name: "Umaid Bhawan", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "oberoi-amarvilas", name: "Oberoi Amarvilas", city: "Agra", rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "umaid-bhawan",
    name: "Umaid Bhawan Palace",
    location: "Jodhpur, Rajasthan",
    city: "Rajasthan",
    rating: 4.9,
    reviews: 62,
    image:
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      { name: "Umaid Extravaganza", price: "₹75,00,000", guests: "600 Guests" },
    ],
    review: {
      couple: "Sanya & Dev",
      date: "Jan 2025",
      rating: 5,
      text: "Umaid Bhawan Palace is simply breathtaking. Getting married here was a childhood dream come true. The grandeur and regal charm is unmatched.",
      avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "six-senses-fort-barwara", name: "Six Senses", city: "Rajasthan", rating: 4.8, reviews: 81, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "leela-palace", name: "Leela Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "itc-grand-chola",
    name: "ITC Grand Chola",
    location: "Chennai, Tamil Nadu",
    city: "Chennai",
    rating: 4.6,
    reviews: 156,
    image:
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      { name: "Chola Classic", price: "₹6,00,000", guests: "400 Guests", tag: "Most Loved" },
      { name: "Grand Celebration", price: "₹12,00,000", guests: "900 Guests" },
      { name: "Chola Extravaganza", price: "₹20,00,000", guests: "1500 Guests" },
    ],
    review: {
      couple: "Deepa & Rajan",
      date: "Jun 2025",
      rating: 5,
      text: "ITC Grand Chola is a landmark Chennai venue. The majestic interiors and seamless event management made our big day absolutely perfect.",
      avatar: "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "leela-palace", name: "Leela Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "oberoi-amarvilas", name: "Oberoi Amarvilas", city: "Agra", rating: 4.8, reviews: 73, image: "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=400&q=80" },
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "golden-tulip-lawn", name: "Golden Tulip", city: "Pune", rating: 4.4, reviews: 201, image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=400&q=80" },
    ],
  },
  {
    id: "oberoi-amarvilas",
    name: "The Oberoi Amarvilas",
    location: "Agra, Uttar Pradesh",
    city: "Agra",
    rating: 4.8,
    reviews: 73,
    image:
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1478436127897-769e1b3f0f36?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      { icon: "landscape", label: "Taj View" },
    ],
    packages: [
      { name: "Taj Romance", price: "₹18,00,000", guests: "150 Guests", tag: "Most Loved" },
      { name: "Amarvilas Celebration", price: "₹30,00,000", guests: "300 Guests" },
      { name: "Grand Agra Experience", price: "₹45,00,000", guests: "500 Guests" },
    ],
    review: {
      couple: "Meera & Rahul",
      date: "Mar 2025",
      rating: 5,
      text: "Getting married with the Taj Mahal as our backdrop at Oberoi Amarvilas was surreal. The romance and luxury is unmatched anywhere in the world.",
      avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=80&q=80",
    },
    similar: [
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
      { id: "umaid-bhawan", name: "Umaid Bhawan", city: "Jodhpur", rating: 4.9, reviews: 62, image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=400&q=80" },
      { id: "six-senses-fort-barwara", name: "Six Senses", city: "Rajasthan", rating: 4.8, reviews: 81, image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=400&q=80" },
      { id: "leela-palace", name: "Leela Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
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
      "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=800&q=80",
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
      { id: "itc-grand-chola", name: "ITC Grand Chola", city: "Chennai", rating: 4.6, reviews: 156, image: "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=400&q=80" },
      { id: "leela-palace", name: "Leela Palace", city: "Delhi", rating: 4.7, reviews: 110, image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=400&q=80" },
      { id: "palace-estate", name: "Palace Estate", city: "Udaipur", rating: 4.8, reviews: 138, image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=400&q=80" },
      { id: "taj-lake-palace", name: "Taj Lake Palace", city: "Udaipur", rating: 4.9, reviews: 94, image: "https://images.unsplash.com/photo-1570544820323-66a7e58ce1d8?auto=format&fit=crop&w=400&q=80" },
    ],
  },
];

export function getVenueById(id: string): VenueDetail | undefined {
  return venues.find((v) => v.id === id);
}
