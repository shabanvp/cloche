import type { Metadata } from "next";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["groom-wear"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );
  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} | Cloche Groom Wear Studios`,
    description: `Discover royal sherwanis, tuxedos, achkans, and designer suits for grooms from ${name}.`,
  };
}

export default async function GroomWearDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["groom-wear"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );

  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const profileData = {
    id: found?.id || slug,
    name: name,
    category: "groom-wear",
    location: found?.location || "Kochi, Kerala",
    rating: found?.rating || 4.9,
    reviews: found?.reviewsCount || 220,
    image: found?.image || "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80",
    subtitle: "Discover royal sherwanis, tuxedos, and designer suits for grooms",
    about: `${name} offers luxury groom wear, royal sherwanis, Italian fabric tuxedos, bandhgalas, and bespoke menswear tailoring for weddings and receptions.`,
    phone: "9876543210",
    isVerified: true,
  };

  return <VendorProfileLayout vendor={profileData} />;
}
