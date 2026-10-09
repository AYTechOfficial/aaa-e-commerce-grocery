"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { products, formatPrice } from "@/lib/catalog";
import { clearCart, useCart } from "@/lib/cart";
import { readLocal, writeLocal } from "@/lib/persist";
import { StoreFooter, StoreHeader } from "@/components/storefront";

type Fulfillment = "delivery" | "pickup";
type SavedDemoOrder = { number: string; placedAt: string; fulfillment: Fulfillment; name: string; email: string; total: number; items: { name: string; quantity: number }[] };

export default function CheckoutPage() {
  const { lines } = useCart();
  const [fulfillment, setFulfillment] = useState<Fulfillment>("delivery");
  const [placedOrder, setPlacedOrder] = useState<SavedDemoOrder | null>(null);
  const rows = lines.map((line) => ({ line, product: products.find((product) => product.slug === line.slug) })).filter((item) => item.product);
  const subtotal = rows.reduce((sum, row) => sum + row.product!.price * row.line.quantity, 0);
  const fee = fulfillment === "delivery" ? (subtotal > 50 ? 0 : 4.99) : 0;
  const tax = subtotal * 0.0825;
  const total = subtotal + fee + tax;

  function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const order: SavedDemoOrder = {
      number: `DEMO-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      placedAt: new Date().toISOString(),
      fulfillment,
      name: String(form.get("name") ?? ""),
      email: String(form.get("email") ?? ""),
      total,
      items: rows.flatMap(({ line, product }) => product ? [{ name: product.name, quantity: line.quantity }] : []),
    };
    const existing = readLocal<SavedDemoOrder[]>("aaa-grocery-demo-orders", []);
    writeLocal("aaa-grocery-demo-orders", [order, ...(Array.isArray(existing) ? existing : [])]);
    clearCart();
    setPlacedOrder(order);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return <div className="min-h-screen bg-[#FAF7F0] text-[#183B2B]"><StoreHeader /><main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 md:py-12"><Link href="/cart" className="text-sm font-semibold text-[#287A4B] hover:underline">← Back to basket</Link>
    {placedOrder ? <section className="mx-auto my-10 max-w-xl rounded-3xl border border-[#dce8dc] bg-white px-6 py-12 text-center shadow-sm"><span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E5F2E8] text-2xl text-[#287A4B]" aria-hidden="true">✓</span><p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[#287A4B]">Demo order saved</p><h1 className="mt-2 text-4xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Thanks, {placedOrder.name.split(" ")[0]}.</h1><p className="mt-3 text-sm leading-6 text-[#68766c]">Your demo {placedOrder.fulfillment} order <strong className="text-[#183B2B]">{placedOrder.number}</strong> has been saved on this device. Nothing was sent to a store and no payment was taken.</p><div className="mt-6 rounded-xl bg-[#FAF7F0] p-4 text-left"><div className="flex justify-between text-sm"><span>Simulated total</span><strong>{formatPrice(placedOrder.total)}</strong></div><p className="mt-2 text-xs text-[#748076]">Confirmation details for this demo are saved locally in your browser.</p></div><Link href="/" className="mt-7 inline-flex rounded-full bg-[#287A4B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e633b]">Back to the market</Link></section> : rows.length === 0 ? <section className="mx-auto my-10 max-w-xl rounded-2xl border border-dashed border-[#c9d4c9] bg-white/70 px-6 py-14 text-center"><span className="text-4xl" aria-hidden="true">🧺</span><h1 className="mt-4 text-2xl font-semibold">Your basket is empty</h1><p className="mt-2 text-sm text-[#748076]">Add a few groceries before heading to demo checkout.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#287A4B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#1e633b]">Shop groceries</Link></section> : <><div className="mt-5"><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#287A4B]">One last look</p><h1 className="mt-1 text-4xl" style={{ fontFamily: "'DM Serif Display', Georgia, serif" }}>Demo checkout</h1><p className="mt-2 max-w-2xl text-sm leading-6 text-[#68766c]">Choose how you would like this sample basket fulfilled, then review every simulated cost. This does not place a real order.</p></div>
      <form onSubmit={submitOrder} className="mt-8 grid gap-6 lg:grid-cols-[1fr_350px] lg:items-start"><div className="space-y-5"><section className="rounded-2xl border border-[#e9e3d8] bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">How would you like your groceries?</h2><div className="mt-4 grid gap-3 sm:grid-cols-2"><button type="button" onClick={() => setFulfillment("delivery")} aria-pressed={fulfillment === "delivery"} className={`rounded-xl border p-4 text-left transition ${fulfillment === "delivery" ? "border-[#287A4B] bg-[#E5F2E8]/60 ring-1 ring-[#287A4B]" : "border-[#e9e3d8] hover:border-[#9eb9a3]"}`}><span className="flex items-center justify-between font-semibold">Delivery <span aria-hidden="true">⌂</span></span><span className="mt-1 block text-xs leading-5 text-[#748076]">Demo delivery to your neighborhood address.</span></button><button type="button" onClick={() => setFulfillment("pickup")} aria-pressed={fulfillment === "pickup"} className={`rounded-xl border p-4 text-left transition ${fulfillment === "pickup" ? "border-[#287A4B] bg-[#E5F2E8]/60 ring-1 ring-[#287A4B]" : "border-[#e9e3d8] hover:border-[#9eb9a3]"}`}><span className="flex items-center justify-between font-semibold">Pickup <span aria-hidden="true">⌖</span></span><span className="mt-1 block text-xs leading-5 text-[#748076]">Demo pickup from our sample neighborhood market.</span></button></div></section>
        <section className="rounded-2xl border border-[#e9e3d8] bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">Your details</h2><p className="mt-1 text-xs leading-5 text-[#748076]">Demo information stays on this device and is not submitted to a retailer.</p><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold text-[#536357]">Full name<input required name="name" autoComplete="name" className="mt-1.5 h-11 w-full rounded-lg border border-[#ded9ce] bg-white px-3 text-sm font-normal text-[#183B2B] outline-none focus:border-[#287A4B] focus:ring-2 focus:ring-[#287A4B]/15" placeholder="Your name" /></label><label className="text-xs font-semibold text-[#536357]">Email address<input required type="email" name="email" autoComplete="email" className="mt-1.5 h-11 w-full rounded-lg border border-[#ded9ce] bg-white px-3 text-sm font-normal text-[#183B2B] outline-none focus:border-[#287A4B] focus:ring-2 focus:ring-[#287A4B]/15" placeholder="you@example.com" /></label>{fulfillment === "delivery" && <label className="text-xs font-semibold text-[#536357] sm:col-span-2">Delivery address<input required name="address" autoComplete="street-address" className="mt-1.5 h-11 w-full rounded-lg border border-[#ded9ce] bg-white px-3 text-sm font-normal text-[#183B2B] outline-none focus:border-[#287A4B] focus:ring-2 focus:ring-[#287A4B]/15" placeholder="Street address, city, ZIP" /></label>}</div></section>
        <section className="rounded-2xl border border-[#e9e3d8] bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">Your basket</h2><div className="mt-3 divide-y divide-[#eee9df]">{rows.map(({ line, product }) => product && <div key={line.slug} className="flex justify-between gap-4 py-3 text-sm"><span>{product.name} <span className="text-[#81877f]">× {line.quantity}</span></span><span className="shrink-0 font-medium">{formatPrice(product.price * line.quantity)}</span></div>)}</div></section></div>
        <aside className="rounded-2xl border border-[#e9e3d8] bg-white p-5 sm:p-6"><h2 className="text-lg font-semibold">Cost breakdown</h2><div className="mt-5 space-y-3 border-b border-[#eee9df] pb-4 text-sm"><div className="flex justify-between"><span className="text-[#68766c]">Items subtotal</span><span>{formatPrice(subtotal)}</span></div><div className="flex justify-between"><span className="text-[#68766c]">{fulfillment === "delivery" ? "Demo delivery fee" : "Pickup fee"}</span><span>{fee === 0 ? "Free" : formatPrice(fee)}</span></div>{fulfillment === "delivery" && subtotal > 0 && subtotal <= 50 && <p className="text-right text-[11px] text-[#748076]">Demo delivery is free on baskets over $50.</p>}<div className="flex justify-between"><span className="text-[#68766c]">Estimated tax (8.25%)</span><span>{formatPrice(tax)}</span></div></div><div className="mt-4 flex justify-between text-lg font-bold"><span>Estimated total</span><span>{formatPrice(total)}</span></div><p className="mt-3 text-xs leading-5 text-[#748076]">All prices, fees, tax, and fulfillment are estimates for this demo. No payment will be collected.</p><button type="submit" className="mt-5 h-12 w-full rounded-full bg-[#287A4B] px-5 text-sm font-semibold text-white transition hover:bg-[#1e633b] focus:outline-none focus:ring-2 focus:ring-[#287A4B] focus:ring-offset-2">Place demo order</button><p className="mt-3 text-center text-[11px] text-[#81877f]">This saves a sample order on this device only.</p></aside></form></>}
  </main><StoreFooter /></div>;
}
