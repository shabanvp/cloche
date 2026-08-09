import type { Metadata } from "next";
import { VendorProfileLayout } from "@/components/VendorProfileLayout";
import { VENDOR_CATEGORIES_DATA } from "@/lib/vendor-categories";

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["invitations"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );
  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return {
    title: `${name} | Cloche Wedding Invitations`,
    description: `Explore luxury wedding invitation cards, digital e-invites, boxed hampers, and custom wedding stationery from ${name}.`,
  };
}

export default async function InvitationsDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const config = VENDOR_CATEGORIES_DATA["invitations"];
  const found = config?.vendors.find(
    (v) => v.id === slug || v.slug === slug || slug.includes(v.slug) || v.slug.includes(slug)
  );

  const name = found ? found.name : slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  const profileData = {
    id: found?.id || slug,
    name: name,
    category: "invitations",
    location: found?.location || "Kochi, Kerala",
    rating: found?.rating || 4.8,
    reviews: found?.reviewsCount || 96,
    image: found?.image || "https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=800&q=80",
    subtitle: "Find the perfect invitation for your special day",
    about: `${name} specializes in creating bespoke wedding invitation suites, hand-crafted paper cards, acrylic boxes, wax seals, and animated digital video e-invites.`,
    phone: "9876543210",
    isVerified: true,
  };

  return <VendorProfileLayout vendor={profileData} />;
}
