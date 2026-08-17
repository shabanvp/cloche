import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getStoryBySlug, getPublishedStories } from "@/lib/realWeddings";
import { RealWeddingStoryClient } from "@/components/RealWeddingStoryClient";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);
  if (!story || story.status !== "published") {
    return { title: "Real Wedding Story | Cloche" };
  }
  return {
    title: `${story.title} | Cloche Real Weddings`,
    description: story.short_story || story.story_text.slice(0, 160),
    openGraph: {
      images: [story.cover_image_url],
    },
  };
}

export default async function RealWeddingDetailPage({ params }: Props) {
  const { slug } = await params;
  const story = await getStoryBySlug(slug);

  if (!story || story.status !== "published") {
    notFound();
  }

  // Fetch 4 related published stories
  const { stories: allPublished } = await getPublishedStories({ limit: 5 });
  const relatedStories = allPublished.filter((s) => s.slug !== slug).slice(0, 4);

  return <RealWeddingStoryClient story={story} relatedStories={relatedStories} />;
}
