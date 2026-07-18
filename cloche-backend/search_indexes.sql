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
