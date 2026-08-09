import type { Metadata } from "next";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["decor-planning"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );
  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} | Cloche Wedding Decor & Planners`,
    description: `Book ${name} in ${found?.location || "Kerala"}. Luxury floral entrance arches, whimsical mandap setups, fairy light tunnels, and romantic candlelight dinner staging.`,
  };
}

export default async function DecorPlanningDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["decor-planning"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );

  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const profileData = {
    id: found?.id || slug,
    name: name,
    category: "decor",
    location: found?.location || "Kochi, Kerala",
    rating: found?.rating || 4.8,
    reviews: found?.reviewsCount || 96,
    image: found?.image || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    subtitle: "Find the perfect decor & planner for your dream event",
    about: "Specialized in exquisite floral entrance arches, whimsical mandap setups, and romantic candlelight dinner staging.",
    phone: "9876543210",
    isVerified: true,
  };

  return <VendorProfileLayout vendor={profileData} />;
}
