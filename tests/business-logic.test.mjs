import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';

// 1. Formatters Test
function formatINR(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  }).format(amount);
}

test('TC-FORMAT-01: formatINR formats amounts into Indian Rupees with comma separators', () => {
  assert.equal(formatINR(0), '₹0');
  assert.equal(formatINR(899), '₹899');
  assert.equal(formatINR(1200), '₹1,200');
  assert.equal(formatINR(15000), '₹15,000');
});

// 2. WhatsApp Link Generation
const DEFAULT_WHATSAPP_NUMBER = '918271735190';

function buildWhatsAppLink({ phone = DEFAULT_WHATSAPP_NUMBER, message }) {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

test('TC-WA-01: buildWhatsAppLink cleans phone number and encodes messages safely', () => {
  const url = buildWhatsAppLink({
    phone: '+91 82717-35190',
    message: 'Hello Bloomora! 🌸',
  });
  assert.match(url, /^https:\/\/wa\.me\/918271735190\?text=/);
  assert.ok(url.includes(encodeURIComponent('Hello Bloomora! 🌸')));
});

test('TC-WA-02: WhatsApp order inquiry includes order reference and total', () => {
  const orderNumber = 'BLOOM-202611-0042';
  const totalFormatted = '₹949';
  const items = 'Everlasting Lavender Bouquet x 1';
  const message = `Hi Bloomora! Order: ${orderNumber}, Total: ${totalFormatted}, Items: ${items}`;
  const url = buildWhatsAppLink({ message });

  assert.ok(url.includes(encodeURIComponent(orderNumber)));
  assert.ok(url.includes(encodeURIComponent(totalFormatted)));
});

// 3. Vadodara PIN Code Validation
const VADODARA_PINS = [
  '390001', '390002', '390004', '390007', '390008', '390010',
  '390011', '390012', '390015', '390018', '390019', '390020',
  '390021', '390022', '390023', '390024', '390025',
];

function isVadodaraServiceablePin(pin) {
  if (!pin || pin.length !== 6 || !/^\d+$/.test(pin)) return false;
  return VADODARA_PINS.includes(pin) || pin.startsWith('390');
}

test('TC-PIN-01: Validates Vadodara PIN codes are serviceable', () => {
  assert.equal(isVadodaraServiceablePin('390001'), true); // Alkapuri
  assert.equal(isVadodaraServiceablePin('390007'), true); // Race Course
  assert.equal(isVadodaraServiceablePin('390021'), true); // Gotri Road
  assert.equal(isVadodaraServiceablePin('390020'), true); // Manjalpur
});

test('TC-PIN-02: Rejects non-Vadodara PIN codes gracefully', () => {
  assert.equal(isVadodaraServiceablePin('380001'), false); // Ahmedabad
  assert.equal(isVadodaraServiceablePin('400001'), false); // Mumbai
  assert.equal(isVadodaraServiceablePin('110001'), false); // Delhi
  assert.equal(isVadodaraServiceablePin('abc123'), false); // Malformed
  assert.equal(isVadodaraServiceablePin('3900'), false);   // Incomplete
});

// 4. Cart Subtotal & Quantity Calculation
test('TC-CART-01: Correctly calculates item subtotal and grand total with Vadodara delivery fee', () => {
  const items = [
    { unitPrice: 899, quantity: 2 }, // 1798
    { unitPrice: 399, quantity: 1 }, // 399
    { unitPrice: 199, quantity: 3 }, // 597
  ];
  const deliveryFee = 50;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
  const grandTotal = subtotal + deliveryFee;

  assert.equal(subtotal, 2794);
  assert.equal(grandTotal, 2844);
});

// 5. Order State Machine Transitions
const VALID_TRANSITIONS = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'CANCELLED'],
  PROCESSING: ['READY_FOR_DELIVERY', 'CANCELLED'],
  READY_FOR_DELIVERY: ['OUT_FOR_DELIVERY', 'CANCELLED'],
  OUT_FOR_DELIVERY: ['DELIVERED', 'CANCELLED'],
  DELIVERED: ['RETURNED'],
  CANCELLED: [],
  RETURNED: [],
};

function isValidStateTransition(currentStatus, nextStatus) {
  const allowed = VALID_TRANSITIONS[currentStatus] || [];
  return allowed.includes(nextStatus);
}

test('TC-STATE-01: Validates sequential order state machine transitions', () => {
  assert.equal(isValidStateTransition('PENDING', 'CONFIRMED'), true);
  assert.equal(isValidStateTransition('CONFIRMED', 'PROCESSING'), true);
  assert.equal(isValidStateTransition('PROCESSING', 'READY_FOR_DELIVERY'), true);
  assert.equal(isValidStateTransition('READY_FOR_DELIVERY', 'OUT_FOR_DELIVERY'), true);
  assert.equal(isValidStateTransition('OUT_FOR_DELIVERY', 'DELIVERED'), true);
  assert.equal(isValidStateTransition('PENDING', 'CANCELLED'), true);
});

