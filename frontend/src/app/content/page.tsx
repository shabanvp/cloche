import type { Metadata } from "next";
import { BlogsList } from "@/components/BlogsList";

export const metadata: Metadata = {
  title: "Blogs | Cloche",
  description: "Read wedding planning tips, bridal fashion guides, and destination wedding ideas.",
};

export default function BlogsPage() {
  return <BlogsList />;
}
