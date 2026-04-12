-- ============================================================
-- STEP 1: Create enquiries table for storing web form submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS enquiries (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL,
  wedding_date DATE,
  preferred_location VARCHAR(255),
  requirement TEXT,
  special_requirement TEXT,
  status VARCHAR(50) DEFAULT 'PENDING',
  source VARCHAR(50) DEFAULT 'web_enquiry',
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);

-- ============================================================
-- STEP 2: Create indexes for enquiries table
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_enquiries_created_at ON enquiries(created_at);
CREATE INDEX IF NOT EXISTS idx_enquiries_phone ON enquiries(phone);
CREATE INDEX IF NOT EXISTS idx_enquiries_status ON enquiries(status);

-- ============================================================
-- STEP 3: Create leads table for boutique-specific leads
-- ============================================================
CREATE TABLE IF NOT EXISTS leads (
  id BIGSERIAL PRIMARY KEY,
  boutique_id INTEGER,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  wedding_date DATE,
  preferred_location VARCHAR(255),
  category VARCHAR(255),
  requirement TEXT,
  special_requirement TEXT,
  status VARCHAR(50) DEFAULT 'NEW',
  source VARCHAR(50),
  created_at TIMESTAMP DEFAULT now(),
  updated_at TIMESTAMP DEFAULT now()
);
