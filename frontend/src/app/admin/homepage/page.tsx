"use client";

import { useEffect, useState, useRef } from "react";
import { LayoutTemplate, Image as ImageIcon, Plus, Save, Trash2, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/Button";
import { 
  getHomepageSections, 
  createHomepageSection, 
  updateHomepageSection, 
  deleteHomepageSection, 
  reorderHomepageSections 
} from "@/app/actions/homepage";

export default function AdminHomepageCMS() {
  const [sections, setSections] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [editingSection, setEditingSection] = useState<any>(null);
  
  // Editor states
  const [title, setTitle] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [type, setType] = useState("hero");
  const [contentStr, setContentStr] = useState(""); // JSON string for arbitrary content
  const [isActive, setIsActive] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    loadSections();
  }, []);

  async function loadSections() {
    setIsLoading(true);
    const res = await getHomepageSections();
    if (res.success) {
      setSections(res.data);
    }
    setIsLoading(false);
  }

  const handleEdit = (sec: any) => {
    setEditingSection(sec);
    setTitle(sec.title || "");
    setSubtitle(sec.subtitle || "");
    setType(sec.section_type || "hero");
    setContentStr(sec.content ? JSON.stringify(sec.content, null, 2) : "");
    setIsActive(sec.is_active);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddNew = () => {
    setEditingSection({ id: "new" });
    setTitle("");
    setSubtitle("");
    setType("hero");
    setContentStr("");
    setIsActive(true);
    setImageFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSaveSection = async () => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("title", title);
    formData.append("subtitle", subtitle);
    formData.append("section_type", type);
    formData.append("is_active", String(isActive));
    if (contentStr) formData.append("content", contentStr);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editingSection && editingSection.id !== "new") {
        const res = await updateHomepageSection(editingSection.id, formData);
        if (res.success) {
          alert("Updated successfully!");
          loadSections();
          setEditingSection(null);
        } else {
          alert(res.message);
        }
      } else {
        const res = await createHomepageSection(formData);
        if (res.success) {
          alert("Created successfully!");
          loadSections();
          setEditingSection(null);
        } else {
          alert(res.message);
        }
      }
    } catch (e) {
      alert("Error saving section.");
    }
    setIsSaving(false);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this section?")) return;
    const res = await deleteHomepageSection(id);
    if (res.success) {
      loadSections();
      if (editingSection?.id === id) setEditingSection(null);
    }
  };

  const handleToggleActive = async (sec: any) => {
    const formData = new FormData();
    formData.append("is_active", String(!sec.is_active));
    const res = await updateHomepageSection(sec.id, formData);
    if (res.success) {
      setSections(prev => prev.map(s => s.id === sec.id ? { ...s, is_active: !sec.is_active } : s));
    }
  };

  const moveSection = async (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === sections.length - 1) return;

    const newSections = [...sections];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    // Swap display_order
    const tempOrder = newSections[index].display_order;
    newSections[index].display_order = newSections[targetIndex].display_order;
    newSections[targetIndex].display_order = tempOrder;

    // Swap elements in array for optimistic UI
    const temp = newSections[index];
    newSections[index] = newSections[targetIndex];
    newSections[targetIndex] = temp;

    setSections([...newSections]);

    // Persist
    const itemsToUpdate = [
      { id: newSections[index].id, display_order: newSections[index].display_order },
      { id: newSections[targetIndex].id, display_order: newSections[targetIndex].display_order }
    ];
    await reorderHomepageSections(itemsToUpdate);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-6xl mx-auto">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Homepage CMS</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage the layout and content of the landing page.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Layout Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-display text-charcoal mb-4 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-gold" /> Sections
            </h2>
            <p className="text-xs text-charcoal/60 mb-6">Order and toggle sections on the homepage.</p>
            
            {isLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : (
              <div className="space-y-3">
                {sections.length === 0 && <p className="text-sm text-gray-500 italic">No sections found. Add one below.</p>}
                
                {sections.map((sec, idx) => (
                  <div key={sec.id} className={`flex items-center gap-4 p-4 border rounded-xl transition-colors ${editingSection?.id === sec.id ? 'border-emerald bg-emerald/5' : 'bg-gray-50 border-gray-200'}`}>
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveSection(idx, 'up')} disabled={idx === 0} className="text-gray-400 hover:text-emerald disabled:opacity-30"><ArrowUp className="w-4 h-4" /></button>
                      <button onClick={() => moveSection(idx, 'down')} disabled={idx === sections.length - 1} className="text-gray-400 hover:text-emerald disabled:opacity-30"><ArrowDown className="w-4 h-4" /></button>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider bg-charcoal/10 px-2 py-0.5 rounded text-charcoal/60">{sec.section_type}</span>
                        <h4 className="text-sm font-medium text-charcoal">{sec.title || "Untitled"}</h4>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={sec.is_active} onChange={() => handleToggleActive(sec)} className="sr-only peer" />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald"></div>
                    </label>
                    <Button onClick={() => handleEdit(sec)} variant="ghost" size="sm" className="text-charcoal hover:bg-gray-200 rounded-lg">Edit</Button>
                    <button onClick={() => handleDelete(sec.id)} className="text-red-400 hover:text-red-600 p-2"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))}
              </div>
            )}

            <Button onClick={handleAddNew} variant="outline" className="w-full mt-6 border-dashed border-gray-300 text-charcoal/60 hover:border-emerald hover:text-emerald hover:bg-emerald/5 rounded-xl py-4 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add New Section
            </Button>
          </div>
        </div>

        {/* Editor Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-display text-charcoal mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald" /> Editor
            </h2>
            
            {!editingSection ? (
              <p className="text-sm text-gray-500 italic py-8 text-center">Select a section to edit or add a new one.</p>
            ) : (
              <div className="space-y-4">
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Section Type</label>
                  <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald">
                    <option value="hero">Hero Banner</option>
                    <option value="featured_boutiques">Featured Boutiques</option>
                    <option value="trending_collections">Trending Collections</option>
                    <option value="categories">Categories Grid</option>
                    <option value="testimonials">Testimonials</option>
                    <option value="custom">Custom JSON Content</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Title / Headline</label>
                  <input type="text" value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Subtitle / Description</label>
                  <textarea rows={2} value={subtitle} onChange={e => setSubtitle(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Background Image</label>
                  {editingSection.image_url && !imageFile && (
                    <div className="mb-2 text-xs text-emerald">Current image saved. Upload new to replace.</div>
                  )}
                  <input 
                    type="file" 
                    accept="image/*" 
                    ref={fileInputRef}
                    onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                    className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald/10 file:text-emerald hover:file:bg-emerald/20 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Content (JSON config / links)</label>
                  <textarea rows={4} value={contentStr} onChange={e => setContentStr(e.target.value)} placeholder='{"ctaText": "Shop Now", "ctaLink": "/search"}' className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm font-mono text-charcoal focus:outline-none focus:border-emerald"></textarea>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input type="checkbox" id="activeToggle" checked={isActive} onChange={e => setIsActive(e.target.checked)} className="w-4 h-4 text-emerald bg-gray-100 border-gray-300 rounded focus:ring-emerald focus:ring-2" />
                  <label htmlFor="activeToggle" className="text-sm font-medium text-gray-900">Active (Visible on Homepage)</label>
                </div>

                <div className="pt-4 border-t border-gray-100 flex gap-2">
                  <Button onClick={handleSaveSection} disabled={isSaving} className="flex-1 bg-emerald text-white rounded-full flex items-center justify-center gap-2">
                    <Save className="w-4 h-4" /> {isSaving ? "Saving..." : "Save Section"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
