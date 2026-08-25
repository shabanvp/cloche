export type GroomWearVendor = {
  id: string;
  name: string;
  subtitle: string;
  rating: number;
  reviews: number;
  location: string;
  image: string;
  isVerified?: boolean;
  about: string;
  yearsInBusiness: number;
  groomsStyled: number;
  collections: { name: string; image: string }[];
  prices: { category: string; price: string; isPopular?: boolean }[];
  amenities: { name: string; icon: string }[];
  tags?: string[];
  userReviews: { author: string; date: string; rating: number; text: string }[];
  workingHours?: any;
  working_hours?: string;
  businessHours?: string;
};

export const groomWearVendors: GroomWearVendor[] = [
  {
    id: "aurora-menswear-couture",
    name: "Aurora Menswear Couture",
    subtitle: "Luxury groom wear crafted for timeless moments.",
    rating: 4.8,
    reviews: 128,
    location: "Bandra, Mumbai",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Aurora Menswear Couture offers exquisite groom wear collection that blends heritage with modern luxury. Each piece is crafted with fine fabrics, intricate detailing and unmatched craftsmanship.",
    yearsInBusiness: 12,
    groomsStyled: 1000,
    collections: [
      {
        name: "Sherwanis",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Achkans",
        image:
          "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Indo Western",
        image:
          "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Tux",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹20,000" },
      { category: "Premium", price: "₹50,000", isPopular: true },
      { category: "Luxury", price: "₹1,00,000" },
    ],
    amenities: [
      { name: "In-house Tailoring", icon: "content_cut" },
      { name: "Private Trial Room", icon: "checkroom" },
      { name: "Styling Assistance", icon: "auto_awesome" },
      { name: "Personalized Consultation", icon: "person" },
      { name: "Outstation Service", icon: "flight_takeoff" },
    ],
    userReviews: [
      {
        author: "Arjun Mehta",
        date: "3 weeks ago",
        rating: 5.0,
        text: "The sherwani was beyond perfection! The team helped me choose the best outfit for my big day. Excellent service and quality.",
      },
    ],
  },
  {
    id: "royal-ivory-sherwani",
    name: "Royal Ivory Sherwani",
    subtitle: "Timeless elegance for the modern groom.",
    rating: 4.8,
    reviews: 126,
    location: "Connaught Place, Delhi",
    image:
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Royal Ivory Sherwani is a premier groom wear atelier, specializing in bespoke sherwanis and bandhgalas. Each garment is hand-embroidered by master artisans with gold and silver thread work.",
    yearsInBusiness: 15,
    groomsStyled: 1200,
    collections: [
      {
        name: "Sherwanis",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Bandhgalas",
        image:
          "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Jodhpuris",
        image:
          "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹25,000" },
      { category: "Premium", price: "₹65,000", isPopular: true },
      { category: "Luxury", price: "₹1,50,000" },
    ],
    amenities: [
      { name: "In-house Tailoring", icon: "content_cut" },
      { name: "Private Fitting", icon: "checkroom" },
      { name: "Styling Assistance", icon: "auto_awesome" },
      { name: "Home Delivery", icon: "local_shipping" },
    ],
    userReviews: [
      {
        author: "Rohan Kapoor",
        date: "1 month ago",
        rating: 5.0,
        text: "Absolutely stunning work! The craftsmanship on my sherwani was unparalleled. Got so many compliments on my wedding day.",
      },
    ],
  },
  {
    id: "midnight-blue-achkan",
    name: "Midnight Blue Achkan",
    subtitle: "Contemporary styles meeting royal heritage.",
    rating: 4.7,
    reviews: 98,
    location: "Koregaon Park, Pune",
    image:
      "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Midnight Blue Achkan brings a bold, contemporary touch to groom wear. Known for deep tonal palettes, sharp cuts, and rich Mughal-inspired embroidery that makes every groom stand out.",
    yearsInBusiness: 8,
    groomsStyled: 650,
    collections: [
      {
        name: "Achkans",
        image:
          "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Sherwanis",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹18,000" },
      { category: "Premium", price: "₹58,000", isPopular: true },
      { category: "Luxury", price: "₹1,20,000" },
    ],
    amenities: [
      { name: "Custom Fitting", icon: "content_cut" },
      { name: "Styling Help", icon: "auto_awesome" },
      { name: "Quick Alterations", icon: "build" },
    ],
    userReviews: [],
  },
  {
    id: "pastel-green-sherwani",
    name: "Pastel Green Sherwani",
    subtitle: "Soft pastels for the elegant modern groom.",
    rating: 4.9,
    reviews: 112,
    location: "Banjara Hills, Hyderabad",
    image:
      "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Pastel Green Sherwani is celebrated for its exquisite pastel palette and lightweight fabrics. Perfect for daytime and sangeet ceremonies, each design balances tradition with contemporary sophistication.",
    yearsInBusiness: 10,
    groomsStyled: 800,
    collections: [
      {
        name: "Pastel Sherwanis",
        image:
          "https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Indo Western",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹22,000" },
      { category: "Premium", price: "₹62,000", isPopular: true },
      { category: "Luxury", price: "₹1,30,000" },
    ],
    amenities: [
      { name: "In-house Tailoring", icon: "content_cut" },
      { name: "Personalized Styling", icon: "person" },
      { name: "Free Alterations", icon: "build" },
      { name: "Outstation Service", icon: "flight_takeoff" },
    ],
    userReviews: [
      {
        author: "Vikram Singh",
        date: "2 months ago",
        rating: 5.0,
        text: "The pastel sherwani was a showstopper! Everyone at the wedding asked where I got it from. Highly recommended.",
      },
    ],
  },
  {
    id: "maroon-velvet-sherwani",
    name: "Maroon Velvet Sherwani",
    subtitle: "Rich velvets for the regal groom.",
    rating: 4.8,
    reviews: 105,
    location: "Juhu, Mumbai",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Maroon Velvet Sherwani specializes in luxurious velvet groom wear with rich embroidery. Perfect for winter weddings and evening ceremonies, their collection exudes royalty and grandeur.",
    yearsInBusiness: 7,
    groomsStyled: 550,
    collections: [
      {
        name: "Velvet Sherwanis",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Bandhgalas",
        image:
          "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹30,000" },
      { category: "Premium", price: "₹70,000", isPopular: true },
      { category: "Luxury", price: "₹1,80,000" },
    ],
    amenities: [
      { name: "Bespoke Tailoring", icon: "content_cut" },
      { name: "Private Consultation", icon: "person" },
      { name: "Accessory Pairing", icon: "auto_awesome" },
    ],
    userReviews: [],
  },
  {
    id: "posh-wedding-rental",
    name: "Posh Wedding Rental",
    subtitle: "Exclusive rental sherwanis, tuxedos, suits & groom wear.",
    rating: 4.8,
    reviews: 115,
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Posh Wedding Rental offers curated luxury wedding ensembles on rent. From designer bridal lehengas to premium groom sherwanis, tuxedos, and suits, enjoy royal wedding attire for your special day.",
    yearsInBusiness: 6,
    groomsStyled: 450,
    collections: [
      {
        name: "Royal Sherwanis",
        image:
          "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Tuxedos & Suits",
        image:
          "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Indo-Western & Bandhgalas",
        image:
          "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Sherwanis (Rental)", price: "₹12,000 / day", isPopular: true },
      { category: "Tuxedos & Suits (Rental)", price: "₹8,000 / day" },
      { category: "Indo-Western (Rental)", price: "₹10,000 / day" },
    ],
    amenities: [
      { name: "In-house Alterations", icon: "content_cut" },
      { name: "Trial Room & Fitting", icon: "checkroom" },
      { name: "Dry Cleaning Included", icon: "dry_cleaning" },
      { name: "Styling Assistance", icon: "auto_awesome" },
    ],
    userReviews: [
      {
        author: "Rahul Sharma",
        date: "2 weeks ago",
        rating: 5.0,
        text: "Rented my wedding sherwani and tuxedo from Posh Wedding Rental! The fit was perfect and quality top-notch.",
      },
    ],
  },
];
