export type ProductType = 'READY_MADE' | 'MADE_TO_ORDER';

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_DELIVERY'
  | 'OUT_FOR_DELIVERY'
  | 'DELIVERED'
  | 'CANCELLED'
  | 'RETURNED';

export type PaymentStatus =
  | 'NOT_REQUIRED'
  | 'PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod = 'MANUAL_UPI' | 'COD' | 'ONLINE_GATEWAY';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  imageUrl?: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  variantId?: string;
  cloudinaryPublicId: string;
  imageUrl: string;
  altText: string;
  displayOrder: number;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: string;
  productId: string;
  title: string;
  sku?: string;
  priceOverride?: number;
  stockQuantity: number;
  isActive: boolean;
  displayOrder: number;
}

export interface Product {
  id: string;
  categoryId: string;
  category?: Category;
  title: string;
  slug: string;
  shortDescription?: string;
  fullDescription: string;
  basePrice: number;
  compareAtPrice?: number;
  productType: ProductType;
  preparationDays: number;
  isPublished: boolean;
  isFeatured: boolean;
  hasVariants: boolean;
  stockQuantity: number;
  lowStockThreshold: number;
  images: ProductImage[];
  variants?: ProductVariant[];
  createdAt: string;
  updatedAt: string;
}

export interface GiftAddOn {
  id: string;
  name: string;
  price: number;
}

export interface CartItem {
  productId: string;
  variantId?: string;
  title: string;
  variantTitle?: string;
  unitPrice: number;
  quantity: number;
  imageUrl: string;
  maxAvailableStock: number;
  productType: ProductType;
  giftMessage?: string;
  addOns?: GiftAddOn[];
}

export interface DeliveryZone {
  id: string;
  postalCode: string;
  zoneName: string;
  city: string;
  deliveryFee: number;
  estimatedDays: string;
  isActive: boolean;
}

export interface OrderItemSnapshot {
  id: string;
  orderId: string;
  productId?: string;
  variantId?: string;
  productTitle: string;
  variantTitle?: string;
  unitPrice: number;
  quantity: number;
  totalPrice: number;
  imageUrl?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  lookupToken: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  deliveryAddress: string;
  landmark?: string;
  postalCode: string;
  deliveryInstructions?: string;
  itemsSubtotal: number;
  deliveryFee: number;
  discountTotal: number;
  grandTotal: number;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentReference?: string;
  internalNotes?: string;
  cancellationReason?: string;
  items?: OrderItemSnapshot[];
  createdAt: string;
  updatedAt: string;
}

export interface CustomerReview {
  id: string;
  customerName: string;
  customerLocation: string;
  customerPhone?: string;
  rating: number; // 1-5
  title?: string;
  reviewText: string;
  productName: string;
  occasion?: string;
  images: string[];
  videoUrl?: string;
  isVerifiedBuyer: boolean;
  isFeatured: boolean;
  status: 'APPROVED' | 'PENDING' | 'REJECTED';
  createdAt: string;
  updatedAt: string;
}

