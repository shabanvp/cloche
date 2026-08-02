-- ====================================================================
-- CLOCHE PLATFORM - PRODUCTION SUPABASE DATA SEED & MIGRATION SCRIPT
-- Version: 1.0.0
-- Idempotent & Duplicate-Safe Insertion for Venues, Boutiques, Packages, Offers & Products
-- ====================================================================

-- --------------------------------------------------------------------
-- 1. VENDOR PROFILES (REAL CLOCHE VENDORS)
-- --------------------------------------------------------------------

INSERT INTO vendor_profiles (vendor_id, category, business_name, tagline, description, city, district, address, contact_number, whatsapp, email, website, instagram, cover_image, is_verified) VALUES
('v-solitaire', 'Venue', 'Grand Solitaire Resort & Convention Centre', 'Kerala’s Premier Waterfront Wedding & Convention Destination', 'Grand Solitaire Resort offers ultra-luxurious waterfront wedding lawns, majestic banquet halls, world-class catering, and dedicated bridal suites in Kochi.', 'Kochi', 'Ernakulam', 'Marine Drive, Kochi, Kerala 682031', '+919876543210', '+919876543210', 'events@grandsolitaire.com', 'https://grandsolitaire.com', '@grandsolitaire', 'https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80', TRUE),

('shifa-covention-centre', 'Venue', 'Shifa Convention Centre', 'Spacious & Elegant Venue for Grand Celebrations', 'Shifa Convention Centre is a state-of-the-art wedding venue equipped with central air conditioning, lush green lawns, and ample parking space in Kochi.', 'Kochi', 'Ernakulam', 'NH Bypass, Edappally, Kochi, Kerala 682024', '+919847012345', '+919847012345', 'contact@shifaconvention.com', 'https://shifaconvention.com', '@shifaconvention', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', TRUE),

('palace-estate', 'Venue', 'The Palace Estate', 'Royal Heritage Destination Wedding Resort', 'The Palace Estate offers palatial architecture, royal lawns, and lakefront views designed for high-profile heritage weddings.', 'Udaipur', 'Udaipur', 'Lake Palace Road, Udaipur, Rajasthan 313001', '+919829011223', '+919829011223', 'concierge@palaceestate.in', 'https://palaceestate.in', '@palaceestate', 'https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80', TRUE),

('grand-hyatt-kochi', 'Venue', 'Grand Hyatt Kochi Bolgatty', '5-Star Luxury Waterfront Hotel & International Convention Centre', 'Set on Bolgatty Island, Grand Hyatt Kochi offers 100,000 sq ft of indoor and outdoor event spaces overlooking Vembanad Lake.', 'Kochi', 'Ernakulam', 'Bolgatty Island, Kochi, Kerala 682050', '+914842661234', '+914842661234', 'kochi.grand@hyatt.com', 'https://hyatt.com', '@grandhyattkochi', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80', TRUE),

('aurora-bridal-couture', 'Bridal Wear', 'Aurora Bridal Couture', 'Luxury Designer Lehengas & Handcrafted Bridal Wear', 'Aurora Bridal Couture specializes in bespoke bridal lehengas, silk sarees, and handcrafted wedding trousseaus tailored to perfection.', 'Kochi', 'Ernakulam', 'Panampilly Nagar, Kochi, Kerala 682036', '+919895011223', '+919895011223', 'orders@aurorabridal.com', 'https://aurorabridal.com', '@aurorabridal', 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=1200&q=80', TRUE),

('valaya-heritage-couture', 'Bridal Wear', 'Valaya Heritage Couture', 'Royal Embroidery & Heritage Bridal Ensembles', 'Valaya Heritage Couture brings regal bridal aesthetics with intricate zardozi, handwoven silk, and custom wedding couture.', 'Kochi', 'Ernakulam', 'MG Road, Kochi, Kerala 682016', '+919846055443', '+919846055443', 'contact@valayaheritage.in', 'https://valayaheritage.in', '@valayaheritage', 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80', TRUE)
ON CONFLICT (vendor_id) DO UPDATE SET
business_name = EXCLUDED.business_name,
cover_image = EXCLUDED.cover_image,
updated_at = NOW();

-- --------------------------------------------------------------------
-- 2. VENUE PROFILES
-- --------------------------------------------------------------------

INSERT INTO venue_profiles (vendor_id, starting_price, min_guests, max_guests, venue_type, rooms_count, parking_capacity, bridal_suite_available, power_backup_available, inhouse_decoration, music_policy, food_policy, alcohol_policy) VALUES
('v-solitaire', '₹2,50,000 / day', 200, 2500, 'Indoor + Outdoor', 16, '350 Cars', TRUE, TRUE, 'Allowed', 'Live Band & DJ Allowed till 10 PM', 'In-house & External Catering Allowed', 'Allowed with Permit'),
('shifa-covention-centre', '₹1,75,000 / day', 150, 1800, 'Indoor + Outdoor', 10, '200 Cars', TRUE, TRUE, 'Allowed', 'DJ Allowed till 10 PM', 'External Catering Allowed', 'Not Allowed'),
('palace-estate', '₹8,00,000 / day', 300, 1200, 'Indoor + Outdoor', 40, '250 Cars', TRUE, TRUE, 'In-house Only', 'Live Music & DJ Allowed', 'In-house Catering Only', 'Allowed'),
('grand-hyatt-kochi', '₹12,00,000 / day', 500, 3500, 'Indoor + Outdoor', 264, '500 Cars', TRUE, TRUE, 'In-house & External Allowed', 'Live Band & DJ Allowed', 'In-house Catering Only', 'Allowed')
ON CONFLICT (vendor_id) DO UPDATE SET
starting_price = EXCLUDED.starting_price,
max_guests = EXCLUDED.max_guests;

-- --------------------------------------------------------------------
-- 3. VENUE GALLERY (CLOUDINARY IMAGE URLS)
-- --------------------------------------------------------------------

INSERT INTO venue_gallery (vendor_id, public_id, secure_url, sort_order, is_cover) VALUES
('v-solitaire', 'v_solitaire_cover', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 0, TRUE),
('v-solitaire', 'v_solitaire_1', 'https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=800&q=80', 1, FALSE),
('v-solitaire', 'v_solitaire_2', 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=800&q=80', 2, FALSE),
('v-solitaire', 'v_solitaire_3', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', 3, FALSE),
('shifa-covention-centre', 'shifa_cover', 'https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80', 0, TRUE),
('shifa-covention-centre', 'shifa_1', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80', 1, FALSE),
('shifa-covention-centre', 'shifa_2', 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80', 2, FALSE)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------
-- 4. VENUE PACKAGES
-- --------------------------------------------------------------------

INSERT INTO venue_packages (vendor_id, name, price, description, included_services, is_popular, is_featured) VALUES
('v-solitaire', 'Royal Heritage Package', '₹3,50,000', 'Complete grand hall setup with air conditioning, stage lighting, and sound system for up to 1000 guests.', '["Full AC Banquet Access", "Stage & LED Screen Setup", "Valet Parking", "2 Luxury Bridal Suites"]'::jsonb, TRUE, TRUE),
('v-solitaire', 'Waterfront Lawn Package', '₹2,50,000', 'Lush outdoor waterfront lawn setting with seating arrangements and ambient evening lighting.', '["Lawn Access", "Ambient Lighting", "Bridal Suite", "Power Backup"]'::jsonb, FALSE, FALSE),
('shifa-covention-centre', 'Premium Wedding Package', '₹2,20,000', 'Spacious AC convention hall with stage backdrop and dining hall capacity for 1200 guests.', '["AC Main Hall", "Dining Area", "Stage Setup", "Bridal Room"]'::jsonb, TRUE, TRUE)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------
-- 5. OFFERS ENGINE
-- --------------------------------------------------------------------

INSERT INTO offers (offer_slug, vendor_id, name, type, discount_type, discount_value, package_ids, coupon_code, banner_url, status, start_date, end_date, max_redemptions, current_redemptions, cta_text) VALUES
('solitaire-earlybird-2026', 'v-solitaire', 'Early Bird Booking Offer', 'percentage', 'percentage', '15% OFF', '["all"]'::jsonb, 'SOLITAIRE15', 'https://images.unsplash.com/photo-1519167758481-83f552bb8c74?auto=format&fit=crop&w=1200&q=80', 'active', '2026-01-01', '2026-12-31', 50, 4, 'Claim 15% OFF'),
('shifa-monsoon-special', 'shifa-covention-centre', 'Monsoon Season Discount', 'fixed', 'fixed', '₹25,000 Flat OFF', '["all"]'::jsonb, 'SHIFA25K', 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80', 'active', '2026-06-01', '2026-09-30', 30, 2, 'Claim ₹25,000 OFF')
ON CONFLICT (offer_slug) DO UPDATE SET
name = EXCLUDED.name,
discount_value = EXCLUDED.discount_value,
status = EXCLUDED.status;

-- --------------------------------------------------------------------
-- 6. BOUTIQUES & BOUTIQUE PRODUCTS
-- --------------------------------------------------------------------

INSERT INTO boutiques (vendor_id, name, category_type, city, rating, cover_image, is_verified) VALUES
('aurora-bridal-couture', 'Aurora Bridal Couture', 'Bridal Wear', 'Kochi', 4.9, 'https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80', TRUE),
('valaya-heritage-couture', 'Valaya Heritage Couture', 'Bridal Wear', 'Kochi', 4.8, 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80', TRUE)
ON CONFLICT (vendor_id) DO UPDATE SET
rating = EXCLUDED.rating;

INSERT INTO boutique_products (vendor_id, title, description, category, price, discount_price, sku, is_in_stock, rating, tags, images) VALUES
('aurora-bridal-couture', 'Crimson Royal Velvet Lehenga', 'Hand-embroidered crimson velvet bridal lehenga with heavy zardozi work and double dupatta.', 'Lehengas', 125000.00, 110000.00, 'AUR-L01', TRUE, 5.0, '["Bridal", "Velvet", "Red"]'::jsonb, '["https://images.unsplash.com/photo-1549417229-aa67d3263c09?auto=format&fit=crop&w=800&q=80"]'::jsonb),
('aurora-bridal-couture', 'Pastel Pink Organza Saree', 'Lightweight pastel pink tissue organza saree with delicate hand-worked zari border.', 'Sarees', 45000.00, 39999.00, 'AUR-S02', TRUE, 4.8, '["Pastel", "Saree", "Organza"]'::jsonb, '["https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=800&q=80"]'::jsonb)
ON CONFLICT DO NOTHING;

-- --------------------------------------------------------------------
-- 7. REVIEWS & FEEDBACK
-- --------------------------------------------------------------------

INSERT INTO reviews (vendor_id, author_name, author_avatar, rating, review_text, reply_text, is_verified) VALUES
('v-solitaire', 'Ananya & Rahul', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80', 5, 'Grand Solitaire turned our dream wedding into reality! The waterfront setting was breathtaking and the management was top notch.', 'Thank you Ananya & Rahul! It was an honor hosting your special day.', TRUE),
('shifa-covention-centre', 'Fathima & Shahid', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80', 5, 'Exceptional venue facilities with superb AC cooling and spacious dining setup.', 'Thank you for your wonderful review!', TRUE)
ON CONFLICT DO NOTHING;
