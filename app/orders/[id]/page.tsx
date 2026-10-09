"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { getOrders, products, type DemoOrder } from "@/lib/grocery";

export default function OrderPage({ params }: { params: { id: string } }) {
  const [order, setOrder] = useState<DemoOrder | undefined>();
  const [ready, setReady] = useState(false);
  useEffect(() => { setOrder(getOrders().find((item) => item.id === params.id)); setReady(true); }, [params.id]);
  return <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><main className="mx-auto max-w-3xl px-5 py-10">
    {!ready ? <p className="rounded-xl bg-white p-6 text-[#68766b]">Loading saved order…</p> : !order ? <section className="rounded-2xl border border-[#ebe6dc] bg-white p-8 text-center"><h1 className="font-serif text-3xl">Order not found</h1><p className="mt-3 text-[#68766b]">This demo order is not saved in this browser.</p><Link href="/account" className="mt-5 inline-block font-semibold text-[#287a4b]">View order history</Link></section> : <><div className="rounded-3xl bg-[#e5f2e8] p-7 sm:p-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Demo order confirmed</p><h1 className="mt-3 font-serif text-4xl">Thanks for trying AAA Grocery.</h1><p className="mt-3 leading-7 text-[#526a58]">Order {order.id} was saved on this device only. No payment, retailer, delivery, or pickup request was made.</p></div><section className="mt-7 rounded-2xl border border-[#ebe6dc] bg-white p-6"><div className="flex flex-wrap justify-between gap-3"><h2 className="font-serif text-2xl">Order details</h2><span className="text-sm text-[#68766b]">{new Date(order.placedAt).toLocaleString()}</span></div><p className="mt-2 text-sm text-[#68766b]">{order.fulfillment === "delivery" ? "Demo delivery" : "Demo pickup"} · Sample fulfillment only</p><div className="mt-5 divide-y divide-[#eee9df]">{order.items.map((line) => { const product = products.find((item) => item.slug === line.productId); return product ? <div key={line.productId} className="flex justify-between gap-4 py-3 text-sm"><span>{product.name} × {line.quantity}</span><span>${(product.price * line.quantity).toFixed(2)}</span></div> : null; })}</div><div className="mt-4 space-y-2 border-t border-[#eee9df] pt-4 text-sm"><div className="flex justify-between"><span>Subtotal</span><span>${order.subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span>Demo fulfillment fee</span><span>${order.fee.toFixed(2)}</span></div><div className="flex justify-between pt-2 text-base font-bold"><span>Total</span><span>${order.total.toFixed(2)}</span></div></div></section><div className="mt-6 flex flex-wrap gap-4"><Link href="/account" className="rounded-full bg-[#287a4b] px-5 py-3 font-semibold text-white">View order history</Link><Link href="/help" className="rounded-full border border-[#d8ded6] px-5 py-3 font-semibold">Demo help & FAQs</Link></div></>}
  </main></div>;
}
