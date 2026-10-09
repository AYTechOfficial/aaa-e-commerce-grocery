"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { readLocal } from "@/lib/persist";
import { CART_KEY, CartItem, cartCount } from "@/lib/grocery";

export default function GroceryNav() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const refresh = () => setCount(cartCount(readLocal<CartItem[]>(CART_KEY, [])));
    refresh();
    window.addEventListener("aaa-cart-change", refresh);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("aaa-cart-change", refresh);
      window.removeEventListener("storage", refresh);
    };
  }, []);

  return (
    <>
      <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">A neighborhood grocery demo — products, prices, inventory, and fulfillment are simulated.</div>
      <header className="border-b border-[#e8e1d4] bg-[#fffefa]">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA <span className="text-[#287A4B]">Grocery</span></Link>
          <div className="flex items-center gap-4 text-sm font-semibold text-[#183B2B]">
            <Link className="hidden transition hover:text-[#287A4B] sm:inline" href="/#shop">Shop</Link>
            <Link className="hidden transition hover:text-[#287A4B] sm:inline" href="/">Help</Link>
            <Link className="hidden transition hover:text-[#287A4B] sm:inline" href="/">Account</Link>
            <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-4 py-2 transition hover:bg-[#d2e8d7]">Basket <span className="ml-1 inline-flex min-w-6 justify-center rounded-full bg-white px-1.5 py-0.5 text-xs">{count}</span></Link>
          </div>
        </nav>
      </header>
    </>
  );
}
