"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { cartCount, readCart } from "@/lib/shop";

export default function ShopHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(cartCount(readCart()));
    update();
    window.addEventListener("aaa-cart-change", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("aaa-cart-change", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return <>
    <div className="bg-[#183B2B] px-4 py-2 text-center text-xs tracking-wide text-white">Demo catalog · Prices, inventory, fees, and fulfillment are simulated</div>
    <header className="border-b border-[#e7e1d6] bg-[#fffefa]">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
        <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA Grocery<span className="text-[#287A4B]">.</span></Link>
        <div className="flex items-center gap-4 text-sm font-medium text-[#183B2B] sm:gap-7">
          <Link href="/#shop" className="hidden hover:text-[#287A4B] sm:block">Shop</Link>
          <Link href="/help" className="hover:text-[#287A4B]">Help</Link>
          <Link href="/account" className="hidden hover:text-[#287A4B] sm:block">Account</Link>
          <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-3 py-2 hover:bg-[#d7eadb]">Basket <span className="ml-1 inline-flex min-w-5 justify-center rounded-full bg-[#287A4B] px-1.5 text-xs text-white">{count}</span></Link>
        </div>
      </nav>
    </header>
  </>;
}
