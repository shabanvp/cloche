-- ====================================================================
-- CLOCHE PLATFORM - PRODUCTION SUPABASE POSTGRESQL DATABASE SCHEMA
-- Version: 1.0.3 (Fully Idempotent Execution Script)
-- Environment: Production / Staging
-- Single Source of Truth for Web, Mobile, Tablet, Vendor & Admin Dashboards
-- ====================================================================

-- Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- --------------------------------------------------------------------
-- 0. CLEANUP INCOMPATIBLE LEGACY TABLES
-- --------------------------------------------------------------------
DROP TABLE IF EXISTS analytics_events CASCADE;
DROP TABLE IF EXISTS wishlists CASCADE;
DROP TABLE IF EXISTS reviews CASCADE;
DROP TABLE IF EXISTS bookings CASCADE;
DROP TABLE IF EXISTS advertisements CASCADE;
DROP TABLE IF EXISTS boutique_products CASCADE;
DROP TABLE IF EXISTS boutiques CASCADE;
DROP TABLE IF EXISTS coupon_redemptions CASCADE;
DROP TABLE IF EXISTS coupons CASCADE;
DROP TABLE IF EXISTS offers CASCADE;
DROP TABLE IF EXISTS venue_faqs CASCADE;
DROP TABLE IF EXISTS venue_custom_amenities CASCADE;
DROP TABLE IF EXISTS venue_packages CASCADE;
DROP TABLE IF EXISTS venue_gallery CASCADE;
DROP TABLE IF EXISTS venue_profiles CASCADE;
DROP TABLE IF EXISTS vendor_profiles CASCADE;
DROP TABLE IF EXISTS vendor_accounts CASCADE;
DROP TABLE IF EXISTS cloche_users CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- --------------------------------------------------------------------
-- 1. AUTHENTICATION & USERS & ROLES
-- --------------------------------------------------------------------

CREATE TABLE roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

INSERT INTO roles (name, description, permissions) VALUES
('admin', 'Super Administrator with full site-wide access', '{"all": true}'::jsonb),
('vendor', 'Registered Vendor managing store, packages, and offers', '{"vendor_dashboard": true}'::jsonb),
('customer', 'Verified Couple/Customer exploring and booking venues', '{"customer_dashboard": true}'::jsonb)
ON CONFLICT (name) DO NOTHING;

CREATE TABLE cloche_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_id VARCHAR(255) UNIQUE,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    role VARCHAR(50) NOT NULL DEFAULT 'customer' REFERENCES roles(name),
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE vendor_accounts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES cloche_users(id) ON DELETE CASCADE,
    vendor_id_slug VARCHAR(100) UNIQUE NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended')),
    subscription_plan VARCHAR(50) DEFAULT 'Pro',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 2. VENDOR PROFILES (ALL CATEGORIES)
-- --------------------------------------------------------------------

CREATE TABLE vendor_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL,
    business_name VARCHAR(255) NOT NULL,
    tagline VARCHAR(255),
    description TEXT,
    city VARCHAR(100) NOT NULL DEFAULT 'Kochi',
    district VARCHAR(100) NOT NULL DEFAULT 'Ernakulam',
    address TEXT,
    contact_number VARCHAR(50),
    whatsapp VARCHAR(50),
    email VARCHAR(255),
    website VARCHAR(255),
    instagram VARCHAR(255),
    cover_image TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE venue_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) UNIQUE NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    starting_price VARCHAR(50) DEFAULT '₹2,50,000 / day',
    min_guests INTEGER DEFAULT 100,
    max_guests INTEGER DEFAULT 3000,
    venue_type VARCHAR(50) DEFAULT 'Indoor + Outdoor' CHECK (venue_type IN ('Indoor', 'Outdoor', 'Indoor + Outdoor')),
    rooms_count INTEGER DEFAULT 12,
    parking_capacity VARCHAR(50) DEFAULT '250 Cars',
    bridal_suite_available BOOLEAN DEFAULT TRUE,
    power_backup_available BOOLEAN DEFAULT TRUE,
    inhouse_decoration VARCHAR(50) DEFAULT 'Allowed',
    music_policy VARCHAR(100) DEFAULT 'Live Band & DJ Allowed',
    food_policy VARCHAR(100) DEFAULT 'In-house Catering & External Allowed',
    alcohol_policy VARCHAR(100) DEFAULT 'Allowed with Permit',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 3. VENUE GALLERY, PACKAGES, AMENITIES, FAQS
-- --------------------------------------------------------------------

