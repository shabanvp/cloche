import { StoryBoutiqueDetailClient } from "@/components/StoryBoutiqueDetailClient";
import { StoryBoutiqueVendorProfile } from "@/lib/storyBoutiqueTypes";

export default async function WeddingStoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const mockProfile: StoryBoutiqueVendorProfile = {
    id: id || "wedding-boutique-1",
    boutique_name: "The Royal Wedding Story House",
    owner_name: "Fanas Rin & Team",
    category: "wedding-story",
    categoryLabel: "Wedding Story Boutique",
    targetAudience: "both",
    phone: "+91 95678 11223",
    whatsapp: "+91 95678 11223",
    email: "contact@weddingstoryhouse.in",
    city: "Ernakulam",
    district: "Ernakulam",
    openingTime: "09:30 AM",
    closingTime: "09:00 PM",
    description: "Curated luxury bridal & groom wear atelier. Offering matching couple ensembles, lehengas, sherwanis, tuxedos, and wedding reception edits.",
    logo: "https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80",
    isVerified: true,
    rating: 5.0,
    reviewsCount: 184,
  };

  return <StoryBoutiqueDetailClient boutique={mockProfile} />;
}
