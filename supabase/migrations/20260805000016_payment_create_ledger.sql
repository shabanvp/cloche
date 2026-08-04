-- Phase 2B Migration 16: Payments Ledger & Escrow
-- File: supabase/migrations/20260805000016_payment_create_ledger.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Master Payment Transactions Ledger Table
CREATE TABLE IF NOT EXISTS payment_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    transaction_id VARCHAR(100) NOT NULL UNIQUE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    vendor_id UUID REFERENCES vendors(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    amount NUMERIC(12, 2) NOT NULL,
    currency VARCHAR(10) NOT NULL DEFAULT 'INR',
    payment_gateway VARCHAR(50) NOT NULL CHECK (payment_gateway IN ('razorpay', 'stripe', 'paypal', 'bank_transfer')),
    gateway_order_id VARCHAR(100),
    gateway_payment_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'captured', 'failed', 'refunded')),
    metadata JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Customer Refunds Table
CREATE TABLE IF NOT EXISTS refunds (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_record_id UUID NOT NULL REFERENCES payment_records(id) ON DELETE CASCADE,
    refund_amount NUMERIC(12, 2) NOT NULL,
    reason TEXT,
    gateway_refund_id VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Escrow Deposit Accounts Table (1:1 with bookings)
CREATE TABLE IF NOT EXISTS escrow_accounts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL UNIQUE REFERENCES bookings(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    held_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    released_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    status VARCHAR(30) NOT NULL DEFAULT 'held' CHECK (status IN ('held', 'partially_released', 'fully_released', 'disputed')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Vendor Bank Payout Disbursements Table
CREATE TABLE IF NOT EXISTS vendor_payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    payout_number VARCHAR(50) NOT NULL UNIQUE,
    amount NUMERIC(12, 2) NOT NULL,
    bank_account_last4 VARCHAR(10),
    status VARCHAR(30) NOT NULL DEFAULT 'processing' CHECK (status IN ('processing', 'completed', 'failed')),
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Platform Commission Accounting Ledger Table
CREATE TABLE IF NOT EXISTS commission_ledger (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    booking_id UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE RESTRICT,
    booking_amount NUMERIC(12, 2) NOT NULL,
    commission_rate NUMERIC(5, 2) NOT NULL DEFAULT 10.00,
    commission_amount NUMERIC(12, 2) NOT NULL,
    vendor_payout_amount NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payment_records_txn ON payment_records(transaction_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_user ON payment_records(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_records_booking ON payment_records(booking_id);
CREATE INDEX IF NOT EXISTS idx_escrow_booking ON escrow_accounts(booking_id);
CREATE INDEX IF NOT EXISTS idx_vendor_payouts_vendor ON vendor_payouts(vendor_id);
CREATE INDEX IF NOT EXISTS idx_commission_vendor ON commission_ledger(vendor_id);

COMMIT;
