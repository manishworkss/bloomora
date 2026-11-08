# 04_DATABASE_SCHEMA.md — PostgreSQL Schema & Data Architecture

> **Bloomora** — Customer Storefront & Admin Console  
> **Database Engine:** PostgreSQL 16 (Supabase Managed Cloud)  
> **Security Model:** Row-Level Security (RLS) with Service Role & Authenticated Admin Policies  
> **Integrity Guarantees:** Transaction-safe inventory locks, idempotent order keys, and immutable order item snapshots

---

## 1. Schema Design Philosophy

1. **Immutable Order Snapshots:** When an order is placed, customer details, product titles, variant names, unit prices, and delivery fees are copied into immutable snapshot fields in `orders` and `order_items`. Subsequent edits to catalog prices or product descriptions will never alter historical financial records.
2. **Strict Inventory Single Source of Truth:**
   - If a product has variants, stock is tracked *only* in `product_variants.stock_quantity`.
   - If a product has no variants, stock is tracked *only* in `products.stock_quantity`.
   - The stored procedure `decrement_inventory_safely()` locks rows with `SELECT ... FOR UPDATE` to completely eliminate race conditions and negative inventory balances.
3. **Anti-Enumeration & Privacy:**
   - Sequential IDs are never exposed externally. Orders use a high-entropy string `lookup_token` (e.g. `nanoid(24)`) and a human-friendly `order_number` (e.g. `THC-2026-0042`).
   - Order tracking endpoints query strictly by `lookup_token`.

---

## 2. PostgreSQL Enumerations (Enums)

```sql
-- Product fulfillment type
CREATE TYPE product_type_enum AS ENUM (
  'READY_MADE',    -- Dispatched from ready shelf stock
  'MADE_TO_ORDER'  -- Handcrafted upon order confirmation
);

-- Order lifecycle progression
CREATE TYPE order_status_enum AS ENUM (
  'PENDING',            -- Order submitted by customer, awaiting admin acceptance / payment verification
  'CONFIRMED',          -- Order accepted by business owner
  'PROCESSING',         -- Items being crafted / packaged
  'READY_FOR_DELIVERY',  -- Packaged and staged for local courier/rider
  'OUT_FOR_DELIVERY',   -- Handed to local delivery partner in Vadodara
  'DELIVERED',          -- Successfully received by customer
  'CANCELLED',          -- Cancelled before delivery (restocks inventory)
  'RETURNED'            -- Returned post-delivery (requires owner approval)
);

-- Payment status lifecycle
CREATE TYPE payment_status_enum AS ENUM (
  'NOT_REQUIRED',       -- Special gifts / promotional
  'PENDING',            -- Awaiting manual UPI verification or COD collection
  'PAID',               -- Confirmed by owner or verified gateway webhook
  'FAILED',             -- Payment attempt unsuccessful
  'REFUNDED',           -- Full amount refunded
  'PARTIALLY_REFUNDED'  -- Partial refund processed
);

-- Payment method options
CREATE TYPE payment_method_enum AS ENUM (
  'MANUAL_UPI',         -- Customer transfers via UPI QR / VPA; admin verifies in bank app
  'COD',                -- Cash on delivery (if enabled for zone)
  'ONLINE_GATEWAY'      -- Automated payment gateway (Razorpay / Cashfree - Future)
);

-- Custom inquiry & commission pipeline
CREATE TYPE enquiry_status_enum AS ENUM (
  'NEW',
  'CONTACTED',
  'QUOTED',
  'ACCEPTED',
  'DECLINED',
  'CLOSED'
);

-- Stock adjustment reason codes
CREATE TYPE inventory_reason_enum AS ENUM (
  'INITIAL_IMPORT',
  'RESTOCK',
  'ORDER_PLACED',
  'ORDER_CANCELLED',
  'DAMAGE_LOSS',
  'MANUAL_CORRECTION'
);
```

---

## 3. Core Tables Specification

