import { notFound, redirect } from "next/navigation";
import { fetchPublicVendorProfileFromDb, supabaseFetch } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ slug: string }>;
}

function getPublicProfilePath(category: string, vendorId: string, slug: string) {
  const normalizedCategory = category.toLowerCase();
  const identifier = encodeURIComponent(slug || vendorId);

  if (normalizedCategory.includes("venue")) return `/venues/${identifier}`;
  if (normalizedCategory.includes("photo") || normalizedCategory.includes("video")) return `/photographers/${identifier}`;
  if (normalizedCategory.includes("makeup")) return `/makeup-artists/${identifier}`;
  if (normalizedCategory.includes("mehendi") || normalizedCategory.includes("mehndi")) return `/mehendi-artists/${identifier}`;
  if (normalizedCategory.includes("cater")) return `/catering/${identifier}`;
  if (normalizedCategory.includes("decor") || normalizedCategory.includes("planner")) return `/decor-planning/${identifier}`;
  if (normalizedCategory.includes("jewel")) return `/jewellery/${identifier}`;
  if (normalizedCategory.includes("invit") || normalizedCategory.includes("card")) return `/invitations/${identifier}`;
  if (normalizedCategory.includes("bridal")) return `/bridal-wear/${identifier}`;
  if (normalizedCategory.includes("groom")) return `/groom-wear/${identifier}`;
  if (normalizedCategory.includes("wedding-story") || normalizedCategory.includes("wedding-studio") || normalizedCategory.includes("boutique")) {
    return `/wedding-story/${identifier}`;
  }

  return `/vendors/${encodeURIComponent(category || "general")}/${identifier}`;
}

export default async function PartnerVendorRedirectPage({ params }: Props) {
  const { slug } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(slug);

  if (!profile?.id) notFound();

  const { data, error } = await supabaseFetch(
    `vendors?id=eq.${encodeURIComponent(profile.id)}&deleted_at=is.null&select=status&limit=1`
  );
  const vendor = Array.isArray(data) ? data[0] : null;

  if (error || vendor?.status !== "active") notFound();

  redirect(getPublicProfilePath(profile.category || "", profile.id, profile.slug || slug));
}
