-- Phase 2B Migration 29: Lead CRM Pipeline, Tasks, Activities & Itemized Quotations Engine
-- File: database/migrations/20260805000029_lead_create_quotation_enhancements.sql

BEGIN;

-- 1. Ensure Leads Table Has Full Multi-Category CRM Fields
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    customer_email VARCHAR(255),
    event_type VARCHAR(100) DEFAULT 'Wedding',
    event_date DATE NOT NULL,
    city VARCHAR(100),
    pincode VARCHAR(20),
    venue_name VARCHAR(255),
    guest_count INTEGER,
    estimated_budget NUMERIC(12, 2),
    message TEXT,
    source VARCHAR(50) DEFAULT 'website',
    status VARCHAR(30) NOT NULL DEFAULT 'new',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS customer_id UUID REFERENCES users(id) ON DELETE SET NULL;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS vendor_id UUID REFERENCES vendors(id) ON DELETE CASCADE;
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS event_type VARCHAR(100) DEFAULT 'Wedding';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS pincode VARCHAR(20);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS venue_name VARCHAR(255);
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS source VARCHAR(50) DEFAULT 'website';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'new';
ALTER TABLE public.leads ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ;

-- 2. Lead Multi-Vendor Assignments Table
CREATE TABLE IF NOT EXISTS lead_vendor_assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    status VARCHAR(30) NOT NULL DEFAULT 'assigned',
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(lead_id, vendor_id)
);

-- 3. Lead Internal Notes Table
CREATE TABLE IF NOT EXISTS lead_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    author_id UUID REFERENCES users(id) ON DELETE RESTRICT,
    author_name VARCHAR(150),
    note_text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Lead Follow-up Tasks Table
CREATE TABLE IF NOT EXISTS lead_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date TIMESTAMPTZ NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    completed_at TIMESTAMPTZ
);

-- 5. Lead Activity Audit Timeline Table
CREATE TABLE IF NOT EXISTS lead_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    activity_type VARCHAR(50) NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Itemized Quotations Table with Revision Versioning
CREATE TABLE IF NOT EXISTS quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES vendors(id) ON DELETE CASCADE,
    quotation_number VARCHAR(50) NOT NULL,
    revision_number INTEGER NOT NULL DEFAULT 1,
    subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    discount_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00,
    tax_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    final_amount NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    terms_and_conditions TEXT,
    cover_letter TEXT,
    payment_terms TEXT,
    valid_until DATE,
    status VARCHAR(30) NOT NULL DEFAULT 'draft',
    notes TEXT,
    sent_at TIMESTAMPTZ,
    accepted_at TIMESTAMPTZ,
    declined_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS revision_number INTEGER NOT NULL DEFAULT 1;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS subtotal NUMERIC(12, 2) NOT NULL DEFAULT 0.00;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS tax_rate NUMERIC(5, 2) NOT NULL DEFAULT 18.00;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS terms_and_conditions TEXT;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS cover_letter TEXT;
ALTER TABLE public.quotations ADD COLUMN IF NOT EXISTS payment_terms TEXT;

-- 7. Itemized Quotation Line Items Table
CREATE TABLE IF NOT EXISTS quotation_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quotation_id UUID NOT NULL REFERENCES quotations(id) ON DELETE CASCADE,
    service_id UUID REFERENCES vendor_services(id) ON DELETE SET NULL,
    package_id UUID REFERENCES vendor_service_packages(id) ON DELETE SET NULL,
    catalog_item_id UUID REFERENCES vendor_catalog_items(id) ON DELETE SET NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER NOT NULL DEFAULT 1,
    unit_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    total_price NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
    sort_order INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Ensure all columns exist on quotation_items table if previously created
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS service_id UUID REFERENCES vendor_services(id) ON DELETE SET NULL;
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES vendor_service_packages(id) ON DELETE SET NULL;
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS catalog_item_id UUID REFERENCES vendor_catalog_items(id) ON DELETE SET NULL;
ALTER TABLE public.quotation_items ADD COLUMN IF NOT EXISTS sort_order INTEGER NOT NULL DEFAULT 0;

-- B-Tree Performance Indexes
CREATE INDEX IF NOT EXISTS idx_leads_v_s_c ON leads(vendor_id, status, created_at DESC) WHERE deleted_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_lead_notes_l ON lead_notes(lead_id);
CREATE INDEX IF NOT EXISTS idx_lead_tasks_l_s ON lead_tasks(lead_id, status, due_date);
CREATE INDEX IF NOT EXISTS idx_lead_activities_l ON lead_activities(lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_quotations_l_v ON quotations(lead_id, vendor_id, status);
CREATE INDEX IF NOT EXISTS idx_quotation_items_q ON quotation_items(quotation_id, sort_order);

-- Permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON leads TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON lead_vendor_assignments TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON lead_notes TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON lead_tasks TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON lead_activities TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON quotations TO anon, authenticated, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON quotation_items TO anon, authenticated, service_role;

COMMIT;

NOTIFY pgrst, 'reload schema';
