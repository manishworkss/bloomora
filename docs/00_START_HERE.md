# 00_START_HERE.md — Project Orientation & Documentation Index

> **The Handmade Craft** — Customer Storefront & Admin Console  
> **Working Brand Line:** *"Little Creations. Endless Emotions."*  
> **Brand:** The Handmade Craft | **Instagram:** [@the_.handmadecraft](https://instagram.com/the_.handmadecraft)  
> **Initial Service Area:** Vadodara, Gujarat (PIN-code gated local delivery)  
> **Recommended Architecture:** Next.js App Router + TypeScript + Tailwind CSS on Vercel | Supabase Postgres + Supabase Auth | Cloudinary | WhatsApp Assisted Commerce  
> **Status:** Planning Baseline & Architectural Blueprint (No code written without owner approval)

---

## 1. Executive Overview

**The Handmade Craft** is transitioning from manual, conversation-based order handling on social media (Instagram DMs and WhatsApp chats) to a dedicated, high-performance, mobile-first web storefront and back-office admin console.

### Core Objectives
1. **Customer Empowerment:** Enable customers in Vadodara to browse genuine handmade items (keychains, bouquets, handmade flowers, and gifts), configure options, verify local delivery eligibility, and place orders smoothly with guest checkout.
2. **Assisted Commerce Preservation:** Integrate contextual WhatsApp click-to-chat links across product and order flows so customers can effortlessly request bespoke customisations without losing context.
3. **Operational Clarity:** Equip the business owner with a protected, centralized admin console to track orders, manage real-time inventory, configure delivery PIN codes/fees, and review customer enquiries without editing code or managing complex servers.
4. **Lean & Modern Stack:** Eliminate standalone heavy servers (e.g. Spring Boot) in favor of a Vercel-native full-stack Next.js App Router application backed by managed Supabase Postgres and Cloudinary.

---

## 2. Complete Companion Documentation Index

This repository contains 11 foundational companion documents in the [`docs/`](file:///Users/manishkumar/Desktop/craft/docs/) directory. Every requirement, schema, API endpoint, security control, test case, deployment procedure, and pending business decision is documented here:

| Document | Title | Core Focus & Description |
| :--- | :--- | :--- |
| **[00_START_HERE.md](file:///Users/manishkumar/Desktop/craft/docs/00_START_HERE.md)** | Project Orientation & Index | Overall vision, repository layout, tech stack overview, engineering tenets, and document navigation. |
| **[01_PRD.md](file:///Users/manishkumar/Desktop/craft/docs/01_PRD.md)** | Product Requirements Document | Canonical specification of all Functional Requirements (FR-C01–FR-C08, FR-A01–FR-A10), state models, non-functional rules, and acceptance criteria. |
| **[02_UX_UI_GUIDE.md](file:///Users/manishkumar/Desktop/craft/docs/02_UX_UI_GUIDE.md)** | UX/UI Design System | Warm handcrafted design tokens, typography, color palettes, mobile-first interaction patterns, UI states, and WCAG 2.2 AA accessibility guidelines. |
| **[03_TECHNICAL_ARCHITECTURE.md](file:///Users/manishkumar/Desktop/craft/docs/03_TECHNICAL_ARCHITECTURE.md)** | Technical Architecture | Vercel serverless deployment model, Next.js App Router structure, Server vs. Client boundaries, caching/revalidation strategy, and third-party integrations. |
| **[04_DATABASE_SCHEMA.md](file:///Users/manishkumar/Desktop/craft/docs/04_DATABASE_SCHEMA.md)** | Database Schema & SQL DDL | Complete PostgreSQL schema for Supabase: tables, enums, indexes, foreign keys, Row-Level Security (RLS) policies, and atomic stock reservation functions. |
| **[05_API_SPEC.md](file:///Users/manishkumar/Desktop/craft/docs/05_API_SPEC.md)** | API & Route Handler Specification | Complete REST contracts for storefront and admin endpoints, request/response JSON schemas, error codes, and checkout idempotency. |
| **[06_SECURITY_PRIVACY.md](file:///Users/manishkumar/Desktop/craft/docs/06_SECURITY_PRIVACY.md)** | Security & Privacy Architecture | Threat modeling, role-based access control, cryptographic lookup token design (anti-enumeration), PII protection, input sanitization, and secrets management. |
| **[07_TEST_PLAN.md](file:///Users/manishkumar/Desktop/craft/docs/07_TEST_PLAN.md)** | Test Strategy & QA Plan | Unit, integration, concurrency, and E2E test suites covering stock race conditions, delivery zone validation, idempotent checkout, and state transitions. |
| **[08_DEPLOYMENT_RUNBOOK.md](file:///Users/manishkumar/Desktop/craft/docs/08_DEPLOYMENT_RUNBOOK.md)** | Deployment Runbook & DevOps | Step-by-step setup for Vercel, Supabase, and Cloudinary; environment variable matrix; database migrations; backup/restore; and zero-downtime release procedures. |
| **[09_ANTIGRAVITY_BUILD_PLAN.md](file:///Users/manishkumar/Desktop/craft/docs/09_ANTIGRAVITY_BUILD_PLAN.md)** | Implementation Build Plan | Phased engineering roadmap (Phases 1 through 6) with explicit deliverables, verification gates, and atomic milestones. |
| **[10_OPEN_DECISIONS.md](file:///Users/manishkumar/Desktop/craft/docs/10_OPEN_DECISIONS.md)** | Owner Decisions & Assumptions Log | Explicit registry of unresolved business choices (PIN codes, shipping pricing, WhatsApp number, return policy, payment options, seed catalog data). |

---

## 3. High-Level Architecture Topology

```
                                  +------------------------------------+
                                  |           End Users                |
                                  |  (Mobile Safari, Chrome, Desktop)  |
                                  +-----------------+------------------+
                                                    |
                                            HTTPS / DNS (Vercel)
                                                    v
                                  +------------------------------------+
                                  |         Vercel Edge & Compute      |
                                  |                                    |
                                  |   Next.js 15 App Router Full-Stack |
                                  |   - React Server Components (RSC)  |
                                  |   - Route Handlers & Server Actions|
                                  |   - Tailwind CSS Handcrafted UI    |
                                  +---------+----------------+---------+
                                            |                |
                       +--------------------+                +--------------------+
                       |                                                          |
                       v                                                          v
        +------------------------------+                           +------------------------------+
        |       Supabase Cloud         |                           |       Cloudinary CDN         |
        |  - PostgreSQL 16 DB          |                           |  - Product Photography       |
        |  - Row Level Security (RLS)  |                           |  - On-the-fly Responsive WebP|
        |  - Supabase Auth (Admin)     |                           |  - Optimized Deliveries      |
        |  - Connection Pooling        |                           +------------------------------+
        +------------------------------+
                       |
                       v
        +------------------------------+
        |   WhatsApp Deep Links        |
        |  - wa.me/prefilled message   |
        |  - Direct owner assisted chat|
        +------------------------------+
```

---

## 4. Fundamental Engineering & Business Principles

To ensure production excellence and protect brand credibility, all work on this project adheres to five strict tenets:

1. **Authenticity Over False Urgency:**
   - No fake stock counters ("Only 1 left!"), no fake countdown timers, and no artificial testimonials.
   - Products, preparation timelines, and pricing must reflect genuine business operations.
2. **Cryptographic Privacy (Anti-Enumeration):**
   - Order tracking and confirmation URLs never expose sequential database IDs (e.g., `/orders/42`).
   - All public lookups require high-entropy, cryptographically random tokens (`nanoid` or `uuidv4`) generated server-side.
3. **Single Source of Truth for Inventory:**
   - If a product has variants, stock is tracked exclusively at the variant level.
   - If a product does not have variants, stock is tracked at the product level.
   - Competing stock records are strictly forbidden. Stock deductions occur within atomic PostgreSQL transactions with row-level locks.
4. **Idempotent Order Creation:**
   - Checkout submissions require an `idempotency_key`. Rapid double-taps or network retries will return the existing order rather than creating duplicate orders or reserving double inventory.
5. **Localization & Cultural Precision:**
   - Monetary values are displayed in Indian Rupees (**INR / ₹**).
   - Customer-facing dates and hours are rendered in **Asia/Kolkata (IST)**, while internal database timestamps are stored strictly in **UTC**.

---

## 5. How to Use These Documents

- **If you are the Business Owner:** Start by reviewing [10_OPEN_DECISIONS.md](file:///Users/manishkumar/Desktop/craft/docs/10_OPEN_DECISIONS.md) to provide input on essential business choices (serviceable PIN codes, shipping charges, contact number, return policy).
- **If you are reviewing UX/UI:** Read [02_UX_UI_GUIDE.md](file:///Users/manishkumar/Desktop/craft/docs/02_UX_UI_GUIDE.md) to inspect the color palette, typography, mobile interaction models, and brand tone.
- **If you are inspecting Architecture & Data:** Review [03_TECHNICAL_ARCHITECTURE.md](file:///Users/manishkumar/Desktop/craft/docs/03_TECHNICAL_ARCHITECTURE.md) and [04_DATABASE_SCHEMA.md](file:///Users/manishkumar/Desktop/craft/docs/04_DATABASE_SCHEMA.md).
- **If you are tracking Execution:** Refer to [09_ANTIGRAVITY_BUILD_PLAN.md](file:///Users/manishkumar/Desktop/craft/docs/09_ANTIGRAVITY_BUILD_PLAN.md) for the phased build milestones.
