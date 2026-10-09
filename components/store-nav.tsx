"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";

type CartLine = { slug: string; quantity: number };

export function StoreNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const update = () => setCount(readLocal<CartLine[]>("aaa-grocery-cart", []).reduce((sum, line) => sum + line.quantity, 0));
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
      <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">Sample catalog, prices, inventory, and fulfillment are simulated for this demo.</div>
      <header className="sticky top-0 z-30 border-b border-[#e8e3d9] bg-[#FAF7F0]/95 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA <span className="text-[#287A4B]">Grocery</span></Link>
          <div className="flex items-center gap-3 text-sm font-medium text-[#183B2B] sm:gap-6">
            <a href="/#catalog" className="hidden hover:text-[#287A4B] sm:inline">Shop</a>
            <a href="/#categories" className="hidden hover:text-[#287A4B] md:inline">Categories</a>
            <Link href="/help" className="hidden hover:text-[#287A4B] sm:inline">Help</Link>
            <Link href="/account" className="hidden hover:text-[#287A4B] md:inline">Account</Link>
            <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-4 py-2 font-semibold transition hover:bg-[#cfe6d4]" aria-label={`Cart, ${count} items`}>Basket <span className="ml-1">{count}</span></Link>
          </div>
        </nav>
      </header>
    </>
  );
}

export function announceCartUpdate() {
  if (typeof window !== "undefined") window.dispatchEvent(new Event("aaa-cart-updated"));
}
