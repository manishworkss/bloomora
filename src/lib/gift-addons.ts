import type { Product } from '../types';
import type { DeliveryZone } from './delivery-zones-store';

export interface AddOnOption {
  id: string;
  name: string;
  price: number;
  description: string;
}

export const AVAILABLE_ADDONS: AddOnOption[] = [
  {
    id: 'card',
    name: 'Handwritten Calligraphy Card',
    price: 0,
    description: 'Sealed kraft envelope with your personal message penned by hand',
  },
  {
    id: 'lights',
    name: 'Warm Fairy Lights Wrap',
    price: 69,
    description: 'Delicate warm-white micro-LEDs wrapped around the blooms',
  },
  {
    id: 'box',
    name: 'Signature Satin Ribbon & Gift Box',
    price: 49,
    description: 'Elevated presentation in our boutique kraft keepsake box',
  },
  {
    id: 'charm',
    name: 'Mini Crochet Heart Charm',
    price: 99,
    description: 'Matching handmade amigurumi heart charm tied with ribbon',
  },
];

const ADDON_PRICE_BY_ID = new Map<string, AddOnOption>(
  AVAILABLE_ADDONS.map((addon) => [addon.id, addon])
);

export interface CheckoutLineInput {
  productId: string;
  variantId?: string;
  title?: string;
  quantity: number;
  imageUrl?: string;
  addOnIds?: string[];
  giftMessage?: string;
}

export interface PricedCheckoutLine {
  productId: string;
  variantId?: string;
  productTitle: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface CheckoutPricingResult {
  items: PricedCheckoutLine[];
  itemsSubtotal: number;
  deliveryFee: number;
  grandTotal: number;
  unknownProductIds: string[];
  inactiveZonePin?: string;
}

/** Resolves authoritative server-side pricing from live catalog products, variants, add-on IDs, and delivery zones. */
export function resolveAuthoritativeOrderPricing(params: {
  inputs: CheckoutLineInput[];
  catalogProducts: Product[];
  deliveryZones: DeliveryZone[];
  postalCode: string;
  fallbackDeliveryFee: number;
}): CheckoutPricingResult {
  const { inputs, catalogProducts, deliveryZones, postalCode, fallbackDeliveryFee } = params;
  const productById = new Map<string, Product>(catalogProducts.map((p) => [p.id, p]));
  const unknownProductIds: string[] = [];

  const matchedZone = deliveryZones.find((z) => z.pin === postalCode);
  const inactiveZonePin = matchedZone && !matchedZone.active ? postalCode : undefined;
  const deliveryFee =
    matchedZone && matchedZone.active && Number.isFinite(matchedZone.fee) && matchedZone.fee >= 0
      ? matchedZone.fee
      : fallbackDeliveryFee >= 0
        ? fallbackDeliveryFee
        : 50;

  const items: PricedCheckoutLine[] = [];

  for (const input of inputs) {
    const product = productById.get(input.productId);
    if (!product || !product.isPublished) {
      unknownProductIds.push(input.productId);
      continue;
    }

    let unitBase = product.basePrice;
    let variantSuffix = '';
    if (input.variantId && Array.isArray(product.variants)) {
      const matchedVariant = product.variants.find((v) => v.id === input.variantId && v.isActive);
      if (matchedVariant) {
        if (typeof matchedVariant.priceOverride === 'number' && matchedVariant.priceOverride > 0) {
          unitBase = matchedVariant.priceOverride;
        }
        variantSuffix = ` (${matchedVariant.title})`;
      }
    }

    const uniqueAddOnIds = Array.from(new Set(input.addOnIds || []));
    const validAddOns = uniqueAddOnIds
      .map((id) => ADDON_PRICE_BY_ID.get(id))
      .filter((a): a is AddOnOption => Boolean(a));
    const addOnsDelta = validAddOns.reduce((sum, addon) => sum + addon.price, 0);

    const authoritativeUnitPrice = Math.max(1, unitBase + addOnsDelta);
    const totalPrice = authoritativeUnitPrice * input.quantity;

    const addOnNote =
      validAddOns.length > 0 ? ` • Add-ons: ${validAddOns.map((a) => a.name).join(', ')}` : '';
    const giftNote =
      input.giftMessage && input.giftMessage.trim()
        ? ` • Note: "${input.giftMessage.trim().slice(0, 160)}"`
        : '';

    items.push({
      productId: product.id,
      variantId: input.variantId,
      productTitle:
        input.title && input.title.trim()
          ? input.title.trim().slice(0, 220)
          : `${product.title}${variantSuffix}${addOnNote}${giftNote}`,
      unitPrice: authoritativeUnitPrice,
      quantity: input.quantity,
      totalPrice,
      imageUrl: input.imageUrl || product.images?.[0]?.imageUrl,
    });
  }

  const itemsSubtotal = items.reduce((sum, line) => sum + line.totalPrice, 0);
  const grandTotal = itemsSubtotal + deliveryFee;

  return {
    items,
    itemsSubtotal,
    deliveryFee,
    grandTotal,
    unknownProductIds,
    inactiveZonePin,
  };
}
