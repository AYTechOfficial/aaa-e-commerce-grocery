import { readLocal, writeLocal } from "@/lib/persist";

export type CartLine = { slug: string; quantity: number };
export const CART_KEY = "aaa-grocery-cart";
export const CART_EVENT = "aaa-grocery-cart-change";

export function readCart(): CartLine[] {
  const saved = readLocal<CartLine[]>(CART_KEY, []);
  return Array.isArray(saved) ? saved.filter((line) => typeof line.slug === "string" && Number.isFinite(line.quantity) && line.quantity > 0) : [];
}

export function saveCart(lines: CartLine[]) {
  writeLocal(CART_KEY, lines);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CART_EVENT));
}

export function addToCart(slug: string) {
  const lines = readCart();
  const existing = lines.find((line) => line.slug === slug);
  saveCart(existing ? lines.map((line) => line.slug === slug ? { ...line, quantity: line.quantity + 1 } : line) : [...lines, { slug, quantity: 1 }]);
}
