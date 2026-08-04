-- Phase 2B Migration 24: Row-Level Security Policies
-- File: supabase/migrations/20260805000024_rls_create_security_policies.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Enable Row-Level Security on Core Tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE vendor_profile_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE media ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- 2. Users Table RLS Policies
DROP POLICY IF EXISTS users_select_own ON users;
CREATE POLICY users_select_own ON users
    FOR SELECT USING (auth.uid() = id);

DROP POLICY IF EXISTS users_update_own ON users;
CREATE POLICY users_update_own ON users
    FOR UPDATE USING (auth.uid() = id);

-- 3. Vendors & Vendor Profiles RLS Policies (Public Active Read; Owner Update)
DROP POLICY IF EXISTS vendors_select_active ON vendors;
CREATE POLICY vendors_select_active ON vendors
    FOR SELECT USING (status = 'active' OR auth.uid() = user_id);

DROP POLICY IF EXISTS vendors_update_owner ON vendors;
CREATE POLICY vendors_update_owner ON vendors
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS vendor_profiles_select_public ON vendor_profiles;
CREATE POLICY vendor_profiles_select_public ON vendor_profiles
    FOR SELECT USING (true);

DROP POLICY IF EXISTS vendor_profiles_update_owner ON vendor_profiles;
CREATE POLICY vendor_profiles_update_owner ON vendor_profiles
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = vendor_profiles.vendor_id 
              AND vendors.user_id = auth.uid()
        )
    );

-- 4. Leads RLS Policies (Customer Read Own; Vendor Read Assigned)
DROP POLICY IF EXISTS leads_select_owner ON leads;
CREATE POLICY leads_select_owner ON leads
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = leads.vendor_id 
              AND vendors.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS leads_insert_authenticated ON leads;
CREATE POLICY leads_insert_authenticated ON leads
    FOR INSERT WITH CHECK (true);

-- 5. Bookings RLS Policies
DROP POLICY IF EXISTS bookings_select_owner ON bookings;
CREATE POLICY bookings_select_owner ON bookings
    FOR SELECT USING (
        auth.uid() = customer_id 
        OR EXISTS (
            SELECT 1 FROM vendors 
            WHERE vendors.id = bookings.vendor_id 
              AND vendors.user_id = auth.uid()
        )
    );

-- 6. Reviews RLS Policies (Public Read Published; Insert Customer)
DROP POLICY IF EXISTS reviews_select_published ON reviews;
CREATE POLICY reviews_select_published ON reviews
    FOR SELECT USING (status = 'published' OR auth.uid() = customer_id);

DROP POLICY IF EXISTS reviews_insert_customer ON reviews;
CREATE POLICY reviews_insert_customer ON reviews
    FOR INSERT WITH CHECK (auth.uid() = customer_id);

COMMIT;
