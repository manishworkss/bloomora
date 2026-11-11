-- ==============================================================================
-- BLOOMORA — 1-CLICK COMPLETE DATABASE SETUP & SEED SCRIPT
-- Paste this entire script into your Supabase SQL Editor and click "Run" (▶)
-- Fully Idempotent (Safe to run multiple times)
-- ==============================================================================

-- 1. ENUMS (Safe creation)
DO $$ BEGIN
  CREATE TYPE product_type_enum AS ENUM ('READY_MADE', 'MADE_TO_ORDER');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE order_status_enum AS ENUM (
    'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY',
    'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_status_enum AS ENUM (
    'NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE payment_method_enum AS ENUM ('MANUAL_UPI', 'COD', 'ONLINE_GATEWAY');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE enquiry_status_enum AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'DECLINED', 'CLOSED');
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE inventory_reason_enum AS ENUM (
    'INITIAL_IMPORT', 'RESTOCK', 'ORDER_PLACED', 'ORDER_CANCELLED', 'DAMAGE_LOSS', 'MANUAL_CORRECTION'
  );
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 2. CATEGORIES
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  slug VARCHAR(120) NOT NULL UNIQUE,
  description TEXT,
  image_url TEXT,
  display_order INT NOT NULL DEFAULT 0,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. PRODUCTS
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID REFERENCES categories(id) ON DELETE RESTRICT,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(280) NOT NULL UNIQUE,
  short_description VARCHAR(500),
  full_description TEXT NOT NULL,
  base_price NUMERIC(10, 2) NOT NULL CHECK (base_price >= 0),
  compare_at_price NUMERIC(10, 2) CHECK (compare_at_price IS NULL OR compare_at_price > base_price),
  product_type product_type_enum NOT NULL DEFAULT 'READY_MADE',
  preparation_days INT NOT NULL DEFAULT 0 CHECK (preparation_days >= 0),
  is_published BOOLEAN NOT NULL DEFAULT false,
  is_featured BOOLEAN NOT NULL DEFAULT false,
  has_variants BOOLEAN NOT NULL DEFAULT false,
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  low_stock_threshold INT NOT NULL DEFAULT 3 CHECK (low_stock_threshold >= 0),
  seo_title VARCHAR(150),
  seo_description VARCHAR(255),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_published ON products(is_published) WHERE deleted_at IS NULL;

-- 4. PRODUCT VARIANTS
CREATE TABLE IF NOT EXISTS product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL,
  sku VARCHAR(80) UNIQUE,
  price_override NUMERIC(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_variants_product ON product_variants(product_id);

-- 5. PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  cloudinary_public_id VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  alt_text VARCHAR(255) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_product_images_product ON product_images(product_id, display_order);

-- 6. INVENTORY LOGS
CREATE TABLE IF NOT EXISTS inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  previous_stock INT NOT NULL,
  change_amount INT NOT NULL,
  new_stock INT NOT NULL,
  reason inventory_reason_enum NOT NULL,
  actor_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 7. DELIVERY ZONES (VADODARA)
CREATE TABLE IF NOT EXISTS delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postal_code VARCHAR(10) NOT NULL UNIQUE,
  zone_name VARCHAR(100) NOT NULL,
  city VARCHAR(60) NOT NULL DEFAULT 'Vadodara',
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00 CHECK (delivery_fee >= 0),
  estimated_days VARCHAR(50) NOT NULL DEFAULT 'Vadodara Local',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_delivery_zones_pin ON delivery_zones(postal_code) WHERE is_active = true;

-- 8. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) NOT NULL UNIQUE,
  lookup_token VARCHAR(64) NOT NULL UNIQUE,
  idempotency_key VARCHAR(100) NOT NULL UNIQUE,
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  customer_email VARCHAR(255),
  delivery_address TEXT NOT NULL,
  delivery_landmark VARCHAR(200),
  postal_code VARCHAR(10) NOT NULL,
  delivery_instructions TEXT,
  items_subtotal NUMERIC(10, 2) NOT NULL CHECK (items_subtotal >= 0),
  delivery_fee NUMERIC(10, 2) NOT NULL CHECK (delivery_fee >= 0),
  discount_total NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (discount_total >= 0),
  grand_total NUMERIC(10, 2) NOT NULL CHECK (grand_total >= 0),
  order_status order_status_enum NOT NULL DEFAULT 'PENDING',
  payment_status payment_status_enum NOT NULL DEFAULT 'PENDING',
  payment_method payment_method_enum NOT NULL DEFAULT 'MANUAL_UPI',
  payment_reference VARCHAR(150),
  internal_notes TEXT,
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX IF NOT EXISTS idx_orders_lookup_token ON orders(lookup_token);
CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);

