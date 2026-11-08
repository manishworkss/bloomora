# 03_TECHNICAL_ARCHITECTURE.md — System & Technical Architecture

> **The Handmade Craft** — Customer Storefront & Admin Console  
> **Architecture Pattern:** Full-Stack Next.js App Router on Vercel Serverless  
> **Data Layer:** Supabase Managed PostgreSQL with Row-Level Security (RLS)  
> **Media Layer:** Cloudinary Image Pipeline & CDN Delivery  
> **Deployment Target:** Vercel Global Edge Network

---

## 1. System Topology & Architectural Philosophy

The architecture adopts a **Vercel-native full-stack Next.js** design. By leveraging Next.js 15 App Router with React Server Components (RSC) and Server Actions / Route Handlers, the entire frontend and backend coexist in a single, type-safe repository, eliminating the operational overhead of hosting and maintaining a separate Spring Boot or Node.js server.

```
+----------------------------------------------------------------------------------------------------+
|                                           CLIENT BROWSER                                           |
|       Mobile Safari / Chrome (Customers)               Desktop / Tablet Chrome (Admin)             |
+-------------------------------------------------+--------------------------------------------------+
                                                  | HTTPS / HTTP2
                                                  v
+----------------------------------------------------------------------------------------------------+
|                                           VERCEL PLATFORM                                          |
|                                                                                                    |
|  +-----------------------------------------------------------------------------------------------+  |
|  | Middleware Layer (middleware.ts)                                                              |  |
|  | - Admin Route Protection (Supabase Session verification & role check)                        |  |
|  | - Security Headers (CSP, HSTS, X-Frame-Options, Permissions-Policy)                          |  |
|  +-----------------------------------------------------------------------------------------------+  |
|                                                  |                                                 |
|         +----------------------------------------+---------------------------------------+         |
|         |                                                                                |         |
|         v                                                                                v         |
|  +-----------------------------------------------+      +---------------------------------------+  |
|  | Storefront Route Group (app/(storefront)/)    |      | Admin Route Group (app/(admin)/)      |  |
|  | - React Server Components (Catalog, Detail)   |      | - Server Components (Dashboard, SSR)  |  |
|  | - Client Components (Cart, Checkout, Filters) |      | - Client Components (Editors, Tables) |  |
|  +-----------------------------------------------+      +---------------------------------------+  |
|                                                  |                                                 |
|                                                  v                                                 |
|  +-----------------------------------------------------------------------------------------------+  |
|  | API & Server Actions Layer (app/api/ & server-actions/)                                       |  |
|  | - POST /api/store/checkout (Idempotent order creation with atomic stock decrement)            |  |
|  | - GET /api/store/orders/[lookupToken] (Safe order tracking)                                   |  |
|  | - Admin Route Handlers (Catalog CRUD, Stock Adjustments, Order State Transitions)             |  |
|  +-----------------------------------------------------------------------------------------------+  |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+   +---------------------------------------------+
|              SUPABASE MANAGED CLOUD              |   |               CLOUDINARY CDN                |
|                                                  |   |                                             |
|  - PostgreSQL 16 with Supabase Connection Pooler |   |  - Media Storage: High-res craft photos     |
|  - Transactional Stored Procedure for Stock Locks|   |  - On-the-fly Format: f_auto, q_auto        |
|  - Supabase Auth (Admin identity & token mgmt)   |   |  - Responsive Resizing: w_800, c_limit      |
|  - Row Level Security (RLS) enforcement          |   |  - Low Quality Image Placeholders (LQIP)    |
+--------------------------------------------------+   +---------------------------------------------+
```

---

## 2. Next.js App Router Structure & Boundary Design

### 2.1 Route Groups
The application is partitioned into two isolated route groups to guarantee complete separation of layouts, styles, and middleware protection:

1. **`app/(storefront)/`:** Customer-facing routes with warm artisanal aesthetic, public caching headers, and mobile-optimized layouts.
2. **`app/(admin)/`:** Protected administrative console with desktop/tablet dashboard navigation, data tables, and strict authentication barriers.
3. **`app/api/`:** Standardized REST Route Handlers for external webhooks, client mutations, and programmatic data access.

### 2.2 Server vs. Client Component Boundaries

To maximize Core Web Vitals and minimize JavaScript bundle payloads sent to mobile devices:

| Component | Execution Type | Rationale |
| :--- | :--- | :--- |
| **Catalog Grid & Product Lists** | **Server Component (RSC)** | Directly queries Supabase; rendered to static/cached HTML; zero client bundle overhead. |
| **Product Detail Page (Shell)** | **Server Component (RSC)** | Pre-fetches product metadata, primary image, and descriptions for SEO and fast First Contentful Paint. |
| **Product Variant Selector** | **Client Component (`'use client'`)** | Manages local selection state, updates live price display, and checks variant stock. |
| **Cart Drawer & Floating Badge** | **Client Component (`'use client'`)** | Reads client-side `localStorage`, calculates optimistic totals, and manages slide-over animations. |
| **Checkout Form & PIN Validator**| **Client Component (`'use client'`)** | Real-time input masking (10-digit phone, 6-digit PIN), interactive feedback, and idempotency generation. |
| **Order Status Page** | **Server Component (RSC)** | Fetches immutable order snapshot server-side via `lookup_token`, ensuring no secrets leak into client bundles. |
| **Admin Dashboard Charts & KPIs** | **Server Component (RSC)** | Aggregates order data on server; passes lightweight props to client visualizers. |
| **Admin Product Editor Form** | **Client Component (`'use client'`)** | Manages multi-tab forms, dynamic variant addition, and Cloudinary media upload widgets. |