```sql
-- ==============================================================================
-- 1. CATEGORIES TABLE
-- ==============================================================================
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
CREATE INDEX idx_categories_active ON categories(is_active, display_order);

-- ==============================================================================
-- 2. PRODUCTS TABLE
-- ==============================================================================
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
  deleted_at TIMESTAMPTZ -- Soft delete timestamp
);

CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_published ON products(is_published) WHERE deleted_at IS NULL;
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_published = true AND deleted_at IS NULL;

-- ==============================================================================
-- 3. PRODUCT VARIANTS TABLE
-- ==============================================================================
CREATE TABLE product_variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  title VARCHAR(150) NOT NULL, -- e.g., 'Lavender / With Twine Bow'
  sku VARCHAR(80) UNIQUE,
  price_override NUMERIC(10, 2) CHECK (price_override IS NULL OR price_override >= 0),
  stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN NOT NULL DEFAULT true,
  display_order INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_variants_product ON product_variants(product_id);

-- ==============================================================================
-- 4. PRODUCT IMAGES TABLE (Cloudinary)
-- ==============================================================================
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

-- ==============================================================================
-- 5. INVENTORY AUDIT LOGS TABLE
-- ==============================================================================
CREATE TABLE inventory_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  variant_id UUID REFERENCES product_variants(id) ON DELETE SET NULL,
  previous_stock INT NOT NULL,
  change_amount INT NOT NULL, -- Negative for orders, positive for restocks
  new_stock INT NOT NULL,
  reason inventory_reason_enum NOT NULL,
  actor_id UUID, -- Admin user ID or system identifier
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_inventory_logs_product ON inventory_logs(product_id, created_at DESC);

-- ==============================================================================
-- 6. DELIVERY ZONES & PIN CODES (Vadodara)
-- ==============================================================================
CREATE TABLE delivery_zones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  postal_code VARCHAR(10) NOT NULL UNIQUE, -- 6-digit Indian PIN code, e.g., '390001'
  zone_name VARCHAR(100) NOT NULL,        -- e.g., 'Alkapuri / Central Vadodara'
  city VARCHAR(60) NOT NULL DEFAULT 'Vadodara',
  delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00 CHECK (delivery_fee >= 0),
  estimated_days VARCHAR(50) NOT NULL DEFAULT '1-2 Days',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_delivery_zones_pin ON delivery_zones(postal_code) WHERE is_active = true;

-- ==============================================================================
-- 7. ORDERS TABLE
-- ==============================================================================
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number VARCHAR(30) NOT NULL UNIQUE,      -- Formatted public reference: THC-YYYYMM-XXXX
  lookup_token VARCHAR(64) NOT NULL UNIQUE,      -- Cryptographic unguessable secret token
  idempotency_key VARCHAR(100) NOT NULL UNIQUE,  -- Prevents duplicate submissions
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,          -- 10-digit Indian phone (E.164 compatible)
  customer_email VARCHAR(255),                  -- Optional for MVP
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
  payment_reference VARCHAR(150),               -- UPI UTR / transaction ID if provided
  internal_notes TEXT,                          -- Admin-only packaging/dispatch notes
  cancellation_reason TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_orders_lookup_token ON orders(lookup_token);
CREATE INDEX idx_orders_order_number ON orders(order_number);
CREATE INDEX idx_orders_status ON orders(order_status, created_at DESC);
CREATE INDEX idx_orders_customer_phone ON orders(customer_phone);

-- ==============================================================================
-- 8. ORDER ITEMS (Immutable Snapshot)
-- ==============================================================================
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

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ==============================================================================
-- 9. ORDER STATUS HISTORY AUDIT LOG
-- ==============================================================================
CREATE TABLE order_status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  previous_status order_status_enum,
  new_status order_status_enum NOT NULL,
  actor_id UUID, -- Supabase auth user id or NULL for system
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id, created_at ASC);

-- ==============================================================================
-- 10. CUSTOM ENQUIRIES & COMMISSIONS TABLE
-- ==============================================================================
CREATE TABLE enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(150) NOT NULL,
  customer_phone VARCHAR(20) NOT NULL,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  budget_estimate VARCHAR(80),
  needed_by_date DATE,
  reference_images TEXT[], -- Array of Cloudinary URLs
  status enquiry_status_enum NOT NULL DEFAULT 'NEW',
  admin_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_enquiries_status ON enquiries(status, created_at DESC);

-- ==============================================================================
-- 11. SITE SETTINGS TABLE (Configurable Parameters)
-- ==============================================================================
CREATE TABLE site_settings (
  key VARCHAR(80) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

-- ==============================================================================
-- 12. ADMIN AUDIT LOGS
-- ==============================================================================
CREATE TABLE admin_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_user_id UUID NOT NULL,
  action VARCHAR(100) NOT NULL,       -- e.g. 'PRODUCT_PRICE_UPDATED'
  resource_type VARCHAR(60) NOT NULL, -- e.g. 'products'
  resource_id VARCHAR(80) NOT NULL,
  diff_json JSONB,
  ip_address VARCHAR(45),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);

CREATE INDEX idx_audit_logs_timestamp ON admin_audit_logs(created_at DESC);
```

---

## 4. Stored Procedures & Transactional Functions

