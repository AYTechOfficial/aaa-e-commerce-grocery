"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readCart } from "@/lib/demo-store";

export default function ShopHeader() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(readCart().reduce((sum, item) => sum + item.quantity, 0));
    update();
    window.addEventListener("focus", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("focus", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  return (
    <>
      <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">A neighborhood grocery demo — catalog, prices, inventory, and fulfillment are simulated.</div>
      <header className="border-b border-[#e8e2d7] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA Grocery</Link>
          <nav className="flex items-center gap-3 text-sm font-semibold text-[#183B2B] sm:gap-6">
            <Link className="hidden hover:text-[#287A4B] sm:inline" href="/#catalog">Shop</Link>
            <Link className="hover:text-[#287A4B]" href="/help">Help</Link>
            <Link className="hidden hover:text-[#287A4B] sm:inline" href="/account">Account</Link>
            <Link className="rounded-full bg-[#E5F2E8] px-4 py-2 hover:bg-[#d3e9d8]" href="/cart">Cart <span aria-label={`${count} items`}>({count})</span></Link>
          </nav>
        </div>
      </header>
    </>
  );
}
