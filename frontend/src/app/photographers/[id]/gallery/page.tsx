import type { Metadata } from "next";
import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { getAuthenticatedUser } from "@/lib/rbac";
import { fetchPublicVendorProfileFromDb, supabaseFetch } from "@/lib/supabase";
import { getPublicPhotographerExtras } from "@/lib/photographerData";
import { VendorGalleryClient } from "@/components/VendorGalleryClient";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id);
  if (!profile) {
    return { title: "Photographer Gallery | Cloche" };
  }
  return {
    title: `${profile.name} — Full Photography & Media Gallery | Cloche`,
    description: profile.about || `Explore wedding photography portfolio of ${profile.name} on Cloche.`,
  };
}

export default async function PhotographerGalleryPage({ params }: Props) {
  const { id } = await params;
  const { data: profile } = await fetchPublicVendorProfileFromDb(id, { includeNonActive: true });
  if (!profile) notFound();

  const { data: vRows } = await supabaseFetch<any[]>(
    `vendors?id=eq.${encodeURIComponent(profile.id)}&deleted_at=is.null&select=id,user_id,status,publication_status&limit=1`
  );
  const vRow = Array.isArray(vRows) ? vRows[0] : null;
  if (!vRow) notFound();

  const isPublished = vRow.status === "active" && vRow.publication_status === "published";
  const cookieStore = await cookies();
  const authUser = getAuthenticatedUser({ cookies: cookieStore });
  const callerUserId = authUser?.userId || authUser?.id || null;
  const isOwner = Boolean(callerUserId && vRow.user_id && callerUserId === vRow.user_id);

  if (!isPublished && !isOwner) {
    notFound();
  }

  const extras = await getPublicPhotographerExtras(profile.id);
  const initialVendor = {
    ...(profile as any),
    storefront: {
      ...((profile as any).storefront || {}),
      gallery: extras.photos.map((p) => ({
        id: p.id,
        url: p.imageUrl,
        caption: p.caption || p.category,
      })),
    },
  };

  return <VendorGalleryClient identifier={id} category="photographers" initialVendor={initialVendor} />;
}
