"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";
import { CART_KEY, type CartItem } from "@/lib/grocery-data";

export default function GroceryNav() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const update = () => {
      const items = readLocal<CartItem[]>(CART_KEY, []);
      setCount(items.reduce((total, item) => total + item.quantity, 0));
    };
    update();
    window.addEventListener("storage", update);
    window.addEventListener("aaa-cart-updated", update);
    return () => {
      window.removeEventListener("storage", update);
      window.removeEventListener("aaa-cart-updated", update);
    };
  }, []);

  return <><div className="bg-[#183b2b] px-4 py-2 text-center text-xs text-white">Sample catalog, prices, and fulfillment details are demo data only.</div><header className="border-b border-[#e9e2d7] bg-[#fffefa]"><nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4"><Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183b2b]">AAA <span className="text-[#287a4b]">Grocery</span></Link><div className="flex flex-wrap items-center justify-end gap-4 text-sm font-medium text-[#183b2b]"><Link href="/#catalog" className="hidden sm:block hover:text-[#287a4b]">Shop</Link><Link href="/help" className="hover:text-[#287a4b]">Help</Link><Link href="/account" className="hover:text-[#287a4b]">Account</Link><Link href="/cart" className="rounded-full bg-[#e5f2e8] px-4 py-2 text-[#183b2b] hover:bg-[#d2e9d8]">Basket <span className="ml-1 rounded-full bg-[#287a4b] px-2 py-0.5 text-xs text-white">{count}</span></Link></div></nav></header></>;
}