test('TC-STATE-02: Blocks illegal skipping of order states', () => {
  assert.equal(isValidStateTransition('PENDING', 'DELIVERED'), false);
  assert.equal(isValidStateTransition('CONFIRMED', 'DELIVERED'), false);
  assert.equal(isValidStateTransition('CANCELLED', 'CONFIRMED'), false);
  assert.equal(isValidStateTransition('DELIVERED', 'PROCESSING'), false);
});

// 6. Customer Review & Media Filtering Logic
const SAMPLE_REVIEWS = [
  {
    id: 'rev-1',
    customerName: 'Ananya S.',
    rating: 5,
    images: ['https://example.com/p1.jpg'],
    videoUrl: '',
    status: 'APPROVED',
    isFeatured: true,
  },
  {
    id: 'rev-2',
    customerName: 'Pooja D.',
    rating: 5,
    images: [],
    videoUrl: 'https://example.com/video.mp4',
    status: 'APPROVED',
    isFeatured: true,
  },
  {
    id: 'rev-3',
    customerName: 'Karan M.',
    rating: 4,
    images: [],
    videoUrl: '',
    status: 'PENDING',
    isFeatured: false,
  },
];

function filterReviews(reviews, filterTab) {
  return reviews.filter((r) => {
    if (filterTab === 'photos') return r.images && r.images.length > 0;
    if (filterTab === 'videos') return !!r.videoUrl && r.videoUrl.trim() !== '';
    if (filterTab === '5stars') return r.rating === 5;
    if (filterTab === 'featured') return r.isFeatured;
    return true;
  });
}

test('TC-REVIEW-01: Filters reviews by media type (photos and videos)', () => {
  const photoReviews = filterReviews(SAMPLE_REVIEWS, 'photos');
  assert.equal(photoReviews.length, 1);
  assert.equal(photoReviews[0].id, 'rev-1');

  const videoReviews = filterReviews(SAMPLE_REVIEWS, 'videos');
  assert.equal(videoReviews.length, 1);
  assert.equal(videoReviews[0].id, 'rev-2');
});

test('TC-REVIEW-02: Filters reviews by 5-star rating and featured status', () => {
  const fiveStars = filterReviews(SAMPLE_REVIEWS, '5stars');
  assert.equal(fiveStars.length, 2);

  const featured = filterReviews(SAMPLE_REVIEWS, 'featured');
  assert.equal(featured.length, 2);
});

// 7. Cart Item Signature & Indian Phone Normalization
function getCartItemKey(item) {
  const addonIds = (item.addOns || []).map((a) => a.id).sort().join(',');
  const note = (item.giftMessage || '').trim();
  return `${item.productId}::${item.variantId || 'base'}::${addonIds}::${note}`;
}

function normalizeIndianPhone(input) {
  const digits = input.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 11 && digits.startsWith('0')) return digits.slice(1);
  return digits;
}

test('TC-CART-02: Differentiates cart lines by add-ons and gift message signature', () => {
  const plainBouquet = { productId: 'prod-1', addOns: [], giftMessage: '' };
  const giftedBouquet = {
    productId: 'prod-1',
    addOns: [{ id: 'lights' }, { id: 'card' }],
    giftMessage: 'Happy Birthday!',
  };
  const reorderedAddonsSameGift = {
    productId: 'prod-1',
    addOns: [{ id: 'card' }, { id: 'lights' }],
    giftMessage: ' Happy Birthday! ',
  };

  assert.notEqual(getCartItemKey(plainBouquet), getCartItemKey(giftedBouquet));
  assert.equal(getCartItemKey(giftedBouquet), getCartItemKey(reorderedAddonsSameGift));
});

test('TC-PHONE-01: Normalizes +91 and leading-0 Indian numbers to 10 digits', () => {
  assert.equal(normalizeIndianPhone('+91 98765 43210'), '9876543210');
  assert.equal(normalizeIndianPhone('09876543210'), '9876543210');
  assert.equal(normalizeIndianPhone('9876543210'), '9876543210');
});

// 8. Enterprise Seed Catalog, Signed Admin Auth & Server Checkout Pricing
const ROOT_DIR = process.cwd();
const COMPILED_DIR = '/tmp/bloomora_unit_lib';
execFileSync(
  path.join(ROOT_DIR, 'node_modules/.bin/tsc'),
  [
    '--outDir',
    COMPILED_DIR,
    '--rootDir',
    path.join(ROOT_DIR, 'src'),
    '--module',
    'commonjs',
    '--target',
    'ES2022',
    '--moduleResolution',
    'node',
    '--esModuleInterop',
    '--skipLibCheck',
    'src/lib/catalog-seed.ts',
    'src/lib/admin-auth.ts',
    'src/lib/gift-addons.ts',
  ],
  { cwd: ROOT_DIR }
);

const requireCompiled = createRequire(import.meta.url);
const { SEED_PRODUCTS_60, isSeededCatalogProduct } = requireCompiled(
  path.join(COMPILED_DIR, 'lib/catalog-seed.js')
);
const { signAdminSessionToken, verifyAdminSessionToken, checkLoginRateLimit, clearLoginRateLimit } =
  requireCompiled(path.join(COMPILED_DIR, 'lib/admin-auth.js'));
