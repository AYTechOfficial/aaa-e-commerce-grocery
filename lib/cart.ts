"use client";

import { useEffect, useState } from "react";
import { readLocal, writeLocal } from "@/lib/persist";

export type CartLine = { slug: string; quantity: number };
const CART_KEY = "aaa-grocery-cart";
const CART_EVENT = "aaa-grocery-cart-change";

function readCart(): CartLine[] {
  const saved = readLocal<CartLine[]>(CART_KEY, []);
  if (!Array.isArray(saved)) return [];
  return saved.filter((line) => typeof line.slug === "string" && Number.isInteger(line.quantity) && line.quantity > 0);
}

function saveCart(lines: CartLine[]) {
  writeLocal(CART_KEY, lines);
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CART_EVENT));
}

export function changeCart(update: (lines: CartLine[]) => CartLine[]) {
  saveCart(update(readCart()));
}

export function addProduct(slug: string) {
  changeCart((lines) => {
    const existing = lines.find((line) => line.slug === slug);
    return existing
      ? lines.map((line) => line.slug === slug ? { ...line, quantity: line.quantity + 1 } : line)
      : [...lines, { slug, quantity: 1 }];
  });
}

export function setProductQuantity(slug: string, quantity: number) {
  changeCart((lines) => quantity < 1
    ? lines.filter((line) => line.slug !== slug)
    : lines.map((line) => line.slug === slug ? { ...line, quantity: Math.min(99, quantity) } : line));
}

export function removeProduct(slug: string) {
  changeCart((lines) => lines.filter((line) => line.slug !== slug));
}

export function clearCart() {
  saveCart([]);
}

export function useCart() {
  const [lines, setLines] = useState<CartLine[]>([]);
  useEffect(() => {
    const refresh = () => setLines(readCart());
    refresh();
    window.addEventListener(CART_EVENT, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(CART_EVENT, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);
  return { lines, count: lines.reduce((sum, line) => sum + line.quantity, 0) };
}
