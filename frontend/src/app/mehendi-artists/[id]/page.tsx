import type { Metadata } from "next";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["mehendi-artists"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );
  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} | Cloche Mehendi Artists`,
    description: `Book ${name} for intricate bridal henna designs, traditional Rajasthani motifs, Arabic patterns, and personalized wedding portraits.`,
  };
}

export default async function MehendiArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["mehendi-artists"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );

  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const profileData = {
    id: found?.id || slug,
    name: name,
    category: "mehendi",
    location: found?.location || "Kochi, Kerala",
    rating: found?.rating || 4.9,
    reviews: found?.reviewsCount || 172,
    image: found?.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    subtitle: "Discover talented mehendi artists for your special celebrations",
    about: `${name} is a renowned bridal mehendi artist specializing in organic henna stain, intricate Rajasthani figures, modern Indo-Arabic lines, and customized love story motifs.`,
    phone: "9876543210",
    isVerified: true,
  };

  return <VendorProfileLayout vendor={profileData} />;
}
