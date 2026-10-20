import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2, Sparkles, BookHeart } from "lucide-react";
import { AdBanner } from "@/components/AdBanner";
import { Footer } from "@/components/Footer";

type BlogPost = {
  id: string;
  title: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  content: string;
  author: string;
};

const blogPosts: BlogPost[] = [
  {
    id: "perfect-wedding-venue",
    title: "How to Choose the Perfect Luxury Heritage Wedding Venue in Kerala",
    category: "Planning",
    date: "July 28, 2026",
    readTime: "5 min read",
    image: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    content: "Choosing your wedding venue is one of the most foundational decisions in your wedding journey. In Kerala, the sheer variety—from tranquil backwater luxury resorts in Kumarakom and heritage mansions in Fort Kochi to cliffside oceanfront lawns in Kovalam—offers an inspiring palette for bespoke celebrations.\n\nFirst, define your celebration scale and guest hospitality expectations. Backwater venues often require early boat transfer planning and tailored sunset docking for traditional arrivals.\n\nSecond, evaluate seasonal weather contingencies. Kerala's monsoons are enchanting, but ensure your venue provides covered glass pavilions or expansive heritage halls alongside sprawling outdoor lawns.\n\nFinally, inspect on-site artisanal culinary facilities. Kerala sadhyas and coastal feasts require dedicated kitchen spaces with seasoned culinary teams to guarantee unmatched warmth and hospitality for your esteemed guests.",
    author: "Editorial Team",
  },
  {
    id: "bridal-fashion-trends-2026",
    title: "Top Bridal Couture & Heirloom Silk Trends of 2026",
    category: "Fashion",
    date: "July 20, 2026",
    readTime: "4 min read",
    image: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80",
    content: "In 2026, bridal fashion embraces heirloom authenticity blended with effortless modern silhouettes. We are observing a magnificent resurgence in heritage handwoven Kanchipuram and Kasavu silks adorned with micro-real gold zari motifs.\n\nBrides are moving towards customized personal monograms hand-embroidered onto long royal veils, structured corseted blouses, and subtle pearl tassels that add movement and quiet luxury.\n\nJewellery palettes reflect this shift: antique temple gold, uncut polki diamonds, and emerald cabochons curated from master heritage goldsmiths anchor the modern bridal ensemble.",
    author: "Fashion Editor",
  },
  {
    id: "destination-wedding-checklist",
    title: "The Ultimate Backwaters Destination Wedding Checklist",
    category: "Inspiration",
    date: "July 12, 2026",
    readTime: "6 min read",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80",
    content: "Planning a destination celebration across God's Own Country requires early logistical choreography. Our master checklist ensures every touchpoint is executed flawlessly.\n\n1. Guest Hospitality & Transfers: Organize private luxury coach or catamaran charters directly from Cochin International Airport (COK) or Trivandrum to the resort.\n\n2. Welcome Hampers: Infuse local artisanal touches—spiced brass tins of Wayanad cardamom, custom handwoven mundu sets, and coconut-palm scented mist.\n\n3. Mandap & Floral Decor: Work with regional floral artists who source fresh tuberose, lotus blooms, and marigold garlands sustainably.\n\n4. Sound & Curfew Protocols: Waterfront properties maintain quiet hour guidelines; plan your sangeet in acoustic indoor ballrooms before concluding with open-air terrace afterparties.",
    author: "Destination Specialist",
  },
  {
    id: "royal-affair-udaipur",
    title: "Real Wedding: A Majestic Palace Affair on Lake Pichola",
    category: "Real Weddings",
    date: "June 30, 2026",
    readTime: "7 min read",
    image: "https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80",
    content: "Priya and Arjun's palace nuptials set a breathtaking benchmark for regal storytelling. With the historic waters of Lake Pichola reflecting golden hour vows, the celebrations blended Rajasthani royal heritage with South Indian temple rituals.\n\nThe bride wore an intricately hand-loomed vermillion lehenga with antique gold zardozi, complemented by ancestral Basra pearl jewellery. The couple's mandap floated gracefully along the palace terrace surrounded by floating diyas and white jasmine waterfalls.",
    author: "Features Writer",
  },
];

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = blogPosts.find((p) => p.id === slug) || blogPosts[0];

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-[#1A1A1A] antialiased">
      {/* Editorial Header Bar */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#D7C2A0]/30 py-4">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-[#0F4C45] hover:text-[#C8A96A] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Journal</span>
          </Link>
          <span className="font-serif text-sm text-[#0F4C45] hidden sm:inline">
            Cloche Editorial Volume
          </span>
          <Link
            href="/real-weddings"
            className="inline-flex items-center gap-1.5 text-xs text-[#0F4C45] font-medium hover:text-[#C8A96A] transition-colors"
          >
            <BookHeart className="w-3.5 h-3.5 text-[#C8A96A]" />
            <span>Real Weddings</span>
          </Link>
        </div>
      </header>

      {/* Article Hero Header */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-16">
        <div className="text-center max-w-2xl mx-auto">
          <span className="inline-block px-3.5 py-1 rounded-full bg-[#0F4C45]/10 text-[#0F4C45] text-[10px] font-semibold uppercase tracking-[0.2em] border border-[#D7C2A0]/50 mb-4">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-[#0F4C45] font-normal tracking-tight leading-[1.15]">
            {post.title}
          </h1>

          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-[#7A6E65]">
            <span>By {post.author}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 text-[#C8A96A]" />
              {post.date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-[#C8A96A]" />
              {post.readTime}
            </span>
          </div>
        </div>

        {/* Hero Image */}
        <div className="relative w-full aspect-[16/9] mt-8 rounded-2xl overflow-hidden border border-[#D7C2A0]/40 shadow-sm bg-[#1C1C17]">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 900px"
          />
        </div>

        {/* Content Body */}
        <div className="mt-10 sm:mt-12 bg-white rounded-2xl border border-[#D7C2A0]/35 p-6 sm:p-10 lg:p-12 shadow-sm">
          <div className="prose prose-emerald max-w-none">
            {post.content.split("\n\n").map((para, idx) => (
              <p
                key={idx}
                className="text-[#3A322D] text-base sm:text-lg leading-relaxed font-light mb-6 first-of-type:text-lg sm:first-of-type:text-xl sm:first-of-type:leading-relaxed first-of-type:text-[#1A1A1A]"
              >
                {para}
              </p>
            ))}
          </div>

          {/* Editorial Callout */}
          <div className="my-10 p-6 rounded-xl bg-[#FAF9F6] border-l-4 border-[#C8A96A] text-sm text-[#4A3F35] font-light leading-relaxed">
            <p className="italic">
              &ldquo;True elegance lies in deliberate curation. Every venue, drape, and heirloom ornament tells an enduring story of heritage and intimacy.&rdquo;
            </p>
            <span className="block mt-2 text-xs font-semibold text-[#0F4C45] uppercase tracking-wider">
              — Cloche Editorial Board
            </span>
          </div>

          {/* Native Sponsored Ad Banner */}
          <AdBanner placement="Blog Pages" className="my-8" />

          {/* Cross Promotion to Real Weddings */}
          <div className="mt-10 p-6 sm:p-8 rounded-xl bg-[#0F4C45] text-[#FAF9F6] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#C8A96A] font-semibold">
                Explore The Gallery
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-normal mt-1 text-white">
                Looking for Real Wedding Inspiration?
              </h3>
              <p className="text-xs text-[#FAF9F6]/80 mt-1 max-w-md font-light">
                Browse authentic ceremonies across Kerala with verified vendor credits, decor archives, and bridal ensembles.
              </p>
            </div>
            <Link
              href="/real-weddings"
              className="shrink-0 px-5 py-2.5 rounded-full bg-[#C8A96A] text-[#0F4C45] text-xs font-semibold uppercase tracking-wider hover:bg-white transition-all shadow-sm"
            >
              View Real Weddings
            </Link>
          </div>
        </div>
      </article>

      {/* Footer */}
      <Footer />
    </div>
  );
}
