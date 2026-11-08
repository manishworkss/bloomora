# 05_API_SPEC.md — API & Route Handler Specifications

> **The Handmade Craft** — Customer Storefront & Admin Console  
> **API Protocol:** REST over HTTPS | JSON Request & Response Bodies  
> **Base Path:** `/api`  
> **Security Schemes:** Public Storefront (CORS-restricted, Rate-Limited) & Admin (Supabase Session Token)

---

## 1. Global API Standards & Conventions

### 1.1 HTTP Headers
- `Content-Type: application/json; charset=utf-8` (All POST/PUT/PATCH requests)
- `Idempotency-Key: <UUID>` (Required for `POST /api/store/checkout`)
- `Accept: application/json`

### 1.2 Response Envelopes

#### Standard Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation completed successfully."
}
```

#### Standard Error Response
```json
{
  "success": false,
  "error": {
    "code": "OUT_OF_STOCK",
    "message": "One or more items in your cart is no longer available in the requested quantity.",
    "details": [
      {
        "productId": "8f8b898a-...",
        "variantId": "3b2c1d0e-...",
        "availableStock": 1,
        "requestedQuantity": 2
      }
    ]
  }
}
```

---

## 2. Customer Storefront Endpoints

### 2.1 Check Delivery PIN Code Eligibility
Validates whether a Vadodara PIN code is serviceable and returns the applicable delivery fee.

- **Route:** `GET /api/store/delivery-zones/check`
- **Query Parameters:**
  - `pin` (string, required): 6-digit Indian PIN code (e.g., `390001`).
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "isServiceable": true,
    "postalCode": "390001",
    "zoneName": "Alkapuri / Central Vadodara",
    "deliveryFee": 50.00,
    "estimatedDays": "1-2 Days"
  }
}
```
- **Response (422 Unprocessable Entity - Unserviceable Zone):**
```json
{
  "success": false,
  "error": {
    "code": "UNSERVICEABLE_PIN_CODE",
    "message": "We currently only deliver within designated areas of Vadodara.",
    "details": {
      "postalCode": "380001",
      "city": "Ahmedabad",
      "assistanceAction": "whatsapp_custom_enquiry"
    }
  }
}
```

---

### 2.2 Place Order (Idempotent Checkout)
Submits a customer order with atomic inventory verification and reservation.

- **Route:** `POST /api/store/checkout`
- **Headers:**
  - `Idempotency-Key: <unique-client-uuid>`
- **Request Body:**
```json
{
  "customer": {
    "name": "Pooja Patel",
    "phone": "9876543210",
    "email": "pooja.patel@example.com",
    "deliveryAddress": "Flat 402, Shivalik Residency, Near Race Course Road",
    "landmark": "Opposite Inox Cinema",
    "postalCode": "390007",
    "deliveryInstructions": "Please call before arriving."
  },
  "items": [
    {
      "productId": "a1b2c3d4-e5f6-7890-abcd-111111111111",
      "variantId": "b2c3d4e5-f6a7-8901-bcde-222222222222",
      "quantity": 2
    }
  ],
  "paymentMethod": "MANUAL_UPI",
  "paymentReference": "UPI/432198765432"
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "orderNumber": "THC-202611-0042",
    "lookupToken": "k8Xp9mQ2vL4wN7yR1tZ6aB3c",
    "trackingUrl": "/orders/track?token=k8Xp9mQ2vL4wN7yR1tZ6aB3c",
    "summary": {
      "itemsSubtotal": 798.00,
      "deliveryFee": 50.00,
      "discountTotal": 0.00,
      "grandTotal": 848.00
    },
    "orderStatus": "PENDING",
    "paymentStatus": "PENDING",
    "paymentMethod": "MANUAL_UPI",
    "createdAt": "2026-11-09T01:00:00Z"
  },
  "message": "Order placed successfully. Thank you for supporting handmade craftsmanship!"
}
```
- **Response (200 OK - Idempotent Retry):**
Returns the previously created order payload if the identical `Idempotency-Key` is re-sent.

---

### 2.3 Safe Order Lookup (Token-Gated)
Retrieves the recipient-safe status and item snapshot for an order. **Never uses sequential numeric IDs.**

