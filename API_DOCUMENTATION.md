# Cloche 2.0 API Documentation (Phase 9)

## 1. Reused Existing APIs

These endpoints from the legacy Express backend are actively integrated into Cloche 2.0 Next.js server components and client hooks.

### Boutiques
- `GET /api/boutiques`
  - **Usage:** Homepage Featured Boutiques, Search/Discovery, Admin Vendor Management.
- `GET /api/boutiques/:id`
  - **Usage:** Dynamic Boutique Profile pages (`/boutiques/[id]`).

### Products
- `GET /api/products`
  - **Usage:** Homepage Trending, Search/Discovery fallback.
- `GET /api/products/:productId`
  - **Usage:** Dynamic Collection Pages (`/collections/[id]`).
- `GET /api/products/boutique/:boutiqueId`
  - **Usage:** Vendor Collections CRM, Boutique Profile showcase.

### Admin
- `GET /api/admin/analytics`
  - **Usage:** Admin Dashboard Overview.

### Authentication
- `POST /api/auth/login`
- `POST /api/auth/register`
- `POST /api/auth/partner-login`

---

## 2. New APIs Created / Required (Phase 9 Integration)

To fulfill the "Production Ready" requirement, the following backend endpoints must be implemented.

### Customer Features
- `GET /api/wishlist` (Requires auth middleware)
- `POST /api/wishlist` (Add to wishlist)
- `DELETE /api/wishlist/:id` (Remove from wishlist)
- `GET /api/appointments/user` (Get customer appointments)
- `POST /api/appointments` (Book appointment)

### Vendor Features
- `GET /api/appointments/vendor` (Get vendor appointments)
- `PUT /api/appointments/:id/status` (Accept/Reject appointment)
- `PUT /api/leads/:id/status` (Update enquiry status)

### Content & CMS
- `GET /api/content/articles` (Fetch editorial blogs/guides)
- `GET /api/content/articles/:slug` (Fetch specific article)
- `GET /api/content/weddings` (Fetch real weddings)
- `GET /api/content/weddings/:id` (Fetch specific real wedding)
- `GET /api/cms/homepage` (Fetch ordered layout sections)

### Search & Discovery
- `GET /api/products/search`
  - **Query Params:** `?q=`, `?category=`, `?district=`, `?minPrice=`, `?maxPrice=`, `?page=`, `?limit=`
  - **Purpose:** Replaces client-side filtering with highly performant server-side PostgreSQL queries.

### Marketing
- `POST /api/marketing/newsletter` (Subscribe to mailing list)
