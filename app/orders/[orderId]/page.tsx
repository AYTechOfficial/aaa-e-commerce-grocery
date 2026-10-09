"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { readLocal } from "@/lib/persist";

type SavedOrder = {
  id?: string;
  orderId?: string;
  items?: Array<{ slug?: string; name?: string; quantity?: number; price?: number; unitPrice?: number }>;
  subtotal?: number;
  total?: number;
  fulfillment?: string;
  fulfillmentType?: string;
  createdAt?: string;
  [key: string]: unknown;
};

export default function OrderPage() {
  const params = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<SavedOrder | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = readLocal<SavedOrder[]>("aaa-grocery-orders", []);
    const found = saved.find((item) => item.id === params.orderId || item.orderId === params.orderId);
    setOrder(found ?? null);
    setReady(true);
  }, [params.orderId]);

  const items = order?.items ?? [];
  const displayedTotal = typeof order?.total === "number" ? order.total : order?.subtotal;
  const fulfillment = order?.fulfillment ?? order?.fulfillmentType;

  return <main className="min-h-screen bg-[#FAF7F0] px-5 py-8 text-[#183B2B]">
    <header className="mx-auto flex max-w-3xl items-center justify-between"><Link href="/" className="font-serif text-2xl font-bold">AAA Grocery<span className="text-[#287A4B]">.</span></Link><span className="rounded-full bg-[#E5F2E8] px-3 py-1.5 text-xs font-semibold text-[#287A4B]">Demo order</span></header>
    <div className="mx-auto max-w-3xl py-12">
      {!ready ? <div className="rounded-2xl bg-white p-8 text-center text-[#657166]">Loading saved order details…</div> : !order ? <section className="rounded-2xl border border-[#e8e2d7] bg-white px-6 py-12 text-center"><div className="text-4xl" aria-hidden="true">🧺</div><h1 className="mt-4 font-serif text-3xl">Order not found</h1><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#657166]">We couldn’t find a locally saved demo order with that number. Orders are only stored in this browser.</p><Link href="/" className="mt-6 inline-flex rounded-full bg-[#287A4B] px-5 py-3 text-sm font-semibold text-white">Continue shopping</Link></section> : <>
        <section className="rounded-2xl border border-[#e8e2d7] bg-white p-6 sm:p-9"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E5F2E8] text-2xl text-[#287A4B]" aria-hidden="true">✓</div><p className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-[#287A4B]">Saved on this device</p><h1 className="mt-2 font-serif text-4xl">Your demo order is ready</h1><p className="mt-3 leading-6 text-[#657166]">This is a locally saved sample order. Nothing was sent to a retailer, and no payment or fulfillment was arranged.</p><div className="mt-7 grid gap-4 rounded-xl bg-[#FAF7F0] p-4 sm:grid-cols-2"><div><p className="text-xs font-semibold uppercase tracking-wider text-[#7b857c]">Order number</p><p className="mt-1 break-all font-semibold">{order.id ?? order.orderId ?? params.orderId}</p></div><div><p className="text-xs font-semibold uppercase tracking-wider text-[#7b857c]">Fulfillment</p><p className="mt-1 font-semibold capitalize">{typeof fulfillment === "string" ? fulfillment : "Demo fulfillment"}</p></div>{typeof order.createdAt === "string" && <div><p className="text-xs font-semibold uppercase tracking-wider text-[#7b857c]">Saved</p><p className="mt-1 font-semibold">{order.createdAt}</p></div>}</div>
          <h2 className="mt-8 font-serif text-2xl">Order items</h2>{items.length ? <ul className="mt-3 divide-y divide-[#eee9df]">{items.map((item, index) => <li key={`${item.slug ?? item.name ?? "item"}-${index}`} className="flex items-center justify-between gap-4 py-4"><div><p className="font-semibold">{item.name ?? item.slug ?? "Grocery item"}</p><p className="mt-1 text-sm text-[#748075]">Quantity: {item.quantity ?? 1}</p></div><p className="font-semibold">${(((item.price ?? item.unitPrice ?? 0) * (item.quantity ?? 1))).toFixed(2)}</p></li>)}</ul> : <p className="mt-3 text-sm text-[#657166]">Item details were not included in the saved order.</p>}
          {typeof displayedTotal === "number" && <div className="mt-4 flex justify-between border-t border-[#e8e2d7] pt-4 text-lg font-bold"><span>Recorded total</span><span>${displayedTotal.toFixed(2)}</span></div>}
        </section><div className="mt-6 flex flex-wrap gap-3"><Link href="/" className="rounded-full bg-[#287A4B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#205f3a]">Continue shopping</Link><Link href="/cart" className="rounded-full border border-[#d8dfd6] bg-white px-5 py-3 text-sm font-semibold hover:border-[#287A4B]">View basket</Link></div>
      </>}
    </div>
  </main>;
}
