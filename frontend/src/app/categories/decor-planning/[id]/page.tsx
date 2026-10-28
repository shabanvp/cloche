import type { Metadata } from "next";
import { fetchPublicVendorProfileFromDb } from "@/lib/supabase";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";
import { decorVendors } from "@/lib/decorData";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  const staticVendor = decorVendors.find((d) => d.id === id);
  const name = profile?.name || (profile as any)?.business_name || staticVendor?.name || "Decor & Planning Studio";
  return {
    title: `${name} | Cloche Wedding Decor & Planning`,
    description: profile?.about || staticVendor?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function DecorPlanningDetailPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);

  const staticVendor = decorVendors.find((d) => d.id === id);

  const cleanProfile = profile || (staticVendor ? {
    id: staticVendor.id,
    name: staticVendor.name,
    category: "Decor & Planning",
    categorySlug: "decor-planning",
    categoryLabel: "Decor & Planning",
    city: staticVendor.location,
    address: staticVendor.location,
    rating: staticVendor.rating,
    reviewCount: staticVendor.reviews,
    is_verified: staticVendor.isVerified ?? true,
    starting_price: staticVendor.price,
    cover_image: staticVendor.image,
    images: [staticVendor.image, ...(staticVendor.portfolio || [])],
    about: staticVendor.about,
    services: staticVendor.services?.map((s) => ({ name: s.name })),
  } : {
    id: id,
    name: "Luxury Decor & Wedding Planning",
    category: "Decor & Planning",
    categorySlug: "decor-planning",
    categoryLabel: "Decor & Planning",
    city: "Kerala",
    address: "Kochi, Kerala",
    rating: 4.9,
    reviewCount: 40,
    is_verified: true,
    starting_price: "₹75,000",
    phone: "919000000000",
    about: "Bespoke wedding stage decor, floral mandap installations, lighting concepts, and end-to-end wedding planning."
  });

  return <VendorProfileDispatcher profile={cleanProfile} forcedCategory="decor-planning" />;
}
