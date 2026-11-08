# 06_SECURITY_PRIVACY.md — Security, Privacy & Compliance Guidelines

> **Bloomora** — Customer Storefront & Admin Console  
> **Security Posture:** Defense-in-Depth, Zero-Trust Admin Routes, Cryptographic Token Isolation  
> **Compliance Standard:** PII Minimization, Digital Personal Data Protection (DPDP) Act Readiness

---

## 1. Threat Modeling & Attack Surface Analysis

As an artisan e-commerce platform processing customer orders, physical addresses, and payments, the application must defend against seven specific attack vectors:

```
+----------------------------------------------------------------------------------------------------+
| Threat Vector                  | Vulnerability / Risk               | Engineered Mitigation        |
+--------------------------------+------------------------------------+------------------------------+
| 1. Order Enumeration           | Attacker scrapes /orders/1, 2, 3   | High-entropy lookup tokens   |
|                                | exposing customer phone & address  | (nanoid 24-char, 140-bit ent)|
+--------------------------------+------------------------------------+------------------------------+
| 2. Inventory Race Conditions   | Multiple customers checkout last   | Row-level locks (FOR UPDATE) |
|                                | item simultaneously -> overselling | in atomic PostgreSQL function|
+--------------------------------+------------------------------------+------------------------------+
| 3. Admin Route Compromise      | Unauthorized access to dashboard,  | Supabase Auth + Middleware   |
|                                | catalog, or order management       | + RLS server policies        |
+--------------------------------+------------------------------------+------------------------------+
| 4. Stored XSS via Settings/CMS | Malicious script injected into     | Disallow raw HTML; sanitize  |
|                                | announcement bar or description    | with Zod & safe text nodes   |
+--------------------------------+------------------------------------+------------------------------+
| 5. Checkout Spam / Denial      | Bot floods checkout creating fake  | Idempotency keys + IP-based  |
|                                | orders and exhausting inventory    | rate limiting (5 req/min)    |
+--------------------------------+------------------------------------+------------------------------+
| 6. Image Upload Exploits       | Upload of malicious executables    | Cloudinary signed presets    |
|                                | disguised as reference images      | with strict MIME validation  |
+--------------------------------+------------------------------------+------------------------------+
| 7. Secret Leaks in Git/Bundles | Exposing Supabase Service Role Key | Strict client/server env sep |
|                                | in public client bundle            | via Next.js env conventions  |
+--------------------------------+------------------------------------+------------------------------+
```

---

## 2. Cryptographic Order Isolation (Anti-Enumeration)

### 2.1 The Danger of Auto-Increment IDs
Traditional e-commerce platforms using auto-increment integer IDs (`/orders/1024`) allow competitors or malicious actors to:
- Scrape entire customer order volumes and track daily sales revenue.
- Harvest personal phone numbers and home addresses.

### 2.2 Token-Gated Architecture
- Public tracking URLs require a high-entropy string token:
  `/orders/track?token=c4k9T2vL7wN8yR1tZ6aB3mP0`
- Generated using cryptographically secure pseudorandom number generators (`crypto.getRandomValues` or `nanoid(24)` with base62 alphabet).
- Entropy: $62^{24} \approx 9.2 \times 10^{42}$ combinations, rendering brute-force enumeration mathematically impossible.
- Lookups are strictly limited: if 5 consecutive invalid tokens are submitted from an IP, a 15-minute cooldown is enforced.

---

## 3. Authentication & Role-Based Access Control (RBAC)

### 3.1 Session Security
- Authentication is handled via **Supabase Auth**.
- Session tokens are stored in **HTTP-only, Secure, `SameSite=Lax` cookies**, preventing JavaScript access (mitigating XSS session theft).
- Tokens are refreshed automatically by Next.js middleware using `@supabase/ssr`.

### 3.2 Route Middleware Guard (`middleware.ts`)
```typescript
import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => request.cookies.getAll() } }
  );

  const { data: { user } } = await supabase.auth.getUser();

  // Guard all /admin routes except /admin/login
  if (request.nextUrl.pathname.startsWith('/admin') && !request.nextUrl.pathname.startsWith('/admin/login')) {
    if (!user || user.app_metadata?.role !== 'admin') {
      const redirectUrl = new URL('/admin/login', request.url);
      redirectUrl.searchParams.set('redirectTo', request.nextUrl.pathname);
      return NextResponse.redirect(redirectUrl);
    }
  }

  return response;
}
```

---

## 4. Personally Identifiable Information (PII) Protection

### 4.1 Data Minimization Principles
- **Guest Checkout:** Only collects the bare minimum data necessary for local fulfillment in Vadodara:
  - Customer Full Name
  - Mobile Number (for delivery rider call)
  - Street Address, Landmark & PIN Code
- Email is entirely optional for MVP.
- Passwords are never collected or stored for guest customers.

### 4.2 Display Redaction on Public Views
- On public tracking pages (`/orders/track?token=...`), customer phone numbers are masked:
  `+91 98765 ****0`
- Internal notes, administrative correspondence, and bank account verifications are stripped from the response model.

---

## 5. Input Validation & Stored XSS Defenses

- **Strict Schema Enforcement:** Every API route handler and Server Action validates incoming payloads using **Zod**. Extra or unexpected fields are automatically stripped.
- **No Raw HTML Input:** Site settings (e.g. announcement bar, hero tagline) accept plain text strings only. React Server Components automatically escape string interpolation by default, neutralizing XSS.
- **Reference Image Uploads:** Custom request attachments only accept validated image MIME types (`image/jpeg`, `image/png`, `image/webp`) with a maximum payload limit of 5MB. Executables and SVG files are rejected.

---

## 6. Rate Limiting & Abuse Prevention

To protect serverless compute quotas and prevent bot scraping:

| Endpoint | Limit | Action on Violation |
| :--- | :--- | :--- |
| `POST /api/store/checkout` | 5 requests per 5 minutes per IP | 429 Too Many Requests (Blocks order spam) |
| `GET /api/store/delivery-zones/check` | 30 requests per minute per IP | 429 Too Many Requests |
| `POST /api/store/enquiries` | 3 requests per 10 minutes per IP | 429 Too Many Requests |
| `POST /admin/login` | 5 attempts per 15 minutes per IP | Account lock / exponential backoff |

---

## 7. HTTP Security Headers

Next.js is configured in `next.config.ts` to attach strict security headers to every response:

```typescript
const securityHeaders = [
  { key: 'X-DNS-Prefetch-Control', value: 'on' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' }, // Prevents clickjacking
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  {
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'", // Needed for Next.js hydration
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https://res.cloudinary.com https://*.supabase.co",
      "connect-src 'self' https://*.supabase.co https://api.cloudinary.com",
      "font-src 'self'",
      "frame-ancestors 'none'"
    ].join('; ')
  }
];
```

---

## 8. Secrets Separation Matrix

| Secret / Key | Visibility Scope | Git Status | Storage Location |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Public Client & Server | Safe for Git/Public | Vercel Environment Variables |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Client & Server | Safe for Git/Public | Vercel Environment Variables |
| `SUPABASE_SERVICE_ROLE_KEY` | **Server-Only (Private)** | **NEVER in Git / NEVER in Client** | Vercel Encrypted Secrets |
| `CLOUDINARY_API_KEY` | Server-Only (Private) | NEVER in Git | Vercel Encrypted Secrets |
| `CLOUDINARY_API_SECRET` | Server-Only (Private) | **NEVER in Git** | Vercel Encrypted Secrets |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`| Public Client & Server | Safe for Git/Public | Vercel Environment Variables |

