"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button, Card, EmptyState } from "@/components/ui";
import ShopHeader from "@/components/shop-header";
import { findProduct, formatPrice } from "@/lib/catalog";
import { getCart, getOrders, saveCart, saveOrders, type CartLine } from "@/lib/shop-state";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartLine[]>([]);
  const [fulfillment, setFulfillment] = useState<"delivery" | "pickup">("delivery");
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  useEffect(() => setCart(getCart()), []);
  const lines = useMemo(() => cart.map((line) => ({ line, product: findProduct(line.productId) })).filter((item) => item.product), [cart]);
  const subtotal = lines.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.line.quantity, 0);
  const fee = fulfillment === "delivery" ? 4.99 : 0;

  function placeDemoOrder(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length) return;
    const order = { id: `DEMO-${Date.now().toString().slice(-8)}`, createdAt: new Date().toISOString(), items: cart, subtotal, fulfillment, fee, total: subtotal + fee, name: name.trim(), address: fulfillment === "delivery" ? address.trim() : "" };
    saveOrders([order, ...getOrders()]);
    saveCart([]);
    window.location.href = `/orders/${order.id}`;
  }

  return <div className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><ShopHeader /><main className="mx-auto max-w-4xl px-5 py-10"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#287A4B]">Demo checkout</p><h1 className="mt-2 font-serif text-4xl">Choose how to get it</h1>{lines.length === 0 ? <div className="mt-8"><EmptyState title="Your basket is empty" message="Add groceries to your basket before checking out." action={<Link href="/" className="rounded-full bg-[#287A4B] px-5 py-3 font-semibold text-white">Shop groceries</Link>} /></div> : <form onSubmit={placeDemoOrder} className="mt-8 grid gap-6 md:grid-cols-[1fr_300px]"><div className="space-y-5"><Card className="border border-[#ece6da] bg-white p-6"><h2 className="font-serif text-2xl">Fulfillment</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setFulfillment("delivery")} className={`rounded-xl border p-4 text-left ${fulfillment === "delivery" ? "border-[#287A4B] bg-[#E5F2E8]" : "border-[#ded8cc]"}`}><strong>Delivery</strong><span className="mt-1 block text-sm">Demo fee: $4.99</span></button><button type="button" onClick={() => setFulfillment("pickup")} className={`rounded-xl border p-4 text-left ${fulfillment === "pickup" ? "border-[#287A4B] bg-[#E5F2E8]" : "border-[#ded8cc]"}`}><strong>Pickup</strong><span className="mt-1 block text-sm">No demo fee</span></button></div><label className="mt-5 block text-sm font-semibold">Your name<input required value={name} onChange={(event) => setName(event.target.value)} className="mt-2 w-full rounded-xl border border-[#ded8cc] px-4 py-3 font-normal outline-none focus:border-[#287A4B]" /></label>{fulfillment === "delivery" && <label className="mt-4 block text-sm font-semibold">Delivery address<input required value={address} onChange={(event) => setAddress(event.target.value)} placeholder="Street address" className="mt-2 w-full rounded-xl border border-[#ded8cc] px-4 py-3 font-normal outline-none focus:border-[#287A4B]" /></label>}</Card><Card className="border border-[#ece6da] bg-white p-6"><h2 className="font-serif text-2xl">Your items</h2>{lines.map(({ line, product }) => product && <div key={line.productId} className="mt-4 flex justify-between gap-3 text-sm"><span>{product.name} × {line.quantity}</span><span>{formatPrice(product.price * line.quantity)}</span></div>)}</Card></div><Card className="h-fit border border-[#ece6da] bg-white p-6"><h2 className="font-serif text-2xl">Cost breakdown</h2><div className="mt-5 space-y-3 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span>{fulfillment === "delivery" ? "Demo delivery fee" : "Pickup fee"}</span><span>{formatPrice(fee)}</span></div><div className="flex justify-between border-t border-[#ece6da] pt-3 text-base font-bold"><span>Demo total</span><span>{formatPrice(subtotal + fee)}</span></div></div><p className="mt-4 text-xs leading-5 text-[#718076]">No payment is collected. This will only save a demo order in this browser.</p>{error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}<Button type="submit" className="mt-5 w-full" size="lg">Place demo order</Button><p className="mt-3 text-center text-xs text-[#718076]">Nothing is sent to a retailer.</p></Card></form>}</main></div>;
}
