import { readLocal, writeLocal } from "@/lib/persist";
import { findProduct } from "@/lib/shop-data";

export type CartLine = { productId: string; quantity: number };
export type Fulfillment = "Delivery" | "Pickup";
export type OrderLine = { productId: string; name: string; image: string; unit: string; unitPrice: number; quantity: number };
export type DemoOrder = {
  id: string;
  createdAt: string;
  status: string;
  fulfillment: Fulfillment;
  items: OrderLine[];
  subtotal: number;
  fee: number;
  total: number;
};

export const CART_KEY = "aaa-grocery-cart";
export const ORDERS_KEY = "aaa-grocery-orders";

export function getCart(): CartLine[] {
  return readLocal<CartLine[]>(CART_KEY, []);
}

export function saveCart(cart: CartLine[]): void {
  writeLocal(CART_KEY, cart);
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-change"));
}

export function getOrders(): DemoOrder[] {
  return readLocal<DemoOrder[]>(ORDERS_KEY, []);
}

export function saveOrders(orders: DemoOrder[]): void {
  writeLocal(ORDERS_KEY, orders);
}

export function ensureDemoOrder(): DemoOrder[] {
  const saved = getOrders();
  if (saved.length) return saved;
  const seeded: DemoOrder = {
    id: "demo-order-1001",
    createdAt: "2025-02-18T15:30:00.000Z",
    status: "Delivered",
    fulfillment: "Pickup",
    items: ["organic-strawberries", "sourdough-loaf", "whole-milk"].flatMap((id) => {
      const product = findProduct(id);
      return product ? [{ productId: product.id, name: product.name, image: product.image, unit: product.unit, unitPrice: product.price, quantity: 1 }] : [];
    }),
    subtotal: 15.87,
    fee: 0,
    total: 15.87,
  };
  saveOrders([seeded]);
  return [seeded];
}

export function money(value: number): string {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export function cartCount(cart: CartLine[]): number {
  return cart.reduce((count, line) => count + line.quantity, 0);
}

export function subtotalFor(cart: CartLine[]): number {
  return cart.reduce((sum, line) => {
    const product = findProduct(line.productId);
    return sum + (product ? product.price * line.quantity : 0);
  }, 0);
}
