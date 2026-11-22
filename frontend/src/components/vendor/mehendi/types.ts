export * from "@/lib/mehendiTypes";

export interface MehendiOverviewBundle {
  vendorId: string;
  businessName: string;
  ownerName: string;
  slug: string;
  publicationStatus: "published" | "draft";
  profileCompletionPercentage: number;
  logoUrl: string;
  coverUrl: string;
  metrics: {
    totalProfileViews: number;
    totalDesigns: number;
    activeServices: number;
    totalEnquiries: number;
    appointmentRequests: number;
    averageCustomerRating: number;
    totalReviews: number;
    confirmedAppointments: number;
  };
  recentEnquiries: Array<{
    id: string;
    customerName: string;
    customerPhone?: string;
    serviceName: string;
    appointmentDate: string;
    status: string;
    createdAt: string;
  }>;
  popularDesigns: Array<{
    id: string;
    title: string;
    imageUrl: string;
    views: number;
    category: string;
  }>;
  recentReviews: Array<{
    id: string;
    customerName: string;
    customerAvatar?: string;
    rating: number;
    writtenReview: string;
    serviceReceived: string;
    createdAt: string;
  }>;
  trafficSeries: Array<{
    date: string;
    profileViews: number;
    inquiries: number;
    appointments: number;
  }>;
}

