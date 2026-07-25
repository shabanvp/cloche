import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { cateringVendors } from "@/lib/cateringData";
import { CateringDetailClient } from "@/components/CateringDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return cateringVendors.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vendor = cateringVendors.find((v) => v.id === id);
  if (!vendor) return { title: "Caterer Not Found | Cloche" };
  return {
    title: `${vendor.name} | Cloche Catering & Food`,
    description: vendor.about,
  };
}

export default async function CateringDetailPage({ params }: Props) {
  const { id } = await params;
  const vendor = cateringVendors.find((v) => v.id === id);

  if (!vendor) {
    notFound();
  }

  return <CateringDetailClient vendor={vendor} />;
}
