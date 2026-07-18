import { LayoutTemplate, Image as ImageIcon, MoveVertical, Plus, Save, Clock } from "lucide-react";
import { Button } from "@/components/Button";

export default function AdminHomepageCMS() {
  const sections = [
    { id: 1, type: "Hero Banner", title: "Main Welcome Banner", active: true },
    { id: 2, type: "Trending", title: "Top Collections Grid", active: true },
    { id: 3, type: "Featured", title: "Premium Boutiques Carousel", active: true },
    { id: 4, type: "Categories", title: "Visual Category Navigation", active: true },
    { id: 5, type: "Testimonials", title: "Success Stories", active: false },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-5xl">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-display text-charcoal">Homepage CMS</h1>
          <p className="text-sm text-charcoal/60 mt-1">Manage the layout and content of the landing page.</p>
        </div>
        <div className="flex gap-2">
          <span className="flex items-center gap-2 bg-purple-50 text-purple-600 px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider">
            <Clock className="w-4 h-4" /> Future Scalable MVP
          </span>
          <Button className="bg-emerald text-white rounded-full flex items-center gap-2">
            <Save className="w-4 h-4" /> Publish Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Layout Builder */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
            <h2 className="text-lg font-display text-charcoal mb-4 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-gold" /> Section Order
            </h2>
            <p className="text-xs text-charcoal/60 mb-6">Drag and drop to reorder how sections appear on the homepage.</p>
            
            <div className="space-y-3">
              {sections.map((sec) => (
                <div key={sec.id} className="flex items-center gap-4 p-4 bg-gray-50 border border-gray-200 rounded-xl group cursor-move hover:border-emerald transition-colors">
                  <MoveVertical className="w-5 h-5 text-charcoal/30 group-hover:text-emerald" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-charcoal/10 px-2 py-0.5 rounded text-charcoal/60">{sec.type}</span>
                      <h4 className="text-sm font-medium text-charcoal">{sec.title}</h4>
                    </div>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={sec.active} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-emerald"></div>
                  </label>
                  <Button variant="ghost" size="sm" className="text-charcoal hover:bg-gray-200 rounded-lg">Edit</Button>
                </div>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-6 border-dashed border-gray-300 text-charcoal/60 hover:border-emerald hover:text-emerald hover:bg-emerald/5 rounded-xl py-4 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" /> Add New Section
            </Button>
          </div>
        </div>

        {/* Editor Panel (Mock) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm sticky top-24">
            <h2 className="text-lg font-display text-charcoal mb-4 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-emerald" /> Hero Banner Editor
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Headline</label>
                <textarea rows={2} defaultValue="Kerala's Premium Wedding Marketplace" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
              </div>
              
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Subheadline</label>
                <textarea rows={2} defaultValue="Discover luxury bridal wear, groom collections, and exclusive boutiques curated for your perfect day." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Background Image</label>
                <div className="w-full h-32 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                  <ImageIcon className="w-6 h-6 text-gray-400 mb-1" />
                  <span className="text-xs text-charcoal/60 font-medium">Replace Image</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">CTA Button Text</label>
                <input type="text" defaultValue="Explore Collections" className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
