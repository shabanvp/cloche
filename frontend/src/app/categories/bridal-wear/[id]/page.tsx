import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LegacyBridalWearDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/categories/bridal-studio/${id}`);
}
