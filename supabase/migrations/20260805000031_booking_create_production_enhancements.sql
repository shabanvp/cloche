-- Phase 2B Migration 31: Booking Lifecycle, Escrow Transactions, Payment Idempotency & Atomic Conversion RPC
-- File: database/migrations/20260805000031_booking_create_production_enhancements.sql

BEGIN;

-- 1. Ensure Master Bookings Table Has Time-Slot & Snapshot Support
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID REFERENCES leads(id) ON DELETE SET NULL,
    quotation_id UUID REFERENCES quotations(id) ON DELETE SET NULL,
    customer_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    booking_number VARCHAR(50) NOT NULL UNIQUE,
    event_date DATE NOT NULL,
    start_time TIME DEFAULT '09:00:00',
    end_time TIME DEFAULT '22:00:00',
    timezone VARCHAR(50) DEFAULT 'Asia/Kolkata',
    total_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    advance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'confirmed',
    payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid',
    booking_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS start_time TIME DEFAULT '09:00:00';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS end_time TIME DEFAULT '22:00:00';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS timezone VARCHAR(50) DEFAULT 'Asia/Kolkata';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS payment_status VARCHAR(30) NOT NULL DEFAULT 'unpaid';
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS booking_snapshot JSONB NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE public.bookings ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Escrow Audit Transactions History Table
CREATE TABLE IF NOT EXISTS escrow_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    escrow_account_id UUID NOT NULL REFERENCES escrow_accounts(id) ON DELETE CASCADE,
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN ('deposit_held', 'partial_release', 'full_release', 'refund_disbursement', 'adjustment')),
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    balance_after NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Idempotent Payment Records Table
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    idempotency_key VARCHAR(255) UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_gateway VARCHAR(50) NOT NULL DEFAULT 'razorpay',
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending',
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.payment_records ADD COLUMN IF NOT EXISTS idempotency_key VARCHAR(255) UNIQUE;
ALTER TABLE public.payment_records ADD COLUMN IF NOT EXISTS gateway_order_id VARCHAR(100);
ALTER TABLE public.payment_records ADD COLUMN IF NOT EXISTS gateway_payment_id VARCHAR(100);

-- 4. Atomic Stored Procedure: Convert Quotation to Booking
CREATE OR REPLACE FUNCTION public.convert_quotation_to_booking_atomic(
    p_quotation_id UUID,
    p_vendor_id UUID,
    p_created_by UUID DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_quote RECORD;
    v_lead RECORD;
    v_booking_id UUID;
    v_booking_number TEXT;
    v_escrow_id UUID;
BEGIN
    -- Fetch quotation
    SELECT * INTO v_quote FROM public.quotations WHERE id = p_quotation_id AND vendor_id = p_vendor_id;
    IF v_quote IS NULL THEN
        RAISE EXCEPTION 'Quotation % not found or access denied.', p_quotation_id;
    END IF;

    IF v_quote.is_booking_converted THEN
        RAISE EXCEPTION 'Quotation % is already converted to a booking.', p_quotation_id;
    END IF;

    -- Fetch lead
    SELECT * INTO v_lead FROM public.leads WHERE id = v_quote.lead_id;

    -- Check calendar conflict for same vendor & date
    IF EXISTS (
        SELECT 1 FROM public.bookings 
        WHERE vendor_id = p_vendor_id 
          AND event_date = COALESCE(v_lead.event_date, CURRENT_DATE)
          AND status IN ('confirmed', 'in_progress')
          AND deleted_at IS NULL
    ) THEN
        RAISE EXCEPTION 'Calendar Conflict: Vendor already has a confirmed booking on %', v_lead.event_date;
    END IF;

    v_booking_number := 'BKG-2026-' || FLOOR(100000 + RANDOM() * 900000)::TEXT;

    -- Create Booking
    INSERT INTO public.bookings (
        lead_id,
        quotation_id,
        customer_id,
        vendor_id,
        booking_number,
        event_date,
        total_amount,
        advance_amount,
        balance_amount,
        status,
        payment_status,
        booking_snapshot
    ) VALUES (
        v_quote.lead_id,
        v_quote.id,
        COALESCE(v_lead.customer_id, p_created_by, v_quote.vendor_id),
        p_vendor_id,
        v_booking_number,
        COALESCE(v_lead.event_date, CURRENT_DATE),
        v_quote.final_amount,
        v_quote.subtotal * 0.50,
        v_quote.final_amount - (v_quote.subtotal * 0.50),
        'confirmed',
        'unpaid',
        jsonb_build_object(
            'quotation_number', v_quote.quotation_number,
            'customer_name', v_lead.customer_name,
            'customer_phone', v_lead.customer_phone,
            'event_type', v_lead.event_type,
            'event_date', v_lead.event_date,
            'final_amount', v_quote.final_amount,
            'converted_at', NOW()
        )
    ) RETURNING id INTO v_booking_id;

    -- Update Quotation & Lead flags
    UPDATE public.quotations 
    SET is_booking_converted = true, booking_id = v_booking_id, status = 'accepted', accepted_at = NOW() 
    WHERE id = p_quotation_id;

    UPDATE public.leads 
    SET status = 'converted', converted_booking_id = v_booking_id 
    WHERE id = v_quote.lead_id;

    -- Create Escrow Account (1:1 with booking)
    INSERT INTO public.escrow_accounts (
        booking_id,
        vendor_id,
        held_amount,
        released_amount,
        status
    ) VALUES (
        v_booking_id,
        p_vendor_id,
        0.00,
        0.00,
        'held'
    ) RETURNING id INTO v_escrow_id;

    -- Create Default Category Milestone Timeline Tasks
    INSERT INTO public.booking_timeline (booking_id, milestone_name, due_date, status) VALUES
    (v_booking_id, 'Booking Confirmation & Deposit Held', v_lead.event_date - INTERVAL '30 days', 'completed'),
    (v_booking_id, 'Pre-Event Service Planning & Trial', v_lead.event_date - INTERVAL '7 days', 'pending'),
    (v_booking_id, 'Event Execution & Service Delivery', v_lead.event_date, 'pending'),
    (v_booking_id, 'Final Settlement & Escrow Release', v_lead.event_date + INTERVAL '1 day', 'pending');

    RETURN jsonb_build_object(
        'success', true,
        'booking_id', v_booking_id,
        'booking_number', v_booking_number,
        'escrow_id', v_escrow_id
    );
EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'convert_quotation_to_booking_atomic failed: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION public.convert_quotation_to_booking_atomic(UUID, UUID, UUID) TO anon, authenticated, service_role;

-- Performance Indexes
CREATE INDEX IF NOT EXISTS idx_bookings_vendor_date_status ON bookings(vendor_id, event_date, status) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_escrow_tx_account ON escrow_transactions(escrow_account_id, created_at);
CREATE INDEX IF NOT EXISTS idx_payment_records_idempotency ON payment_records(idempotency_key) WHERE idempotency_key IS NOT NULL;

GRANT SELECT, INSERT, UPDATE, DELETE ON bookings TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON escrow_transactions TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON payment_records TO anon, authenticated, service_role;

COMMIT;

NOTIFY pgrst, 'reload schema';
