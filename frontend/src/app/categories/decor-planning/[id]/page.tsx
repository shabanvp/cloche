import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { decorVendors, getDecorVendorById } from "@/lib/decorData";
import { DecorPlanningDetailClient } from "@/components/DecorPlanningDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return decorVendors.map((vendor) => ({ id: vendor.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vendor = getDecorVendorById(id);
  if (!vendor) return { title: "Vendor Not Found | Cloche" };
  return {
    title: `${vendor.name} | Cloche Wedding Decor & Planning`,
    description: vendor.about,
  };
}

export default async function DecorVendorDetailPage({ params }: Props) {
  const { id } = await params;
  const vendor = getDecorVendorById(id);

  if (!vendor) {
    notFound();
  }

  return <DecorPlanningDetailClient vendor={vendor} />;
}
