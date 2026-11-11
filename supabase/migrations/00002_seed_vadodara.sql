-- ==============================================================================
-- BLOOMORA — VADODARA SEED DATA MIGRATION
-- Version: 1.0 (Nov 2026)
-- Target: Initial Categories, Vadodara Delivery Zones, Site Settings & Products
-- ==============================================================================

-- 1. SEED CATEGORIES
INSERT INTO categories (id, name, slug, description, image_url, display_order, is_active)
VALUES
  ('c1000000-0000-0000-0000-000000000001', 'Handmade Keychain', 'handmade-keychain', 'Hand-crocheted daisies, strawberries, hearts, and miniature keepsakes crafted for everyday charm.', '/images/cat-handmade-keychain.jpg', 1, true),
  ('c1000000-0000-0000-0000-000000000002', 'Customized Bouquet', 'customized-bouquet', 'Bespoke everlasting crochet bouquets wrapped with ribbons, roses, tulips, and your personal colour palette.', '/images/cat-customized-bouquet.jpg', 2, true),
  ('c1000000-0000-0000-0000-000000000006', 'Handmade Flower', 'handmade-flower', 'Everlasting single crochet sunflowers, roses, tulips, and desk flower pots that never fade.', '/images/cat-handmade-flower.jpg', 3, true),
  ('c1000000-0000-0000-0000-000000000003', 'Seasonable Handmade Products', 'seasonable-handmade-products', 'Limited-edition festive marigolds, cozy winter knits, and seasonal handcrafted creations made fresh in small batches.', '/images/cat-seasonable-handmade.jpg', 4, true),
  ('c1000000-0000-0000-0000-000000000004', 'Birthday Surprise Card', 'birthday-surprise-card', 'Handmade pop-up explosion cards, layered memory flaps, handwritten notes, and birthday keepsake envelopes.', '/images/cat-birthday-surprise-card.jpg', 5, true),
  ('c1000000-0000-0000-0000-000000000005', 'Customized / Personalized Gifts', 'customized-personalized-gifts', 'You have an idea — we have the creativity to craft it into a one-of-a-kind handmade keepsake made from scratch.', '/images/cat-personalized-gifts.jpg', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- 2. SEED VADODARA DELIVERY ZONES (All 17 Major Postal Codes Active at ₹50 Flat Fee)
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

-- 3. SEED SITE SETTINGS (Configured with Approved WhatsApp Number)
INSERT INTO site_settings (key, value, description)
VALUES
  ('business_whatsapp_number', '"918271735190"', 'Official owner WhatsApp contact number for wa.me links.'),
  ('instagram_handle', '"bloomora.creation"', 'Official Instagram username.'),
  ('announcement_text', '"Handcrafted with love in Vadodara • Delivering across all of Vadodara • WhatsApp Orders: +91 8271735190"', 'Storefront top announcement bar text.'),
  ('default_delivery_fee', '50.00', 'Standard local courier delivery charge in Vadodara.')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = timezone('utc', now());


