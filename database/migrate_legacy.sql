-- ====================================================================
-- CLOCHE PLATFORM - SAFE TRANSACTIONAL LEGACY DATA MIGRATION SCRIPT
-- Version: 2.0.0 (Transactional with Pre-Validation & Rollback)
-- Environment: Production / Staging
-- ====================================================================

-- --------------------------------------------------------------------
-- STEP 1: PRE-MIGRATION PREVIEW & VALIDATION CHECK
-- --------------------------------------------------------------------
DO $$
BEGIN
    RAISE NOTICE '--- PRE-MIGRATION PREVIEW CHECK ---';
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'boutique_showcase') THEN
        RAISE NOTICE 'Table boutique_showcase found. Proceeding with migration...';
    ELSE
        RAISE NOTICE 'Table boutique_showcase not found in current schema. Skipping migration safely.';
    END IF;
END $$;

-- --------------------------------------------------------------------
-- STEP 2: SAFE TRANSACTIONAL MIGRATION (BEGIN ... COMMIT / ROLLBACK)
-- --------------------------------------------------------------------
BEGIN;

DO $$
BEGIN
    -- Check if boutique_showcase table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'boutique_showcase') THEN
        
        -- 1. Insert/Update into vendor_profiles
        EXECUTE '
            INSERT INTO vendor_profiles (
                vendor_id, category, business_name, tagline, description,
                city, district, address, contact_number, whatsapp, email,
                cover_image, is_verified, created_at, updated_at
            )
            SELECT 
                COALESCE(
                    NULLIF(slug, ''''),
                    NULLIF(id::text, ''''),
                    LOWER(REGEXP_REPLACE(COALESCE(boutique_name, name, ''boutique''), ''[^a-zA-Z0-9]+'', ''-'', ''g''))
                ) AS vendor_id,
                ''Bridal Wear'' AS category,
                COALESCE(boutique_name, name, ''Bridal Boutique'') AS business_name,
                COALESCE(NULLIF(area, ''''), NULLIF(district, ''''), ''Bridal Boutique'') AS tagline,
                COALESCE(NULLIF(description, ''''), NULLIF(about, ''''), ''Premium Bridal Boutique in Kerala'') AS description,
                COALESCE(NULLIF(city, ''''), NULLIF(district, ''''), ''Kochi'') AS city,
                COALESCE(NULLIF(district, ''''), ''Ernakulam'') AS district,
                COALESCE(NULLIF(address, ''''), NULLIF(area, ''''), ''Kerala'') AS address,
                COALESCE(NULLIF(phone, ''''), NULLIF(contact_number, ''''), ''+919876543210'') AS contact_number,
                COALESCE(NULLIF(whatsapp, ''''), NULLIF(phone, ''''), ''+919876543210'') AS whatsapp,
                COALESCE(NULLIF(email, ''''), ''contact@cloche.in'') AS email,
                COALESCE(NULLIF(image_url, ''''), NULLIF(cover_image, ''''), NULLIF(logo_url, ''''), NULLIF(image, '''')) AS cover_image,
                TRUE AS is_verified,
                COALESCE(created_at, NOW()) AS created_at,
                NOW() AS updated_at
            FROM boutique_showcase
            ON CONFLICT (vendor_id) DO UPDATE SET
            business_name = EXCLUDED.business_name,
            cover_image = COALESCE(EXCLUDED.cover_image, vendor_profiles.cover_image),
            city = COALESCE(EXCLUDED.city, vendor_profiles.city),
            district = COALESCE(EXCLUDED.district, vendor_profiles.district),
            updated_at = NOW()';

        -- 2. Insert/Update into boutiques
        EXECUTE '
            INSERT INTO boutiques (
                vendor_id, name, category_type, city, rating, cover_image, is_verified, created_at
            )
            SELECT 
                COALESCE(
                    NULLIF(slug, ''''),
                    NULLIF(id::text, ''''),
                    LOWER(REGEXP_REPLACE(COALESCE(boutique_name, name, ''boutique''), ''[^a-zA-Z0-9]+'', ''-'', ''g''))
                ) AS vendor_id,
                COALESCE(boutique_name, name, ''Bridal Boutique'') AS name,
                ''Bridal Wear'' AS category_type,
                COALESCE(NULLIF(city, ''''), NULLIF(district, ''''), ''Kochi'') AS city,
                COALESCE(rating, 5.0) AS rating,
                COALESCE(NULLIF(image_url, ''''), NULLIF(cover_image, ''''), NULLIF(logo_url, ''''), NULLIF(image, '''')) AS cover_image,
                TRUE AS is_verified,
                COALESCE(created_at, NOW()) AS created_at
            FROM boutique_showcase
            ON CONFLICT (vendor_id) DO UPDATE SET
            name = EXCLUDED.name,
            cover_image = COALESCE(EXCLUDED.cover_image, boutiques.cover_image),
            city = COALESCE(EXCLUDED.city, boutiques.city),
            rating = COALESCE(EXCLUDED.rating, boutiques.rating)';

        RAISE NOTICE 'Migration from boutique_showcase completed successfully.';
    ELSE
        RAISE NOTICE 'boutique_showcase table not present. No legacy rows to import.';
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration failed with error: %. Transaction rolled back automatically.', SQLERRM;
END $$;

COMMIT;

-- --------------------------------------------------------------------
-- STEP 3: POST-MIGRATION VERIFICATION CHECKS
-- --------------------------------------------------------------------
SELECT 'vendor_profiles count' AS entity, COUNT(*) AS record_count FROM vendor_profiles
UNION ALL
SELECT 'boutiques count' AS entity, COUNT(*) AS record_count FROM boutiques;
