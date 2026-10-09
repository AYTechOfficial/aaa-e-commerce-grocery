import { readLocal, writeLocal } from '@/lib/persist';

export type CartItem = { slug: string; quantity: number };
export const CART_KEY = 'aaa-grocery-cart';

export function readCart(): CartItem[] {
  const value = readLocal<unknown>(CART_KEY, []);
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is CartItem => {
    if (typeof item !== 'object' || item === null) return false;
    const record = item as Record<string, unknown>;
    return typeof record.slug === 'string' && typeof record.quantity === 'number' && record.quantity > 0;
  });
}

export function saveCart(cart: CartItem[]) {
  writeLocal(CART_KEY, cart);
}

export function cartCount(cart: CartItem[]) {
  return cart.reduce((total, item) => total + item.quantity, 0);
}
