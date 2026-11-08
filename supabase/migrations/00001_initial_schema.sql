-- ==============================================================================
-- THE HANDMADE CRAFT — VERCEL + SUPABASE SCHEMA MIGRATION
-- Version: 1.0 (Nov 2026)
-- Target: PostgreSQL 16 (Supabase Managed Cloud)
-- ==============================================================================

-- 1. ENUMERATIONS
CREATE TYPE product_type_enum AS ENUM ('READY_MADE', 'MADE_TO_ORDER');
CREATE TYPE order_status_enum AS ENUM (
  'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_DELIVERY',
  'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED', 'RETURNED'
);
CREATE TYPE payment_status_enum AS ENUM (
  'NOT_REQUIRED', 'PENDING', 'PAID', 'FAILED', 'REFUNDED', 'PARTIALLY_REFUNDED'
);
CREATE TYPE payment_method_enum AS ENUM ('MANUAL_UPI', 'COD', 'ONLINE_GATEWAY');
CREATE TYPE enquiry_status_enum AS ENUM ('NEW', 'CONTACTED', 'QUOTED', 'ACCEPTED', 'DECLINED', 'CLOSED');
CREATE TYPE inventory_reason_enum AS ENUM (
  'INITIAL_IMPORT', 'RESTOCK', 'ORDER_PLACED', 'ORDER_CANCELLED', 'DAMAGE_LOSS', 'MANUAL_CORRECTION'
);

-- 2. CATEGORIES
CREATE TABLE categories (
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
CREATE INDEX idx_categories_slug ON categories(slug);

-- 3. PRODUCTS
CREATE TABLE products (
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
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_published ON products(is_published) WHERE deleted_at IS NULL;

-- 4. PRODUCT VARIANTS
CREATE TABLE product_variants (
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
CREATE INDEX idx_variants_product ON product_variants(product_id);

-- 5. PRODUCT IMAGES (CLOUDINARY)
CREATE TABLE product_images (
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
CREATE INDEX idx_product_images_product ON product_images(product_id, display_order);

-- 6. INVENTORY LOGS
CREATE TABLE inventory_logs (
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
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postal_code VARCHAR(10) NOT NULL UNIQUE,
  zone_name VARCHAR(100) NOT NULL,
  city VARCHAR(60) NOT NULL DEFAULT 'Vadodara',
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 50.00 CHECK (delivery_fee >= 0),
  estimated_days VARCHAR(50) NOT NULL DEFAULT '1-2 Days',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
CREATE INDEX idx_delivery_zones_pin ON delivery_zones(postal_code) WHERE is_active = true;

-- 8. ORDERS TABLE
CREATE TABLE orders (
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
CREATE INDEX idx_orders_lookup_token ON orders(lookup_token);
CREATE INDEX idx_orders_order_number ON orders(order_number);

-- 9. ORDER ITEMS
CREATE TABLE order_items (
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

-- 10. ORDER STATUS HISTORY
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  previous_status order_status_enum,
  new_status order_status_enum NOT NULL,
  actor_id UUID,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 11. ENQUIRIES
CREATE TABLE enquiries (
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

-- 12. SITE SETTINGS
CREATE TABLE site_settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- 13. ATOMIC STOCK TRANSACTION FUNCTION
CREATE OR REPLACE FUNCTION decrement_inventory_safely(p_items JSONB)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  item RECORD;
  v_current_stock INT;
  v_product_type product_type_enum;
  v_has_variants BOOLEAN;
BEGIN
  FOR item IN SELECT * FROM jsonb_to_recordset(p_items) AS x(
    product_id UUID,
    variant_id UUID,
    quantity INT
  )
  LOOP
    SELECT product_type, has_variants, stock_quantity
    INTO v_product_type, v_has_variants, v_current_stock
    FROM products
    WHERE id = item.product_id AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % does not exist.', item.product_id;
    END IF;

    IF v_product_type = 'MADE_TO_ORDER' THEN
      CONTINUE;
    END IF;

    IF v_has_variants THEN
      SELECT stock_quantity INTO v_current_stock
      FROM product_variants
      WHERE id = item.variant_id AND product_id = item.product_id
      FOR UPDATE;

      IF v_current_stock < item.quantity THEN
        RAISE EXCEPTION 'Insufficient variant stock for %.', item.variant_id;
      END IF;

      UPDATE product_variants
      SET stock_quantity = stock_quantity - item.quantity,
          updated_at = timezone('utc', now())
      WHERE id = item.variant_id;
    ELSE
      IF v_current_stock < item.quantity THEN
        RAISE EXCEPTION 'Insufficient product stock for %.', item.product_id;
      END IF;

      UPDATE products
      SET stock_quantity = stock_quantity - item.quantity,
          updated_at = timezone('utc', now())
      WHERE id = item.product_id;
    END IF;
  END LOOP;
END;
$$;

-- 14. ROW LEVEL SECURITY (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active categories" ON categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read published products" ON products FOR SELECT USING (is_published = true AND deleted_at IS NULL);
CREATE POLICY "Public read active delivery zones" ON delivery_zones FOR SELECT USING (is_active = true);
CREATE POLICY "Public read site settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Public submit enquiries" ON enquiries FOR INSERT WITH CHECK (true);

