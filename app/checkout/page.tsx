"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import GroceryNav from "@/components/grocery-nav";
import { readLocal, writeLocal } from "@/lib/persist";
import { CART_KEY, CartItem, DemoOrder, ORDERS_KEY, announceCartChange, cartSubtotal, formatPrice } from "@/lib/grocery";

export default function CheckoutPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  useEffect(() => setItems(readLocal<CartItem[]>(CART_KEY, [])), []);
  const subtotal = cartSubtotal(items);
  const fee = fulfillment === "delivery" ? 4.99 : 0;

  function placeDemoOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!items.length) return;
    const order: DemoOrder = { id: `demo-${Date.now().toString(36)}`, createdAt: new Date().toISOString(), items, fulfillment, name, address: fulfillment === "delivery" ? address : "Neighborhood pickup", subtotal, fee, total: subtotal + fee };
    const orders = readLocal<DemoOrder[]>(ORDERS_KEY, []);
    writeLocal(ORDERS_KEY, [order, ...orders]);
    writeLocal(CART_KEY, []);
    announceCartChange();
    window.location.href = `/orders/${order.id}`;
  }

  return <main className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><GroceryNav /><div className="mx-auto max-w-5xl px-5 py-10"><Link href="/cart" className="text-sm font-semibold text-[#287A4B]">← Back to basket</Link><h1 className="mt-4 font-serif text-4xl">Demo checkout</h1><p className="mt-2 max-w-xl text-sm leading-6 text-[#667267]">Choose a sample fulfillment option and review every cost. This demo does not send an order or payment to a retailer.</p>
    {!items.length ? <div className="mt-8 rounded-2xl bg-white p-10 text-center"><h2 className="font-serif text-2xl">Your basket is empty</h2><p className="mt-2 text-sm text-[#667267]">Add groceries before heading to checkout.</p><Link href="/" className="mt-5 inline-block rounded-full bg-[#287A4B] px-5 py-3 text-sm font-bold text-white">Shop groceries</Link></div> : <form onSubmit={placeDemoOrder} className="mt-8 grid gap-7 lg:grid-cols-[1fr_320px]"><section className="space-y-6 rounded-2xl border border-[#e8e1d4] bg-white p-6"><fieldset><legend className="font-serif text-xl">How would you like your groceries?</legend><div className="mt-4 grid gap-3 sm:grid-cols-2">{(["delivery", "pickup"] as const).map((option) => <label key={option} className={`cursor-pointer rounded-xl border p-4 ${fulfillment === option ? "border-[#287A4B] bg-[#E5F2E8]" : "border-[#e8e1d4]"}`}><input type="radio" name="fulfillment" value={option} checked={fulfillment === option} onChange={() => setFulfillment(option)} className="mr-2 accent-[#287A4B]" /> <span className="font-bold capitalize">{option}</span><span className="mt-1 block pl-6 text-xs text-[#667267]">{option === "delivery" ? "Simulated neighborhood delivery · $4.99" : "Simulated local pickup · free"}</span></label>)}</div></fieldset><div className="grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Your name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#ddd6c9] px-3 py-3 font-normal outline-none focus:border-[#287A4B]" placeholder="Alex Green" /></label>{fulfillment === "delivery" && <label className="text-sm font-semibold">Delivery address<input required value={address} onChange={(event) => setAddress(event.target.value)} className="mt-2 block w-full rounded-xl border border-[#ddd6c9] px-3 py-3 font-normal outline-none focus:border-[#287A4B]" placeholder="123 Garden Street" /></label>}</div></section><aside className="h-fit rounded-2xl border border-[#e8e1d4] bg-white p-5"><h2 className="font-serif text-xl">Cost breakdown</h2><div className="mt-5 space-y-3 border-b border-[#eee8dd] pb-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span>{fulfillment === "delivery" ? "Demo delivery fee" : "Pickup fee"}</span><span>{fee ? formatPrice(fee) : "Free"}</span></div></div><div className="mt-4 flex justify-between font-bold"><span>Demo total</span><span>{formatPrice(subtotal + fee)}</span></div><button type="submit" className="mt-5 w-full rounded-full bg-[#287A4B] px-5 py-3 text-sm font-bold text-white hover:bg-[#1e603a]">Place demo order</button><p className="mt-3 text-xs leading-5 text-[#778076]">No payment is collected. This order is saved only in this browser.</p></aside></form>}
  </div></main>;
}
