import type { Metadata } from "next";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["bridal-wear"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );
  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} | Cloche Bridal Wear & Boutiques`,
    description: `Explore designer bridal lehengas, silk sarees, bridal gowns, and custom wedding couture from ${name}.`,
  };
}

export default async function BridalWearDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["bridal-wear"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );

  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const profileData = {
    id: found?.id || slug,
    name: name,
    category: "bridal-wear",
    location: found?.location || "Kochi, Kerala",
    rating: found?.rating || 4.9,
    reviews: found?.reviewsCount || 310,
    image: found?.image || "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80",
    subtitle: "Explore luxury bridal lehengas, gowns, and designer sarees",
    about: `${name} is a high-fashion bridal boutique specializing in handcrafted Kanchipuram silk sarees, bespoke bridal lehengas, reception gowns, and custom wedding embroidery.`,
    phone: "9876543210",
    isVerified: true,
  };

  return <VendorProfileLayout vendor={profileData} />;
}
