-- Phase 2B Migration 32: Customer Portal Discovery, Favorites, Comparisons, Reviews & In-App Notifications
-- File: database/migrations/20260805000032_customer_portal_discovery.sql

BEGIN;

-- 1. Customer Favorites Table (Wishlist)
CREATE TABLE IF NOT EXISTS customer_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(customer_id, vendor_id)
);

-- 2. Customer Recently Viewed Vendors Table
CREATE TABLE IF NOT EXISTS customer_recently_viewed (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Vendor Comparison Lists Table
CREATE TABLE IF NOT EXISTS vendor_comparisons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    comparison_name VARCHAR(150) NOT NULL DEFAULT 'My Vendor Comparison',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Vendor Comparison Items Table (Max 4 per list enforced via API)
CREATE TABLE IF NOT EXISTS vendor_comparison_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    comparison_id UUID NOT NULL REFERENCES vendor_comparisons(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(comparison_id, vendor_id)
);

-- 5. Customer In-App Notifications Table
CREATE TABLE IF NOT EXISTS customer_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL CHECK (notification_type IN ('new_quotation', 'vendor_reply', 'inquiry_update', 'review_reminder', 'promotional')),
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Customer Reviews & Drafts Table
CREATE TABLE IF NOT EXISTS customer_review_drafts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    rating NUMERIC(3, 2) NOT NULL CHECK (rating >= 1.0 AND rating <= 5.0),
    review TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Performance B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_customer_fav_cust ON customer_favorites(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_recent_cust ON customer_recently_viewed(customer_id, viewed_at DESC);
CREATE INDEX IF NOT EXISTS idx_vendor_comp_cust ON vendor_comparisons(customer_id);
CREATE INDEX IF NOT EXISTS idx_customer_notif_cust_read ON customer_notifications(customer_id, is_read, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_vend_stat ON customer_review_drafts(vendor_id, status);

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON customer_favorites TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON customer_recently_viewed TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_comparisons TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON vendor_comparison_items TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON customer_notifications TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON customer_review_drafts TO anon, authenticated, service_role;

COMMIT;

NOTIFY pgrst, 'reload schema';
