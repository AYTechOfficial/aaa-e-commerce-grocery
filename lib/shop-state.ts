import { readLocal, writeLocal } from "@/lib/persist";

export const CART_KEY = "aaa-grocery-cart";
export const ORDERS_KEY = "aaa-grocery-orders";

export type CartLine = { productId: string; quantity: number };
export type DemoOrder = {
  id: string;
  createdAt: string;
  items: CartLine[];
  subtotal: number;
  fulfillment: "delivery" | "pickup";
  fee: number;
  total: number;
  name: string;
  address: string;
};

export function getCart() {
  return readLocal<CartLine[]>(CART_KEY, []);
}

export function saveCart(cart: CartLine[]) {
  writeLocal(CART_KEY, cart);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-updated"));
}

export function getOrders() {
  return readLocal<DemoOrder[]>(ORDERS_KEY, []);
}

export function saveOrders(orders: DemoOrder[]) {
  writeLocal(ORDERS_KEY, orders);
}

export function cartCount(cart: CartLine[]) {
  return cart.reduce((total, line) => total + line.quantity, 0);
}

export function addToCart(productId: string) {
  const cart = getCart();
  const existing = cart.find((line) => line.productId === productId);
  saveCart(existing
    ? cart.map((line) => line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line)
    : [...cart, { productId, quantity: 1 }]);
}
