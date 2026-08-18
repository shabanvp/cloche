import { StoryBoutiqueDetailClient } from "@/components/StoryBoutiqueDetailClient";
import { StoryBoutiqueVendorProfile } from "@/lib/storyBoutiqueTypes";

export default async function GroomStoryDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const mockProfile: StoryBoutiqueVendorProfile = {
    id: id || "groom-boutique-1",
    boutique_name: "Aurora Groom's Story Atelier",
    owner_name: "Arjun Mehta",
    category: "grooms-story",
    categoryLabel: "Groom's Story Boutique",
    targetAudience: "groom",
    phone: "+91 98470 12345",
    whatsapp: "+91 98470 12345",
    email: "info@auroragroom.in",
    city: "Connaught Place",
    district: "Kozhikode",
    openingTime: "10:30 AM",
    closingTime: "08:30 PM",
    description: "Bespoke royal sherwanis, bandhgalas, tuxedos, Jodhpuri suits, Mundu sets, and ceremonial groom wear tailoring.",
    logo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
    coverImage: "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
    isVerified: true,
    rating: 4.8,
    reviewsCount: 96,
  };

  return <StoryBoutiqueDetailClient boutique={mockProfile} />;
}
