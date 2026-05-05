-- Update boutiques table with subscription and limit columns
DO $$ 
BEGIN 
    -- Add plan column if it exists as VARCHAR, we might want to convert or just ensure it exists
    -- However, the app now stores early partners as 'early_partner'.
    
    -- Check if plan enum exists, if not create it
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan') THEN
        CREATE TYPE subscription_plan AS ENUM ('early', 'early_partner', 'professional', 'premium');
    ELSE
        ALTER TYPE subscription_plan ADD VALUE IF NOT EXISTS 'early_partner';
    END IF;

    -- Add columns to boutiques table
    ALTER TABLE boutiques 
    ADD COLUMN IF NOT EXISTS subscription_status VARCHAR(50) DEFAULT 'active',
    ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ADD COLUMN IF NOT EXISTS end_date TIMESTAMP WITH TIME ZONE,
    ADD COLUMN IF NOT EXISTS leads_used INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS product_count INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE,
    ADD COLUMN IF NOT EXISTS priority_score INTEGER DEFAULT 0,
    ADD COLUMN IF NOT EXISTS payment_id VARCHAR(255);

    -- Handle plan column conversion or addition
    -- If plan column exists and is not the enum, we might need a more complex migration
    -- For now, let's just make sure it exists as the new type if possible, 
    -- or add a new column if 'plan' is currently a string.
    -- Let's check the type of the existing 'plan' column.
    
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'boutiques' AND column_name = 'plan') THEN
        -- If it's varchar, we can try to cast it, but let's be safe and just ensure we have the right values
        -- For simplicity in this script, we'll assume we can alter it or it's new.
        -- ALTER TABLE boutiques ALTER COLUMN plan TYPE subscription_plan USING plan::subscription_plan;
        -- Actually, let's just use VARCHAR for now to avoid enum headaches during transition if they have 'Basic'
        ALTER TABLE boutiques ALTER COLUMN plan SET DEFAULT 'early_partner';
    ELSE
        ALTER TABLE boutiques ADD COLUMN plan VARCHAR(50) DEFAULT 'early_partner';
    END IF;

    ALTER TABLE users ADD COLUMN IF NOT EXISTS plan VARCHAR(50) DEFAULT 'early_partner';
    ALTER TABLE boutique_showcase ADD COLUMN IF NOT EXISTS shop_location VARCHAR(700);
    UPDATE boutiques SET plan = 'early_partner' WHERE LOWER(COALESCE(plan::TEXT, '')) IN ('early', 'basic', 'early partner');
    UPDATE users SET plan = 'early_partner' WHERE plan IS NULL OR LOWER(COALESCE(plan::TEXT, '')) IN ('early', 'basic', 'early partner');

END $$;
