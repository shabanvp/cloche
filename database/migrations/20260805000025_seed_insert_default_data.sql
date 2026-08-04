-- Phase 2B Migration 25: Master Seed Data Ingestion
-- File: database/migrations/20260805000025_seed_insert_default_data.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Seed Roles
INSERT INTO roles (name, description) VALUES
    ('super_admin', 'Full system access and platform management'),
    ('admin', 'Content moderation, vendor verification, and support management'),
    ('vendor', 'Registered business profile owner'),
    ('customer', 'Registered wedding planning user')
ON CONFLICT (name) DO NOTHING;

-- 2. Seed Default Feature Flags
INSERT INTO feature_flags (flag_key, description, is_enabled) VALUES
    ('enable_genie_ai_assistant', 'Cloche Genie AI Planning Assistant', true),
    ('enable_instant_booking', 'Direct customer instant booking confirmation', false),
    ('enable_whatsapp_notifications', 'Automated WhatsApp lead & booking alerts', true),
    ('enable_sponsored_listings', 'Vendor sponsored ad search placements', true)
ON CONFLICT (flag_key) DO NOTHING;

-- 3. Seed Master Categories (12 Standard Categories)
INSERT INTO vendor_categories (name, slug, description, icon_name) VALUES
    ('Wedding Venues', 'venues', 'Banquet halls, luxury resorts, beach lawns, and heritage palaces', 'Building'),
    ('Bridal Makeup & Hair', 'makeup', 'HD makeup, airbrush artists, saree draping, and bridal styling', 'Sparkles'),
    ('Wedding Photographers', 'photographers', 'Candid photography, cinematic films, pre-wedding shoots, and drone coverage', 'Camera'),
    ('Catering Services', 'catering', 'Multi-cuisine buffets, live counters, custom menus, and beverage services', 'Utensils'),
    ('Wedding Decorators', 'decorators', 'Floral mandaps, stage lighting, theme decor, and entrance concepts', 'Flower2'),
    ('Bridal Wear & Lehengas', 'bridal-wear', 'Designer lehengas, bridal gowns, sarees, and custom stitching', 'Shirt'),
    ('Jewellery & Accessories', 'jewellery', 'Kundan, Polki, gold sets, diamond jewellery, and bridal accessories', 'Gem'),
    ('Mehndi Artists', 'mehndi', 'Bridal henna, Arabic designs, Rajasthani patterns, and guest booking', 'Palette'),
    ('Invitation & Cards', 'invitations', 'Digital video invites, traditional printed cards, and luxury boxed gifts', 'Mail'),
    ('Wedding Entertainment', 'entertainment', 'DJ setups, live bands, sangeet choreographers, and celebrity performances', 'Music'),
    ('DJs & Live Bands', 'djs-bands', 'Professional wedding DJs, live acoustic bands, and sound setups', 'Disc'),
    ('Wedding Planners', 'planners', 'Full event execution, budget allocation, vendor coordination, and hospitality', 'Calendar')
ON CONFLICT (name) DO NOTHING;

-- 4. Seed Default Subscription Plans
INSERT INTO subscription_plans (name, code, monthly_price, annual_price, featured_listings_count, lead_quota_per_month) VALUES
    ('Free Tier', 'free', 0.00, 0.00, 0, 5),
    ('Silver Vendor', 'silver', 1999.00, 19990.00, 1, 30),
    ('Gold Partner', 'gold', 4999.00, 49990.00, 3, 100),
    ('Platinum Luxury', 'platinum', 9999.00, 99990.00, 10, 500)
ON CONFLICT (name) DO NOTHING;

-- 5. Seed System Default Settings
INSERT INTO system_settings (setting_key, setting_value, description, is_public) VALUES
    ('platform_commission_rate', '{"percentage": 10}'::jsonb, 'Default platform commission fee on bookings', false),
    ('platform_currency', '{"code": "INR", "symbol": "₹"}'::jsonb, 'Default platform operating currency', true),
    ('support_contact', '{"email": "support@cloche.wedding", "phone": "+91 9876543210"}'::jsonb, 'Platform customer support contact info', true)
ON CONFLICT (setting_key) DO NOTHING;

COMMIT;
