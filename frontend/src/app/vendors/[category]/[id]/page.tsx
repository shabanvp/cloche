import type { Metadata } from "next";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

interface Props {
  params: Promise<{ category: string; id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category, id } = await params;
  const catSlug = category.toLowerCase().trim();
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA[catSlug];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );
  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} | Cloche Wedding Partner`,
    description: `View profile, pricing, packages, portfolio, and contact details for ${name} on Cloche.`,
  };
}

export default async function DynamicVendorDetailPage({ params }: Props) {
  const { category, id } = await params;
  const catSlug = category.toLowerCase().trim();
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA[catSlug];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );

  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const profileData = {
    id: found?.id || slug,
    name: name,
    category: catSlug,
    location: found?.location || "Kochi, Kerala",
    rating: found?.rating || 4.9,
    reviews: found?.reviewsCount || 128,
    image: found?.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    subtitle: config?.subtitle || "Explore luxury wedding vendor services and packages",
    about: `${name} is a verified luxury wedding partner on Cloche, dedicated to delivering unforgettable celebrations and world-class service.`,
    phone: "9876543210",
    isVerified: true,
  };

  return <VendorProfileLayout vendor={profileData} />;
}
