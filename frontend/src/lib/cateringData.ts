export type CateringVendor = {
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
  eventsCartered: number;
  menuHighlights: { name: string; image: string }[];
  prices: { category: string; price: string; isPopular?: boolean }[];
  services: { name: string; icon: string }[];
  userReviews: { author: string; date: string; rating: number; text: string }[];
};

export const cateringVendors: CateringVendor[] = [
  {
    id: "royal-bites-catering",
    name: "Royal Bites Catering",
    subtitle: "Exquisite flavors, impeccable service and unforgettable experiences.",
    rating: 4.8,
    reviews: 128,
    location: "Bandra, Mumbai",
    image:
      "https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Royal Bites Catering is known for creating memorable culinary experiences with a perfect blend of taste, presentation and hospitality. From intimate gatherings to grand celebrations, we bring your vision to life.",
    yearsInBusiness: 10,
    eventsCartered: 500,
    menuHighlights: [
      {
        name: "North Indian Cuisine",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "South Indian Delicacies",
        image:
          "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Live Counters",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Desserts & Sweets",
        image:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹20,000" },
      { category: "Premium", price: "₹50,000", isPopular: true },
      { category: "Luxury", price: "₹1,00,000" },
    ],
    services: [
      { name: "Customized Menu", icon: "restaurant_menu" },
      { name: "Hygienic Preparation", icon: "clean_hands" },
      { name: "Professional Staff", icon: "people" },
      { name: "Live Counters", icon: "local_fire_department" },
      { name: "Timely Service", icon: "schedule" },
    ],
    userReviews: [
      {
        author: "Neha Sharma",
        date: "1 month ago",
        rating: 5.0,
        text: "The food was absolutely amazing! Every dish was flavorful and beautifully presented. The team ensured everything was perfect. Highly recommended!",
      },
    ],
  },
  {
    id: "saffron-feast",
    name: "Saffron Feast",
    subtitle: "From royal kitchens to modern banquets, every bite is a story.",
    rating: 4.7,
    reviews: 96,
    location: "Defence Colony, Delhi",
    image:
      "https://images.unsplash.com/photo-1467003909585-2f8a72700288?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Saffron Feast specializes in authentic North and South Indian cuisine with a modern twist. Our culinary team brings together traditional recipes and contemporary plating to create an unparalleled dining experience.",
    yearsInBusiness: 8,
    eventsCartered: 350,
    menuHighlights: [
      {
        name: "Mughlai Cuisine",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Continental Spread",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Dessert Station",
        image:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹18,000" },
      { category: "Premium", price: "₹55,000", isPopular: true },
      { category: "Luxury", price: "₹90,000" },
    ],
    services: [
      { name: "Custom Menu", icon: "restaurant_menu" },
      { name: "Trained Staff", icon: "people" },
      { name: "Live Counters", icon: "local_fire_department" },
      { name: "Halal Options", icon: "check_circle" },
    ],
    userReviews: [],
  },
  {
    id: "taste-of-tradition",
    name: "Taste of Tradition",
    subtitle: "Authentic flavors that bring generations together.",
    rating: 4.9,
    reviews: 112,
    location: "Koramangala, Bangalore",
    image:
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "Taste of Tradition is a premium catering service renowned for its authentic regional Indian cuisines. We believe food is the heart of every celebration and craft menus that reflect the diversity and richness of Indian culinary heritage.",
    yearsInBusiness: 12,
    eventsCartered: 700,
    menuHighlights: [
      {
        name: "South Indian Feast",
        image:
          "https://images.unsplash.com/photo-1630383249896-424e482df921?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Rajasthani Dal Bati",
        image:
          "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Bengali Sweets",
        image:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹22,000" },
      { category: "Premium", price: "₹70,000", isPopular: true },
      { category: "Luxury", price: "₹1,20,000" },
    ],
    services: [
      { name: "Regional Menus", icon: "restaurant_menu" },
      { name: "Hygienic Kitchens", icon: "clean_hands" },
      { name: "Expert Chefs", icon: "people" },
      { name: "Timely Delivery", icon: "schedule" },
    ],
    userReviews: [
      {
        author: "Priya Nair",
        date: "2 months ago",
        rating: 5.0,
        text: "The food was a journey through India's flavors! Every dish was authentic and made with love. Our guests couldn't stop talking about it.",
      },
    ],
  },
  {
    id: "the-gourmet-table",
    name: "The Gourmet Table",
    subtitle: "Where culinary art meets wedding grandeur.",
    rating: 4.6,
    reviews: 88,
    location: "Jubilee Hills, Hyderabad",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
    isVerified: true,
    about:
      "The Gourmet Table brings world-class catering to Indian weddings. From Japanese sushi bars to Italian pasta stations alongside traditional Indian spreads, we create curated multi-cuisine experiences that wow every guest.",
    yearsInBusiness: 6,
    eventsCartered: 280,
    menuHighlights: [
      {
        name: "Fusion Counters",
        image:
          "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Pan-Asian Stall",
        image:
          "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
      },
      {
        name: "Dessert Bar",
        image:
          "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
      },
    ],
    prices: [
      { category: "Budget", price: "₹25,000" },
      { category: "Premium", price: "₹60,000", isPopular: true },
      { category: "Luxury", price: "₹1,40,000" },
    ],
    services: [
      { name: "Multi-Cuisine Menu", icon: "restaurant_menu" },
      { name: "Premium Staff", icon: "people" },
      { name: "Live Stations", icon: "local_fire_department" },
      { name: "Customized Setup", icon: "settings" },
      { name: "Timely Service", icon: "schedule" },
    ],
    userReviews: [],
  },
];
