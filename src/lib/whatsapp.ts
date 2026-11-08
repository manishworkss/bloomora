/**
 * Bloomora — WhatsApp Utility Builder
 * Official Contact: +91 8271735190
 */

export const DEFAULT_WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '918271735190';

export interface BuildWhatsAppLinkOptions {
  phone?: string;
  message: string;
}

export function buildWhatsAppLink({ phone = DEFAULT_WHATSAPP_NUMBER, message }: BuildWhatsAppLinkOptions): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  const encodedMessage = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanPhone}?text=${encodedMessage}`;
}

export function getProductInquiryLink(productTitle: string, variantTitle?: string, productUrl?: string): string {
  const details = variantTitle ? `${productTitle} (${variantTitle})` : productTitle;
  const linkText = productUrl ? `\nProduct Link: ${productUrl}` : '';
  const message = `Hi Bloomora! 🌸\nI'm interested in your "${details}".${linkText}\nCan you share more details or help me customize this?`;
  return buildWhatsAppLink({ message });
}

export function getOrderInquiryLink(orderNumber: string, grandTotalFormatted: string, itemsSummary: string): string {
  const message = `Hi Bloomora! 👋🌸\nI'd like to place an order from your website:\n\nOrder Ref: ${orderNumber}\nItems: ${itemsSummary}\nTotal: ${grandTotalFormatted}\n\nPlease share your UPI payment QR or details so I can confirm my order! 💖`;
  return buildWhatsAppLink({ message });
}

export function getCustomOrderInquiryLink(): string {
  const message = `Hi Bloomora! 🌷\nI'm looking for a custom handcrafted gift (keychain, bouquet, or flower pot). Could you help me with design options and pricing?`;
  return buildWhatsAppLink({ message });
}
