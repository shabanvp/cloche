-- Phase 2B Migration 30: Production Lead CRM, Notification Queue, Quotation Snapshots & Phase 8 Booking Preparation
-- File: database/migrations/20260805000030_lead_create_production_enhancements.sql

BEGIN;

-- 1. Notification Event Queue Table (Async Notification Processing)
CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    event_type VARCHAR(50) NOT NULL,
    recipient_email VARCHAR(255),
    recipient_phone VARCHAR(50),
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    payload JSONB NOT NULL DEFAULT '{}'::jsonb,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    retry_count INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    processed_at TIMESTAMPTZ
);

-- 2. Audit Columns & Phase 8 Booking Slots on Leads Table
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS converted_booking_id UUID;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- 3. Immutable Snapshots, Audit Columns & Phase 8 Booking Slots on Quotations Table
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS booking_id UUID;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS is_booking_converted BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS updated_by UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS deleted_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- 4. Immutable Item Snapshot Column on Quotation Line Items Table
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS item_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS created_by UUID REFERENCES users(id) ON DELETE SET NULL;

-- Performance B-Tree Indexes
CREATE INDEX IF NOT EXISTS idx_notification_queue_status ON notification_queue(status, created_at);
CREATE INDEX IF NOT EXISTS idx_leads_converted_booking ON leads(converted_booking_id) WHERE converted_booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by);
CREATE INDEX IF NOT EXISTS idx_quotations_booking ON quotations(booking_id) WHERE booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_quotations_created_by ON quotations(created_by);

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON notification_queue TO anon, authenticated, service_role;

COMMIT;

NOTIFY pgrst, 'reload schema';
