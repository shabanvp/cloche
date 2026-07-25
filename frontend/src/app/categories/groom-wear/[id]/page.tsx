import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { groomWearVendors } from "@/lib/groomWearData";
import { GroomWearDetailClient } from "@/components/GroomWearDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return groomWearVendors.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vendor = groomWearVendors.find((v) => v.id === id);
  if (!vendor) return { title: "Vendor Not Found | Cloche" };
  return {
    title: `${vendor.name} | Cloche Groom Wear`,
    description: vendor.about,
  };
}

export default async function GroomWearDetailPage({ params }: Props) {
  const { id } = await params;
  const vendor = groomWearVendors.find((v) => v.id === id);

  if (!vendor) {
    notFound();
  }

  return <GroomWearDetailClient vendor={vendor} />;
}
