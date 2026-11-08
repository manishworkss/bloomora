# 02_UX_UI_GUIDE.md — Design System & User Experience Guidelines

> **The Handmade Craft** — Customer Storefront & Admin Console  
> **Aesthetic Theme:** Handcrafted Warmth, Artisanal Elegance, Mindful Gifting  
> **Working Brand Line:** *"Little Creations. Endless Emotions."*  
> **Accessibility Standard:** WCAG 2.2 Level AA Compliance

---

## 1. Aesthetic Philosophy & Brand Voice

The Handmade Craft is an artisanal studio creating intimate, emotion-driven gifts—crochet flowers, beaded keychains, floral bouquets, and bespoke keepsakes. The visual identity must feel:

- **Warm & Tactile:** Reminiscent of natural textures (linen, unbleached cotton, warm paper, soft yarn).
- **Unhurried & Mindful:** Generous whitespace, soft transitions, and gentle shadows; rejecting the sterile, frantic look of drop-shipping or ultra-fast-fashion storefronts.
- **Honest & Grounded:** Authentic photography of real handmade creations without artificial filters, stock imagery, or aggressive "FLASH SALE" banners.
- **Effortlessly Accessible:** Ergonomic mobile touch targets, crystal-clear typography, and unambiguous microcopy.

---

## 2. Color Palette & Semantic Tokens

To ensure consistency across the storefront and admin console, the design system utilizes CSS custom properties mapped to Tailwind CSS utilities.

### 2.1 Color Swatches

```
+-----------------------------------------------------------------------------------+
| Warm Linen (Canvas)    | Artisan Terracotta (Primary) | Soft Sage (Accent/Success)|
| Light: #FDFBF7         | #C06C54                     | #738A75                   |
| Dark:  #1A1715         | Dark: #D88973               | Dark: #8CA38E             |
+-----------------------------------------------------------------------------------+
| Rose Dust (Secondary)  | Deep Cocoa (Text/Ink)        | Cream Card Surface        |
| #D4A396                | #2C2420                     | #F7F3EE                   |
| Dark: #A07468          | Dark: #EDE8E3               | Dark: #24201D             |
+-----------------------------------------------------------------------------------+
```

### 2.2 Design System Color Token Matrix

| Token Name | Hex Code (Light Mode) | Hex Code (Dark Mode) | Usage Purpose |
| :--- | :--- | :--- | :--- |
| `--color-bg-canvas` | `#FDFBF7` (Warm Linen) | `#1A1715` (Deep Charcoal) | Primary application background. |
| `--color-bg-surface` | `#F7F3EE` (Soft Cream) | `#24201D` (Dark Surface) | Card surfaces, modals, popovers, dropdowns. |
| `--color-border-subtle` | `#E8DFD5` (Warm Muted) | `#38322D` (Muted Dark) | Card borders, dividers, table rows. |
| `--color-text-primary` | `#2C2420` (Deep Cocoa) | `#EDE8E3` (Soft Ivory) | Headings, primary body text, active labels. |
| `--color-text-muted` | `#70645D` (Warm Slate) | `#A89F97` (Soft Taupe) | Subtext, timestamps, placeholders, metadata. |
| `--color-primary` | `#C06C54` (Terracotta) | `#D88973` (Warm Coral) | Primary buttons, active tabs, prominent links. |
| `--color-primary-hover`| `#A85B45` (Deep Terra) | `#E29C88` (Light Coral) | Hover & focus states for primary actions. |
| `--color-secondary` | `#D4A396` (Rose Dust) | `#A07468` (Muted Rose) | Secondary tags, decorative accents, hover tints. |
| `--color-success` | `#5B7A5F` (Artisan Sage) | `#799E7E` (Bright Sage) | In-stock badges, delivered status, success toasts. |
| `--color-warning` | `#C98A2C` (Warm Ochre) | `#DF9E3C` (Bright Amber) | Pending orders, low-stock warnings, alerts. |
| `--color-danger` | `#B3392F` (Muted Crimson)| `#D95349` (Coral Red) | Errors, out-of-stock, cancellations. |
| `--color-whatsapp` | `#25D366` (Official Green)| `#25D366` (Official Green)| WhatsApp click-to-chat buttons and badges. |

---

## 3. Typography & Hierarchy

The typography pairs an **editorial serif for brand expression** with a **crisp geometric sans-serif for interface clarity**.

### 3.1 Font Stack
- **Headings & Display:** `Playfair Display` or `Cormorant Garamond` (fallback: `Georgia, serif`). Conveys craftsmanship and timeless emotion.
- **Body, UI, & Numbers:** `Plus Jakarta Sans` or `Inter` (fallback: `system-ui, -apple-system, sans-serif`). Highly legible at small sizes on mobile displays.

### 3.2 Type Scale

| Role | Font Family | Size | Weight | Line Height | Letter Spacing |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | Serif | 2.5rem (40px) / 3.5rem (56px) | 600 SemiBold | 1.15 | -0.02em |
| **Heading 1** | Serif | 2.0rem (32px) / 2.5rem (40px) | 600 SemiBold | 1.2 | -0.01em |
| **Heading 2** | Serif | 1.5rem (24px) / 1.75rem (28px) | 600 SemiBold | 1.25 | 0 |
| **Heading 3** | Sans-Serif | 1.25rem (20px) | 600 SemiBold | 1.3 | 0 |
| **Subhead / Lead**| Sans-Serif | 1.125rem (18px) | 400 Regular | 1.5 | 0 |
| **Body (Default)**| Sans-Serif | 1.0rem (16px) | 400 Regular | 1.5 | 0 |
| **Body Small** | Sans-Serif | 0.875rem (14px) | 400 / 500 | 1.45 | 0.01em |
| **Caption / Meta**| Sans-Serif | 0.75rem (12px) | 500 Medium | 1.4 | 0.02em |