### 4.1 Safe Atomic Stock Decrement
This stored function prevents race conditions and overselling by taking row-level exclusive locks during checkout:

```sql
CREATE OR REPLACE FUNCTION decrement_inventory_safely(
  p_items JSONB -- Array of { product_id: UUID, variant_id: UUID | null, quantity: INT }
)
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
    -- 1. Fetch product type and variant configuration with lock
    SELECT product_type, has_variants, stock_quantity
    INTO v_product_type, v_has_variants, v_current_stock
    FROM products
    WHERE id = item.product_id AND deleted_at IS NULL
    FOR UPDATE;

    IF NOT FOUND THEN
      RAISE EXCEPTION 'Product % does not exist or has been deleted.', item.product_id;
    END IF;

    -- If product is MADE_TO_ORDER, physical stock deduction is not strictly gating
    IF v_product_type = 'MADE_TO_ORDER' THEN
      CONTINUE;
    END IF;

    -- 2. Deduct variant-level stock if variants exist
    IF v_has_variants THEN
      IF item.variant_id IS NULL THEN
        RAISE EXCEPTION 'Variant ID required for product % with variants.', item.product_id;
      END IF;

      SELECT stock_quantity INTO v_current_stock
      FROM product_variants
      WHERE id = item.variant_id AND product_id = item.product_id
      FOR UPDATE;

      IF NOT FOUND THEN
        RAISE EXCEPTION 'Variant % not found for product %.', item.variant_id, item.product_id;
      END IF;

      IF v_current_stock < item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for variant %. Available: %, Requested: %',
          item.variant_id, v_current_stock, item.quantity;
      END IF;

      UPDATE product_variants
      SET stock_quantity = stock_quantity - item.quantity,
          updated_at = timezone('utc', now())
      WHERE id = item.variant_id;

      INSERT INTO inventory_logs (
        product_id, variant_id, previous_stock, change_amount, new_stock, reason
      ) VALUES (
        item.product_id, item.variant_id, v_current_stock, -item.quantity,
        v_current_stock - item.quantity, 'ORDER_PLACED'
      );

    -- 3. Deduct product-level stock if no variants
    ELSE
      IF v_current_stock < item.quantity THEN
        RAISE EXCEPTION 'Insufficient stock for product %. Available: %, Requested: %',
          item.product_id, v_current_stock, item.quantity;
      END IF;

      UPDATE products
      SET stock_quantity = stock_quantity - item.quantity,
          updated_at = timezone('utc', now())
      WHERE id = item.product_id;

      INSERT INTO inventory_logs (
        product_id, variant_id, previous_stock, change_amount, new_stock, reason
      ) VALUES (
        item.product_id, NULL, v_current_stock, -item.quantity,
        v_current_stock - item.quantity, 'ORDER_PLACED'
      );
    END IF;
  END LOOP;
END;
$$;
```

---

## 5. Row-Level Security (RLS) Policies

```sql
-- Enable RLS across all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_status_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- 1. Public Storefront Read Policies (Anonymously accessible)
CREATE POLICY "Public can view active categories" ON categories
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can view published non-deleted products" ON products
  FOR SELECT USING (is_published = true AND deleted_at IS NULL);

CREATE POLICY "Public can view active variants of published products" ON product_variants
  FOR SELECT USING (
    is_active = true AND
    EXISTS (SELECT 1 FROM products WHERE products.id = product_variants.product_id AND products.is_published = true AND products.deleted_at IS NULL)
  );

CREATE POLICY "Public can view product images" ON product_images
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM products WHERE products.id = product_images.product_id AND products.is_published = true AND products.deleted_at IS NULL)
  );

CREATE POLICY "Public can view active delivery zones" ON delivery_zones
  FOR SELECT USING (is_active = true);

CREATE POLICY "Public can read site settings" ON site_settings
  FOR SELECT USING (true);

-- 2. Public Storefront Creation Policies
CREATE POLICY "Public can submit enquiries" ON enquiries
  FOR INSERT WITH CHECK (true);

-- 3. Authenticated Admin Full Management
CREATE POLICY "Admin full access on categories" ON categories
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on products" ON products
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on product_variants" ON product_variants
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on product_images" ON product_images
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on delivery_zones" ON delivery_zones
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on orders" ON orders
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on order_items" ON order_items
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on order_status_history" ON order_status_history
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on enquiries" ON enquiries
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on site_settings" ON site_settings
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Admin full access on admin_audit_logs" ON admin_audit_logs
  FOR ALL TO authenticated USING (true) WITH CHECK (true);
```

