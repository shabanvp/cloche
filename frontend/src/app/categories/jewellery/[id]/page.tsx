import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { jewelleryVendors } from "@/lib/jewelleryData";
import { JewelleryDetailClient } from "@/components/JewelleryDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return jewelleryVendors.map((v) => ({ id: v.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const vendor = jewelleryVendors.find((v) => v.id === id);
  if (!vendor) return { title: "Vendor Not Found | Cloche" };
  return {
    title: `${vendor.name} | Cloche Jewellery`,
    description: vendor.about,
  };
}

export default async function JewelleryDetailPage({ params }: Props) {
  const { id } = await params;
  const vendor = jewelleryVendors.find((v) => v.id === id);

  if (!vendor) {
    notFound();
  }

  return <JewelleryDetailClient vendor={vendor} />;
}
