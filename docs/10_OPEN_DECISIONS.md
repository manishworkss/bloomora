# 10_OPEN_DECISIONS.md — Owner Decisions & Business Assumptions Registry

> **Bloomora** — Customer Storefront & Admin Console  
> **Status:** ✅ OWNER DECISIONS RECORDED & RESOLVED (Nov 9, 2026)  
> **Rule of Engagement:** Real business data only. Zero fake scarcity or artificial urgency.

---

## 1. Registry of Recorded Owner Decisions

| Decision ID | Domain | Summary of Decision | Owner Decision & Specification | Status |
| :--- | :--- | :--- | :--- | :--- |
| **DEC-01** | Contact / Comms | **Official WhatsApp Business Number** | **`+91 8271735190`** (E.164: `918271735190`). All `wa.me` links pre-fill context to this number. | ✅ **RESOLVED** |
| **DEC-02** | Logistics | **Vadodara Delivery PIN Codes** | **Entire Vadodara** is serviceable at launch (PIN codes `390001` through `390025` enabled by default). Flat local delivery fee. | ✅ **RESOLVED** |
| **DEC-03** | Payments / Flow | **MVP Ordering & Payment Flow** | **WhatsApp Assisted Checkout & Enquiry.** Customers finalize their orders and confirm payments directly via WhatsApp with the owner. | ✅ **RESOLVED** |
| **DEC-04** | Policies | **Cancellation & Return Policy** | **Strictly Non-Refundable.** Handmade and customized goods cannot be returned or refunded once crafted; transit damages replaced within 24h of delivery. | ✅ **RESOLVED** |
| **DEC-05** | Catalog | **Product Data Authenticity** | **100% Real Data.** Authentic pricing, genuine preparation estimates, real stock availability. Zero fake scarcity or countdown timers. | ✅ **RESOLVED** |
| **DEC-06** | Media Assets | **Product Imagery Pipeline** | **Owner will upload real product photos** via Cloudinary/Admin console. Clean handcrafted SVG placeholders used during initial scaffolding. | ✅ **RESOLVED** |
| **DEC-07** | Customization | **Custom Request Turnaround** | Standard custom orders require **3–5 days** advance notice. | ✅ **RESOLVED** |
| **DEC-08** | Order ID | **Order Reference Format** | **`THC-YYYYMM-XXXX`** (e.g. `THC-202611-0001`). Clean, sequential receipt references. | ✅ **RESOLVED** |

---

## 2. Decision Specifications & System Configuration

### DEC-01: Official WhatsApp Business Contact
- **Owner Phone:** `+91 8271735190`
- **Configured In:** `site_settings` table under key `business_whatsapp_number` = `"918271735190"`.
- **Target URL Template:** `https://wa.me/918271735190?text={encoded_message}`

---

### DEC-02: Serviceable Delivery Coverage (Whole Vadodara)
- **Coverage:** All major Vadodara postal codes are active at launch:
  `390001` (Alkapuri / Central), `390002` (Mandvi), `390004` (Fatehgunj), `390007` (Race Course), `390008` (Waghodia Road), `390010` (Karelibaug), `390011` (Sayajigunj), `390012` (Gorwa), `390015` (Sama), `390018` (Gotri), `390019` (Harni), `390020` (Manjalpur / Makarpura), `390021` (Gotri Road), `390022` (Vasna), `390023` (Subhanpura), `390024` (Akota), `390025` (Tarsali).
- **Default Delivery Fee:** Configurable in admin panel (flat fee default ₹50 or customizable per zone).

---

### DEC-03: Ordering & Payment via WhatsApp Enquiry
- **Flow:**
  1. Customer browses catalog, customizes options/variants, and adds items to cart.
  2. At checkout, customer enters delivery details (name, phone, address, Vadodara PIN code).
  3. Clicking **"Place Order via WhatsApp"** or **"Enquire to Order"**:
     - Creates the order record in the database with status `PENDING` and a high-entropy `lookup_token`.
     - Opens WhatsApp chat directly with `+91 8271735190` with a pre-filled, formatted order summary:
       > *"Hi Bloomora! 👋 I'd like to place an order on your website:*  
       > *Order: THC-202611-0001*  
       > *Items: [Product Title] x 2 (₹798)*  
       > *Delivery To: [Customer Name], [Address], Vadodara - [PIN]*  
       > *Total: ₹848*  
       > *Order Link: [URL]*  
       > *Please let me know how to pay via UPI!"*
  4. The owner receives the exact order details, provides their UPI QR / payment info in chat, verifies the payment, and marks the order as `CONFIRMED` $\rightarrow$ `PROCESSING` in the admin console.

---

### DEC-04: Non-Refundable & Damaged Transit Policy
- **Return Policy:** Non-refundable once crafted due to the bespoke, handmade nature of products.
- **Damage Clause:** In the rare event of transit damage, customers must send photo/video proof within 24 hours of delivery via WhatsApp to receive a replacement.
- **Configured In:** `/policies/returns` page and checkout policy notices.

---

### DEC-05 & DEC-06: Real Products & Real Imagery
- **Catalog Standard:** Real pricing in INR (`₹`), authentic descriptions, genuine preparation estimates.
- **Image Pipeline:** Cloudinary account will be used by the owner to upload authentic studio photos of keychains, bouquets, and flower pots. High-aesthetic handcrafted SVG placeholders will be utilized until the owner completes image uploads.
