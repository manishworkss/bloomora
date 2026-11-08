# 08_DEPLOYMENT_RUNBOOK.md — Operations & Deployment Runbook

> **The Handmade Craft** — Customer Storefront & Admin Console  
> **Target Hosting:** Vercel Global Edge Network  
> **Database:** Supabase Managed Cloud (Region: `ap-south-1` Mumbai)  
> **Media CDN:** Cloudinary Managed Asset Pipeline  
> **Release Strategy:** Zero-Downtime Preview Branches & Instant Production Rollback

---

## 1. Cloud Infrastructure & Service Topology

```
+----------------------------------------------------------------------------------------------------+
|                                    VERCEL PRODUCTION PROJECT                                       |
|  - Connected Repository: GitHub (main branch)                                                      |
|  - Edge Network: Mumbai Edge (bom1) for ultra-fast customer loading in Gujarat                     |
|  - Serverless Node.js Runtime: v20 LTS                                                             |
+-------------------------------------------------+--------------------------------------------------+
                                                  |
                         +------------------------+------------------------+
                         |                                                 |
                         v                                                 v
+--------------------------------------------------+   +---------------------------------------------+
|              SUPABASE MANAGED CLOUD              |   |               CLOUDINARY CDN                |
|  - Project Region: ap-south-1 (Mumbai, India)    |   |  - Folder: the-handmade-craft/products      |
|  - PostgreSQL 16 Engine                          |   |  - Transformations: f_auto, q_auto, w_800   |
|  - Connection Pooler (Port 6543, Transaction)    |   |  - Delivery: Cloudinary Global Akamai/Fastly|
|  - Automated Daily Backups                       |   +---------------------------------------------+
+--------------------------------------------------+
```

---

## 2. Environment Variables Configuration Matrix

The following environment variables must be configured in Vercel under **Project Settings $\rightarrow$ Environment Variables**:

| Variable Name | Environment | Description | Sample / Format |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_SITE_URL` | Production / Preview | Canonical public URL of the application. | `https://thehandmadecraft.in` |
| `NEXT_PUBLIC_SUPABASE_URL` | All | Supabase project API gateway endpoint. | `https://xyzcompany.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | All | Public Supabase client anonymous token. | `eyJhbGciOiJIUzI1NiIsIn...` |
| `SUPABASE_SERVICE_ROLE_KEY` | Production / Preview | **Secret:** Superuser key bypassing RLS. | `eyJhbGciOiJIUzI1NiIsIn...` (Keep Secret) |
| `DATABASE_URL` | Production / Preview | Transaction pooled direct connection string. | `postgresql://postgres.[ref]:[pass]@aws-0-ap-south-1.pooler.supabase.com:6543/postgres?pgbouncer=true` |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`| All | Cloudinary account identifier. | `thehandmadecraft` |
| `CLOUDINARY_API_KEY` | Production / Preview | Cloudinary authentication API key. | `123456789012345` |
| `CLOUDINARY_API_SECRET` | Production / Preview | **Secret:** Cloudinary secret for signed ops. | `abcdefghijklmnopqrstuv_1234` |
| `ADMIN_INITIAL_EMAIL` | Production (One-Time)| Initial owner login email for seed creation. | `owner@thehandmadecraft.in` |

---

## 3. Step-by-Step Initial Setup Guide

### 3.1 Step 1: Provision Supabase Database
1. Log in to [Supabase](https://supabase.com) and click **New Project**.
2. Set **Project Name** to `the-handmade-craft`.
3. Choose the region closest to Gujarat: **`ap-south-1` (Mumbai, India)** for sub-30ms latency.
4. Set a strong database password and copy the connection details.
5. In Supabase Dashboard, open the **SQL Editor**, paste the complete contents of [`04_DATABASE_SCHEMA.md`](file:///Users/manishkumar/Desktop/craft/docs/04_DATABASE_SCHEMA.md), and click **Run**.
6. Verify that all 12 tables and stored procedures (`decrement_inventory_safely`) appear under Table Editor.

### 3.2 Step 2: Configure Supabase Auth & Owner Account
1. Under **Authentication $\rightarrow$ Settings $\rightarrow$ User Signups**, toggle **Enable Signups** to **OFF** (prevents unauthorized public admin registration).
2. Go to **Authentication $\rightarrow$ Users** and click **Invite User** or **Add User**.
3. Create the initial owner account using the email designated by the business owner.
4. Set the user's `app_metadata` to include `{"role": "admin"}` to activate admin route permissions.

### 3.3 Step 3: Configure Cloudinary Media Asset Pipeline
1. Create a free/pro tier account on [Cloudinary](https://cloudinary.com).
2. Note the `Cloud Name`, `API Key`, and `API Secret`.
3. In Cloudinary Settings $\rightarrow$ **Upload Presets**:
   - Create a signed upload preset named `thc_products_preset`.
   - Set Folder to `the-handmade-craft/products/`.
   - Restrict incoming file formats to `jpg, jpeg, png, webp`.
   - Enable automatic format optimization (`f_auto`) and quality optimization (`q_auto`).

### 3.4 Step 4: Deploy Next.js to Vercel
1. Import the GitHub repository into [Vercel](https://vercel.com).
2. Select Framework Preset: **Next.js**.
3. In **Environment Variables**, paste all production values listed in the matrix above.
4. Click **Deploy**.
5. Once deployment completes, verify:
   - Storefront home page loads cleanly.
   - Products query runs without database errors.
   - `/admin/login` renders and permits owner sign-in.

---

## 4. Custom Domain & DNS Mapping

To connect the official domain (e.g., `thehandmadecraft.in`):
1. In Vercel Project Settings, navigate to **Domains** and enter the registered apex domain and `www` subdomain.
2. In the domain registrar's DNS panel (GoDaddy, Namecheap, Hostinger, etc.), create:

| Record Type | Host / Name | Target / Value | TTL |
| :--- | :--- | :--- | :--- |
| **A Record** | `@` (apex) | `76.76.21.21` | Automatic / 300 |
| **CNAME Record**| `www` | `cname.vercel-dns.com` | Automatic / 300 |

3. Vercel will automatically provision and renew a free Let's Encrypt SSL/TLS certificate.

---

## 5. Zero-Downtime Database Migration Workflow

When schema adjustments or new tables are required:
1. Always write migrations that are **forward-compatible** (e.g. adding nullable columns or new tables first).
2. Test migrations locally against a Supabase preview branch or staging instance.
3. Apply migration script in production Supabase SQL Editor *prior* to merging the code that relies on the new columns.
4. Trigger production deployment on Vercel.

---

## 6. Backup, Health Checks & Disaster Recovery

### 6.1 Database Backups
- Supabase automatically executes daily physical backups with a 7-day retention window on standard plans.
- For major catalog overhauls or seasonal launches, take a manual logical dump:
  ```bash
  supabase db dump --data-only -f backup_catalog_$(date +%Y%m%d).sql
  ```

### 6.2 Health Check Endpoint
- The application exposes a health probe at `GET /api/health`:
  - Returns `200 OK` with status `{"status": "ok", "db": "connected", "timestamp": "..."}`.
  - Used for uptime monitoring (e.g. BetterUptime or UptimeRobot).

### 6.3 Instant Rollback Runbook
If a bug occurs post-deployment:
1. Open Vercel Dashboard $\rightarrow$ **Deployments**.
2. Find the previous stable production deployment.
3. Click the three dots menu $\rightarrow$ **Instant Rollback**.
4. Traffic is immediately re-routed to the previous build in $<5$ seconds without re-compiling.

