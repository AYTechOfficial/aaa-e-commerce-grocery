"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";
import { CartState, GROCERY_CART_KEY } from "@/lib/grocery";

export function MarketHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => {
      const cart = readLocal<CartState>(GROCERY_CART_KEY, { storeId: "", items: [] });
      setCount(cart.items.reduce((total, item) => total + item.quantity, 0));
    };
    refresh();
    window.addEventListener("grocery-cart-updated", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("grocery-cart-updated", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <header className="border-b border-[#E5E8DF] bg-[#F7F5EF]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-[#20352B] transition-opacity hover:opacity-75" aria-label="Local Grocery home">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E6F1E7] text-[#2F7657]" aria-hidden="true">
            <svg viewBox="0 0 32 32" className="h-6 w-6" fill="none"><path d="M25.8 5.8C16.1 5.7 8 8.8 7.2 16.4c-.4 4.1 2.4 7 6.2 6.8 7.7-.4 10.6-8.8 12.4-17.4Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/><path d="M5.5 27c4.2-7.8 9.1-11.7 16.6-16.1" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
          </span>
          <span className="font-semibold tracking-tight">Local Grocery</span>
        </Link>
        <div className="order-3 flex w-full items-center gap-2 text-xs text-[#6B756E] sm:order-none sm:w-auto">
          <span className="text-[#2F7657]" aria-hidden="true">●</span>
          Northside demo area <span className="rounded-full bg-[#E6F1E7] px-2 py-1 text-[#2F7657]">Simulated</span>
        </div>
        <nav className="flex items-center gap-1 text-sm text-[#20352B] sm:gap-3" aria-label="Main navigation">
          <Link href="/#stores" className="rounded-lg px-3 py-2 transition-colors hover:bg-[#E6F1E7] focus-visible:outline-2 focus-visible:outline-[#2F7657]">Stores</Link>
          <Link href="/cart" className="rounded-lg px-3 py-2 transition-colors hover:bg-[#E6F1E7] focus-visible:outline-2 focus-visible:outline-[#2F7657]">Cart <span className="ml-1 inline-flex min-w-5 justify-center rounded-full bg-[#2F7657] px-1.5 py-0.5 text-xs text-white">{count}</span></Link>
          <Link href="/orders" className="rounded-lg px-3 py-2 transition-colors hover:bg-[#E6F1E7] focus-visible:outline-2 focus-visible:outline-[#2F7657]">Orders</Link>
        </nav>
      </div>
    </header>
  );
}
