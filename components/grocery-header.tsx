"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCartCount } from "@/lib/grocery";

export function GroceryHeader() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(getCartCount());
    update();
    window.addEventListener("aaa-cart-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aaa-cart-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <>
      <div className="bg-[#183b2b] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">A neighborhood grocery demo · Sample prices, inventory, fees, and fulfillment are simulated</div>
      <header className="border-b border-[#e6e1d7] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8" aria-label="Main navigation">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183b2b]">AAA <span className="text-[#287a4b]">Grocery</span></Link>
          <div className="flex items-center gap-3 text-sm font-medium text-[#183b2b] sm:gap-6">
            <Link href="/#catalog" className="hidden transition-colors hover:text-[#287a4b] sm:inline">Shop</Link>
            <Link href="/help" className="transition-colors hover:text-[#287a4b]">Help</Link>
            <Link href="/help#account" className="hidden transition-colors hover:text-[#287a4b] sm:inline">Account</Link>
            <Link href="/cart" className="rounded-full bg-[#e5f2e8] px-4 py-2 text-[#183b2b] transition-colors hover:bg-[#d4e9d9]" aria-label={`Cart, ${count} items`}>Cart <span className="ml-1 font-bold">{count}</span></Link>
          </div>
        </nav>
      </header>
    </>
  );
}
