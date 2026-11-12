import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/rbac";
import { fetchPublicVendorProfileFromDb, supabaseFetch } from "@/lib/supabase";
import { isPhotographerCategory } from "@/lib/photographerAuth";
import { enrichPhotographerPublicProfile } from "@/lib/photographerData";
import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ preview?: string }>;
}

async function resolvePhotographerVisibility(identifier: string) {
  const { data: profile } = await fetchPublicVendorProfileFromDb(identifier, {
    includeNonActive: true,
  });
  if (!profile) return { profile: null, isPublished: false, ownerUserId: null };

  const { data: vRows } = await supabaseFetch<any[]>(
    `vendors?id=eq.${encodeURIComponent(profile.id)}&deleted_at=is.null&select=id,user_id,status,publication_status,vendor_categories(slug,name)&limit=1`
  );
  const vRow = Array.isArray(vRows) ? vRows[0] : null;
  if (!vRow) return { profile: null, isPublished: false, ownerUserId: null };

  const cat = Array.isArray(vRow.vendor_categories)
    ? vRow.vendor_categories[0]
    : vRow.vendor_categories;
  if (!isPhotographerCategory(cat?.slug) && !isPhotographerCategory(cat?.name)) {
    return { profile: null, isPublished: false, ownerUserId: null };
  }

  const isPublished = vRow.status === "active" && vRow.publication_status === "published";
  return { profile, isPublished, ownerUserId: vRow.user_id || null };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { profile, isPublished } = await resolvePhotographerVisibility(id);
  if (!profile || !isPublished) {
    return { title: "Photographer | Cloche Luxury Weddings" };
  }
  const name = profile?.name || (profile as any)?.business_name || "Wedding Photographer";
  return {
    title: `${name} | Cloche Wedding Photographers`,
    description: profile?.about || `Explore ${name} on Cloche.`,
  };
}

export default async function PhotographerDetailPage({ params, searchParams }: Props) {
  const { id } = await params;
  const sp = (await searchParams) || {};
  const { profile, isPublished, ownerUserId } = await resolvePhotographerVisibility(id);

  if (!profile) {
    notFound();
  }

  const cookieStore = await cookies();
  const authUser = getAuthenticatedUser({ cookies: cookieStore });
  const callerUserId = authUser?.userId || authUser?.id || null;
  const isOwner = Boolean(callerUserId && ownerUserId && callerUserId === ownerUserId);

  if (!isPublished && !isOwner) {
    notFound();
  }

  const enrichedProfile = await enrichPhotographerPublicProfile(profile, {
    isDraftPreview: !isPublished && isOwner && Boolean(sp?.preview || isOwner),
  });

  return <VendorProfileDispatcher profile={enrichedProfile} forcedCategory="photographers" />;
}
