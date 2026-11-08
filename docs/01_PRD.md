# 01_PRD.md — Product Requirements Document (PRD)

> **Project:** Bloomora Handcrafted Creations — Customer Storefront & Admin Console  
> **Brand Working Line:** *"Little Creations. Endless Emotions."*  
> **Version:** 1.0 (Live Implementation)  
> **Target Deployment:** Vercel Full-Stack Architecture (Next.js App Router)  
> **Decisions & Specs:** Finalized in [`10_OPEN_DECISIONS.md`](file:///Users/manishkumar/Desktop/craft/docs/10_OPEN_DECISIONS.md)

---

## 1. Executive Summary

**Bloomora** (Handcrafted Creations) is an artisan business based in Vadodara, Gujarat, specializing in handmade keychains, bouquets, handmade flowers, and bespoke personalized gifts. The business is transitioning from social chats to a high-performance, mobile-first web storefront and back-office admin console.

While social commerce provides a direct personal touch, manual order processing suffers from:
- Inconsistent catalog visibility and price confusion.
- Manual tracking of custom requests and delivery timelines.
- Uncoordinated inventory tracking leading to potential overselling.
- High operational overhead for the owner answering repetitive questions.

This project delivers a **unified, high-performance web platform** consisting of:
1. A **mobile-first customer storefront** where visitors discover products, configure options, verify local delivery eligibility, and place orders smoothly via guest checkout.
2. An **assisted commerce bridge** that generates context-aware WhatsApp click-to-chat links for customized inquiries.
3. A **protected, responsive admin console** enabling the business owner to manage products, variants, ready-made vs. made-to-order stock, delivery PIN codes, order lifecycles, and customer inquiries.

---

## 2. Business Goals & MVP Scope Boundaries

### 2.1 Core Business Goals
- **Professional Brand Presence:** Establish a cohesive, warm digital storefront that highlights genuine craftsmanship and real product photography.
- **Local Fulfillment Clarity:** Provide instant delivery fee calculation and eligibility validation based on recipient PIN codes in Vadodara.
- **Frictionless Purchasing:** Maximize conversion on mobile devices with guest checkout (no mandatory password creation).
- **Assisted Commerce Integration:** Blend self-serve e-commerce with WhatsApp conversations for custom gifts.
- **Operational Simplicity:** Enable the owner to process orders and update catalog items in under two minutes from a smartphone or desktop without engineering intervention.

### 2.2 Explicit Non-Goals for MVP
To ensure rapid, defect-free delivery, the following features are strictly excluded from the MVP:
- **Multi-Vendor / Marketplace:** No third-party sellers; single-tenant owner operations only.
- **International / Pan-India Logistics:** No automated courier aggregation APIs (e.g. Shiprocket) at launch; local Vadodara delivery only.
- **Native Mobile Apps:** No iOS/Android app store builds; optimized for mobile web (PWA-ready responsive web).
- **Complex Loyalty / Subscriptions:** No reward points, gift cards, or recurring recurring subscriptions.
- **Automated WhatsApp Business Bots:** No expensive Meta Cloud API webhooks or automated bots; leverages standard, reliable `wa.me` deep links.
- **Live Automated Payment Gateways (MVP Launch):** Gateway integration (e.g. Razorpay / Cashfree) is deferred until merchant onboarding and KYC are completed by the owner. MVP supports manual UPI confirmation and Cash on Delivery (COD) if approved by the owner.
- **Automated ERP / Invoicing Systems:** No direct integration with Tally or GST billing software in MVP.

---

## 3. User Personas & Role Matrix

| Role | Description | Access & Capabilities |
| :--- | :--- | :--- |
| **Guest Customer** | Primary shopper browsing on mobile devices. | - Browse and search active catalog.<br>- Add items to client-persisted cart.<br>- Complete checkout with name, phone, address, and PIN code.<br>- Receive secure order confirmation and track status using a high-entropy lookup token.<br>- Initiate WhatsApp chat pre-filled with product context. |
| **Registered Customer** *(P1 - Post MVP)* | Repeat customer with an authenticated account. | - All guest capabilities.<br>- View order history and saved delivery addresses.<br>- Save favorites / wishlist.<br>- Submit verified purchase reviews. |
| **Owner / Admin** | Single business owner managing operations. | - Authenticate via secure admin credentials.<br>- View real-time dashboard KPIs and daily summaries.<br>- Full CRUD on products, categories, variants, and stock adjustments.<br>- Manage order lifecycle transitions, add private internal notes, and cancel orders.<br>- Configure delivery zones, serviceable PIN codes, and flat fees.<br>- Manage customer inquiries, custom order requests, and homepage content. |
| **Staff Member** *(Future - v1.2)* | Assistant handling packing and dispatch. | - View and update order statuses.<br>- No access to financial settings, site configuration, or audit logs. |

---

## 4. Customer-Facing Functional Requirements

### FR-C01: Home Page Experience
- **FR-C01.1:** Prominently display brand identity, tagline (*"Little Creations. Endless Emotions."*), and clear primary Call-to-Action (CTA) leading to the catalog.
- **FR-C01.2:** Showcase curated featured categories and highlighted products dynamically managed by the admin.
- **FR-C01.3:** Feature a dedicated *"Why Handmade"* brand story section emphasizing care, artisanal detail, and emotional connection.
- **FR-C01.4:** Render customer reviews and testimonials only if genuine and approved via the admin panel.
- **FR-C01.5:** Display official Instagram link (`@the_.handmadecraft`) and serviceable area notice (Vadodara, Gujarat).
- **FR-C01.6:** Standard header and footer navigation linking to Shop, About Us, Contact, Policies, and Cart.

### FR-C02: Catalog & Search
- **FR-C02.1:** Display only active, published products.
- **FR-C02.2:** Multi-faceted filtering by category, price range, and availability (In Stock vs. Made-to-Order).
- **FR-C02.3:** Full-text search matching product titles and descriptions.
- **FR-C02.4:** Sorting options: Featured, Newest, Price (Low to High), and Price (High to Low).
- **FR-C02.5:** Responsive grid layout with pagination or load-more controls to prevent client bloat.
- **FR-C02.6:** Display clear pricing in INR (`₹`), product type badge, and preparation time estimate where applicable.

### FR-C03: Product Details
- **FR-C03.1:** High-resolution product image gallery hosted on Cloudinary with thumbnail navigation and swipeable mobile carousel.
- **FR-C03.2:** Complete product details: title, SKU, category, base price, optional compare-at price, detailed craftsmanship description, and dimensions/materials.
- **FR-C03.3:** Variant selector (e.g. Color, Flower Type, Size) with live price updates and real-time inventory validation.
- **FR-C03.4:** Display realistic preparation time estimate for made-to-order items (e.g., *"Handmade with love: Ready for dispatch in 2–3 days"*).
- **FR-C03.5:** Contextual WhatsApp enquiry CTA pre-populating message: *"Hi, I'm interested in [Product Title] ([Variant]) on your website: [URL]. Can I customize this?"*
- **FR-C03.6:** Related products carousel based on shared category.

### FR-C04: Shopping Cart
- **FR-C04.1:** Add, update quantity, and remove items with instant visual feedback (slide-over drawer on desktop, sheet on mobile).
- **FR-C04.2:** Client-side cart persistence using safe `localStorage` or encrypted session cookie.
- **FR-C04.3:** Live subtotal calculation with dynamic notification that delivery fees will be confirmed based on recipient PIN code.
- **FR-C04.4:** Server-side revalidation of pricing and stock availability before allowing entry into checkout.

### FR-C05: Checkout Experience
- **FR-C05.1:** Frictionless guest checkout collecting:
  - Full Name (required)
  - Mobile Number (10-digit Indian mobile, required for delivery coordination)
  - Full Delivery Address (street, landmark, flat/house number, required)
  - PIN Code (6-digit Indian postal code, required)
  - Special Instructions / Gift Note (optional)
- **FR-C05.2:** PIN code validation against active delivery zones in Vadodara. If unsupported, cleanly notify the user and offer a WhatsApp custom enquiry fallback.
- **FR-C05.3:** Server-side calculation of order total (Items Subtotal + Delivery Fee − Discounts).
- **FR-C05.4:** Payment method selection based on active configurations (e.g. Manual UPI Verification or Cash on Delivery).
- **FR-C05.5:** Strict checkout idempotency via unique client-generated `idempotency_key` to eliminate duplicate orders on multiple clicks.
- **FR-C05.6:** Order confirmation screen presenting the public Order Reference Number, receipt breakdown, and WhatsApp order support link.

### FR-C06: Order Tracking & Status Lookup
- **FR-C06.1:** Access order tracking strictly via a cryptographically random, high-entropy `lookup_token` (e.g., `/orders/track?token=...`). Public lookup by simple sequential IDs is prohibited.
- **FR-C06.2:** Visual status timeline representing the order lifecycle (`PENDING` → `CONFIRMED` → `PROCESSING` → `READY_FOR_DELIVERY` → `OUT_FOR_DELIVERY` → `DELIVERED`).
- **FR-C06.3:** Complete recipient-safe order snapshot (purchased items, delivery address, selected payment method, timeline).
- **FR-C06.4:** Strict redaction: Never expose internal admin notes, audit logs, or payment secrets.

### FR-C07: WhatsApp Assisted Enquiries
- **FR-C07.1:** Universal floating WhatsApp button and product-level inquiry triggers.
- **FR-C07.2:** Clean URL encoding of dynamic parameters ensuring compatibility across iOS, Android, and WhatsApp Web.
- **FR-C07.3:** Clean fallback: If the business WhatsApp number is unconfigured, hide the button gracefully or display standard contact form.

### FR-C08: Policy & Brand Information Pages
- **FR-C08.1:** Dedicated static/dynamic pages for About Us, Contact Us, Shipping & Delivery Policy, Returns & Refund Policy, Privacy Policy, and Terms of Service.
- **FR-C08.2:** All policy copy must be editable from the admin console or structured content files without code deployments.

---

## 5. Admin Console Functional Requirements

### FR-A01: Security & Authentication
- **FR-A01.1:** Dedicated, non-discoverable admin sign-in endpoint (e.g. `/admin/login`). Public registration is disabled.
- **FR-A01.2:** Session authentication managed via Supabase Auth with secure HTTP-only cookies.
- **FR-A01.3:** Strict server-side route guards and API middleware validating role claims on every admin request.
- **FR-A01.4:** Comprehensive audit logging of sensitive admin actions (status changes, price updates, stock overrides).

### FR-A02: Executive Dashboard
- **FR-A02.1:** Real-time KPI summary cards: Total Orders, Pending Orders, In-Processing Orders, Out-for-Delivery, and Low-Stock Warnings.
- **FR-A02.2:** Net and Gross Sales metrics with date-range filtering (Today, Last 7 Days, Month to Date, Custom).
- **FR-A02.3:** Quick-action table of recent unfulfilled orders requiring immediate owner action.

### FR-A03: Product & Variant Catalog Management
- **FR-A03.1:** Create, edit, publish, unpublish, and archive products.
- **FR-A03.2:** Product schema fields: Title, URL Slug, Short Teaser, Full Craftsmanship Description, Category ID, Base Price, Compare-at Price, Product Type (`READY_MADE` vs. `MADE_TO_ORDER`), Preparation Days, Featured Flag, and SEO Meta Tags.
- **FR-A03.3:** Image asset manager: Upload via Cloudinary, reorder image gallery, and assign the primary display thumbnail.
- **FR-A03.4:** Variant configurations: Multi-option support (e.g., Color, Style, Material) with variant-specific SKU, price modifier, and stock count.
- **FR-A03.5:** Soft-delete enforcement: Deleting a product that exists in past order snapshots archives the product rather than breaking historical order records.

### FR-A04: Category Management
- **FR-A04.1:** Manage product categories with name, slug, description, display order, and cover image.
- **FR-A04.2:** Safe deletion rule: Prevent category deletion if linked to active products.

### FR-A05: Single Source of Truth Inventory Control
- **FR-A05.1:** Strict inventory tracking hierarchy:
  - Products with variants track stock *exclusively at the variant level*.
  - Products without variants track stock *at the product level*.
  - Competing stock tallies are strictly prohibited.
- **FR-A05.2:** Support for made-to-order items with infinite or threshold-based capacity.
- **FR-A05.3:** Transactional adjustments: Every manual inventory modification records an adjustment quantity, reason code (`RESTOCK`, `DAMAGE`, `MANUAL_CORRECTION`, `ORDER_CANCELLED`), actor ID, and timestamp.
- **FR-A05.4:** Configurable low-stock threshold with visual warnings on dashboard and product lists.

### FR-A06: Order Processing & Lifecycle Management
- **FR-A06.1:** Comprehensive order table with search by Order Reference, Customer Name, Mobile Number, Status, and Date.
- **FR-A06.2:** Detail view featuring immutable snapshots of customer address, item prices, selected options, and delivery fee at the time of purchase.
- **FR-A06.3:** State machine enforcement: Status transitions can only follow sanctioned business paths (see Section 6).
- **FR-A06.4:** Admin internal notes: Private communication area for packaging notes, delivery driver instructions, and manual verification details.
- **FR-A06.5:** Cancellation handling: Order cancellation requires a documented reason and triggers policy-based automated inventory restoration.

### FR-A07: Delivery Zones & PIN-Code Management
- **FR-A07.1:** Table of serviceable delivery zones in Vadodara with PIN code, zone name, flat delivery fee, active/inactive toggle, and estimated transit time.
- **FR-A07.2:** Instant validation check during storefront checkout rejecting unserviceable areas gracefully.

### FR-A08: Enquiries & Custom Order Pipeline
- **FR-A08.1:** Inbox capturing customer inquiries submitted via storefront forms or logged from WhatsApp chats.
- **FR-A08.2:** Status lifecycle: `NEW` → `CONTACTED` → `QUOTED` → `ACCEPTED` → `DECLINED` → `CLOSED`.
- **FR-A08.3:** Capture customer name, phone, desired delivery date, budget range, and attached reference image links.

### FR-A09: Content & Brand Settings
- **FR-A09.1:** Configurable settings interface: Homepage announcement bar text, banner hero image, brand bio, official WhatsApp number, Instagram profile URL, and customer support contact details.
- **FR-A09.2:** Strict validation: Disallow raw executable JavaScript/HTML input to prevent Stored XSS.

### FR-A10: Basic Sales & Operational Analytics
- **FR-A10.1:** Order volume and revenue aggregated by date range.
- **FR-A10.2:** Top-selling products and categories by unit volume and gross revenue.
- **FR-A10.3:** Average Order Value (AOV) calculations excluding cancelled/refunded orders.

---

## 6. Order & Payment State Transition Models

### 6.1 Order Lifecycle State Machine

```
              [Customer Checkout]
                       |
                       v
                   +-------+
                   |PENDING|
                   +---+---+
                       | (Admin Confirms Order / Verifies Payment)
                       v
                  +---------+
       +--------->|CONFIRMED|
       |          +----+----+
       |               | (Crafting / Packaging Starts)
       |               v
       |         +------------+
       |         | PROCESSING |
       |         +-----+------+
       |               | (Item Packed & Ready)
       |               v
       |     +--------------------+
       |     | READY_FOR_DELIVERY |
       |     +---------+----------+
       |               | (Handed to Local Delivery Rider)
       |               v
       |     +--------------------+
       |     |  OUT_FOR_DELIVERY  |
       |     +---------+----------+
       |               | (Customer Receives Order)
       |               v
       |          +-----------+
       |          | DELIVERED |
       |          +-----+-----+
       |                |
(Restock Logic)         v (Return Request Approved)
       |          +-----------+
       +----------+ RETURNED  |
                  +-----------+

* Exception State: CANCELLED (Allowed from PENDING, CONFIRMED, or PROCESSING).
```

#### Valid Order Transitions:
- `PENDING` $\rightarrow$ `CONFIRMED` or `CANCELLED`
- `CONFIRMED` $\rightarrow$ `PROCESSING` or `CANCELLED`
- `PROCESSING` $\rightarrow$ `READY_FOR_DELIVERY` or `CANCELLED`
- `READY_FOR_DELIVERY` $\rightarrow$ `OUT_FOR_DELIVERY` or `CANCELLED`
- `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED` or `CANCELLED` (failed delivery)
- `DELIVERED` $\rightarrow$ `RETURNED` (requires admin approval)

### 6.2 Payment Lifecycle State Machine

- Valid states: `NOT_REQUIRED`, `PENDING`, `PAID`, `FAILED`, `REFUNDED`, `PARTIALLY_REFUNDED`.
- For Manual UPI: Status starts as `PENDING`. Customer uploading a screenshot or submitting a transaction reference is *not* proof of payment; status only transitions to `PAID` when the admin confirms receipt in the bank/UPI account.
- For COD: Payment status is `PENDING` until marked `PAID` upon verified delivery confirmation.

---

## 7. Non-Functional & Quality Standards

1. **Mobile-First Responsiveness:** Flawless rendering and touch ergonomics on iOS (Safari) and Android (Chrome) across 360px–430px viewports.
2. **Accessibility (WCAG 2.2 AA):** All interactive elements must have visible focus rings, high contrast ratios ($\ge 4.5:1$ for normal text), appropriate ARIA labels, and full keyboard navigability.
3. **Performance & Core Web Vitals:**
   - Largest Contentful Paint (LCP) $\le 2.0\text{s}$ on standard 4G mobile connections.
   - Cumulative Layout Shift (CLS) $\le 0.05$.
   - First Input Delay (FID) / Interaction to Next Paint (INP) $\le 100\text{ms}$.
4. **Security & Cryptography:** Zero secrets committed to Git; high-entropy tokens for order lookups; parameterized SQL via Supabase client; sanitization of all inputs.
5. **Localization:**
   - Display Currency: Indian Rupee (`₹` / `INR`).
   - Timestamps: Stored in database as **UTC**; formatted for presentation in **Asia/Kolkata (IST)**.

---

## 8. MVP Acceptance Criteria Checklist

- [ ] Visitor can discover, search, and filter published handmade products on mobile and desktop.
- [ ] Product details accurately display Cloudinary images, descriptions, options, and estimated craft timelines.
- [ ] Cart updates seamlessly and recalculates subtotals accurately.
- [ ] Checkout enforces Vadodara PIN code validation and applies correct delivery charges server-side.
- [ ] Double-clicking the place-order button produces only one order (idempotent submission).
- [ ] Customer receives an order confirmation with a secret, high-entropy lookup link.
- [ ] WhatsApp button initiates a chat with a perfectly formatted, prefilled product/order enquiry message.
- [ ] Admin can securely log in, update catalog items, and view real-time orders.
- [ ] Inventory decrements transactionally without race conditions or negative balances.
- [ ] All informational policy pages (Shipping, Returns, Privacy, Terms) are fully rendered.
- [ ] Production build passes all automated unit, integration, and lint checks with zero errors.

