# 07_TEST_PLAN.md — Quality Assurance & Verification Plan

> **Bloomora** — Customer Storefront & Admin Console  
> **Testing Frameworks:** Vitest (Unit/Integration) + React Testing Library + Playwright (E2E)  
> **Target Coverage:** $>85\%$ on Core Commerce Logic (Checkout, Stock Locks, Pricing, State Machine)

---

## 1. Testing Philosophy & Test Pyramid

Quality assurance for Bloomora focuses heavily on **business-critical failure modes**: ensuring stock is never oversold, orders are never duplicated, delivery fees are calculated accurately, and customer PII is never exposed through order enumeration.

```
                  / \
                 / E2E \       Playwright: 5 Critical Paths
                /-------\      (Browse -> Cart -> Checkout -> Admin Transition)
               /  Integ  \     Route Handlers + Supabase Test Instance
              /-----------\    (Idempotency, Concurrency, PIN Check, Token Lookup)
             /    Unit     \   Vitest: Fast, Deterministic
            /---------------\  (Zod Schemas, Cart Math, WhatsApp Links, State Machine)
```

---

## 2. Test Suites & Tooling Matrix

| Layer | Tooling | Scope | Execution Trigger |
| :--- | :--- | :--- | :--- |
| **Unit Tests** | `vitest` | Formatters (INR, IST), WhatsApp link builder, Zod validators, cart math, state transition guards. | Pre-commit hook & Pull Request CI |
| **Integration Tests** | `vitest` + `@supabase/ssr` | Route handlers, atomic stock decrements, PIN-code lookup, idempotent checkout logic. | Pull Request CI |
| **Concurrency Tests** | Custom parallel runner (`p-all` / `Promise.all`) | Simulating simultaneous checkouts competing for the same physical inventory. | Pre-merge verification |
| **E2E Tests** | `playwright` | Full browser automation: Storefront guest purchase flow and Admin console fulfillment. | Staging / Pre-deployment |

---

## 3. High-Priority Test Cases

### 3.1 Cart & Calculations Suite
- **TC-CART-01 (Subtotal & Quantity):**
  - *Given:* 2 items at ₹399.00 and 1 item at ₹199.00 in cart.
  - *When:* User increases quantity of the second item to 2.
  - *Then:* Cart recalculates subtotal to ₹1,196.00 instantly.
- **TC-CART-02 (Price Authoritativeness):**
  - *Given:* Customer tampers with client-side price payload in browser.
  - *When:* Checkout payload is received on the server.
  - *Then:* Server rejects the client price and recalculates against the authoritative database price.

### 3.2 Delivery Zones & PIN-Code Validation
- **TC-DELIV-01 (Serviceable Vadodara PIN):**
  - *Given:* Recipient enters PIN code `390001` (Alkapuri).
  - *When:* `GET /api/store/delivery-zones/check?pin=390001` is invoked.
  - *Then:* Returns `isServiceable: true` with the configured flat delivery fee (e.g. ₹50.00).
- **TC-DELIV-02 (Unserviceable PIN):**
  - *Given:* Recipient enters PIN code `380001` (Ahmedabad).
  - *When:* API validates the PIN.
  - *Then:* Returns 422 error indicating delivery is currently restricted to Vadodara, offering a WhatsApp custom enquiry fallback.

### 3.3 Checkout Idempotency & Concurrency Suite
- **TC-IDEMP-01 (Double-Click Prevention):**
  - *Given:* A customer submits checkout with `Idempotency-Key: abc-123`.
  - *When:* Due to network lag, the button is pressed again with the exact same key.
  - *Then:* The second request returns the first order's confirmation data with HTTP 200 without creating a duplicate order record or decrementing stock twice.
- **TC-STOCK-01 (Atomic Stock Reservation):**
  - *Given:* A ready-made bouquet has `stock_quantity = 3`.
  - *When:* An order for 2 units is completed.
  - *Then:* `stock_quantity` becomes 1, and an audit log with reason `ORDER_PLACED` is recorded.
