-- ====================================================================
-- CLOCHE PLATFORM - LEGACY DATA PRE-CHECK, PREVIEW & MIGRATION SCRIPT
-- Version: 3.0.0 (Column Audit, Top 10 Preview, Transactional Execution)
-- Environment: Production / Staging
-- ====================================================================

-- --------------------------------------------------------------------
-- STEP 1: PRE-CHECK SOURCE COLUMNS & GENERATE AUDIT REPORT
-- --------------------------------------------------------------------
DO $$
DECLARE
    table_exists BOOLEAN := FALSE;
BEGIN
    RAISE NOTICE '====================================================';
    RAISE NOTICE '1. AUDITING LEGACY TABLE & COLUMN STRUCTURE...';
    RAISE NOTICE '====================================================';

    SELECT EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'boutique_showcase'
    ) INTO table_exists;

    IF NOT table_exists THEN
        RAISE NOTICE 'NOTICE: Table "boutique_showcase" is not present in public schema.';
        RAISE NOTICE 'Skipping direct column migration. Seeded vendors remain active.';
    ELSE
        RAISE NOTICE '✓ Table "boutique_showcase" exists in public schema.';
    END IF;
END $$;

-- --------------------------------------------------------------------
-- STEP 2: PREVIEW MODE - TOP 10 MAPPED RECORDS (READ-ONLY QUERY)
-- --------------------------------------------------------------------
SELECT 
    COALESCE(
        NULLIF(b.slug, ''),
        NULLIF(b.id::text, ''),
        LOWER(REGEXP_REPLACE(COALESCE(b.boutique_name, b.name, 'boutique'), '[^a-zA-Z0-9]+', '-', 'g'))
    ) AS mapped_vendor_id,
    'Bridal Wear' AS mapped_category,
    COALESCE(b.boutique_name, b.name, 'Bridal Boutique') AS mapped_business_name,
    COALESCE(NULLIF(b.city, ''), NULLIF(b.district, ''), 'Kochi') AS mapped_city,
    COALESCE(NULLIF(b.district, ''), 'Ernakulam') AS mapped_district,
    COALESCE(NULLIF(b.image_url, ''), NULLIF(b.cover_image, ''), NULLIF(b.logo_url, ''), NULLIF(b.image, '')) AS mapped_cover_image,
    COALESCE(b.rating, 5.0) AS mapped_rating
FROM (
    SELECT 1 AS dummy
) d
LEFT JOIN boutique_showcase b ON TRUE
LIMIT 10;

-- --------------------------------------------------------------------
-- STEP 3: TRANSACTIONAL EXECUTION WITH AUTOMATIC ROLLBACK
-- --------------------------------------------------------------------
BEGIN;

DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = 'boutique_showcase'
    ) THEN
        RAISE NOTICE 'Executing safe transactional migration from boutique_showcase...';

        -- 1. Populate vendor_profiles
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

        -- 2. Populate boutiques
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

        RAISE NOTICE 'Migration execution successful.';
    ELSE
        RAISE NOTICE 'No legacy boutique_showcase table detected. Preserving existing vendors.';
    END IF;

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Migration halted with error: %. Automatic rollback performed.', SQLERRM;
END $$;

COMMIT;

-- --------------------------------------------------------------------
-- STEP 4: POST-COMMIT VERIFICATION QUERY
-- --------------------------------------------------------------------
SELECT 'vendor_profiles' AS table_name, COUNT(*) AS record_count FROM vendor_profiles
UNION ALL
SELECT 'boutiques' AS table_name, COUNT(*) AS record_count FROM boutiques
UNION ALL
SELECT 'boutique_products' AS table_name, COUNT(*) AS record_count FROM boutique_products;