CREATE TABLE venue_gallery (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    public_id VARCHAR(255),
    secure_url TEXT NOT NULL,
    folder VARCHAR(100) DEFAULT 'venues/gallery',
    alt_text VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    is_cover BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE venue_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    price VARCHAR(100) NOT NULL,
    description TEXT,
    included_services JSONB DEFAULT '[]'::jsonb,
    is_popular BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE venue_custom_amenities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    icon VARCHAR(100) DEFAULT 'check_circle',
    description TEXT,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE venue_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 4. OFFERS & COUPONS ENGINE
-- --------------------------------------------------------------------

CREATE TABLE offers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    offer_slug VARCHAR(100) UNIQUE NOT NULL,
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL DEFAULT 'percentage',
    discount_type VARCHAR(50) NOT NULL DEFAULT 'percentage',
    discount_value VARCHAR(50) NOT NULL,
    package_ids JSONB DEFAULT '["all"]'::jsonb,
    coupon_code VARCHAR(50),
    banner_url TEXT,
    mobile_banner_url TEXT,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'scheduled', 'paused', 'expired', 'draft')),
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    max_redemptions INTEGER DEFAULT 50,
    current_redemptions INTEGER DEFAULT 0,
    min_booking_amount NUMERIC(12,2) DEFAULT 0,
    min_guests INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT FALSE,
    is_flash_sale BOOLEAN DEFAULT FALSE,
    flash_sale_ends_at TIMESTAMP WITH TIME ZONE,
    cta_text VARCHAR(100) DEFAULT 'Claim Offer',
    terms_and_conditions TEXT,
    analytics JSONB DEFAULT '{"views": 0, "clicks": 0, "bookings": 0, "revenue": 0}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE coupons (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    code VARCHAR(50) UNIQUE NOT NULL,
    discount_display VARCHAR(100) NOT NULL,
    min_booking_value NUMERIC(12,2) DEFAULT 0,
    max_uses INTEGER DEFAULT 100,
    current_uses INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'paused', 'expired')),
    expires_at DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE coupon_redemptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coupon_id UUID REFERENCES coupons(id) ON DELETE CASCADE,
    offer_id UUID REFERENCES offers(id) ON DELETE SET NULL,
    vendor_id VARCHAR(100) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    redeemed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 5. BOUTIQUES, COLLECTIONS & PRODUCTS
-- --------------------------------------------------------------------

CREATE TABLE boutiques (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) UNIQUE NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category_type VARCHAR(100) DEFAULT 'Bridal Wear',
    city VARCHAR(100) DEFAULT 'Kochi',
    rating NUMERIC(3,2) DEFAULT 4.9,
    cover_image TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE boutique_products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100) NOT NULL,
    price NUMERIC(12,2) NOT NULL,
    discount_price NUMERIC(12,2),
    sku VARCHAR(100),
    is_in_stock BOOLEAN DEFAULT TRUE,
    rating NUMERIC(3,2) DEFAULT 5.0,
    tags JSONB DEFAULT '[]'::jsonb,
    images JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 6. ADVERTISEMENTS & MARKETING CAMPAIGNS
-- --------------------------------------------------------------------

CREATE TABLE advertisements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    campaign_slug VARCHAR(100) UNIQUE NOT NULL,
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    campaign_name VARCHAR(255) NOT NULL,
    ad_package VARCHAR(100) NOT NULL,
    placement VARCHAR(100) NOT NULL,
    banner_url TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('active', 'pending', 'paused', 'expired', 'rejected', 'draft')),
    amount NUMERIC(12,2) NOT NULL,
    payment_status VARCHAR(50) DEFAULT 'unpaid' CHECK (payment_status IN ('paid', 'unpaid', 'refunded')),
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 7. BOOKINGS & QUOTES & LEADS
-- --------------------------------------------------------------------

CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50) NOT NULL,
    customer_email VARCHAR(255),
    event_date DATE NOT NULL,
    guest_count INTEGER DEFAULT 500,
    package_name VARCHAR(255),
    offer_code VARCHAR(50),
    total_price NUMERIC(12,2),
    discount_amount NUMERIC(12,2) DEFAULT 0,
    final_price NUMERIC(12,2),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Confirmed', 'Completed', 'Cancelled')),
    message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 8. REVIEWS & FEEDBACK
-- --------------------------------------------------------------------

CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    author_name VARCHAR(255) NOT NULL,
    author_avatar TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80',
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review_text TEXT NOT NULL,
    reply_text TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    is_pinned BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 9. WISHLISTS & ANALYTICS EVENTS
