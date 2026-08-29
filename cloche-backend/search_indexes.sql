-- 9. Search Performance Indexes
CREATE EXTENSION IF NOT EXISTS pg_trgm;

CREATE INDEX IF NOT EXISTS idx_products_product_name ON products USING GIN (product_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_products_category ON products (category);
CREATE INDEX IF NOT EXISTS idx_products_price ON products (price);
CREATE INDEX IF NOT EXISTS idx_boutiques_boutique_name ON boutiques USING GIN (boutique_name gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_boutiques_city ON boutiques (city);
CREATE INDEX IF NOT EXISTS idx_showcase_district ON boutique_showcase (district);
CREATE INDEX IF NOT EXISTS idx_showcase_tags ON boutique_showcase USING GIN (tags gin_trgm_ops);
CREATE INDEX IF NOT EXISTS idx_showcase_rating ON boutique_showcase (rating DESC);

-- Composite Performance Indexes for High-Traffic Queries
CREATE INDEX IF NOT EXISTS idx_vendors_status_deleted ON vendors (status, deleted_at);
CREATE INDEX IF NOT EXISTS idx_vendors_category_status ON vendors (category_id, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_vendor_categories_slug ON vendor_categories (slug);
CREATE INDEX IF NOT EXISTS idx_boutiques_city_rating ON boutiques (city, rating DESC);
CREATE INDEX IF NOT EXISTS idx_wishlists_user_product ON wishlists (user_id, product_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_boutique ON appointments (user_id, boutique_id);

