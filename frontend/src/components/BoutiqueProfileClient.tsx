"use client";

import { VendorProfileDispatcher } from "@/components/VendorProfileDispatcher";

interface BoutiqueProfileClientProps {
  profile: any;
}

export function BoutiqueProfileClient({ profile }: BoutiqueProfileClientProps) {
  return <VendorProfileDispatcher profile={profile} />;
}
