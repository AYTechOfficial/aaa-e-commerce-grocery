'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { cartCount, readCart, type CartItem } from '@/lib/shop';

export default function ShopHeader() {
  const [cart, setCart] = useState<CartItem[]>([]);
  useEffect(() => setCart(readCart()), []);

  return (
    <>
      <div className="bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white">A neighborhood grocery demo — prices, inventory, and fulfillment are simulated.</div>
      <header className="border-b border-[#e9e3d8] bg-white">
        <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4" aria-label="Main navigation">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight text-[#183B2B]">AAA <span className="text-[#287A4B]">Grocery</span></Link>
          <div className="flex items-center gap-5 text-sm font-medium text-[#183B2B]">
            <Link className="hidden hover:text-[#287A4B] sm:inline" href="/#shop">Shop</Link>
            <Link className="hidden hover:text-[#287A4B] sm:inline" href="/help">Help</Link>
            <Link className="hidden hover:text-[#287A4B] sm:inline" href="/account">Account</Link>
            <Link href="/cart" className="rounded-full bg-[#E5F2E8] px-4 py-2 font-semibold transition hover:bg-[#d3e9d8]">Basket <span aria-label={`${cartCount(cart)} items`}>({cartCount(cart)})</span></Link>
          </div>
        </nav>
      </header>
    </>
  );
}