---

## 4. Spacing, Layout & Grid Standards

- **Spacing Base Unit:** `4px` ($0.25\text{rem}$).
- **Container Max-Widths:**
  - Storefront Main: `1280px` (`max-w-7xl`)
  - Product Details: `1120px` (`max-w-6xl`)
  - Cart / Checkout: `768px` (`max-w-3xl`)
  - Admin Content: `1440px` (`max-w-screen-2xl`)
- **Corner Radii:**
  - Badges & Pills: `9999px` (`rounded-full`)
  - Cards & Modals: `12px` (`rounded-xl`)
  - Inputs & Buttons: `8px` (`rounded-lg`)
- **Elevation & Shadows:**
  - Soft Card: `0 2px 8px -2px rgba(44, 36, 32, 0.06), 0 1px 4px -1px rgba(44, 36, 32, 0.04)`
  - Elevated Dropdown/Modal: `0 12px 24px -4px rgba(44, 36, 32, 0.12), 0 4px 8px -2px rgba(44, 36, 32, 0.06)`

---

## 5. Component Design Specifications

### 5.1 Buttons
1. **Primary Button:**
   - Background: `--color-primary` (Terracotta)
   - Text: `#FFFFFF`
   - Padding: `12px 24px` (touch height $\ge 48\text{px}$)
   - Border Radius: `rounded-lg`
   - Hover: Brightness increase + gentle upward translate (`-1px`).
   - Active: Scale `0.98`.
2. **Secondary / Outline Button:**
   - Background: Transparent
   - Border: `1.5px solid --color-border-subtle`
   - Text: `--color-text-primary`
   - Hover: Background `--color-bg-surface`.
3. **WhatsApp Action Button:**
   - Background: `#25D366`
   - Text: `#FFFFFF`
   - Icon: Authentic WhatsApp SVG icon
   - Visual Focus: Clean green glow on focus.

### 5.2 Badges & Status Indicators
- **Ready to Ship:** Soft Sage background (`bg-emerald-50 text-emerald-800 border-emerald-200`).
- **Made to Order:** Soft Terracotta background (`bg-amber-50 text-amber-800 border-amber-200`).
- **Order Status Pills:**
  - `PENDING`: Muted Gray / Light Ochre
  - `CONFIRMED`: Soft Blue
  - `PROCESSING`: Warm Amber
  - `READY_FOR_DELIVERY`: Indigo
  - `OUT_FOR_DELIVERY`: Purple
  - `DELIVERED`: Sage Green
  - `CANCELLED`: Rose Red

### 5.3 Product Card Pattern
- **Aspect Ratio:** `1:1` or `4:5` image frame with subtle rounded corners and overflow hidden.
- **Image Optimization:** Cloudinary dynamic fetch with responsive `sizes` attribute and low-quality image placeholder (LQIP).
- **Content Hierarchy:**
  1. Product Category (Small uppercase tag, e.g. "FLORAL BOUQUET")
  2. Product Title (Serif, 2-line clamp)
  3. Price (Indian Rupee formatted: `₹799`, optional strikethrough compare-at price)
  4. Availability badge ("In Stock" or "Handcrafted to Order")

### 5.4 Cart Drawer & Mobile Sheet
- Slide-in from right on desktop (`420px` width); slide-up sheet on mobile viewports.
- Backdrop blur: `backdrop-blur-sm bg-black/30`.
- Persistent bottom action bar displaying Subtotal, PIN-code delivery note, and "Proceed to Checkout" primary CTA.

### 5.5 Order Lookup & Tracking View
- Non-discoverable link: `/orders/track?token=[high_entropy_token]`.
- Vertical timeline stepper with circular status nodes, connected by progress tracks.
- Completed steps highlighted in Sage Green; active step pulsating gently; pending steps in muted outline.

---

## 6. Admin Console Ergonomics

- **Layout Structure:**
  - Desktop: Persistent collapsible left sidebar (`w-64`) with icon + text navigation.
  - Mobile: Slide-out sheet triggered by top hamburger icon.
- **Data Tables:**
  - Clean striped or bordered table with horizontal scrolling enabled for small screens.
  - Fixed action column (View / Edit / Delete).
  - Prominent search input and status filter pills above tables.
- **Form Design:**
  - Grouped sections (General Information, Pricing & Inventory, Media, SEO Metadata).
  - Sticky bottom save bar on product editor screens to avoid scroll fatigue.

---

## 7. Accessibility (a11y) & Usability Checklist

To ensure full compliance with **WCAG 2.2 AA**:
1. **Contrast Ratios:** All body text must maintain at least $4.5:1$ contrast against backgrounds; large headers ($\ge 24\text{px}$) must maintain at least $3:1$.
2. **Focus Rings:** No removing default focus outlines without providing a visible replacement (`focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2`).
3. **Touch Target Size:** All clickable elements (buttons, links, form checkboxes) must occupy at least $44 \times 44\text{px}$ of interactive touch area on touchscreens.
4. **Descriptive Alt Text:** Product images must describe the artisanal craft accurately (e.g., *"Handmade crochet lavender bouquet wrapped in kraft paper with twine bow"* rather than *"flower photo"*).
5. **No Color-Only Information:** Status badges must include text labels alongside color coding so color-blind users can distinguish states.

