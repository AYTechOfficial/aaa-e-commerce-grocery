"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartStorageKey, cartUpdatedEvent, type CartLine } from "@/lib/grocery-data";
import { readLocal } from "@/lib/persist";

export function GroceryNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const lines = readLocal<CartLine[]>(cartStorageKey, []);
      setCount(lines.reduce((sum, line) => sum + Math.max(0, line.quantity), 0));
    };
    refresh();
    window.addEventListener(cartUpdatedEvent, refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener(cartUpdatedEvent, refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <>
      <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">
        Sample catalog, prices, inventory, and fulfillment are simulated for this demo.
      </div>
      <header className="border-b border-[#e9e3d7] bg-[#fffefa]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA Grocery<span className="text-[#287A4B]">.</span></Link>
          <div className="flex items-center gap-4 text-sm font-medium text-[#345441]">
            <Link href="/#catalog" className="hidden transition hover:text-[#287A4B] sm:inline">Shop</Link>
            <Link href="/orders" className="hidden transition hover:text-[#287A4B] sm:inline">Orders</Link>
            <Link href="/" className="hidden transition hover:text-[#287A4B] md:inline">Help</Link>
            <Link href="/" className="hidden transition hover:text-[#287A4B] md:inline">Account</Link>
            <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-4 py-2 font-semibold text-[#183B2B] transition hover:bg-[#d6eadb]" aria-label={`Cart, ${count} items`}>
              Basket <span className="ml-1 inline-flex min-w-6 justify-center rounded-full bg-[#287A4B] px-1.5 py-0.5 text-xs text-white">{count}</span>
            </Link>
          </div>
        </nav>
      </header>
    </>
  );
}
