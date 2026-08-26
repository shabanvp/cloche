import { redirect } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function LegacyGroomWearDetailPage({ params }: Props) {
  const { id } = await params;
  redirect(`/categories/groom-studio/${id}`);
}