const { resolveAuthoritativeOrderPricing } = requireCompiled(
  path.join(COMPILED_DIR, 'lib/gift-addons.js')
);

test('TC-CATALOG-01: Seeds 60 cleanable products (10 per category across 6 categories) with valid local images', () => {
  assert.equal(SEED_PRODUCTS_60.length, 60);

  const byCategory = new Map();
  const seenSlugs = new Set();
  const seenIds = new Set();

  for (const product of SEED_PRODUCTS_60) {
    assert.equal(isSeededCatalogProduct(product), true);
    assert.ok(product.basePrice > 0, `${product.slug} must have positive price`);
    assert.ok(product.images.length >= 1, `${product.slug} must have images`);
    assert.equal(seenSlugs.has(product.slug), false, `Duplicate slug: ${product.slug}`);
    assert.equal(seenIds.has(product.id), false, `Duplicate ID: ${product.id}`);
    seenSlugs.add(product.slug);
    seenIds.add(product.id);

    const primaryPath = path.join(ROOT_DIR, 'public', product.images[0].imageUrl);
    assert.equal(fs.existsSync(primaryPath), true, `Missing primary image on disk: ${primaryPath}`);

    byCategory.set(product.categoryId, (byCategory.get(product.categoryId) || 0) + 1);
  }

  assert.equal(byCategory.size, 6);
  for (const [catId, count] of byCategory.entries()) {
    assert.equal(count, 10, `Category ${catId} expected 10 products, got ${count}`);
  }
  assert.equal(isSeededCatalogProduct({ id: 'custom-uuid-123' }), false);
});

test('TC-AUTH-01: Signs and verifies HMAC admin tokens while rejecting tampered and expired tokens', async () => {
  const secret = 'test-enterprise-signing-secret-32chars!';
  const now = 1_794_400_000_000;
  const token = await signAdminSessionToken('StudioOwner@Bloomora.in', secret, now);
  assert.ok(token);

  const verified = await verifyAdminSessionToken(token, secret, now + 1000);
  assert.equal(verified?.sub, 'studioowner@bloomora.in');
  assert.equal(verified?.role, 'admin');

  const [payloadPart, sigPart] = token.split('.');
  const tamperedToken = `${payloadPart}.tampered${sigPart.slice(8)}`;
  assert.equal(await verifyAdminSessionToken(tamperedToken, secret, now + 1000), null);
  assert.equal(await verifyAdminSessionToken('authenticated', secret, now + 1000), null);

  // Token expires cleanly after 7 days
  assert.equal(await verifyAdminSessionToken(token, secret, now + 8 * 24 * 60 * 60 * 1000), null);
});

test('TC-AUTH-02: Enforces sliding-window login rate limit and clears cleanly on reset', () => {
  const key = 'test-ip:admin@bloomora.in';
  clearLoginRateLimit(key);
  const t0 = 1_794_400_000_000;
  for (let i = 0; i < 8; i += 1) {
    assert.equal(checkLoginRateLimit(key, t0 + i * 100).allowed, true);
  }
  const blocked = checkLoginRateLimit(key, t0 + 1000);
  assert.equal(blocked.allowed, false);
  assert.ok(blocked.retryAfterSeconds > 0);
  clearLoginRateLimit(key);
  assert.equal(checkLoginRateLimit(key, t0 + 2000).allowed, true);
});

test('TC-CHECKOUT-01: Resolves authoritative server pricing from catalog, add-ons, and active PIN zones', () => {
  const catalog = [
    SEED_PRODUCTS_60[0], // basePrice 249
    { ...SEED_PRODUCTS_60[1], isPublished: false },
  ];
  const zones = [
    { pin: '390007', area: 'Race Course', fee: 40, active: true },
    { pin: '390099', area: 'Paused Zone', fee: 60, active: false },
  ];

  const pricing = resolveAuthoritativeOrderPricing({
    inputs: [
      {
        productId: catalog[0].id,
        quantity: 2,
        addOnIds: ['lights', 'box', 'bogus-addon'],
        giftMessage: 'Happy Birthday!',
      },
    ],
    catalogProducts: catalog,
    deliveryZones: zones,
    postalCode: '390007',
    fallbackDeliveryFee: 50,
  });

  // Authoritative unit = 249 + 69 (lights) + 49 (box) = 367 * 2 = 734; zone 390007 fee = 40; total = 774
  assert.equal(pricing.unknownProductIds.length, 0);
  assert.equal(pricing.items[0].unitPrice, 367);
  assert.equal(pricing.itemsSubtotal, 734);
  assert.equal(pricing.deliveryFee, 40);
  assert.equal(pricing.grandTotal, 774);

  const blocked = resolveAuthoritativeOrderPricing({
    inputs: [{ productId: catalog[1].id, quantity: 1 }],
    catalogProducts: catalog,
    deliveryZones: zones,
    postalCode: '390099',
    fallbackDeliveryFee: 50,
  });
  assert.equal(blocked.unknownProductIds[0], catalog[1].id);
  assert.equal(blocked.inactiveZonePin, '390099');
});

