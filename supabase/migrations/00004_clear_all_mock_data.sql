-- ==============================================================================
-- BLOOMORA — PURGE ALL SEEDED & MOCK DATA
-- Version: 1.0 (Nov 2026)
-- Target: Reset database to clean production state (Real Data Only)
-- Retains: Categories, Delivery Zones, Site Settings, Schema & Triggers
-- ==============================================================================

-- 1. Remove all mock orders and order items
DELETE FROM order_items;
DELETE FROM orders;

-- 2. Remove all mock products and their images
DELETE FROM product_images;
DELETE FROM products;

-- 3. Remove all mock custom order enquiries
DELETE FROM custom_order_enquiries;

-- 4. Remove all mock reviews
DELETE FROM reviews;
