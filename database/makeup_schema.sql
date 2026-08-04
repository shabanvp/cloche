-- ====================================================================
-- CLOCHE PLATFORM - MAKEUP ARTIST PROFILE MODULE & VENDOR SCHEMAS
-- Scalable Normalized Architecture for Makeup Artists & All Vendor Categories
-- ====================================================================

-- Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. BASE VENDORS TABLE (Shared across all vendor categories)
CREATE TABLE IF NOT EXISTS vendors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    business_name VARCHAR(255) NOT NULL,
    owner_name VARCHAR(255),
    slug VARCHAR(255) UNIQUE NOT NULL,
    category VARCHAR(100) NOT NULL DEFAULT 'Bridal Makeup Artist',
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    whatsapp VARCHAR(50),
    logo TEXT,
    cover_image TEXT,
    city VARCHAR(100) DEFAULT 'Delhi NCR',
    state VARCHAR(100) DEFAULT 'Delhi',
    country VARCHAR(100) DEFAULT 'India',
    verified BOOLEAN DEFAULT TRUE,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'pending', 'suspended', 'rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. MAKEUP PROFILES TABLE (Makeup-specific metadata)
CREATE TABLE IF NOT EXISTS makeup_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    about TEXT,
    philosophy TEXT,
    experience_years INTEGER DEFAULT 8,
    response_time VARCHAR(100) DEFAULT 'Within 2 Hours',
    team_size INTEGER DEFAULT 6,
    languages JSONB DEFAULT '["English", "Hindi", "Punjabi"]'::jsonb,
    cities_served JSONB DEFAULT '["Delhi NCR", "Mumbai", "Jaipur", "Udaipur", "Goa", "Dubai"]'::jsonb,
    destination_wedding BOOLEAN DEFAULT TRUE,
    products_used JSONB DEFAULT '["Charlotte Tilbury", "MAC", "Dior", "NARS", "Tom Ford", "Huda Beauty"]'::jsonb,
    starting_price NUMERIC(12,2) DEFAULT 25000.00,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    youtube VARCHAR(255),
    website VARCHAR(255),
    studio_address TEXT DEFAULT 'DLF Phase 5, Golf Course Road, Gurgaon / South Delhi Studio',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. MAKEUP SERVICES TABLE
CREATE TABLE IF NOT EXISTS makeup_services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    service_name VARCHAR(255) NOT NULL,
    description TEXT,
    duration VARCHAR(50) DEFAULT '3 Hours',
    price NUMERIC(12,2) NOT NULL DEFAULT 25000.00,
    image TEXT,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. MAKEUP PACKAGES TABLE
CREATE TABLE IF NOT EXISTS makeup_packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    package_name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(12,2) NOT NULL DEFAULT 45000.00,
    includes JSONB DEFAULT '[]'::jsonb,
    travel VARCHAR(255) DEFAULT 'Travel charges extra for outstation',
    assistant VARCHAR(255) DEFAULT '2 Senior Assistant Artists Included',
    trial VARCHAR(255) DEFAULT 'Complimentary trial included on confirmation',
    hair VARCHAR(255) DEFAULT 'Hair Styling & Bun floral arrangement',
    draping VARCHAR(255) DEFAULT 'Lehenga & Dupatta Draping',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. MAKEUP PORTFOLIO TABLE
CREATE TABLE IF NOT EXISTS makeup_portfolio (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    category VARCHAR(100) NOT NULL DEFAULT 'Bridal' CHECK (category IN ('Bridal', 'Reception', 'Engagement', 'Haldi', 'Mehendi', 'Editorial', 'Celebrity', 'Before After', 'Christian', 'South Indian')),
    image_url TEXT NOT NULL,
    caption VARCHAR(255),
    sort_order INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 120,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. MAKEUP VIDEOS TABLE
CREATE TABLE IF NOT EXISTS makeup_videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    thumbnail TEXT NOT NULL,
    video_url TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    views_count VARCHAR(50) DEFAULT '120K',
    likes_count VARCHAR(50) DEFAULT '14.2K',
    duration VARCHAR(20) DEFAULT '0:45',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. MAKEUP REVIEWS TABLE
CREATE TABLE IF NOT EXISTS makeup_reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name VARCHAR(255) NOT NULL,
    customer_avatar TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) DEFAULT 5,
    review TEXT NOT NULL,
    wedding_date VARCHAR(100),
    images JSONB DEFAULT '[]'::jsonb,
    vendor_reply JSONB,
    verified_bride BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. MAKEUP FAQS TABLE
CREATE TABLE IF NOT EXISTS makeup_faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. MAKEUP AWARDS TABLE
CREATE TABLE IF NOT EXISTS makeup_awards (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    organization VARCHAR(255),
    year VARCHAR(20),
    image TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. MAKEUP GALLERY CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS makeup_gallery_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) UNIQUE NOT NULL,
    icon VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- SEED GALLERY CATEGORIES
INSERT INTO makeup_gallery_categories (name, icon) VALUES
('Bridal', 'sparkles'),
('Reception', 'star'),
('Engagement', 'heart'),
('Haldi', 'sun'),
('Mehendi', 'flower'),
('Editorial', 'camera'),
('Celebrity', 'crown'),
('Before After', 'refresh')
ON CONFLICT (name) DO NOTHING;