- **Route:** `GET /api/store/orders/[lookupToken]`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "orderNumber": "THC-202611-0042",
    "customerName": "Pooja Patel",
    "deliveryAddress": "Flat 402, Shivalik Residency, Near Race Course Road",
    "postalCode": "390007",
    "orderStatus": "PROCESSING",
    "paymentStatus": "PAID",
    "paymentMethod": "MANUAL_UPI",
    "grandTotal": 848.00,
    "items": [
      {
        "productTitle": "Handmade Crochet Lavender Bouquet",
        "variantTitle": "Purple / With Twine Bow",
        "unitPrice": 399.00,
        "quantity": 2,
        "totalPrice": 798.00,
        "imageUrl": "https://res.cloudinary.com/.../lavender-bouquet.jpg"
      }
    ],
    "timeline": [
      { "status": "PENDING", "timestamp": "2026-11-09T01:00:00Z" },
      { "status": "CONFIRMED", "timestamp": "2026-11-09T01:15:00Z" },
      { "status": "PROCESSING", "timestamp": "2026-11-09T01:30:00Z" }
    ]
  }
}
```
- **Response (404 Not Found):**
```json
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Invalid or expired tracking token. Please check your link or contact us on WhatsApp."
  }
}
```

---

### 2.4 Submit Custom Enquiry / Request
Captures bespoke gift enquiries from storefront forms.

- **Route:** `POST /api/store/enquiries`
- **Request Body:**
```json
{
  "customerName": "Rohan Shah",
  "customerPhone": "9825012345",
  "productId": "a1b2c3d4-...",
  "message": "Looking for 15 personalized tulip keychains for a wedding favor.",
  "budgetEstimate": "₹3,000 - ₹4,500",
  "neededByDate": "2026-12-15",
  "referenceImages": ["https://res.cloudinary.com/.../ref-image.jpg"]
}
```
- **Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "enquiryId": "e3f4a5b6-...",
    "status": "NEW"
  },
  "message": "Enquiry received! We will connect with you on WhatsApp shortly."
}
```

---

## 3. Protected Admin Endpoints

*All admin endpoints require an active Supabase Auth session with `role = admin` validated in server middleware.*

### 3.1 Admin Operational Dashboard
- **Route:** `GET /api/admin/dashboard`
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "kpis": {
      "pendingOrders": 3,
      "processingOrders": 7,
      "outForDelivery": 2,
      "deliveredToday": 4,
      "lowStockItems": 2,
      "todayGrossSales": 4850.00
    },
    "recentOrders": [ ... ],
    "recentEnquiries": [ ... ]
  }
}
```

---

### 3.2 Product CRUD Endpoints
- **Create Product:** `POST /api/admin/products`
- **Update Product:** `PUT /api/admin/products/[id]`
- **Archive Product (Soft-Delete):** `DELETE /api/admin/products/[id]`
- **Request Payload Sample:**
```json
{
  "title": "Sunflower Crochet Pot",
  "slug": "sunflower-crochet-pot",
  "categoryId": "c1d2e3f4-...",
  "shortDescription": "Cute desk companion handcrafted with vibrant yellow yarn.",
  "fullDescription": "Handcrafted miniature sunflower pot using premium soft milk cotton yarn...",
  "basePrice": 449.00,
  "compareAtPrice": 499.00,
  "productType": "READY_MADE",
  "preparationDays": 0,
  "isPublished": true,
  "isFeatured": true,
  "hasVariants": false,
  "stockQuantity": 8,
  "lowStockThreshold": 3,
  "images": [
    {
      "cloudinaryPublicId": "craft/products/sunflower-1",
      "imageUrl": "https://res.cloudinary.com/.../sunflower-1.jpg",
      "altText": "Yellow handmade sunflower in ceramic pot",
      "displayOrder": 0,
      "isPrimary": true
    }
  ]
}
```

---

### 3.3 Inventory Stock Adjustment
Directly adjusts physical stock levels with mandatory reason codes and actor auditing.

- **Route:** `POST /api/admin/inventory/adjust`
- **Request Body:**
```json
{
  "productId": "a1b2c3d4-...",
  "variantId": null,
  "adjustmentAmount": 10,
  "reason": "RESTOCK",
  "notes": "Finished fresh batch of 10 keychains."
}
```
- **Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "productId": "a1b2c3d4-...",
    "previousStock": 2,
    "adjustmentAmount": 10,
    "newStock": 12,
    "reason": "RESTOCK"
  }
}
```

---

### 3.4 Order State Lifecycle Update
Enforces valid state transitions and appends to the audit history.

- **Route:** `PATCH /api/admin/orders/[id]/status`
- **Request Body:**
```json
{
  "newStatus": "PROCESSING",
  "notes": "Yarn dyed, crafting in progress."
}
```
- **Validation Rules:**
  - Disallows illegal jumps (e.g. `PENDING` directly to `DELIVERED`).
  - If transitioning to `CANCELLED`, automatically releases reserved stock back to inventory.

---

### 3.5 Delivery Zones Management
- **List All Zones:** `GET /api/admin/delivery-zones`
- **Create/Update Zone:** `POST /api/admin/delivery-zones`
- **Request Body:**
```json
{
  "postalCode": "390020",
  "zoneName": "Manjalpur / Makarpura",
  "deliveryFee": 60.00,
  "estimatedDays": "1-2 Days",
  "isActive": true
}
```