-- 9. ORDER ITEMS
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  product_title_snapshot VARCHAR(255) NOT NULL,
  variant_title_snapshot VARCHAR(150),
  unit_price_snapshot NUMERIC(10, 2) NOT NULL CHECK (unit_price_snapshot >= 0),
  quantity INT NOT NULL CHECK (quantity > 0),
  total_price_snapshot NUMERIC(10, 2) NOT NULL CHECK (total_price_snapshot >= 0),
  image_url_snapshot TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 10. ENQUIRIES
CREATE TABLE IF NOT EXISTS enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  budget_estimate VARCHAR(80),
  needed_by_date DATE,
  reference_images TEXT[],
  status enquiry_status_enum NOT NULL DEFAULT 'NEW',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. SITE SETTINGS
CREATE TABLE IF NOT EXISTS site_settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 12. ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

DO $$ BEGIN
  CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read published products" ON products FOR SELECT USING (is_published = true AND deleted_at IS NULL);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read active delivery zones" ON delivery_zones FOR SELECT USING (is_active = true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);
EXCEPTION WHEN duplicate_object THEN null;
END $$;

-- 13. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Handmade Keychain', 'handmade-keychain', 'Hand-crocheted daisies, strawberries, hearts, and miniature keepsakes crafted for everyday charm.', '/images/cat-handmade-keychain.jpg', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Customized Bouquet', 'customized-bouquet', 'Bespoke everlasting crochet bouquets wrapped with ribbons, roses, tulips, and your personal colour palette.', '/images/cat-customized-bouquet.jpg', 2, true),
  ('c1000000-0000-0000-0000-000000000006', 'Handmade Flower', 'handmade-flower', 'Everlasting single crochet sunflowers, roses, tulips, and desk flower pots that never fade.', '/images/cat-handmade-flower.jpg', 3, true),
  ('c1000000-0000-0000-0000-000000000003', 'Seasonable Handmade Products', 'seasonable-handmade-products', 'Limited-edition festive marigolds, cozy winter knits, and seasonal handcrafted creations made fresh in small batches.', '/images/cat-seasonable-handmade.jpg', 4, true),
  ('c1000000-0000-0000-0000-000000000004', 'Birthday Surprise Card', 'birthday-surprise-card', 'Handmade pop-up explosion cards, layered memory flaps, handwritten notes, and birthday keepsake envelopes.', '/images/cat-birthday-surprise-card.jpg', 5, true),
  ('c1000000-0000-0000-0000-000000000005', 'Customized / Personalized Gifts', 'customized-personalized-gifts', 'You have an idea — we have the creativity to craft it into a one-of-a-kind handmade keepsake made from scratch.', '/images/cat-personalized-gifts.jpg', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 14. SEED VADODARA DELIVERY ZONES (All 17 Major Postal Codes Active at ₹50 Flat Fee)
INSERT INTO delivery_zones (postal_code, zone_name, city, delivery_fee, estimated_days, is_active)
VALUES
  ('390001', 'Alkapuri / Central Vadodara', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390002', 'Mandvi / Old City', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390004', 'Fatehgunj / MS University Area', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390007', 'Race Course / Inox Area', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390008', 'Waghodia Road', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390010', 'Karelibaug', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390011', 'Sayajigunj / Station Area', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390012', 'Gorwa / BIDC', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390015', 'Sama / New Sama Road', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390018', 'Gotri', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390019', 'Harni / Airport Area', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390020', 'Manjalpur / Makarpura', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390021', 'Gotri Road / Sevasi', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390022', 'Vasna / Bhayli Road', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390023', 'Subhanpura', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390024', 'Akota', 'Vadodara', 50.00, 'Vadodara Local', true),
  ('390025', 'Tarsali', 'Vadodara', 50.00, 'Vadodara Local', true)
ON CONFLICT (postal_code) DO NOTHING;

-- 15. SEED SITE SETTINGS
INSERT INTO site_settings (key, value, description)
VALUES
  ('business_whatsapp_number', '"918271735190"', 'Official owner WhatsApp contact number for wa.me links.'),
  ('instagram_handle', '"bloomora.creation"', 'Official Instagram username.'),
  ('announcement_text', '"Bloomora • Handcrafted with love in Vadodara • City-Wide Delivery across all PIN codes • WhatsApp: +91 8271735190"', 'Storefront top announcement bar text.'),
  ('default_delivery_fee', '50.00', 'Standard local courier delivery charge in Vadodara.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = timezone('utc', now());


