-- Phase 2B Migration 23: Database Functions & Timestamp Triggers
-- File: database/migrations/20260805000023_triggers_create_timestamp_functions.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Standard Auto-Updating Timestamp Function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Attach Triggers to Core Tables
DROP TRIGGER IF EXISTS trigger_update_users_timestamp ON users;
CREATE TRIGGER trigger_update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_vendors_timestamp ON vendors;
CREATE TRIGGER trigger_update_vendors_timestamp
    BEFORE UPDATE ON vendors
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_vendor_profiles_timestamp ON vendor_profiles;
CREATE TRIGGER trigger_update_vendor_profiles_timestamp
    BEFORE UPDATE ON vendor_profiles
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_leads_timestamp ON leads;
CREATE TRIGGER trigger_update_leads_timestamp
    BEFORE UPDATE ON leads
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_bookings_timestamp ON bookings;
CREATE TRIGGER trigger_update_bookings_timestamp
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_reviews_timestamp ON reviews;
CREATE TRIGGER trigger_update_reviews_timestamp
    BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

DROP TRIGGER IF EXISTS trigger_update_media_timestamp ON media;
CREATE TRIGGER trigger_update_media_timestamp
    BEFORE UPDATE ON media
    FOR EACH ROW EXECUTE FUNCTION update_timestamp_column();

COMMIT;
