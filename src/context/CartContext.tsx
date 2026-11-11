'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { CartItem } from '@/types';

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (productId: string, variantId?: string, itemKey?: string) => void;
  updateQuantity: (
    productId: string,
    variantId: string | undefined,
    quantity: number,
    itemKey?: string
  ) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'the_handmade_craft_cart_v1';

/** Builds a stable line-item signature so differing add-ons or gift notes stay distinct in cart. */
export function getCartItemKey(item: Pick<CartItem, 'productId' | 'variantId' | 'addOns' | 'giftMessage' | 'itemKey'>): string {
  if (item.itemKey) return item.itemKey;
  const addonIds = (item.addOns || [])
    .map((a) => a.id)
    .sort()
    .join(',');
  const note = (item.giftMessage || '').trim();
  return `${item.productId}::${item.variantId || 'base'}::${addonIds}::${note}`;
}

/** Formats variant, add-ons, and gift note into one readable suffix for WhatsApp/order snapshots. */
export function formatCartLineExtras(
  item: Pick<CartItem, 'variantTitle' | 'addOns' | 'giftMessage'>
): string {
  const parts: string[] = [];
  if (item.variantTitle) parts.push(item.variantTitle);
  if (item.addOns && item.addOns.length > 0) {
    parts.push(`Add-ons: ${item.addOns.map((a) => a.name).join(', ')}`);
  }
  if (item.giftMessage && item.giftMessage.trim()) {
    parts.push(`Note: "${item.giftMessage.trim()}"`);
  }
  return parts.length > 0 ? ` (${parts.join(' | ')})` : '';
}

function matchesCartLine(
  item: CartItem,
  productId: string,
  variantId: string | undefined,
  itemKey?: string
): boolean {
  if (itemKey) {
    return getCartItemKey(item) === itemKey;
  }
  return item.productId === productId && item.variantId === variantId;
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed.map((item) => ({ ...item, itemKey: getCartItemKey(item) })));
        }
      }
    } catch (e) {
      console.error('Failed to load cart from storage', e);
    } finally {
      setIsHydrated(true);
    }
  }, []);

  // Save cart to localStorage on changes
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error('Failed to persist cart', e);
      }
    }
  }, [items, isHydrated]);

  const addItem = (newItem: CartItem) => {
    const incomingKey = getCartItemKey(newItem);
    const normalizedItem: CartItem = { ...newItem, itemKey: incomingKey };

    setItems((prev) => {
      const index = prev.findIndex((i) => getCartItemKey(i) === incomingKey);

      if (index > -1) {
        const updated = [...prev];
        const existing = updated[index];
        const newQty = Math.min(
          existing.quantity + normalizedItem.quantity,
          existing.maxAvailableStock > 0 ? existing.maxAvailableStock : 99
        );
        updated[index] = { ...existing, quantity: newQty };
        return updated;
      }

      return [...prev, normalizedItem];
    });
    setIsDrawerOpen(true);
  };

  const removeItem = (productId: string, variantId?: string, itemKey?: string) => {
    setItems((prev) => prev.filter((i) => !matchesCartLine(i, productId, variantId, itemKey)));
  };

  const updateQuantity = (
    productId: string,
    variantId: string | undefined,
    quantity: number,
    itemKey?: string
  ) => {
    if (quantity <= 0) {
      removeItem(productId, variantId, itemKey);
      return;
    }
    setItems((prev) =>
      prev.map((i) => {
        if (matchesCartLine(i, productId, variantId, itemKey)) {
          return { ...i, quantity };
        }
        return i;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

