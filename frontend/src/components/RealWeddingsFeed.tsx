"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, SlidersHorizontal, Heart, MessageCircle } from "lucide-react";
import { BottomNavBar } from "@/components/BottomNavBar";

type WeddingFeedItem = {
  id: string;
  couple: string;
  city: string;
  likes: string;
  comments: number;
  image: string;
};

const trendingWeddings: WeddingFeedItem[] = [
  {
    id: "ananya-rohan",
    couple: "Ananya & Rohan",
    city: "Udaipur",
    likes: "1.2K",
    comments: 98,
    image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "kritika-arjun",
    couple: "Kritika & Arjun",
    city: "Jaipur",
    likes: "982",
    comments: 76,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "megha-vihaan",
    couple: "Megha & Vihaan",
    city: "Goa",
    likes: "645",
    comments: 64,
    image: "https://images.unsplash.com/photo-1519225495846-f9acbe3b136d?auto=format&fit=crop&w=800&q=80",
  },
];

const featuredWeddings: WeddingFeedItem[] = [
  {
    id: "priya-sid",
    couple: "Priya & Sid",
    city: "Goa",
    likes: "850",
    comments: 42,
    image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=800&q=80",
  },
];

const latestWeddings: WeddingFeedItem[] = [
  {
    id: "kavya-kabir",
    couple: "Kavya & Kabir",
    city: "Delhi",
    likes: "420",
    comments: 31,
    image: "https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=800&q=80",
  },
];

export function RealWeddingsFeed() {
  const [activeTab, setActiveTab] = useState<"trending" | "featured" | "latest">("trending");
  const [likedItems, setLikedItems] = useState<Set<string>>(new Set());

  const getActiveList = () => {
    switch (activeTab) {
      case "featured":
        return featuredWeddings;
      case "latest":
        return latestWeddings;
      default:
        return trendingWeddings;
    }
  };

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setLikedItems((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F5F0E8" }}>
      {/* Header */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 py-4" style={{ background: "#F5F0E8" }}>
        <Link
          href="/"
          className="flex h-10 w-10 items-center justify-center rounded-full"
          style={{ background: "rgba(15,76,69,0.08)" }}
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </Link>
        <h1 className="font-display text-[20px] font-bold" style={{ color: "#0F4C45" }}>
          Real Weddings
        </h1>
        <button className="flex h-10 w-10 items-center justify-center rounded-full" style={{ background: "rgba(15,76,69,0.08)" }}>
          <SlidersHorizontal className="h-5 w-5" style={{ color: "#0F4C45" }} />
        </button>
      </header>

      {/* Tabs */}
      <div className="px-4 pb-3">
        <div className="flex border-b justify-between" style={{ borderColor: "#E2D5C0" }}>
          {(["trending", "featured", "latest"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className="flex-1 py-2 text-[14px] font-semibold capitalize relative transition-colors"
              style={{ color: activeTab === tab ? "#0F4C45" : "#7A6E65" }}
            >
              {tab}
              {activeTab === tab && <div className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full" style={{ background: "#0F4C45" }} />}
            </button>
          ))}
        </div>
      </div>

      {/* List Container */}
      <div className="flex-grow px-4 pb-28 space-y-4">
        {getActiveList().map((item) => {
          const isLiked = likedItems.has(item.id);
          return (
            <div
              key={item.id}
              className="rounded-2xl overflow-hidden bg-white shadow-sm border border-gold/10"
            >
              {/* Cover Image */}
              <div className="relative w-full aspect-video">
                <Image src={item.image} alt={item.couple} fill className="object-cover" />
              </div>

              {/* Info Panel */}
              <div className="p-4 flex items-center justify-between">
                <div>
                  <h2 className="font-display text-[16px] font-bold" style={{ color: "#1A1410" }}>
                    {item.couple}
                  </h2>
                  <p className="text-[12px] mt-0.5" style={{ color: "#7A6E65" }}>
                    {item.city}
                  </p>
                </div>

                {/* Interaction stats */}
                <div className="flex items-center gap-4 text-[#7A6E65] text-[13px]">
                  <button onClick={(e) => handleLike(e, item.id)} className="flex items-center gap-1">
                    <Heart className="h-4 w-4" style={{ color: isLiked ? "#E8614A" : "#C8A96A", fill: isLiked ? "#E8614A" : "none" }} />
                    <span>{isLiked ? "1.3K" : item.likes}</span>
                  </button>
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-4 w-4" style={{ color: "#C8A96A" }} />
                    <span>{item.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNavBar activeTab="home" />
    </div>
  );
}
