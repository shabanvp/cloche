"use client";

import Link from "next/link";
import { ArrowLeft, UploadCloud } from "lucide-react";
import { Button } from "@/components/Button";

export default function NewCollectionPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-4xl mx-auto">
      
      <div className="flex items-center gap-4 border-b border-gold/10 pb-4">
        <Link href="/vendor/collections">
          <Button variant="ghost" size="icon" className="rounded-full text-charcoal/60 hover:text-emerald hover:bg-emerald/10">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-display text-charcoal">Add New Collection</h1>
          <p className="text-sm text-charcoal/60 mt-1">Create a new listing for your boutique.</p>
        </div>
      </div>

      <form className="space-y-8">
        
        {/* Media Upload */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Media (Images & Video)</h2>
          <div className="border-2 border-dashed border-gold/20 rounded-xl p-8 text-center hover:bg-ivory/50 transition-colors cursor-pointer group">
            <UploadCloud className="w-10 h-10 text-gold mx-auto mb-3 opacity-70 group-hover:opacity-100 transition-opacity" />
            <p className="text-sm font-medium text-charcoal mb-1">Click to upload or drag and drop</p>
            <p className="text-xs text-charcoal/50">High resolution JPG, PNG or MP4 (Max 10MB each)</p>
          </div>
        </section>

        {/* Basic Details */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Basic Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Collection Title</label>
              <input type="text" placeholder="e.g. Royal Emerald Bridal Lehenga" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Category</label>
              <select className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald">
                <option>Bridal Wear</option>
                <option>Groom Wear</option>
                <option>Jewellery</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Price (INR)</label>
              <input type="number" placeholder="0.00" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Purchase Type</label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal">
                  <input type="radio" name="type" className="accent-emerald w-4 h-4" defaultChecked /> Purchase
                </label>
                <label className="flex items-center gap-2 cursor-pointer text-sm text-charcoal">
                  <input type="radio" name="type" className="accent-emerald w-4 h-4" /> Rental
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Availability</label>
              <select className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald">
                <option>In Stock / Ready to ship</option>
                <option>Made to Order</option>
                <option>Out of Stock</option>
              </select>
            </div>
          </div>
        </section>

        {/* Specifications */}
        <section className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gold/10">
          <h2 className="text-lg font-display text-charcoal mb-4 border-b border-gold/10 pb-3">Specifications</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Fabric</label>
              <input type="text" placeholder="e.g. Raw Silk, Kanchipuram" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Colors Available</label>
              <input type="text" placeholder="e.g. Ivory, Maroon, Gold" className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-charcoal/60 mb-2">Description</label>
            <textarea rows={5} placeholder="Describe the collection in detail..." className="w-full bg-ivory border border-gold/20 rounded-xl p-3 text-sm text-charcoal focus:outline-none focus:border-emerald"></textarea>
          </div>
        </section>

        {/* Actions */}
        <div className="flex justify-end gap-4 pt-4 pb-12">
          <Button variant="outline" type="button" className="rounded-full border-charcoal/20 text-charcoal">Save as Draft</Button>
          <Button type="button" className="bg-emerald text-white rounded-full">Publish Collection</Button>
        </div>

      </form>
    </div>
  );
}
