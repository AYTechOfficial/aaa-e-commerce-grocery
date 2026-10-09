"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, getCart } from "@/lib/shop-state";

export default function ShopHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(cartCount(getCart()));
    update();
    window.addEventListener("aaa-cart-updated", update);
    return () => window.removeEventListener("aaa-cart-updated", update);
  }, []);

  return <>
    <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">Sample catalog, prices, inventory, and fulfillment are demo data only.</div>
    <header className="border-b border-[#e8e2d6] bg-white">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA Grocery<span className="text-[#287A4B]">.</span></Link>
        <div className="flex items-center gap-3 text-sm font-semibold text-[#183B2B] sm:gap-6">
          <Link href="/#shop" className="hidden hover:text-[#287A4B] sm:inline">Shop</Link>
          <Link href="/help" className="hover:text-[#287A4B]">Help</Link>
          <Link href="/account" className="hidden hover:text-[#287A4B] sm:inline">Account</Link>
          <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-4 py-2 hover:bg-[#d5e9da]">Cart <span aria-label={`${count} items`}>({count})</span></Link>
        </div>
      </nav>
    </header>
  </>;
}
