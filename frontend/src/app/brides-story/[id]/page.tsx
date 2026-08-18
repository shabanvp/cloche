import { StoryBoutiqueDetailClient } from "@/components/StoryBoutiqueDetailClient";
import { StoryBoutiqueVendorProfile } from "@/lib/storyBoutiqueTypes";

export default async function BrideStoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const mockProfile: StoryBoutiqueVendorProfile = {
    id: id || "bride-boutique-1",
    boutique_name: "Aurora Bridal Story Couture",
    owner_name: "Fathima Rahman",
    category: "brides-story",
    categoryLabel: "Bride's Story Boutique",
    targetAudience: "bride",
    phone: "+91 95678 11223",
    whatsapp: "+91 95678 11223",
    email: "info@aurorabridal.in",
    city: "Bandra",
    district: "Ernakulam",
    openingTime: "10:00 AM",
    closingTime: "08:00 PM",
    description: "Exclusive luxury bridal lehengas, silk sarees, Nikah dresses, Christian bridal gowns and custom bridal fittings.",
    logo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1200&q=80",
    isVerified: true,
    rating: 4.9,
    reviewsCount: 128,
  };

  return <StoryBoutiqueDetailClient boutique={mockProfile} />;
}
