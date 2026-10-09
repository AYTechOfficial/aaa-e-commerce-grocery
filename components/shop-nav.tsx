"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getCart } from "@/lib/shop-data";

export default function ShopNav() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(getCart().reduce((sum, item) => sum + item.quantity, 0));
    update();
    window.addEventListener("focus", update);
    window.addEventListener("cart-updated", update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("cart-updated", update);
    };
  }, []);
  return <>
    <div className="bg-[#183b2b] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">Catalog, prices, inventory, and fulfillment are demo data.</div>
    <header className="border-b border-[#e8e2d7] bg-[#fffefa]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
        <Link href="/" className="font-serif text-2xl font-bold text-[#183b2b]">AAA Grocery</Link>
        <div className="flex items-center gap-4 text-sm font-medium text-[#31523e]">
          <Link href="/#catalog" className="hidden sm:inline hover:text-[#287a4b]">Shop</Link>
          <Link href="/help" className="hover:text-[#287a4b]">Help</Link>
          <Link href="/account" className="hidden sm:inline hover:text-[#287a4b]">Account</Link>
          <Link href="/cart" className="rounded-full bg-[#e5f2e8] px-4 py-2 text-[#183b2b] hover:bg-[#d4ead9]">Basket ({count})</Link>
        </div>
      </nav>
    </header>
  </>;
}
