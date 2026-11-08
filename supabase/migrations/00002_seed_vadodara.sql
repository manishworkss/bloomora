-- ==============================================================================
-- THE HANDMADE CRAFT — VADODARA SEED DATA MIGRATION
-- Version: 1.0 (Nov 2026)
-- Target: Initial Categories, Vadodara Delivery Zones, Site Settings & Products
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Floral Bouquets', 'bouquets', 'Everlasting handmade crochet bouquets with lavender, tulips, and roses.', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Desk Flower Pots', 'flowers', 'Adorable smiling sunflowers and potted crochet blooms for work desks.', 2, true),
  ('c1000000-0000-0000-0000-000000000003', 'Handmade Keychains', 'keychains', 'Charming daisy charms, strawberries, and personalized key tags.', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED VADODARA DELIVERY ZONES (All 17 Major Postal Codes Active at ₹50 Flat Fee)
INSERT INTO delivery_zones (postal_code, zone_name, city, delivery_fee, estimated_days, is_active)
VALUES
  ('390001', 'Alkapuri / Central Vadodara', 'Vadodara', 50.00, '1-2 Days', true),
  ('390002', 'Mandvi / Old City', 'Vadodara', 50.00, '1-2 Days', true),
  ('390004', 'Fatehgunj / MS University Area', 'Vadodara', 50.00, '1-2 Days', true),
  ('390007', 'Race Course / Inox Area', 'Vadodara', 50.00, '1-2 Days', true),
  ('390008', 'Waghodia Road', 'Vadodara', 50.00, '1-2 Days', true),
  ('390010', 'Karelibaug', 'Vadodara', 50.00, '1-2 Days', true),
  ('390011', 'Sayajigunj / Station Area', 'Vadodara', 50.00, '1-2 Days', true),
  ('390012', 'Gorwa / BIDC', 'Vadodara', 50.00, '1-2 Days', true),
  ('390015', 'Sama / New Sama Road', 'Vadodara', 50.00, '1-2 Days', true),
  ('390018', 'Gotri', 'Vadodara', 50.00, '1-2 Days', true),
  ('390019', 'Harni / Airport Area', 'Vadodara', 50.00, '1-2 Days', true),
  ('390020', 'Manjalpur / Makarpura', 'Vadodara', 50.00, '1-2 Days', true),
  ('390021', 'Gotri Road / Sevasi', 'Vadodara', 50.00, '1-2 Days', true),
  ('390022', 'Vasna / Bhayli Road', 'Vadodara', 50.00, '1-2 Days', true),
  ('390023', 'Subhanpura', 'Vadodara', 50.00, '1-2 Days', true),
  ('390024', 'Akota', 'Vadodara', 50.00, '1-2 Days', true),
  ('390025', 'Tarsali', 'Vadodara', 50.00, '1-2 Days', true)
ON CONFLICT (postal_code) DO NOTHING;

-- 3. SEED SITE SETTINGS (Configured with Approved WhatsApp Number)
INSERT INTO site_settings (key, value, description)
VALUES
  ('business_whatsapp_number', '"918271735190"', 'Official owner WhatsApp contact number for wa.me links.'),
  ('instagram_handle', '"the_.handmadecraft"', 'Official Instagram username.'),
  ('announcement_text', '"Handcrafted with love in Vadodara • Delivering across all of Vadodara • WhatsApp Orders: +91 8271735190"', 'Storefront top announcement bar text.'),
  ('default_delivery_fee', '50.00', 'Standard local courier delivery charge in Vadodara.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = timezone('utc', now());

-- 4. SEED PRODUCTS
INSERT INTO products (
  id, category_id, title, slug, short_description, full_description,
  base_price, compare_at_price, product_type, preparation_days,
  is_published, is_featured, stock_quantity, low_stock_threshold
) VALUES
  (
    'p1000000-0000-0000-0000-000000000001',
    'c1000000-0000-0000-0000-000000000001',
    'Everlasting Crochet Lavender & Tulip Bouquet',
    'everlasting-lavender-tulip-bouquet',
    'Handcrafted with soft milk-cotton yarn in pastel lilac and cream, tied with natural jute twine.',
    'A timeless arrangement of handcrafted lavender sprigs and pastel tulips. Hand-knitted with love in Vadodara, this bouquet never withers and stays vibrant forever. Perfect for birthdays, anniversaries, or self-love gifting.',
    899.00, 1049.00, 'READY_MADE', 0, true, true, 6, 2
  ),
  (
    'p1000000-0000-0000-0000-000000000002',
    'c1000000-0000-0000-0000-000000000002',
    'Mini Smiling Sunflower Crochet Desk Pot',
    'mini-smiling-sunflower-crochet-pot',
    'Adorable handmade yellow sunflower with a joyful face sitting in a cozy terracotta yarn pot.',
    'Brighten any work desk, study table, or gifting occasion with this cheerful smiling sunflower. Hand-crocheted stitch-by-stitch with soft hypoallergenic yarn.',
    399.00, 450.00, 'READY_MADE', 0, true, true, 10, 3
  ),
  (
    'p1000000-0000-0000-0000-000000000003',
    'c1000000-0000-0000-0000-000000000003',
    'Handmade Daisy Flower Charm Keychain',
    'handmade-daisy-flower-charm-keychain',
    'Delicate white daisy with yellow pistil charm, durable alloy golden ring, and ribbon bow.',
    'A lightweight yet durable handmade keychain to keep keys organized or attach to your favorite handbag, school bag, or backpack.',
    199.00, 249.00, 'READY_MADE', 0, true, true, 15, 5
  ),
  (
    'p1000000-0000-0000-0000-000000000004',
    'c1000000-0000-0000-0000-000000000001',
    'Customizable Pastel Rose & Daisy Keepsake Bouquet',
    'customizable-pastel-rose-daisy-keepsake-bouquet',
    'Bespoke bouquet customized with your favorite color palette. Handcrafted to order.',
    'Select your personalized colors and let our artisan craft an exclusive floral bouquet just for your special person. Handcrafted to order in 3–4 days in Vadodara.',
    1199.00, NULL, 'MADE_TO_ORDER', 3, true, true, 99, 1
  )
ON CONFLICT (slug) DO NOTHING;