---

## 3. Caching & Data Revalidation Strategy

Next.js caching is configured intentionally according to data volatility:

```
[Request]
    |
    +---> Storefront Catalog / Products
    |       |--> Cached with Tag ('products', 'categories')
    |       |--> Revalidated on demand when admin edits a product (revalidateTag('products'))
    |
    +---> Cart Verification & Checkout
    |       |--> dynamic = 'force-dynamic', fetchCache = 'force-no-store'
    |       |--> Real-time stock verification against Supabase inside PostgreSQL transaction
    |
    +---> Order Lookup (/orders/track?token=...)
    |       |--> dynamic = 'force-dynamic' (Never cached publicly; private customer data)
    |
    +---> Admin Console
            |--> dynamic = 'force-dynamic' (Always fresh real-time operational data)
```

1. **Catalog & Categories:** Use Next.js Tag-based revalidation (`revalidateTag('catalog')`). When the owner creates or edits a product, Server Actions trigger immediate cache invalidation.
2. **Checkout & Inventory:** Always dynamic (`no-store`). Every cart validation, delivery eligibility check, and order placement bypasses all caches to prevent overselling.

---

## 4. State Management Architecture

- **Client-Side Cart Store:**
  - Built with **Zustand** or React Context with local storage synchronization.
  - Cart Item Schema:
    ```typescript
    interface CartItem {
      productId: string;
      variantId?: string; // Optional if product has no variants
      title: string;
      variantTitle?: string;
      unitPrice: number;
      quantity: number;
      imageUrl: string;
      maxAvailableStock: number;
    }
    ```
- **Server-Side Mutation Handling:**
  - Client sends cart items + recipient info + `idempotency_key` to `POST /api/store/checkout`.
  - Server recalculates prices from authoritative database records (never trusting client-supplied prices).

---

## 5. Third-Party Service Integration Contracts

### 5.1 Supabase Postgres & Auth
- **Client Library:** `@supabase/ssr` (official Server-Side Rendering package for Next.js App Router).
- **Connection Model:**
  - Browser Client (`createBrowserClient`): For client-side UI hooks.
  - Server Client (`createServerClient`): Used in Server Components and Route Handlers with HTTP-only cookie forwarding.
  - Admin/Service Role Client: Used *exclusively* in protected Server Actions for sensitive operations (bypassing RLS with audit logging).

