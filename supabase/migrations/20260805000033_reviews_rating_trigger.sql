-- Phase 2B Migration 33: Reviews Rating Aggregation & Trigger Engine
-- File: database/migrations/20260805000033_reviews_rating_trigger.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Add Unique constraint on (vendor_id, customer_id) to prevent duplicate reviews
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'uq_reviews_vendor_customer'
    ) THEN
        ALTER TABLE reviews ADD CONSTRAINT uq_reviews_vendor_customer UNIQUE (vendor_id, customer_id);
    END IF;
END $$;

-- 2. Create or Replace Trigger Function to Recalculate Vendor Rating
CREATE OR REPLACE FUNCTION recalculate_vendor_rating_trigger()
RETURNS TRIGGER AS $$
DECLARE
    target_vendor_id UUID;
    computed_avg NUMERIC(3, 1);
    computed_count INTEGER;
BEGIN
    IF (TG_OP = 'DELETE') THEN
        target_vendor_id := OLD.vendor_id;
    ELSE
        target_vendor_id := NEW.vendor_id;
    END IF;

    -- Compute rating average and count for published reviews only
    SELECT
        COALESCE(ROUND(AVG(rating)::numeric, 1), 0.0),
        COUNT(*)
    INTO
        computed_avg,
        computed_count
    FROM reviews
    WHERE vendor_id = target_vendor_id
      AND status = 'published';

    -- Update vendor_profiles denormalized columns
    UPDATE vendor_profiles
    SET
        rating = computed_avg,
        review_count = computed_count,
        updated_at = NOW()
    WHERE vendor_id = target_vendor_id;

    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach Trigger to Reviews Table
DROP TRIGGER IF EXISTS trg_recalculate_vendor_rating ON reviews;
CREATE TRIGGER trg_recalculate_vendor_rating
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION recalculate_vendor_rating_trigger();

COMMIT;
