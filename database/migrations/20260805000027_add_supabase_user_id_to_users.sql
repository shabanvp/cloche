-- Phase 2B Migration 27: Add Supabase User ID & Atomic Registration RPC Functions
-- File: database/migrations/20260805000027_add_supabase_user_id_to_users.sql

BEGIN;

-- 1. Add supabase_user_id column to users table if not exists and make password_hash nullable
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS supabase_user_id UUID UNIQUE;
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;

-- 2. Create helper slug generation function for vendors if not exists
CREATE OR REPLACE FUNCTION public.generate_vendor_slug(p_name TEXT)
RETURNS TEXT AS $$
DECLARE
    v_base TEXT;
    v_random INT;
BEGIN
    v_base := LOWER(TRIM(REGEXP_REPLACE(p_name, '[^a-zA-Z0-9]+', '-', 'g')));
    v_base := TRIM(BOTH '-' FROM v_base);
    IF v_base IS NULL OR v_base = '' THEN
        v_base := 'vendor';
    END IF;
    v_random := FLOOR(1000 + RANDOM() * 9000)::INT;
    RETURN v_base || '-' || v_random::TEXT;
END;
$$ LANGUAGE plpgsql;

-- 3. Atomic Customer Registration RPC Function
CREATE OR REPLACE FUNCTION public.register_customer_atomic(
    p_supabase_user_id UUID,
    p_email TEXT,
    p_full_name TEXT,
    p_phone TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
    v_clean_email TEXT;
    v_clean_name TEXT;
BEGIN
    v_clean_email := LOWER(TRIM(p_email));
    v_clean_name := TRIM(p_full_name);

    -- Check if user record already exists for this email
    SELECT id INTO v_user_id FROM public.users WHERE email = v_clean_email;

    IF v_user_id IS NOT NULL THEN
        -- Update existing user record with supabase_user_id and latest profile info
        UPDATE public.users 
        SET 
            supabase_user_id = p_supabase_user_id,
            full_name = COALESCE(v_clean_name, full_name),
            name = COALESCE(v_clean_name, name),
            phone = COALESCE(p_phone, phone),
            updated_at = NOW()
        WHERE id = v_user_id;
    ELSE
        -- Insert new user record
        INSERT INTO public.users (
            supabase_user_id,
            email,
            full_name,
            name,
            phone,
            is_active,
            is_verified
        ) VALUES (
            p_supabase_user_id,
            v_clean_email,
            v_clean_name,
            v_clean_name,
            p_phone,
            true,
            false
        ) RETURNING id INTO v_user_id;
    END IF;

    -- Ensure customer role exists and is assigned
    SELECT id INTO v_role_id FROM public.roles WHERE name = 'customer';
    IF v_role_id IS NULL THEN
        INSERT INTO public.roles (name, description) VALUES ('customer', 'Customer role')
        RETURNING id INTO v_role_id;
    END IF;

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (v_user_id, v_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'supabase_user_id', p_supabase_user_id,
        'email', v_clean_email
    );
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'register_customer_atomic failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Atomic Vendor Registration RPC Function
CREATE OR REPLACE FUNCTION public.register_vendor_atomic(
    p_supabase_user_id UUID,
    p_email TEXT,
    p_owner_name TEXT,
    p_phone TEXT,
    p_business_name TEXT,
    p_category_name TEXT DEFAULT 'Bridal Boutique',
    p_city TEXT DEFAULT 'Kochi',
    p_state TEXT DEFAULT 'Kerala',
    p_pincode TEXT DEFAULT NULL,
    p_address TEXT DEFAULT NULL,
    p_website TEXT DEFAULT NULL,
    p_instagram TEXT DEFAULT NULL,
    p_description TEXT DEFAULT NULL,
    p_gst_number TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_role_id UUID;
    v_category_id UUID;
    v_vendor_id UUID;
    v_profile_id UUID;
    v_version_id UUID;
    v_vendor_code TEXT;
    v_slug TEXT;
    v_clean_email TEXT;
    v_clean_owner TEXT;
    v_clean_biz TEXT;
BEGIN
    v_clean_email := LOWER(TRIM(p_email));
    v_clean_owner := TRIM(p_owner_name);
    v_clean_biz := TRIM(p_business_name);

    -- 1. Insert or Update User Record
    SELECT id INTO v_user_id FROM public.users WHERE email = v_clean_email;

    IF v_user_id IS NOT NULL THEN
        UPDATE public.users 
        SET 
            supabase_user_id = p_supabase_user_id,
            full_name = COALESCE(v_clean_owner, v_clean_biz, full_name),
            name = COALESCE(v_clean_owner, v_clean_biz, name),
            phone = COALESCE(p_phone, phone),
            updated_at = NOW()
        WHERE id = v_user_id;
    ELSE
        INSERT INTO public.users (
            supabase_user_id,
            email,
            full_name,
            name,
            phone,
            is_active,
            is_verified
        ) VALUES (
            p_supabase_user_id,
            v_clean_email,
            COALESCE(v_clean_owner, v_clean_biz),
            COALESCE(v_clean_owner, v_clean_biz),
            p_phone,
            true,
            false
        ) RETURNING id INTO v_user_id;
    END IF;

    -- 2. Assign Vendor Role in user_roles
    SELECT id INTO v_role_id FROM public.roles WHERE name = 'vendor';
    IF v_role_id IS NULL THEN
        INSERT INTO public.roles (name, description) VALUES ('vendor', 'Vendor role')
        RETURNING id INTO v_role_id;
    END IF;

    INSERT INTO public.user_roles (user_id, role_id)
    VALUES (v_user_id, v_role_id)
    ON CONFLICT (user_id, role_id) DO NOTHING;

    -- 3. Resolve Vendor Category ID
    IF p_category_name IS NOT NULL AND p_category_name <> '' THEN
        SELECT id INTO v_category_id FROM public.vendor_categories 
        WHERE name ILIKE '%' || p_category_name || '%' LIMIT 1;
    END IF;

    IF v_category_id IS NULL THEN
        SELECT id INTO v_category_id FROM public.vendor_categories LIMIT 1;
    END IF;

    -- 4. Create Core Vendor Record
    v_vendor_code := 'VND-2026-' || FLOOR(1000 + RANDOM() * 9000)::TEXT;

    INSERT INTO public.vendors (
        vendor_code,
        user_id,
        category_id,
        status,
        publication_status,
        onboarding_stage,
        profile_completion_percentage,
        is_verified,
        is_kyc_verified
    ) VALUES (
        v_vendor_code,
        v_user_id,
        v_category_id,
        'pending',
        'draft',
        'registration_started',
        20,
        false,
        false
    ) RETURNING id INTO v_vendor_id;

    -- 5. Create Vendor Profile
    v_slug := public.generate_vendor_slug(v_clean_biz);

    INSERT INTO public.vendor_profiles (
        vendor_id,
        business_name,
        slug,
        about,
        city,
        state,
        pincode,
        rating,
        review_count
    ) VALUES (
        v_vendor_id,
        v_clean_biz,
        v_slug,
        p_description,
        COALESCE(p_city, 'Kochi'),
        COALESCE(p_state, 'Kerala'),
        p_pincode,
        0.0,
        0
    ) RETURNING id INTO v_profile_id;

    -- 6. Create Initial Vendor Profile Version
    INSERT INTO public.vendor_profile_versions (
        vendor_id,
        version_number,
        status,
        change_summary,
        created_by
    ) VALUES (
        v_vendor_id,
        1,
        'draft',
        'Initial vendor registration draft profile',
        v_user_id
    ) RETURNING id INTO v_version_id;

    RETURN jsonb_build_object(
        'success', true,
        'user_id', v_user_id,
        'vendor_id', v_vendor_id,
        'profile_id', v_profile_id,
        'version_id', v_version_id,
        'vendor_code', v_vendor_code,
        'slug', v_slug,
        'business_name', v_clean_biz
    );
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'register_vendor_atomic failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.register_customer_atomic(UUID, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;
GRANT EXECUTE ON FUNCTION public.register_vendor_atomic(UUID, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated, service_role;

COMMIT;
