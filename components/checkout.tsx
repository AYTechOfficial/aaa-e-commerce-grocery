"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import GroceryNav from "@/components/grocery-nav";
import { readLocal, writeLocal } from "@/lib/persist";
import { CART_KEY, ORDERS_KEY, findProduct, money, subtotalFor, type CartItem, type DemoOrder, type Fulfillment } from "@/lib/grocery-data";

export default function CheckoutPage() {
  const router = useRouter();
  const [items, setItems] = useState<CartItem[]>([]);
  const [fulfillment, setFulfillment] = useState<Fulfillment>("Delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  useEffect(() => setItems(readLocal<CartItem[]>(CART_KEY, [])), []);
  const subtotal = useMemo(() => subtotalFor(items), [items]);
  const fee = fulfillment === "Delivery" ? (items.length ? 4.99 : 0) : 0;
  function placeOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    if (!name.trim() || (fulfillment === "Delivery" && !address.trim())) {
      setMessage("Please enter your name and the demo delivery address.");
      return;
    }
    const order: DemoOrder = { id: `demo-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), items, fulfillment, subtotal, fee, total: subtotal + fee };
    const existing = readLocal<DemoOrder[]>(ORDERS_KEY, []);
    writeLocal(ORDERS_KEY, [order, ...existing]);
    writeLocal(CART_KEY, []);
    window.dispatchEvent(new Event("aaa-cart-updated"));
    router.push(`/orders/${order.id}`);
  }
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><GroceryNav/><div className="mx-auto max-w-5xl px-5 py-10"><p className="text-sm font-bold uppercase tracking-wider text-[#287a4b]">Demo checkout</p><h1 className="mt-1 font-serif text-4xl font-bold">Choose how to get your groceries</h1><p className="mt-2 text-[#617367]">This checkout only saves a sample order in this browser. It does not contact a store or take payment.</p>{!items.length ? <div className="mt-8 rounded-2xl bg-white p-8 text-center"><h2 className="font-serif text-2xl font-bold">Your basket is empty</h2><p className="mt-2 text-[#617367]">Add some groceries before checking out.</p><Link href="/" className="mt-5 inline-block rounded-full bg-[#287a4b] px-6 py-3 font-semibold text-white">Shop groceries</Link></div> : <form onSubmit={placeOrder} className="mt-8 grid gap-7 lg:grid-cols-[1fr_340px]"><div className="space-y-6"><section className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl font-bold">Fulfillment</h2><div className="mt-4 grid gap-3 sm:grid-cols-2">{(["Delivery", "Pickup"] as Fulfillment[]).map((option) => <button type="button" key={option} onClick={() => { setFulfillment(option); setMessage(""); }} className={`rounded-xl border p-4 text-left ${fulfillment === option ? "border-[#287a4b] bg-[#e5f2e8] ring-1 ring-[#287a4b]" : "border-[#e9e2d7]"}`}><span className="block font-bold">{option}</span><span className="mt-1 block text-sm text-[#617367]">{option === "Delivery" ? "Simulated same-day delivery · $4.99 demo fee" : "Simulated neighborhood pickup · no fee"}</span></button>)}</div></section><section className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl font-bold">Demo contact details</h2><label className="mt-4 block text-sm font-semibold">Your name<input value={name} onChange={(event) => setName(event.target.value)} className="mt-1 h-11 w-full rounded-lg border border-[#ded8cd] px-3 outline-none focus:border-[#287a4b]" placeholder="Name" /></label>{fulfillment === "Delivery" && <label className="mt-4 block text-sm font-semibold">Delivery address (demo only)<input value={address} onChange={(event) => setAddress(event.target.value)} className="mt-1 h-11 w-full rounded-lg border border-[#ded8cd] px-3 outline-none focus:border-[#287a4b]" placeholder="Street address" /></label>}{message && <p role="alert" className="mt-3 text-sm font-semibold text-[#9a4b34]">{message}</p>}</section></div><aside className="h-fit rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl font-bold">Order summary</h2><div className="mt-4 space-y-3">{items.map((item) => { const product = findProduct(item.slug); return product ? <div key={item.slug} className="flex justify-between gap-3 text-sm"><span>{product.name} × {item.quantity}</span><span>{money(product.price * item.quantity)}</span></div> : null; })}</div><div className="mt-4 space-y-2 border-t border-[#e9e2d7] pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{money(subtotal)}</span></div><div className="flex justify-between"><span>{fulfillment} fee (demo)</span><span>{money(fee)}</span></div><div className="flex justify-between pt-2 text-base font-bold"><span>Demo total</span><span>{money(subtotal + fee)}</span></div></div><button type="submit" className="mt-5 w-full rounded-full bg-[#287a4b] px-5 py-3 font-bold text-white hover:bg-[#1e633b]">Place demo order</button><p className="mt-3 text-xs leading-5 text-[#617367]">No payment is collected. This is not a real delivery or pickup request.</p></aside></form>}</div></main>;
}