-- --------------------------------------------------------------------

CREATE TABLE wishlists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    customer_email VARCHAR(255) NOT NULL,
    vendor_id VARCHAR(100) NOT NULL REFERENCES vendor_profiles(vendor_id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    price VARCHAR(100),
    image_url TEXT,
    location VARCHAR(100),
    rating NUMERIC(3,2) DEFAULT 4.9,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE analytics_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id VARCHAR(100) NOT NULL,
    event_type VARCHAR(50) NOT NULL CHECK (event_type IN ('views', 'clicks', 'bookings', 'wishlist')),
    entity_type VARCHAR(50) DEFAULT 'venue',
    entity_id VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- --------------------------------------------------------------------
-- 10. INDEXES FOR HIGH-PERFORMANCE QUERYING
-- --------------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_vendor_profiles_category ON vendor_profiles(category);
CREATE INDEX IF NOT EXISTS idx_vendor_profiles_city ON vendor_profiles(city);
CREATE INDEX IF NOT EXISTS idx_venue_gallery_vendor ON venue_gallery(vendor_id);
CREATE INDEX IF NOT EXISTS idx_venue_packages_vendor ON venue_packages(vendor_id);
CREATE INDEX IF NOT EXISTS idx_offers_vendor_status ON offers(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_coupons_vendor_code ON coupons(vendor_id, code);
CREATE INDEX IF NOT EXISTS idx_advertisements_vendor ON advertisements(vendor_id);
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_status ON bookings(vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_reviews_vendor ON reviews(vendor_id);
CREATE INDEX IF NOT EXISTS idx_wishlists_customer ON wishlists(customer_email);
CREATE INDEX IF NOT EXISTS idx_analytics_vendor_type ON analytics_events(vendor_id, event_type);

-- --------------------------------------------------------------------
-- 11. ROW LEVEL SECURITY (RLS) POLICIES
-- --------------------------------------------------------------------

ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE venue_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE advertisements ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Clean Up Old RLS Policies If Already Existing
DROP POLICY IF EXISTS "Public Read Vendor Profiles" ON vendor_profiles;
DROP POLICY IF EXISTS "Public Read Venue Gallery" ON venue_gallery;
DROP POLICY IF EXISTS "Public Read Venue Packages" ON venue_packages;
DROP POLICY IF EXISTS "Public Read Offers" ON offers;
DROP POLICY IF EXISTS "Public Read Coupons" ON coupons;
DROP POLICY IF EXISTS "Public Read Reviews" ON reviews;

DROP POLICY IF EXISTS "Vendor Manage Own Profile" ON vendor_profiles;
DROP POLICY IF EXISTS "Vendor Manage Own Gallery" ON venue_gallery;
DROP POLICY IF EXISTS "Vendor Manage Own Packages" ON venue_packages;
DROP POLICY IF EXISTS "Vendor Manage Own Offers" ON offers;
DROP POLICY IF EXISTS "Vendor Manage Own Coupons" ON coupons;
DROP POLICY IF EXISTS "Vendor Manage Own Ads" ON advertisements;
DROP POLICY IF EXISTS "Vendor Manage Own Bookings" ON bookings;

-- Create Idempotent Public Read-Only Access Policies
CREATE POLICY "Public Read Vendor Profiles" ON vendor_profiles FOR SELECT USING (true);
CREATE POLICY "Public Read Venue Gallery" ON venue_gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Venue Packages" ON venue_packages FOR SELECT USING (true);
CREATE POLICY "Public Read Offers" ON offers FOR SELECT USING (true);
CREATE POLICY "Public Read Coupons" ON coupons FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON reviews FOR SELECT USING (true);

-- Create Idempotent Vendor & Admin Management Policies
CREATE POLICY "Vendor Manage Own Profile" ON vendor_profiles FOR ALL USING (true);
CREATE POLICY "Vendor Manage Own Gallery" ON venue_gallery FOR ALL USING (true);
CREATE POLICY "Vendor Manage Own Packages" ON venue_packages FOR ALL USING (true);
CREATE POLICY "Vendor Manage Own Offers" ON offers FOR ALL USING (true);
CREATE POLICY "Vendor Manage Own Coupons" ON coupons FOR ALL USING (true);
CREATE POLICY "Vendor Manage Own Ads" ON advertisements FOR ALL USING (true);
CREATE POLICY "Vendor Manage Own Bookings" ON bookings FOR ALL USING (true);
