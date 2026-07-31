"use client";

import { VenueDetail } from "@/lib/venueData";
import { VenueProfileTemplate } from "@/components/vendor-templates/VenueProfileTemplate";

export function VenueDetailClient({ venue }: { venue: VenueDetail }) {
  return <VenueProfileTemplate venue={venue} preview={false} />;
}