### 5.2 Cloudinary Image Pipeline
- **Storage:** Product photos are uploaded directly to a dedicated Cloudinary folder (`the-handmade-craft/products/`).
- **Delivery Transformation URL Helper:**
  ```typescript
  export function getOptimizedImageUrl(publicId: string, options: { width?: number; height?: number } = {}) {
    const { width = 800, height } = options;
    const transforms = ['f_auto', 'q_auto', `w_${width}`, 'c_limit'];
    if (height) transforms.push(`h_${height}`);
    return `https://res.cloudinary.com/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload/${transforms.join(',')}/${publicId}`;
  }
  ```
- **Benefits:** Automatic WebP/AVIF formatting, responsive image sizes, and sub-second asset delivery over global CDNs.

### 5.3 WhatsApp Dynamic Link Generator
- **Utility:** Generates standards-compliant WhatsApp click-to-chat URLs:
  ```typescript
  export function buildWhatsAppLink(params: {
    phone: string; // E.164 without '+' or spaces, e.g. '919876543210'
    message: string;
  }): string {
    const cleanPhone = params.phone.replace(/[^0-9]/g, '');
    const encodedMessage = encodeURIComponent(params.message.trim());
    return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
  }
  ```
- **Contextual Inquiries:** Prefills product title, variant, and canonical product URL so the business owner immediately knows what the customer is asking about.

---

## 6. Directory Layout Specification

```
craft/
├── docs/                                  # Complete companion documentation suite
│   ├── 00_START_HERE.md
│   ├── 01_PRD.md
│   ├── 02_UX_UI_GUIDE.md
│   ├── 03_TECHNICAL_ARCHITECTURE.md
│   ├── 04_DATABASE_SCHEMA.md
│   ├── 05_API_SPEC.md
│   ├── 06_SECURITY_PRIVACY.md
│   ├── 07_TEST_PLAN.md
│   ├── 08_DEPLOYMENT_RUNBOOK.md
│   ├── 09_ANTIGRAVITY_BUILD_PLAN.md
│   └── 10_OPEN_DECISIONS.md
├── src/
│   ├── app/
│   │   ├── (storefront)/                  # Customer-facing storefront
│   │   │   ├── layout.tsx                 # Header, announcement bar, footer
│   │   │   ├── page.tsx                   # Brand home page (Hero, Categories, Story)
│   │   │   ├── shop/                      # Catalog browsing & filtering
│   │   │   │   ├── page.tsx
│   │   │   │   └── [slug]/page.tsx        # Product detail page
│   │   │   ├── cart/page.tsx              # Standalone cart view
│   │   │   ├── checkout/page.tsx          # Guest checkout & PIN code validation
│   │   │   ├── orders/
│   │   │   │   ├── confirmation/page.tsx  # Post-purchase receipt
│   │   │   │   └── track/page.tsx         # Token-based order status tracker
│   │   │   ├── about/page.tsx             # Brand story & artisans
│   │   │   ├── contact/page.tsx           # Contact form & WhatsApp trigger
│   │   │   └── policies/                  # Legal & operational policies
│   │   │       ├── shipping/page.tsx
│   │   │       ├── returns/page.tsx
│   │   │       ├── privacy/page.tsx
│   │   │       └── terms/page.tsx
│   │   ├── (admin)/                       # Protected back-office console
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx             # Admin sidebar & top nav
│   │   │   │   ├── login/page.tsx         # Secure admin login
│   │   │   │   ├── dashboard/page.tsx     # Operational KPIs & metrics
│   │   │   │   ├── products/              # Product & variant catalog CRUD
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   ├── new/page.tsx
│   │   │   │   │   └── [id]/edit/page.tsx
│   │   │   │   ├── categories/page.tsx    # Category manager
│   │   │   │   ├── inventory/page.tsx     # Single source of truth stock adjustments
│   │   │   │   ├── orders/                # Order lifecycle & fulfillment
│   │   │   │   │   ├── page.tsx
│   │   │   │   │   └── [id]/page.tsx
│   │   │   │   ├── delivery-zones/page.tsx# Vadodara PIN code fees & zones
│   │   │   │   ├── enquiries/page.tsx     # Custom order requests & leads
│   │   │   │   ├── settings/page.tsx      # WhatsApp number, banners, contacts
│   │   │   │   └── analytics/page.tsx     # Sales & conversion reports
│   │   ├── api/                           # REST route handlers
│   │   │   ├── store/
│   │   │   │   ├── delivery-zones/check/route.ts
│   │   │   │   ├── checkout/route.ts      # Idempotent order placement
│   │   │   │   ├── orders/[token]/route.ts# High-entropy order lookup
│   │   │   │   └── enquiries/route.ts
│   │   │   └── admin/
│   │   │       ├── products/route.ts
│   │   │       ├── orders/[id]/status/route.ts
│   │   │       ├── inventory/adjust/route.ts
│   │   │       └── settings/route.ts
│   │   ├── globals.css                    # Tailwind CSS v4 / theme tokens
│   │   └── layout.tsx                     # Root HTML & font configurations
│   ├── components/
│   │   ├── ui/                            # Atomic UI primitives (Button, Input, Modal)
│   │   ├── storefront/                    # Header, ProductCard, CartDrawer, Hero
│   │   └── admin/                         # Sidebar, DataTable, StatusSelect, ImageUploader
│   ├── lib/
│   │   ├── supabase/                      # Server, browser, & admin Supabase clients
│   │   ├── cloudinary.ts                  # Cloudinary upload & URL transformation utils
│   │   ├── whatsapp.ts                    # WhatsApp deep-link builder
│   │   ├── formatters.ts                  # Currency (INR) & IST date formatters
│   │   └── validation/                    # Zod schemas for checkout, products, etc.
│   ├── types/                             # Database & business domain TypeScript types
│   └── middleware.ts                      # Route guards & security headers
├── supabase/
│   └── migrations/                        # SQL DDL migration files
├── tests/                                 # Unit, integration, & E2E tests
├── public/                                # Static favicon & brand SVG assets
├── next.config.ts                         # Next.js configurations & image remote patterns
├── tailwind.config.ts                     # Tailwind theme tokens & color definitions
├── tsconfig.json                          # Strict TypeScript configurations
└── package.json                           # Dependencies & run scripts
```

---

## 7. Error Handling & Standardized Response Envelope

All API Route Handlers enforce a consistent JSON structure to prevent ambiguous client parsing:

### 7.1 Success Envelope
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}
```

### 7.2 Error Envelope
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "The delivery PIN code is not currently serviceable.",
    "details": [
      { "field": "postalCode", "issue": "PIN code 390099 is outside current Vadodara delivery zones." }
    ]
  }
}
```

### 7.3 Standard Error Codes
- `UNAUTHORIZED` (401): Admin session missing or expired.
- `FORBIDDEN` (403): User lacks required permissions.
- `NOT_FOUND` (404): Resource does not exist or lookup token is invalid.
- `OUT_OF_STOCK` (409): Requested inventory unavailable during checkout.
- `INVALID_PIN_CODE` (422): Recipient address outside delivery zones.
- `IDEMPOTENT_RETRY` (200): Returning previously processed order for duplicate submission.

