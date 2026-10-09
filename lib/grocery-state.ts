import { readLocal, writeLocal } from "@/lib/persist";

export type CartItem = { productId: string; quantity: number };
export type DemoOrder = {
  id: string;
  items: CartItem[];
  fulfillment: "Delivery" | "Pickup";
  subtotal: number;
  fee: number;
  total: number;
  createdAt: string;
};

const CART_KEY = "aaa-grocery-cart";
const ORDERS_KEY = "aaa-grocery-orders";

export function getCart(): CartItem[] {
  return readLocal<CartItem[]>(CART_KEY, []);
}

export function saveCart(items: CartItem[]) {
  writeLocal(CART_KEY, items.filter((item) => item.quantity > 0));
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-change"));
}

export function getOrders(): DemoOrder[] {
  return readLocal<DemoOrder[]>(ORDERS_KEY, []);
}

export function saveOrder(order: DemoOrder) {
  writeLocal(ORDERS_KEY, [order, ...getOrders()]);
}
