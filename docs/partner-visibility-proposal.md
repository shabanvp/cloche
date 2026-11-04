# Partner vendor visibility proposal

## Rule

Public visitors should see a vendor if and only if `vendors.status = 'active'`. Do not require `publication_status = 'published'`: the site has active vendors with another publication status that must remain visible. This document reports the current paths and proposes minimal changes only; no visibility code was changed for this report.

## Current public read paths

| Surface | Current behavior | Minimal change to enforce the rule |
| --- | --- | --- |
| `frontend/src/app/api/v1/public/vendors/route.ts` | Already filters `deleted_at IS NULL` and `status = active`. It does not restrict `publication_status`, which matches the requested rule. | No status change needed. Keep this as the canonical listing query. |
| Shared lookup: `frontend/src/lib/supabase.ts` (`resolvePublicVendor`, used by `fetchPublicVendorProfileFromDb`) | The vendor-by-ID, vendor-code, profile-slug, profile-ID, boutique, and venue fallback queries do not consistently require `status = active`. The helper returns a profile without exposing the vendor status. | Add `status=eq.active` and `deleted_at=is.null` to each vendor resolution query. Make profile-slug/profile-ID resolution fail if the related vendor is not active. Preserve the returned public profile shape. |
| Public detail pages | `/vendors/[category]/[id]`, `/boutiques/[id]`, and category detail routes such as `/venues/[id]`, `/photographers/[id]`, `/bridal-wear/[id]`, and others call the shared lookup helper. Some pages render fallback profile data when no profile is found; they do not independently gate on `vendors.status`. | Have the public detail resolution return no profile for non-active vendors, and ensure each detail page calls `notFound()` instead of rendering a fallback vendor when lookup fails. The new `/v/[slug]` alias added in this branch checks `status=active` before redirecting; it does not change these existing routes. |
| Public listing through `frontend/src/app/api/boutiques/route.ts` | Reads the `boutiques` compatibility view and `vendors` without an active-status filter. The view includes `status` and `publication_status`. This feed is used by the `/vendors` and `/boutiques` pages and as a homepage fallback. | Filter both the view and vendor query by `status=eq.active` (or filter rows by status before returning them). Avoid falling back to non-active rows. |
| Search autocomplete: `frontend/src/app/api/v1/search/autocomplete/route.ts` | Reads all boutiques and all vendors, then returns matches without checking the vendor status. | Filter the boutiques view and vendor query by `status=eq.active` before ranking results. |
| Search registered vendors: `frontend/src/lib/realWeddings.ts` (`searchRegisteredVendors`, used by `/api/v1/public/vendors/search`) | The database query requires both active and published, which hides active vendors whose publication status is draft. If the query returns no match, the function returns hard-coded example vendors. | Keep `status=eq.active`, remove `publication_status=eq.published`, and return an empty result instead of the hard-coded vendor examples. |
| Trending recompute: `frontend/src/lib/trendingEngine.ts` | Reads vendors with both `status=active` and `publication_status=published`. | Remove the publication-status condition so every active vendor remains eligible. This is used to produce public trending data. |
| Sitemap | No sitemap source or generated sitemap file was found in the repository. | If a vendor sitemap is added, build its IDs/slugs from `vendors?status=eq.active`; do not include draft, pending, rejected, or suspended vendors. |
| Lead/enquiry resolution: `frontend/src/app/api/v1/leads/route.ts` | Converts an incoming `vendor_profiles.id` to `vendor_id`, but does not check that the resolved vendor is active before creating a lead. | After resolving the ID, query `vendors` by that ID with `status=eq.active&deleted_at=is.null`; reject the request before saving a lead if no active vendor is found. |
| Flutter app: `cloche_flutter/lib/services/api_service.dart` → `GET /api/boutiques` at the legacy backend | `cloche_flutter` calls `https://cloche-backend.onrender.com/api/boutiques`. The legacy `cloche-backend/controllers/boutiqueController.js` reads the `boutiques` compatibility view and filters verified rows, but verification is not an active-status check. The compatibility view exposes `status`. | Include `status` in the select list and add `.eq('status', 'active')` to both the normal and fallback boutique queries. Keep any verification filter separately if still required. |
| Android: `cloche-app/android` | The Android directory contains the Capacitor shell and no independent vendor/database queries. | No Android query change identified. Keep its web content pointed at the gated Cloche routes/API. |

## Other public-facing notes

- `frontend/src/app/api/v1/public/vendors/route.ts` is already the best source for the active-only rule.
- The public `/api/boutiques` route can return compatibility-view vendors and direct `vendors` rows without checking `status`; this affects more than the Flutter UI.
- `frontend/src/app/api/v1/search/autocomplete/route.ts` also reads the compatibility view directly, so fixing only the vendor-table query would leave non-active view rows searchable.
- Customer favorites, recently viewed vendors, quotations, and leads can legitimately reference previously saved vendors. Those account-history joins are not discovery feeds; avoid deleting historical references when enforcing the public discovery gate.

## Verification note

This is a source-code audit, not a live database query. No SQL was run and no database records or policies were changed.
