"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CART_EVENT, readCart } from "@/lib/cart";

export default function StorefrontNav() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => setCount(readCart().reduce((sum, line) => sum + line.quantity, 0));
    update();
    window.addEventListener(CART_EVENT, update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener(CART_EVENT, update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return <><div className="bg-[#183b2b] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">Sample catalog, prices, inventory, and fulfillment are demo data only.</div><nav className="border-b border-[#e9e2d7] bg-white"><div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><Link href="/" className="font-serif text-2xl font-bold text-[#183b2b]">AAA <span className="text-[#287a4b]">Grocery</span></Link><div className="flex items-center gap-4 text-sm font-semibold text-[#183b2b]"><Link className="hidden sm:inline hover:text-[#287a4b]" href="/#shop">Shop</Link><Link className="hidden sm:inline hover:text-[#287a4b]" href="/help">Help</Link><Link className="hidden sm:inline hover:text-[#287a4b]" href="/account">Account</Link><Link href="/cart" className="rounded-full bg-[#e5f2e8] px-4 py-2 text-[#183b2b] hover:bg-[#d5e9da]">Basket ({count})</Link></div></div></nav></>;
}
