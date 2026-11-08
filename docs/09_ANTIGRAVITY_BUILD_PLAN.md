# 09_ANTIGRAVITY_BUILD_PLAN.md — Implementation Roadmap & Execution Plan

> **The Handmade Craft** — Customer Storefront & Admin Console  
> **Execution Strategy:** Phased, Test-Driven, Incremental Verification  
> **Architecture:** Full-Stack Next.js (App Router) on Vercel + Supabase Postgres + Cloudinary + WhatsApp  
> **Status:** Planning Baseline (Awaiting User/Owner Approval to Begin Phase 1)

---

## 1. Phased Execution Roadmap Overview

The implementation is structured into **six discrete, self-verifying phases**. Each phase produces a testable increment, enforcing strict separation of concerns and preventing technical debt:

```
+----------------------------------------------------------------------------------------------------+
| Phase 1: Scaffolding, Tooling & Design System                                                      |
| Next.js App Router, TypeScript, Tailwind CSS v4, Font Pairing, Responsive Layout Shells             |
+-------------------------------------------------+--------------------------------------------------+
                                                  | Verification Gate 1: Lint, Build, Responsive Shell
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 2: Database Layer, Migrations & Supabase Architecture                                        |
| PostgreSQL DDL, RLS Policies, Atomic Stock Functions, Supabase Client Modules, Typed Models       |
+-------------------------------------------------+--------------------------------------------------+
                                                  | Verification Gate 2: Migration Run, RLS Validation
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 3: Customer Storefront Experience                                                            |
| Hero, Category Navigation, Catalog Filtering & Search, Product Details, Cloudinary Gallery, WhatsApp|
+-------------------------------------------------+--------------------------------------------------+
                                                  | Verification Gate 3: Visual & Functional Acceptance
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 4: Cart, PIN Delivery Validation, Idempotent Checkout & Tracking                             |
| Client Cart Persistence, Vadodara PIN Checker, Atomic Stock Checkout, Unguessable Tracking Token   |
+-------------------------------------------------+--------------------------------------------------+
                                                  | Verification Gate 4: Stock Lock & Idempotency Tests
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 5: Protected Admin Console                                                                   |
| Supabase Auth, Dashboard KPIs, Product/Variant Manager, Stock Adjustments, Order State Transitions  |
+-------------------------------------------------+--------------------------------------------------+
                                                  | Verification Gate 5: RBAC & State Machine Integrity
                                                  v
+----------------------------------------------------------------------------------------------------+
| Phase 6: Automated Test Suite, Hardening & Production Deployment                                   |
| Vitest Unit Tests, Concurrency Race Tests, Playwright E2E, Vercel Release, Operational Handover     |
+----------------------------------------------------------------------------------------------------+
```

---

## 2. Phase-by-Phase Technical Breakdown

