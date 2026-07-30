export type BridalBoutiqueVendor = {
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
  bridesDressed: number;
  collections: { name: string; image: string }[];
  prices: { category: string; price: string; isPopular?: boolean }[];
  amenities: { name: string; icon: string }[];
  userReviews: { author: string; date: string; rating: number; text: string }[];
};

export const bridalBoutiqueVendors: BridalBoutiqueVendor[] = [
  {
    id: "kalki-couture",
    name: "Kalki Couture",
    subtitle: "Luxury couture lehengas crafted to perfection.",
    rating: 4.8,
    reviews: 120,
    location: "Bandra, Mumbai",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Kalki Couture is a luxury bridal wear label known for its exquisite craftsmanship, intricate detailing and timeless designs. Every piece is a blend of heritage and modern elegance, crafted for your most memorable moments.",
    yearsInBusiness: 12,
    bridesDressed: 500,
    collections: [
      { name: "Signature Lehengas", image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80" },
      { name: "Pastel Edit", image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=600&q=80" },
      { name: "Red Bridal Collection", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
    ],
    prices: [
      { category: "Lehengas", price: "₹80,000" },
      { category: "Bridal Couture", price: "₹1,50,000", isPopular: true },
      { category: "Sarees", price: "₹45,000" },
    ],
    amenities: [
      { name: "In-house Tailoring", icon: "content_cut" },
      { name: "Private Trial Room", icon: "checkroom" },
      { name: "Styling Assistance", icon: "auto_awesome" },
      { name: "Outstation Brides", icon: "flight_takeoff" },
      { name: "Customization Available", icon: "design_services" },
    ],
    userReviews: [
      {
        author: "Aisha Khan",
        date: "2 months ago",
        rating: 5.0,
        text: "The experience was surreal! The team understood my vision and made me feel so special. The lehenga was everything I dreamed of and more.",
      },
    ],
  },
  {
    id: "papa-dont-preach",
    name: "Papa Don't Preach",
    subtitle: "Contemporary silhouettes with a touch of tradition.",
    rating: 4.7,
    reviews: 96,
    location: "Defence Colony, Delhi",
    image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Vibrant high-fashion Indian couture featuring signature embellishments, metallics, and whimsical pastel embroidery.",
    yearsInBusiness: 9,
    bridesDressed: 380,
    collections: [
      { name: "Pop Pastel Edit", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
    ],
    prices: [
      { category: "Lehengas", price: "₹1,20,000", isPopular: true },
    ],
    amenities: [
      { name: "Styling Assistance", icon: "auto_awesome" },
      { name: "Customization Available", icon: "design_services" },
    ],
    userReviews: [],
  },
  {
    id: "sabyasachi-kolkata",
    name: "Sabyasachi Kolkata",
    subtitle: "Iconic designs for the extraordinary you.",
    rating: 4.9,
    reviews: 212,
    location: "Alipore, Kolkata",
    image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Heritage Indian bridal couture handcrafted with antique zardosi, velvet borders, and royal regal elegance.",
    yearsInBusiness: 20,
    bridesDressed: 1500,
    collections: [
      { name: "Heritage Bridal", image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80" },
    ],
    prices: [
      { category: "Royal Lehengas", price: "₹3,50,000", isPopular: true },
    ],
    amenities: [
      { name: "Private Trial Room", icon: "checkroom" },
      { name: "Outstation Brides", icon: "flight_takeoff" },
    ],
    userReviews: [],
  },
  {
    id: "anita-dongre",
    name: "Anita Dongre",
    subtitle: "Timeless craftsmanship in every thread.",
    rating: 4.8,
    reviews: 88,
    location: "Saket, Delhi",
    image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Sustainable luxury wedding ensembles infused with Rajasthan's handcrafted gotapatti tradition.",
    yearsInBusiness: 15,
    bridesDressed: 900,
    collections: [
      { name: "Gotapatti Edits", image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80" },
    ],
    prices: [
      { category: "Silk Lehengas", price: "₹1,80,000", isPopular: true },
    ],
    amenities: [
      { name: "In-house Tailoring", icon: "content_cut" },
    ],
    userReviews: [],
  },
  {
    id: "posh-wedding-rental",
    name: "Posh Wedding Rental",
    subtitle: "Exclusive rental bridal lehengas, sherwanis, tuxedos & couture.",
    rating: 4.8,
    reviews: 115,
    location: "Indiranagar, Bangalore",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about: "Posh Wedding Rental offers curated luxury wedding ensembles on rent. From designer bridal lehengas to premium groom sherwanis, tuxedos, and suits, enjoy royal wedding attire for your special day.",
    yearsInBusiness: 6,
    bridesDressed: 450,
    collections: [
      { name: "Bridal Lehengas", image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=600&q=80" },
      { name: "Designer Sarees & Gowns", image: "https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80" },
      { name: "Royal Sherwanis", image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80" },
      { name: "Tuxedos & Suits", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80" },
      { name: "Indo-Western & Bandhgalas", image: "https://images.unsplash.com/photo-1593030761757-71fae45fa0e7?auto=format&fit=crop&w=600&q=80" },
    ],
    prices: [
      { category: "Bridal Lehengas (Rental)", price: "₹15,000 / day" },
      { category: "Groom Sherwanis (Rental)", price: "₹12,000 / day", isPopular: true },
      { category: "Tuxedos & Suits (Rental)", price: "₹8,000 / day" },
    ],
    amenities: [
      { name: "In-house Alterations", icon: "content_cut" },
      { name: "Trial Room & Fitting", icon: "checkroom" },
      { name: "Dry Cleaning Included", icon: "dry_cleaning" },
      { name: "Styling Assistance", icon: "auto_awesome" },
    ],
    userReviews: [
      {
        author: "Kavya & Rahul",
        date: "2 weeks ago",
        rating: 5.0,
        text: "Rented both the bridal lehenga and groom sherwani from Posh Wedding Rental! Outfits looked brand new and saved us a fortune.",
      },
    ],
  },
];

export type InvitationVendor = {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  ordersCount: number;
  location: string;
  price: string;
  image: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  tags: string[];
  about: string;
  portfolio: string[];
  packages: { name: string; price: string; description: string; features: string[]; isPopular?: boolean }[];
  userReviews: { author: string; date: string; text: string; isVerified?: boolean }[];
};

export const invitationVendors: InvitationVendor[] = [
  {
    id: "paper-rhapsody",
    name: "Paper Rhapsody",
    rating: 4.9,
    reviews: 128,
    ordersCount: 248,
    location: "Mumbai, Maharashtra",
    price: "₹45 / card",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    isFeatured: true,
    isVerified: true,
    tags: ["Modern", "Luxury", "Floral"],
    about: "We craft luxury invitations that reflect your story with exquisite design, fine materials, and impeccable attention to detail.",
    portfolio: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Essentials",
        price: "₹35 / card",
        description: "Beautiful designs with quality printing.",
        features: ["1-2 Design Concepts", "Standard Paper", "Digital Proof"],
      },
      {
        name: "Signature",
        price: "₹55 / card",
        description: "Premium materials with detailed customization.",
        features: ["2-3 Design Concepts", "Premium Paper", "Foil / Embossing", "Custom Inserts"],
        isPopular: true,
      },
      {
        name: "Luxury",
        price: "₹85 / card",
        description: "Bespoke creations for a truly grand impression.",
        features: ["Unlimited Concepts", "Imported Paper", "Foil / Embossing", "Custom Embellishments", "Hand Assembly"],
      },
    ],
    userReviews: [
      {
        author: "Ananya & Rohan",
        date: "Mar 12, 2024",
        isVerified: true,
        text: "The invitations were beyond stunning! The team was incredibly patient and brought our vision to life.",
      },
    ],
  },
  {
    id: "studio-alankaar",
    name: "Studio Alankaar",
    rating: 4.8,
    reviews: 96,
    ordersCount: 190,
    location: "Delhi, NCR",
    price: "₹35 / card",
    image: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    tags: ["Traditional", "Classic", "Royal"],
    about: "Royal laser-cut invitations, velvet box suites, and gilded traditional wedding invites.",
    portfolio: [
      "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Royal Suite",
        price: "₹40 / card",
        description: "Classic laser-cut cards",
        features: ["Laser-cut folder", "2 inserts"],
        isPopular: true,
      },
    ],
    userReviews: [],
  },
  {
    id: "the-invite-co",
    name: "The Invite Co.",
    rating: 4.7,
    reviews: 74,
    ordersCount: 140,
    location: "Bangalore, Karnataka",
    price: "₹50 / card",
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    tags: ["Minimal", "Elegant", "Modern"],
    about: "Sleek typography-focused wedding stationery, wax seals, and eco-conscious handmade paper suites.",
    portfolio: [
      "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Modern Minimal",
        price: "₹50 / card",
        description: "Handmade cotton paper suite",
        features: ["Wax seal", "Vellum wrap"],
        isPopular: true,
      },
    ],
    userReviews: [],
  },
  {
    id: "ink-and-impressions",
    name: "Ink & Impressions",
    rating: 4.9,
    reviews: 112,
    ordersCount: 210,
    location: "Pune, Maharashtra",
    price: "₹30 / card",
    image: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    tags: ["Watercolor", "Floral", "Whimsical"],
    about: "Custom hand-painted watercolor floral maps, itinerary cards, and luggage tags.",
    portfolio: [
      "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Botanical Edit",
        price: "₹30 / card",
        description: "Watercolor floral suite",
        features: ["Illustrated venue map"],
        isPopular: true,
      },
    ],
    userReviews: [],
  },
];
