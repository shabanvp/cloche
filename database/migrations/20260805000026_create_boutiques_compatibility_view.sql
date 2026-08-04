-- Phase 2B Migration 26: Boutiques Compatibility View for PostgREST & Legacy Backend
-- File: database/migrations/20260805000026_create_boutiques_compatibility_view.sql

BEGIN;

-- Drop existing table/view if needed and replace with backward-compatible view
DROP VIEW IF EXISTS public.boutiques CASCADE;

CREATE OR REPLACE VIEW public.boutiques AS
SELECT 
    v.id AS id,
    v.user_id AS user_id,
    v.vendor_code AS vendor_code,
    COALESCE(vp.business_name, u.full_name, 'Vendor') AS boutique_name,
    COALESCE(vp.business_name, u.full_name, 'Vendor') AS name,
    COALESCE(u.full_name, vp.business_name) AS owner_name,
    u.email AS email,
    u.phone AS phone,
    vc.name AS category,
    v.category_id AS category_id,
    COALESCE(vp.city, 'Kochi') AS city,
    COALESCE(vp.city, 'Ernakulam') AS district,
    COALESCE(vp.state, 'Kerala') AS state,
    vp.pincode AS pincode,
    COALESCE(vp.rating, 5.0) AS rating,
    COALESCE(vp.review_count, 0) AS review_count,
    vp.starting_price AS starting_price,
    COALESCE(vp.slug, LOWER(REPLACE(v.vendor_code, '-', ''))) AS slug,
    v.status AS status,
    v.publication_status AS publication_status,
    'early_partner'::VARCHAR AS plan,
    true AS is_featured,
    v.is_verified AS is_verified,
    v.created_at AS created_at,
    v.updated_at AS updated_at
FROM public.vendors v
LEFT JOIN public.users u ON u.id = v.user_id
LEFT JOIN public.vendor_profiles vp ON vp.vendor_id = v.id
LEFT JOIN public.vendor_categories vc ON vc.id = v.category_id;

-- Grant permissions to PostgREST roles (anon, authenticated, service_role)
GRANT SELECT ON public.boutiques TO anon, authenticated, service_role;

COMMIT;

-- Reload PostgREST schema cache
NOTIFY pgrst, 'reload schema';
