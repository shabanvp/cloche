"use client";

import { useState, useEffect } from "react";
import { getArticles, deleteArticle, createArticle } from "@/app/actions/content";
import { Plus, Trash2, Loader2, CheckCircle2, FileText } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminContentCMS() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await getArticles(false);
      if (res && res.success && Array.isArray(res.data)) {
        setArticles(res.data);
      } else {
        setArticles([]);
      }
    } catch (e) {
      setArticles([]);
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

  const handleCreateArticle = async () => {
    const title = prompt("Enter Article Title:");
    if (!title) return;
    
    const formData = new FormData();
    formData.append("title", title);
    formData.append("slug", title.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now());
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
          <p className="text-charcoal/60">Manage your editorial articles and guides directly from database.</p>
        </div>
        <Button onClick={handleCreateArticle} className="flex gap-2 items-center bg-emerald text-white rounded-full">
          <Plus className="w-4 h-4" /> Add Article
        </Button>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {articles.length > 0 ? (
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
              {articles.map((article) => (
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
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(article.id)} className="text-red-500 hover:text-red-700">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="py-16 text-center space-y-3">
            <FileText className="w-12 h-12 text-gold mx-auto opacity-50" />
            <h3 className="text-lg font-bold text-charcoal">No Content Articles Found</h3>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto">Create your first editorial article or guide to display on the blog.</p>
          </div>
        )}
      </div>
    </div>
  );
}
