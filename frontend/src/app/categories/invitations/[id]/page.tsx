import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { invitationVendors } from "@/lib/bridalAndInvitationData";
import { InvitationsDetailClient } from "@/components/InvitationsDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return invitationVendors.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vendor = invitationVendors.find((v) => v.id === id);
  if (!vendor) return { title: "Designer Not Found | Cloche" };
  return {
    title: `${vendor.name} | Cloche Invitation Designers`,
    description: vendor.about,
  };
}

export default async function InvitationsDetailPage({ params }: Props) {
  const { id } = await params;
  const vendor = invitationVendors.find((v) => v.id === id);

  if (!vendor) {
    notFound();
  }

  return <InvitationsDetailClient vendor={vendor} />;
}
