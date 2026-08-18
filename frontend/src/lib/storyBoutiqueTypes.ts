"use client";

export type BoutiqueCategoryKey = "brides-story" | "grooms-story" | "wedding-story";

export type TargetAudience = "bride" | "groom" | "both";

export type AvailabilityType = "purchase" | "rental" | "both";

export type StockStatus = "In Stock" | "Out of Stock";

export type SizeOption = "XS" | "S" | "M" | "L" | "XL" | "XXL" | "XXXL";

export interface DressCollectionItem {
  id: string;
  boutiqueId: string;
  name: string;
  description: string;
  category: string;
  targetAudience: TargetAudience;
  images: string[];
  purchasePrice?: string;
  rentalPrice?: string;
  availabilityType: AvailabilityType;
  rentalDuration?: string;
  securityDeposit?: string;
  lateReturnCharges?: string;
  sizes: SizeOption[];
  colors: string[];
  fabric: string;
  embroidery: string;
  additionalServices: string[];
  stockStatus: StockStatus;
  viewsCount?: number;
  savedCount?: number;
  createdAt?: string;
}

export interface StoryBoutiqueVendorProfile {
  id: string;
  user_id?: string;
  boutique_name: string;
  owner_name?: string;
  category: BoutiqueCategoryKey | string;
  categoryLabel: string;
  targetAudience: TargetAudience;
  phone?: string;
  whatsapp?: string;
  email?: string;
  address?: string;
  city?: string;
  district?: string;
  googleMapsLocation?: string;
  openingTime?: string;
  closingTime?: string;
  workingDays?: string;
  weeklyOff?: string;
  description?: string;
  logo?: string;
  logo_url?: string;
  coverImage?: string;
  cover_image?: string;
  galleryImages?: string[];
  gallery_images?: string[];
  instagram?: string;
  facebook?: string;
  website?: string;
  isVerified?: boolean;
  status?: "active" | "pending" | "suspended";
  rating?: number;
  reviewsCount?: number;
  collectionsCount?: number;
  profileViews?: number;
  wishlistCount?: number;
  deliveryOptions?: string[];
}

export const BRIDE_STORY_CATEGORIES: string[] = [
  "Bridal Saree",
  "Bridal Lehenga",
  "Bridal Gown",
  "Nikah Dress",
  "Reception Dress",
  "Engagement Dress",
  "Mehendi Outfit",
  "Haldi Outfit",
  "Christian Bridal Gown",
  "Kerala Bridal Saree",
  "Muslim Bridal Wear",
  "Indo-Western Bridal Wear",
];

export const GROOM_STORY_CATEGORIES: string[] = [
  "Sherwani",
  "Suit",
  "Tuxedo",
  "Kurta Set",
  "Jodhpuri Suit",
  "Pathani Suit",
  "Blazer",
  "Mundu Set",
  "Reception Suit",
  "Indo-Western Groom Wear",
];

export const WEDDING_STORY_CATEGORIES: string[] = [
  ...BRIDE_STORY_CATEGORIES,
  ...GROOM_STORY_CATEGORIES,
];

export const DRESS_SIZES: SizeOption[] = ["XS", "S", "M", "L", "XL", "XXL", "XXXL"];

export const DRESS_COLORS: string[] = [
  "White",
  "Cream",
  "Gold",
  "Silver",
  "Red",
  "Maroon",
  "Pink",
  "Green",
  "Blue",
  "Black",
  "Ivory",
  "Custom",
];

export const DRESS_FABRICS: string[] = [
  "Silk",
  "Satin",
  "Velvet",
  "Cotton",
  "Organza",
  "Net",
  "Chiffon",
  "Georgette",
  "Banarasi Silk",
  "Tissue",
  "Linen",
  "Raw Silk",
];

export const DRESS_EMBROIDERY: string[] = [
  "Hand Work",
  "Zari Work",
  "Stone Work",
  "Mirror Work",
  "Thread Work",
  "Bead Work",
  "Sequins",
  "Minimal Work",
];

export const ADDITIONAL_SERVICES_OPTIONS: string[] = [
  "Custom Stitching Available",
  "Alteration Available",
  "Home Delivery Available",
  "Store Pickup Available",
];

export const KERALA_DISTRICTS: string[] = [
  "Thiruvananthapuram",
  "Kollam",
  "Pathanamthitta",
  "Alappuzha",
  "Kottayam",
  "Idukki",
  "Ernakulam",
  "Thrissur",
  "Palakkad",
  "Malappuram",
  "Kozhikode",
  "Wayanad",
  "Kannur",
  "Kasaragod",
];
