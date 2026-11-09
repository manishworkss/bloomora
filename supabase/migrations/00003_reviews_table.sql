-- ==============================================================================
-- BLOOMORA — CUSTOMER REVIEWS & STORIES TABLE MIGRATION
-- Run in Supabase SQL Editor to enable cloud storage for reviews with photos & videos
-- ==============================================================================

CREATE TABLE IF NOT EXISTS customer_reviews (
  id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
  customer_name VARCHAR(150) NOT NULL,
  customer_location VARCHAR(120) NOT NULL DEFAULT 'Vadodara, Gujarat',
  customer_phone VARCHAR(20),
  rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title VARCHAR(200),
  review_text TEXT NOT NULL,
  product_name VARCHAR(200) NOT NULL,
  occasion VARCHAR(120),
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  is_verified_buyer BOOLEAN NOT NULL DEFAULT true,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  status VARCHAR(20) NOT NULL DEFAULT 'APPROVED',
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX IF NOT EXISTS idx_customer_reviews_status ON customer_reviews(status);
CREATE INDEX IF NOT EXISTS idx_customer_reviews_featured ON customer_reviews(is_featured) WHERE status = 'APPROVED';

ALTER TABLE customer_reviews ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read approved reviews" ON customer_reviews FOR SELECT USING (status = 'APPROVED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public submit reviews" ON customer_reviews FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;
