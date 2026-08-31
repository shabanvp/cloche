"use client";

import React from "react";
import { VendorStorefront } from "@/components/VendorStorefront";

interface VendorProfileDispatcherProps {
  profile: any;
  forcedCategory?: string;
}

export function VendorProfileDispatcher({ profile, forcedCategory }: VendorProfileDispatcherProps) {
  if (!profile) return null;

  const category = forcedCategory || profile.categorySlug || profile.categoryLabel || profile.category || "";

  return <VendorStorefront vendor={{ ...profile, category: category || profile.category }} />;
}
