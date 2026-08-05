import type { Metadata } from "next";
import { makeupArtists } from "@/lib/vendorLists";
import { MakeupDetailClient } from "@/components/MakeupDetailClient";

interface Props {
  params: Promise<{ id: string }>;
}

export function generateStaticParams() {
  return makeupArtists.map((m) => ({ id: m.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const slug = id.toLowerCase().trim();
  const artist = makeupArtists.find(
    (m) => m.id === slug || m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slug) || slug.includes(m.id)
  ) || {
    id: slug,
    name: slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    category: "Bridal Makeup Artist",
    location: "Kochi, Kerala",
    rating: 4.9,
    reviews: 186,
    followers: 458,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    images: ["https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80"],
    about: "Celebrated bridal makeup artist specializing in HD airbrush, skin prep rituals, and global couture standards.",
  };

  return {
    title: `${artist.name} | Cloche Bridal Makeup Artists`,
    description: artist.about,
  };
}

export default async function MakeupArtistDetailPage({ params }: Props) {
  const { id } = await params;
  const slug = id.toLowerCase().trim();

  const found = makeupArtists.find(
    (m) => m.id === slug || m.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").includes(slug) || slug.includes(m.id)
  );

  const artist = found || {
    id: slug,
    name: slug.replace(/[-_]+/g, " ").replace(/\b\w/g, (l) => l.toUpperCase()),
    category: "Bridal Makeup Artist",
    location: "Kochi, Kerala",
    rating: 4.9,
    reviews: 186,
    followers: 458,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=800&q=80",
    ],
    about: "With over 8 years of luxury bridal experience, specializing in HD Makeup, Airbrush Makeup, Traditional Makeup, and Glam Makeup. Creating timeless, radiant, and customized wedding looks for brides across India.",
    phone: "9876543210",
  };

  return <MakeupDetailClient artist={artist} />;
}
