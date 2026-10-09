"use client";

import { useState } from "react";
import { readLocal, writeLocal } from "@/lib/persist";

type CartRow = { productId: string; quantity: number };

export function ProductAddButton({ productId }: { productId: string }) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const rows = readLocal<CartRow[]>("aaa-grocery-cart", []);
    const current = Array.isArray(rows) ? rows : [];
    const existing = current.find((row) => row.productId === productId);
    const next = existing
      ? current.map((row) => row.productId === productId ? { ...row, quantity: row.quantity + 1 } : row)
      : [...current, { productId, quantity: 1 }];
    writeLocal("aaa-grocery-cart", next);
    setAdded(true);
    window.setTimeout(() => setAdded(false), 2200);
  }

  return <button type="button" onClick={addToCart} className="w-full rounded-full bg-[#287A4B] px-7 py-4 text-base font-bold text-white transition hover:bg-[#1f613a] focus:outline-none focus:ring-4 focus:ring-[#b7d9bf]">{added ? "Added to your basket ✓" : "Add to cart"}</button>;
}
