export type MehendiVendor = {
  id: string;
  name: string;
  subtitle: string;
  category: string;
  rating: number;
  reviews: number;
  location: string;
  price: string;
  image: string;
  isVerified?: boolean;
  chips: string[];
  about: string;
  portfolio: string[];
  packages: {
    name: string;
    price: string;
    description: string;
    features: string[];
    image?: string;
  }[];
  userReviews: {
    author: string;
    date: string;
    rating: number;
    text: string;
    avatar: string;
  }[];
  faqs: { question: string; answer: string }[];
};

export const mehendiVendors: MehendiVendor[] = [
  {
    id: "henna-by-rida",
    name: "Henna By Rida",
    subtitle: "Luxury Mehendi Artist",
    category: "Bridal Mehendi Specialist",
    rating: 4.9,
    reviews: 128,
    location: "Mumbai, Maharashtra",
    price: "₹25,000",
    image: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    chips: ["Bridal Specialists", "Eco-friendly Henna", "10+ Years Exp."],
    about: "With 10+ years of experience, Rida specializes in intricate bridal mehendi designs that blend tradition with contemporary elegance. 100% natural henna used for a rich, long-lasting stain.",
    portfolio: [
      "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Signature Bridal",
        price: "₹25,000",
        description: "Full bridal mehendi (hands & feet)",
        features: ["Intricate designs with detailing", "Touch-up included", "Natural organic henna paste"],
        image: "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=400&q=80",
      },
      {
        name: "Royale Bridal & Family",
        price: "₹45,000",
        description: "Bridal + 5 family members",
        features: ["Custom figure portrait motifs", "Dedicated team of 3 artists", "Premium stain oil"],
        image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80",
      },
    ],
    userReviews: [
      {
        author: "Ananya Sharma",
        date: "2 weeks ago",
        rating: 5.0,
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
        text: "Rida is truly amazing! Her attention to detail and creativity made my bridal mehendi experience so special.",
      },
    ],
    faqs: [
      {
        question: "How long does the mehendi last?",
        answer: "With proper care and using our 100% natural organic henna paste, the stain reaches maximum dark tone in 48 hours and lasts 10 to 14 days.",
      },
      {
        question: "Do you travel outstation for weddings?",
        answer: "Yes, Rida and her team travel worldwide for destination weddings upon request.",
      },
    ],
  },
  {
    id: "mehendi-by-ayesha",
    name: "Mehendi By Ayesha",
    subtitle: "Traditional & Contemporary",
    category: "Arabic & Indo-Arabic Specialist",
    rating: 4.8,
    reviews: 96,
    location: "Delhi, India",
    price: "₹20,000",
    image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    chips: ["Bridal Specialists", "Quick Booking"],
    about: "Creating breathtaking traditional Indian motifs combined with sleek modern geometric figures.",
    portfolio: [
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1605001011156-cbf0b0f67a51?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Classic Bridal",
        price: "₹20,000",
        description: "Full elbow and leg bridal mehendi",
        features: ["Classic traditional motifs", "Natural henna"],
      },
    ],
    userReviews: [
      {
        author: "Pooja V.",
        date: "1 month ago",
        rating: 4.8,
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
        text: "The color came out so dark and beautiful! Everyone complimented my bridal hands.",
      },
    ],
    faqs: [
      {
        question: "How long does the application take?",
        answer: "Bridal mehendi application usually takes between 3.5 to 5 hours depending on detail intricacy.",
      },
    ],
  },
  {
    id: "shaheens-henna-art",
    name: "Shaheen's Henna Art",
    subtitle: "Custom Bridal Henna",
    category: "Traditional Artist",
    rating: 4.7,
    reviews: 72,
    location: "Bangalore, Karnataka",
    price: "₹18,000",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    chips: ["Bridal Mehendi", "Arabic & Indo-Arabic"],
    about: "Known for neat symmetry, delicate peacocks, and personalized couple storytelling portraits in henna.",
    portfolio: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    ],
    packages: [
      {
        name: "Elegant Henna",
        price: "₹18,000",
        description: "Hand and feet bridal set",
        features: ["Peacock & floral patterns"],
      },
    ],
    userReviews: [],
    faqs: [],
  },
];

export function getMehendiVendorById(id: string) {
  return mehendiVendors.find((vendor) => vendor.id === id) || mehendiVendors[0];
}
