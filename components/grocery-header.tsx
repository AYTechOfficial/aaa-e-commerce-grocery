"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";
import type { CartItem } from "@/lib/grocery";

export default function GroceryHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const cart = readLocal<CartItem[]>("aaa-grocery-cart", []);
      setCount(cart.reduce((total, item) => total + item.quantity, 0));
    };
    updateCount();
    window.addEventListener("storage", updateCount);
    window.addEventListener("aaa-cart-updated", updateCount);
    return () => {
      window.removeEventListener("storage", updateCount);
      window.removeEventListener("aaa-cart-updated", updateCount);
    };
  }, []);

  return (
    <>
      <div className="bg-[#183B2B] px-4 py-2 text-center text-xs tracking-wide text-white">
        Sample catalog, prices, availability, and fulfillment are demo data only.
      </div>
      <header className="border-b border-[#e9e4d9] bg-[#fffefa]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">
            AAA <span className="text-[#287A4B]">Grocery</span>
          </Link>
          <div className="flex items-center gap-3 text-sm font-medium text-[#355342] sm:gap-6">
            <Link href="/#catalog" className="hidden transition hover:text-[#287A4B] sm:block">Shop</Link>
            <Link href="/" className="hidden transition hover:text-[#287A4B] sm:block">Help</Link>
            <Link href="/" className="hidden transition hover:text-[#287A4B] sm:block">Account</Link>
            <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-4 py-2 text-[#183B2B] transition hover:bg-[#d4e9d9]" aria-label={`Cart, ${count} items`}>
              Basket <span className="ml-1 rounded-full bg-white px-2 py-0.5 text-xs">{count}</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
