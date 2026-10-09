"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GroceryNav from "@/components/grocery-nav";
import { readLocal, writeLocal } from "@/lib/persist";
import { CART_KEY, CartItem, announceCartChange, cartSubtotal, formatPrice, productBySlug } from "@/lib/grocery";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(readLocal<CartItem[]>(CART_KEY, [])), []);

  function update(next: CartItem[]) {
    const clean = next.filter((item) => item.quantity > 0 && productBySlug(item.slug));
    setItems(clean);
    writeLocal(CART_KEY, clean);
    announceCartChange();
  }

  return <main className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><GroceryNav /><div className="mx-auto max-w-5xl px-5 py-10"><p className="text-xs font-bold uppercase tracking-[.18em] text-[#287A4B]">Your neighborhood basket</p><h1 className="mt-2 font-serif text-4xl">Your basket</h1>
    {!items.length ? <div className="mt-8 rounded-2xl border border-[#e8e1d4] bg-white px-6 py-14 text-center"><div className="text-4xl" aria-hidden="true">🧺</div><h2 className="mt-4 font-serif text-2xl">Your basket is waiting</h2><p className="mt-2 text-sm text-[#667267]">Browse the sample catalog and add something good.</p><Link href="/" className="mt-6 inline-block rounded-full bg-[#287A4B] px-6 py-3 text-sm font-bold text-white">Continue shopping</Link></div> : <div className="mt-7 grid gap-7 lg:grid-cols-[1fr_320px]"><div className="space-y-3">{items.map((item) => { const product = productBySlug(item.slug); if (!product) return null; return <article key={item.slug} className="flex gap-4 rounded-2xl border border-[#e8e1d4] bg-white p-4"><img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl bg-[#e9efe5] object-cover" /><div className="flex min-w-0 flex-1 flex-col justify-between sm:flex-row sm:items-center"><div><p className="font-bold">{product.name}</p><p className="mt-1 text-sm text-[#667267]">{formatPrice(product.price)} · {product.unit}</p><button onClick={() => update(items.filter((entry) => entry.slug !== item.slug))} className="mt-2 text-xs font-semibold text-[#a24b36] underline">Remove</button></div><div className="mt-3 flex items-center gap-3 sm:mt-0"><div className="flex items-center rounded-full border border-[#ddd6c9]"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => update(items.map((entry) => entry.slug === item.slug ? { ...entry, quantity: entry.quantity - 1 } : entry))} className="px-3 py-1.5 text-lg">−</button><span className="min-w-7 text-center text-sm font-bold">{item.quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => update(items.map((entry) => entry.slug === item.slug ? { ...entry, quantity: entry.quantity + 1 } : entry))} className="px-3 py-1.5 text-lg">+</button></div><span className="w-20 text-right font-bold">{formatPrice(product.price * item.quantity)}</span></div></div></article>; })}</div><aside className="h-fit rounded-2xl border border-[#e8e1d4] bg-white p-5"><h2 className="font-serif text-xl">Order summary</h2><div className="mt-5 flex justify-between border-b border-[#eee8dd] pb-4 text-sm"><span>Subtotal</span><span className="font-bold">{formatPrice(cartSubtotal(items))}</span></div><p className="mt-4 text-xs leading-5 text-[#778076]">Delivery or pickup fees are shown during demo checkout. All prices and fees are simulated.</p><Link href="/checkout" className="mt-5 block rounded-full bg-[#287A4B] px-5 py-3 text-center text-sm font-bold text-white hover:bg-[#1e603a]">Continue to checkout</Link><Link href="/" className="mt-4 block text-center text-sm font-semibold text-[#287A4B]">Continue shopping</Link></aside></div>}
  </div></main>;
}
