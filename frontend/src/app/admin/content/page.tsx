"use client";

import { useState, useEffect } from "react";
import { getArticles, deleteArticle, createArticle } from "@/app/actions/content";
import { Plus, Trash2, Edit2, Loader2, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminContentCMS() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

const DEFAULT_ARTICLES = [
  { id: 1, title: "Ultimate Kerala Bridal Shopping Guide 2026", slug: "kerala-bridal-shopping-guide", category: "Bridal Guide", is_published: true, created_at: "2026-03-01" },
  { id: 2, title: "Top 10 Destination Wedding Venues in Kochi", slug: "top-kochi-wedding-venues", category: "Venues", is_published: true, created_at: "2026-03-15" },
  { id: 3, title: "Traditional Kerala Sadya & Modern Catering Trends", slug: "kerala-sadya-catering-trends", category: "Catering", is_published: true, created_at: "2026-04-02" },
  { id: 4, title: "Cloche Vendor Agreement & Terms", slug: "vendor-agreement", category: "Legal Policy", is_published: true, created_at: "2026-01-01" },
  { id: 5, title: "Privacy Policy & Data Security", slug: "privacy", category: "Legal Policy", is_published: true, created_at: "2026-01-01" }
];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getArticles(false);
      if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
        setArticles(res.data);
      } else {
        setArticles(DEFAULT_ARTICLES);
      }
    } catch (e) {
      setArticles(DEFAULT_ARTICLES);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const res = await deleteArticle(id);
    if (res.success) {
      fetchData();
    }
  };

  const handleCreateMock = async () => {
    const formData = new FormData();
    formData.append("title", "New Wedding Guide");
    formData.append("slug", "new-wedding-guide-" + Date.now());
    formData.append("category", "Bridal Guide");
    formData.append("is_published", "true");
    
    await createArticle(formData);
    fetchData();
  };

  if (loading) return <div className="p-12 flex justify-center"><Loader2 className="animate-spin text-emerald w-8 h-8" /></div>;

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Content Management</h1>
          <p className="text-charcoal/60">Manage your editorial articles and guides.</p>
        </div>
        <Button onClick={handleCreateMock} className="flex gap-2 items-center bg-emerald text-white rounded-full">
          <Plus className="w-4 h-4" /> Add Article
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs uppercase tracking-wider text-charcoal/50">
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Category</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="p-4">
                  <div className="font-medium text-charcoal">{article.title}</div>
                  <div className="text-xs text-charcoal/50">{article.slug}</div>
                </td>
                <td className="p-4 text-sm text-charcoal/70">{article.category}</td>
                <td className="p-4">
                  {article.is_published ? (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald bg-emerald/10 px-2 py-1 rounded-full">
                      <CheckCircle2 className="w-3 h-3" /> Published
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-orange-500 bg-orange-500/10 px-2 py-1 rounded-full">
                      Draft
                    </span>
                  )}
                </td>
                <td className="p-4 flex justify-end gap-2">
                  <Button variant="outline" size="icon" className="h-8 w-8 rounded-full border-gray-200">
                    <Edit2 className="w-3 h-3 text-charcoal" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={() => handleDelete(article.id)} className="h-8 w-8 rounded-full border-red-200 hover:bg-red-50 hover:border-red-300">
                    <Trash2 className="w-3 h-3 text-red-500" />
                  </Button>
                </td>
              </tr>
            ))}
            {articles.length === 0 && (
              <tr>
                <td colSpan={4} className="p-12 text-center text-charcoal/50">No articles found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
