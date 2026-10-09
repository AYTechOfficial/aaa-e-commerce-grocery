"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { Button, Card } from "@/components/ui";
import { CartItem, getCart, money, saveCart } from "@/lib/shop";

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  useEffect(() => setItems(getCart()), []);
  function update(next: CartItem[]) {
    setItems(next);
    saveCart(next);
    window.dispatchEvent(new Event("cart-updated"));
  }
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-5xl px-5 py-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Your basket</p><h1 className="mt-2 font-serif text-4xl font-bold">A good shop, gathered</h1>
    {!items.length ? <Card className="mt-8 rounded-2xl border border-[#e9e2d7] bg-white p-8"><h2 className="font-serif text-2xl">Your basket is waiting</h2><p className="mt-2 text-[#617367]">Browse the sample catalog and add something delicious.</p><Link href="/" className="mt-5 inline-block rounded-full bg-[#287a4b] px-5 py-3 font-semibold text-white">Continue shopping</Link></Card> : <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-4">{items.map((item) => <Card key={item.productId} className="flex gap-4 rounded-2xl border border-[#e9e2d7] bg-white p-4 sm:gap-6"><img src={item.image} alt={item.name} className="h-24 w-24 rounded-xl bg-[#e5f2e8] object-cover sm:h-28 sm:w-32" /><div className="min-w-0 flex-1"><h2 className="font-semibold">{item.name}</h2><p className="mt-1 text-sm text-[#617367]">{money(item.price)} · {item.unit}</p><p className="mt-3 font-bold">Line total: {money(item.price * item.quantity)}</p><div className="mt-3 flex flex-wrap items-center gap-3"><div className="flex items-center rounded-full border border-[#d9e2d9]"><button aria-label={`Decrease ${item.name} quantity`} onClick={() => update(items.flatMap((row) => row.productId !== item.productId ? [row] : row.quantity > 1 ? [{ ...row, quantity: row.quantity - 1 }] : []))} className="px-3 py-1">−</button><span className="min-w-8 text-center">{item.quantity}</span><button aria-label={`Increase ${item.name} quantity`} onClick={() => update(items.map((row) => row.productId === item.productId ? { ...row, quantity: row.quantity + 1 } : row))} className="px-3 py-1">+</button></div><button onClick={() => update(items.filter((row) => row.productId !== item.productId))} className="text-sm font-semibold text-[#9d4934] underline">Remove</button></div></div></Card>)}</div>
      <Card className="h-fit rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl">Cost summary</h2><div className="mt-5 flex justify-between"><span>Sample item subtotal</span><strong>{money(subtotal)}</strong></div><p className="mt-2 text-sm leading-5 text-[#617367]">Delivery or pickup fees, if any, are shown before you place a demo order.</p><div className="my-5 border-t border-[#e9e2d7]" /><div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{money(subtotal)}</span></div><Link href="/checkout" className="mt-6 block rounded-full bg-[#287a4b] px-5 py-3 text-center font-semibold text-white hover:bg-[#20633c]">Continue to checkout</Link><Link href="/" className="mt-4 block text-center text-sm font-semibold text-[#287a4b]">Continue shopping</Link></Card>
    </div>}
  </div></main>;
}
