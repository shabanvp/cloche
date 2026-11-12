export type PhotographerTab =
  | "overview"
  | "leads"
  | "inquiries"
  | "profile"
  | "services"
  | "portfolio"
  | "packages"
  | "reviews"
  | "faqs"
  | "messages"
  | "settings";

export interface PhotographerProfileData {
  vendorId: string;
  vendorCode: string | null;
  status: string;
  publicationStatus: "draft" | "published" | string;
  isVerified: boolean;
  businessName: string;
  slug: string;
  ownerName: string;
  tagline: string;
  intro: string;
  about: string;
  experienceYears: number | null;
  startingPrice: number | null;
  logoMediaId: string | null;
  logoUrl: string;
  coverMediaId: string | null;
  coverUrl: string;
  city: string;
  state: string;
  pincode: string;
  addressLine1: string;
  addressLine2: string;
  areasServed: string[];
  phone: string;
  whatsapp: string;
  email: string;
  instagram: string;
  website: string;
  youtube: string;
  facebook: string;
  candidPhotography: boolean;
  cinematicVideo: boolean;
  droneCoverage: boolean;
  deliveryDays: number;
  albumPages: number | null;
  equipment: string[];
  styles: string[];
  specializations: string[];
  rating: number;
  reviewCount: number;
}

export interface PhotographerServiceItem {
  id: string;
  name: string;
  description: string;
  price: number | null;
  price_unit: string;
  is_active: boolean;
  is_popular: boolean;
  sort_order: number;
  imageUrl: string;
}

export interface PhotographerPhotoItem {
  id: string;
  mediaId: string;
  imageUrl: string;
  caption: string;
  sortOrder: number;
  isCover: boolean;
  albumId: string | null;
  category: string;
  createdAt: string;
}

export interface PhotographerAlbumItem {
  id: string;
  title: string;
  description: string;
  eventDate: string | null;
  location: string;
  coverMediaId: string | null;
  coverUrl: string;
  category: string;
  photoCount: number;
  createdAt: string;
}

export interface PhotographerVideoItem {
  id: string;
  title: string;
  videoUrl: string;
  thumbnailUrl: string;
  platform: "youtube" | "vimeo" | "instagram" | "custom";
  category: string;
  sortOrder: number;
  createdAt: string;
}

export interface PhotographerPackageItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  price: number;
  priceOnRequest: boolean;
  features: string[];
  photographersCount: number | null;
  coverageDuration: string;
  albumDetails: string;
  videoDetails: string;
  imageUrl: string;
  isPopular: boolean;
  isActive: boolean;
  sortOrder: number;
}

export interface PhotographerLeadItem {
  id: string;
  customerId: string | null;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  eventType: string;
  eventDate: string | null;
  location: string;
  guestCount: number | null;
  estimatedBudget: number | null;
  message: string;
  latestMessage: string;
  latestMessageAt: string;
  messageCount: number;
  isUnread: boolean;
  stage: "New" | "Contacted" | "Interested" | "Follow-up Required" | "Converted" | "Lost";
  dbStatus: string;
  source: string;
  notes: Array<{ id: string; note_text: string; created_at: string }>;
  createdAt: string;
  updatedAt: string;
}

export interface PhotographerReviewItem {
  id: string;
  customerId: string;
  customerName: string;
  rating: number;
  title: string;
  reviewText: string;
  images: string[];
  isVerified: boolean;
  createdAt: string;
  vendorReply: {
    id: string;
    replyText: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  isReported: boolean;
}

export interface PhotographerReviewsBundle {
  averageRating: number;
  totalReviews: number;
  distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  reviews: PhotographerReviewItem[];
}

export interface PhotographerFaqItem {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export interface CustomerQuestionItem {
  id: string;
  customerName: string;
  customerEmail?: string;
  question: string;
  answer: string;
  status: "pending" | "published" | "draft" | "rejected";
  faqId?: string | null;
  createdAt: string;
  answeredAt?: string | null;
}

export interface PhotographerOverviewBundle {
  ownerName: string;
  businessName: string;
  slug: string;
  vendorId: string;
  publicationStatus: string;
  profileCompletion: number;
  metrics: {
    uniqueLeadsCount: number;
    totalInquiriesCount: number;
    unreadMessagesCount: number;
    profileViewsCount: number;
    publishedPortfolioCount: number;
    albumsCount: number;
    photosCount: number;
    videosCount: number;
    activeServicesCount: number;
    activePackagesCount: number;
    averageRating: number;
    totalReviews: number;
    pendingQuestionsCount: number;
  };
  recentInquiries: PhotographerLeadItem[];
}

export async function uploadPhotographerAsset(
  file: File,
  kind: "logo" | "cover" | "gallery" | "service" | "package" | "album"
): Promise<{ mediaId: string; url: string }> {
  const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
  if (!validTypes.includes(file.type.toLowerCase())) {
    throw new Error("Please select a JPG, PNG, or WebP image.");
  }
  if (file.size > 10 * 1024 * 1024) {
    throw new Error("File size exceeds 10MB limit.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("kind", kind);

  const res = await fetch("/api/vendor/photographer/upload", {
    method: "POST",
    credentials: "include",
    body: formData,
  });
  const json = await res.json();
  if (!res.ok || !json?.success || !json?.data?.url) {
    throw new Error(json?.error || "Image upload failed.");
  }
  return json.data;
}

export function formatInr(val?: number | null): string {
  if (val == null || Number.isNaN(Number(val))) return "On Request";
  return `₹${Number(val).toLocaleString("en-IN")}`;
}

export function formatShortDate(dateStr?: string | null): string {
  if (!dateStr) return "TBD";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

