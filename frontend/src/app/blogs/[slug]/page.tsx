import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "perfect-wedding-venue",
    title: "How to Choose the Perfect Wedding Venue",
    category: "Planning",
    date: "May 12, 2024",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80",
    content: "Choosing your wedding venue is one of the most important decisions you will make. It defines the backdrop, guest capacity, aesthetics, and date. First, define your budget. Second, consider guest count. Third, ensure the venue suits your design theme. Finally, evaluate indoor vs outdoor preferences.",
  },
  {
    id: "bridal-fashion-trends-2024",
    title: "Top Bridal Fashion Trends of 2024",
    category: "Fashion",
    date: "May 10, 2024",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1594938298596-70f594f74246?auto=format&fit=crop&w=1200&q=80",
    content: "In 2024, bridal fashion takes a bold step forward. We see a rise in deep jewel tones, heritage fabrics like Banarasi silks, capes and jackets replacing heavy dupattas, and exquisite customized embroideries showing the couple's story.",
  },
  {
    id: "destination-wedding-checklist",
    title: "Destination Wedding Checklist",
    category: "Inspiration",
    date: "May 8, 2024",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    content: "Planning a destination wedding requires early preparations. Our definitive checklist covers guest travel logistics, vendor vetting in regional areas, local food curation, styling details, climate checks, and contingency venue plans.",
  },
  {
    id: "royal-affair-udaipur",
    title: "Real Wedding: A Royal Affair in Udaipur",
    category: "Tips",
    date: "May 5, 2024",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1519225495846-f9acbe3b136d?auto=format&fit=crop&w=1200&q=80",
    content: "Priya and Arjun's palace wedding in Udaipur was the highlight of the season. Featuring majestic floral altars, customized local catering delicacies, and gorgeous royal outfits set against the beautiful background of Lake Pichola.",
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.id === slug) || blogPosts[0];

  return (
    <div className="min-h-screen flex flex-col pb-24" style={{ background: "#F5F0E8" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center px-4 py-4" style={{ background: "#F5F0E8" }}>
        <Link href="/blogs" className="flex h-10 w-10 items-center justify-center rounded-full animate-transform active:scale-95" style={{ background: "rgba(15,76,69,0.08)" }} aria-label="Back">
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <span className="flex-1 text-center font-display text-[16px] font-bold pr-10" style={{ color: "#0F4C45" }}>
          Article Details
        </span>
      </header>

      {/* Hero Image */}
      <div className="relative w-full aspect-video">
        <Image src={post.image} alt={post.title} fill priority className="object-cover" />
      </div>

      {/* Content */}
      <main className="flex-1 px-5 pt-6">
        <span className="inline-block bg-[#0F4C45]/15 text-[#0F4C45] px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3">
          {post.category}
        </span>
        <h1 className="font-display text-[26px] font-bold leading-tight" style={{ color: "#1A1410" }}>
          {post.title}
        </h1>

        <div className="mt-3 flex items-center gap-4 text-[12px]" style={{ color: "#7A6E65" }}>
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {post.date}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>

        <p className="mt-6 text-[15px] leading-relaxed" style={{ color: "#4A3F35" }}>
          {post.content}
        </p>
      </main>

      <BottomNavBar activeTab="home" />
    </div>
  );
}
