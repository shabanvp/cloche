import { normalizeCategory } from "@/lib/categories";
import { formatCategory } from "@/lib/format";

type Row = Record<string, unknown>;

function asRow(value: unknown): Row {
  if (Array.isArray(value)) return asRow(value[0]);
  return value && typeof value === "object" ? value as Row : {};
}

function stringValue(...values: unknown[]): string {
  const value = values.find((candidate) => candidate != null && String(candidate).trim() !== "");
  return value == null ? "" : String(value).trim();
}

function numberValue(...values: unknown[]): number {
  for (const value of values) {
    if (value == null || (typeof value === "string" && !value.trim())) continue;
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
}

export function mapVendorCategory(source: Row): { category: string; categorySlug: string } {
  const relation = asRow(source.vendor_categories ?? source.vendor_category);
  const rawCategory = stringValue(
    relation.slug,
    relation.name,
    source.category_id,
    source.categorySlug,
    source.category_slug,
    typeof source.category === "string" ? source.category : undefined,
    source.tags
  );
  const normalized = normalizeCategory(rawCategory || undefined);
  const category = normalized?.title || formatCategory(rawCategory);
  const categorySlug = normalized?.slug || rawCategory.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "vendors";
  return { category, categorySlug };
}

/** Maps legacy boutiques, normalized vendor rows, and already mapped API rows to one public shape. */
export function mapPublicVendor(source: Row): Row {
  const profile = asRow(source.vendor_profiles ?? source.vendor_profile ?? source.profile);
  const address = asRow(source.vendor_addresses ?? source.vendor_address ?? source.address);
  const services = Array.isArray(source.vendor_services) ? source.vendor_services.map(asRow) : [];
  const servicePrices = services.map((service) => Number(service.base_price)).filter((price) => Number.isFinite(price) && price > 0);
  const category = mapVendorCategory(source);
  const name = stringValue(source.name, source.boutique_name, profile.business_name, source.business_name) || "Wedding Vendor";
  const city = stringValue(source.city, profile.city, address.city);
  const district = stringValue(source.district, source.area, profile.district, address.district);
  const state = stringValue(source.state, profile.state, address.state);
  const startingPrice = source.startingPrice ?? source.starting_price ?? profile.starting_price ?? (servicePrices.length ? Math.min(...servicePrices) : null);
  const logo = stringValue(source.logo, source.logoUrl, source.logo_url, profile.logo_url, asRow(profile.logo_media).cdn_url);
  const coverImage = stringValue(source.coverImage, source.cover_image, profile.cover_image, asRow(profile.cover_media).cdn_url);
  const reviews = numberValue(source.reviewCount, source.review_count, profile.review_count);

  return {
    ...source,
    id: stringValue(source.id),
    slug: stringValue(source.slug, profile.slug, source.vendor_code, source.id),
    name,
    boutique_name: name,
    ...category,
    category_slug: category.categorySlug,
    city,
    district,
    state,
    rating: numberValue(source.rating, profile.rating),
    reviewCount: reviews,
    review_count: reviews,
    startingPrice,
    starting_price: startingPrice,
    logo,
    logoUrl: logo,
    logo_url: logo,
    profileImage: stringValue(source.profileImage, source.profile_image, logo),
    coverImage,
    cover_image: coverImage,
  };
}