- **TC-STOCK-02 (Concurrency Race Condition Test):**
  - *Given:* A unique handmade keychain has `stock_quantity = 1`.
  - *When:* 5 parallel automated requests attempt to checkout the single item simultaneously.
  - *Then:* Exactly 1 request succeeds (HTTP 201). The remaining 4 requests receive HTTP 409 `OUT_OF_STOCK`. The database inventory never drops below zero.

### 3.4 Order Security & State Machine
- **TC-TRACK-01 (High-Entropy Token Access):**
  - *Given:* An order created with token `k8Xp9mQ2vL4wN7yR1tZ6aB3c`.
  - *When:* Accessed via `/api/store/orders/k8Xp9mQ2vL4wN7yR1tZ6aB3c`.
  - *Then:* Returns order snapshot with internal admin notes and payment secrets stripped.
- **TC-TRACK-02 (Anti-Enumeration Guard):**
  - *Given:* An attacker requests `/api/store/orders/1` or `/api/store/orders/42`.
  - *Then:* Returns HTTP 404 Not Found.
- **TC-STATE-01 (Valid State Progression):**
  - *Given:* Order in status `PENDING`.
  - *When:* Admin transitions to `CONFIRMED` $\rightarrow$ `PROCESSING` $\rightarrow$ `READY_FOR_DELIVERY` $\rightarrow$ `OUT_FOR_DELIVERY` $\rightarrow$ `DELIVERED`.
  - *Then:* Each transition records an entry in `order_status_history` with the admin's `actor_id`.
- **TC-STATE-02 (Illegal Transition Block):**
  - *Given:* Order in status `PENDING`.
  - *When:* Admin attempts to jump directly to `DELIVERED`.
  - *Then:* API throws HTTP 400 Bad Request with an invalid transition error.
- **TC-CANCEL-01 (Cancellation Restocking):**
  - *Given:* Order for 2 ready-made units is in `CONFIRMED` status.
  - *When:* Admin cancels the order with reason "Customer requested cancellation".
  - *Then:* Order status changes to `CANCELLED`, and inventory for the products is restored (+2) with log reason `ORDER_CANCELLED`.

---

## 4. End-to-End (E2E) Test Scenarios (Playwright)

```typescript
// Sample E2E Specification: Guest Purchase Flow
test('Guest customer can browse, add item to cart, and checkout with Vadodara PIN', async ({ page }) => {
  // 1. Visit Home & Navigate to Catalog
  await page.goto('/');
  await page.click('text=Shop Now');
  await expect(page).toHaveURL(/\/shop/);

  // 2. Select Product
  await page.click('[data-testid="product-card"]:first-child');
  await expect(page.locator('h1')).toBeVisible();

  // 3. Add to Cart
  await page.click('text=Add to Cart');
  await expect(page.locator('[data-testid="cart-drawer"]')).toBeVisible();

  // 4. Proceed to Checkout
  await page.click('text=Proceed to Checkout');
  await expect(page).toHaveURL(/\/checkout/);

  // 5. Fill Details
  await page.fill('input[name="name"]', 'Ananya Sharma');
  await page.fill('input[name="phone"]', '9898012345');
  await page.fill('textarea[name="address"]', '12 B, Vasant Vihar, Gotri Road');
  await page.fill('input[name="postalCode"]', '390021'); // Valid Vadodara PIN

  // 6. Verify PIN Delivery Charge Applied
  await expect(page.locator('text=Delivery Fee')).toBeVisible();

  // 7. Place Order
  await page.click('button[type="submit"]');

  // 8. Verify Confirmation Screen
  await expect(page).toHaveURL(/\/orders\/confirmation/);
  await expect(page.locator('text=Order Placed Successfully')).toBeVisible();
});
```

---

## 5. Verification Gate Before Production Deployment

Every release must satisfy the following automated verification checklist:
- [ ] `npm run lint` passes with 0 warnings/errors.
- [ ] `npm run type-check` passes with 0 TypeScript compilation errors.
- [ ] `npm run test` executes all unit and integration tests with 100% pass rate.
- [ ] `npm run test:concurrency` completes without stock integrity anomalies.
- [ ] `npm run build` generates optimized production serverless bundles without warnings.

