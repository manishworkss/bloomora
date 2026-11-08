import test from 'node:test';
import assert from 'node:assert/strict';

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
    message: 'Hello The Handmade Craft! 🌸',
  });
  assert.match(url, /^https:\/\/wa\.me\/918271735190\?text=/);
  assert.ok(url.includes(encodeURIComponent('Hello The Handmade Craft! 🌸')));
});

test('TC-WA-02: WhatsApp order inquiry includes order reference and total', () => {
  const orderNumber = 'THC-202611-0042';
  const totalFormatted = '₹949';
  const items = 'Everlasting Lavender Bouquet x 1';
  const message = `Hi The Handmade Craft! Order: ${orderNumber}, Total: ${totalFormatted}, Items: ${items}`;
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