### Phase 1: Scaffolding, Tooling & Design System
- **Objective:** Establish the clean Next.js App Router workspace with strict TypeScript configurations, Tailwind CSS tokens, typography, and reusable layout shells.
- **Detailed Tasks:**
  1. Initialize Next.js 15 (App Router, TypeScript, Tailwind CSS, ESLint).
  2. Configure Tailwind CSS with the handcrafted design tokens specified in [`02_UX_UI_GUIDE.md`](file:///Users/manishkumar/Desktop/craft/docs/02_UX_UI_GUIDE.md) (Terracotta `#C06C54`, Warm Linen `#FDFBF7`, Soft Sage `#738A75`, Deep Cocoa `#2C2420`).
  3. Load font families: `Playfair Display` / `Cormorant Garamond` for headings and `Plus Jakarta Sans` / `Inter` for UI.
  4. Build responsive header, announcement banner, navigation drawer, and footer components for the storefront.
  5. Implement atomic UI primitives: Button, Input, Modal, Drawer, Badge, Card.
- **Verification Gate:**
  - `npm run build` succeeds cleanly.
  - Shell layouts render seamlessly across mobile (375px), tablet (768px), and desktop (1280px) viewports.

---

### Phase 2: Database Layer, Migrations & Supabase Architecture
- **Objective:** Deploy the complete PostgreSQL schema to Supabase, configure Row-Level Security (RLS), and write server-side client connection helpers.
- **Detailed Tasks:**
  1. Set up `@supabase/ssr` with browser, server, and admin client factories in `src/lib/supabase/`.
  2. Create migration scripts for all 12 tables and enums defined in [`04_DATABASE_SCHEMA.md`](file:///Users/manishkumar/Desktop/craft/docs/04_DATABASE_SCHEMA.md).
  3. Implement the PostgreSQL stored procedure `decrement_inventory_safely()` with row-level locks (`FOR UPDATE`).
  4. Configure Row-Level Security (RLS) policies for public reads, customer enquiry submissions, and admin full access.
  5. Generate comprehensive TypeScript database definitions from the schema (`src/types/database.types.ts`).
- **Verification Gate:**
  - Migrations execute without errors in Supabase.
  - RLS policies block unauthorized write attempts on products and orders.

---

### Phase 3: Customer Storefront Experience
- **Objective:** Build out the discovery and product exploration experience for shoppers in Vadodara.
- **Detailed Tasks:**
  1. Build the **Home Page (`app/(storefront)/page.tsx`)**:
     - Brand Hero with primary CTA ("Explore Handcrafted Gifts").
     - Featured categories grid and curated product highlights.
     - "Why Handmade" brand storytelling section.
     - Vadodara local delivery service notice and Instagram connection.
  2. Build the **Catalog Page (`app/(storefront)/shop/page.tsx`)**:
     - Category filter pills, price range slider, and in-stock toggle.
     - Full-text search input with debounce.
     - Sort dropdown (Featured, Newest, Price Low $\rightarrow$ High, Price High $\rightarrow$ Low).
  3. Build the **Product Detail Page (`app/(storefront)/shop/[slug]/page.tsx`)**:
     - Cloudinary image gallery with swipeable thumbnails.
     - Real-time variant selector with dynamic price and stock updates.
     - Preparation time estimate badge (for made-to-order items).
     - Context-aware WhatsApp enquiry button pre-populating product name and URL.
  4. Build static informational policy pages: Shipping, Returns, Privacy, Terms, Contact, and About Us.
- **Verification Gate:**
  - Lighthouse Performance score $\ge 90$ on mobile.
  - WhatsApp deep-link properly builds and encodes URLs across all products.

---

### Phase 4: Cart, PIN Delivery Validation, Idempotent Checkout & Tracking
- **Objective:** Implement complete commerce transaction capabilities: client-persisted cart, server-side Vadodara PIN code validation, atomic order creation, and token-based status lookup.
- **Detailed Tasks:**
  1. Build client-side cart drawer with `localStorage` persistence and slide-over animation.
  2. Implement `GET /api/store/delivery-zones/check`: Validate recipient PIN against active Vadodara delivery zones and return delivery fee.
  3. Implement **Guest Checkout (`app/(storefront)/checkout/page.tsx`)**:
     - Recipient address form with real-time PIN validation.
     - Order summary with itemized prices and delivery fee.
     - Payment method selector (Manual UPI QR/VPA instructions or COD).
     - Unique `idempotency_key` generation per checkout session.
  4. Implement `POST /api/store/checkout` route handler:
     - Verify prices against authoritative database records.
     - Call `decrement_inventory_safely()` inside an atomic transaction.
     - Create immutable snapshots in `order_items`.
     - Generate high-entropy unguessable `lookup_token` and formatted `order_number`.
  5. Implement **Order Confirmation & Tracking (`app/(storefront)/orders/track/page.tsx`)**:
     - Vertical status progress timeline.
     - Masked customer contact details and redacted internal notes.
- **Verification Gate:**
  - Automated tests confirm identical `idempotency_key` never creates duplicate orders.
  - Checkout strictly rejects unserviceable PIN codes with a polite WhatsApp fallback.

---

### Phase 5: Protected Admin Console
- **Objective:** Build a secure, back-office administration suite for the business owner.
- **Detailed Tasks:**
  1. Implement **Authentication (`app/(admin)/admin/login/page.tsx`)**:
     - Supabase Auth sign-in with HTTP-only cookies.
     - Next.js edge middleware redirecting unauthenticated or non-admin visitors.
  2. Implement **Executive Dashboard (`app/(admin)/admin/dashboard/page.tsx`)**:
     - Real-time metric cards: Pending Orders, In-Crafting, Out-for-Delivery, Low Stock.
     - Today's and MTD sales summaries.
  3. Implement **Product & Variant Catalog Manager**:
     - Form to create/edit products with Cloudinary drag-and-drop image upload.
     - Dynamic variant manager (title, SKU, price override, stock).
     - Archive toggle (soft-delete) to protect past order foreign keys.
  4. Implement **Inventory Control Center**:
     - Single source of truth stock adjustment modal with required reason logging.
  5. Implement **Order Fulfillment Suite**:
     - Filterable, searchable order table.
     - Order detail view with customer address, item snapshot, and private internal notes.
     - State machine transition controls (`PENDING` $\rightarrow$ `CONFIRMED` $\rightarrow$ `PROCESSING` $\rightarrow$ `READY_FOR_DELIVERY` $\rightarrow$ `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`).
     - Order cancellation modal with automatic restock trigger.
  6. Implement **Delivery Zones & Settings Manager**:
     - Add/edit Vadodara PIN codes and delivery charges.
     - Update site settings: announcement banner, WhatsApp business phone number.
- **Verification Gate:**
  - Unauthenticated visits to `/admin/*` are blocked with 100% reliability.
  - Order status transitions strictly adhere to the defined state machine.

---

### Phase 6: Automated Test Suite, Hardening & Production Deployment
- **Objective:** Achieve automated test coverage, conduct security hardening, and deploy the production build to Vercel.
- **Detailed Tasks:**
  1. Write and run Vitest test suites for cart calculations, formatters, and Zod validators.
  2. Write integration tests for idempotent checkout and atomic stock decrement.
  3. Execute a multi-threaded concurrency test simulating simultaneous checkout of low-stock items.
  4. Run Playwright E2E browser tests for the complete customer shopping and admin fulfillment workflows.
  5. Audit application for security: Verify security headers (CSP, HSTS, X-Frame-Options), confirm zero leaked secrets in client bundles.
  6. Deploy to Vercel, attach custom domain, configure production Supabase & Cloudinary credentials, and execute final smoke tests.
- **Verification Gate:**
  - All automated unit, integration, and E2E tests pass.
  - Zero TypeScript or lint errors.
  - Successful live test transaction executed on production.

