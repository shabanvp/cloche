-- Phase 2B Migration 18: Notification Service Engine
-- File: database/migrations/20260805000018_notification_create_engine.sql
-- Compatible with PostgreSQL 16 and Supabase SQL Editor

BEGIN;

-- 1. Notification Templates Registry Table
CREATE TABLE IF NOT EXISTS notification_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    subject VARCHAR(255),
    body_template TEXT NOT NULL,
    variables TEXT[],
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Async Notification Queue Processing Table
CREATE TABLE IF NOT EXISTS notification_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES notification_templates(id) ON DELETE SET NULL,
    recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL CHECK (channel IN ('email', 'sms', 'whatsapp', 'push', 'in_app')),
    destination VARCHAR(255) NOT NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'sent', 'failed')),
    error_message TEXT,
    attempts INTEGER NOT NULL DEFAULT 0,
    scheduled_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. In-App & Sent Notification History Table
CREATE TABLE IF NOT EXISTS notification_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recipient_user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    channel VARCHAR(30) NOT NULL,
    title VARCHAR(255) NOT NULL,
    body TEXT NOT NULL,
    metadata JSONB,
    is_read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. User Notification Preference Settings Table (1:1 with users)
CREATE TABLE IF NOT EXISTS user_notification_preferences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,
    email_notifications BOOLEAN NOT NULL DEFAULT true,
    sms_notifications BOOLEAN NOT NULL DEFAULT true,
    whatsapp_notifications BOOLEAN NOT NULL DEFAULT true,
    push_notifications BOOLEAN NOT NULL DEFAULT true,
    marketing_emails BOOLEAN NOT NULL DEFAULT false,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_notif_templates_code ON notification_templates(code);
CREATE INDEX IF NOT EXISTS idx_notif_queue_status_sched ON notification_queue(status, scheduled_at);
CREATE INDEX IF NOT EXISTS idx_notif_history_user ON notification_history(recipient_user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notif_pref_user ON user_notification_preferences(user_id);

COMMIT;
