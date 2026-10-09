"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import GroceryNav from "@/components/grocery-nav";
import { readLocal, writeLocal } from "@/lib/persist";
import { CART_KEY, findProduct, money, subtotalFor, type CartItem } from "@/lib/grocery-data";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(readLocal<CartItem[]>(CART_KEY, [])), []);
  const subtotal = useMemo(() => subtotalFor(items), [items]);
  function save(next: CartItem[]) {
    setItems(next);
    writeLocal(CART_KEY, next);
    window.dispatchEvent(new Event("aaa-cart-updated"));
  }
  function change(slug: string, amount: number) {
    save(items.map((item) => item.slug === slug ? { ...item, quantity: item.quantity + amount } : item).filter((item) => item.quantity > 0));
  }
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><GroceryNav /><div className="mx-auto max-w-5xl px-5 py-10"><p className="text-sm font-bold uppercase tracking-wider text-[#287a4b]">Your basket</p><h1 className="mt-1 font-serif text-4xl font-bold">Review your groceries</h1><p className="mt-2 text-sm text-[#617367]">Sample prices only. Nothing is sent to a retailer.</p>{items.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-[#cfc8bc] bg-white px-6 py-14 text-center"><h2 className="font-serif text-2xl font-bold">Your basket is empty</h2><p className="mt-2 text-[#617367]">Find something delicious in the sample catalog.</p><Link href="/" className="mt-5 inline-block rounded-full bg-[#287a4b] px-6 py-3 font-semibold text-white">Continue shopping</Link></div> : <div className="mt-8 grid gap-7 lg:grid-cols-[1fr_320px]"><div className="space-y-3">{items.map((item) => { const product = findProduct(item.slug); if (!product) return null; return <article key={item.slug} className="flex gap-4 rounded-2xl border border-[#e9e2d7] bg-white p-4"><img src={product.image} alt={product.name} className="h-24 w-24 rounded-xl object-cover sm:h-28 sm:w-28"/><div className="min-w-0 flex-1"><p className="text-xs text-[#287a4b]">{product.category}</p><h2 className="mt-1 font-semibold">{product.name}</h2><p className="mt-1 text-sm text-[#617367]">{money(product.price)} / {product.unit}</p><button onClick={() => save(items.filter((entry) => entry.slug !== item.slug))} className="mt-2 text-sm font-semibold text-[#9a4b34] underline">Remove</button></div><div className="flex flex-col items-end justify-between"><p className="font-bold">{money(product.price * item.quantity)}</p><div className="flex items-center gap-3 rounded-full border border-[#ded8cd] px-2 py-1"><button aria-label={`Decrease ${product.name} quantity`} onClick={() => change(item.slug, -1)} className="h-7 w-7 rounded-full hover:bg-[#e5f2e8]">−</button><span className="min-w-4 text-center text-sm font-semibold">{item.quantity}</span><button aria-label={`Increase ${product.name} quantity`} onClick={() => change(item.slug, 1)} className="h-7 w-7 rounded-full hover:bg-[#e5f2e8]">+</button></div></div></article>; })}<Link href="/" className="inline-block py-2 font-semibold text-[#287a4b]">← Continue shopping</Link></div><aside className="h-fit rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl font-bold">Cost summary</h2><div className="mt-5 flex justify-between"><span>Subtotal</span><span className="font-semibold">{money(subtotal)}</span></div><p className="mt-2 text-xs leading-5 text-[#617367]">Taxes and any fulfillment fee are shown at demo checkout. Sample pricing only.</p><Link href="/checkout" className="mt-6 block rounded-full bg-[#287a4b] px-5 py-3 text-center font-bold text-white hover:bg-[#1e633b]">Continue to checkout</Link></aside></div>}</div></main>;
}
