"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { getOrders, products, type DemoOrder } from "@/lib/grocery";

export default function AccountPage() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  useEffect(() => setOrders(getOrders().slice().reverse()), []);
  return <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><main className="mx-auto max-w-4xl px-5 py-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Your account</p><h1 className="mt-2 font-serif text-4xl">Demo order history</h1><p className="mt-3 text-sm text-[#68766b]">Orders are saved locally in this browser. No orders are sent to a retailer.</p>
    {orders.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-[#c9d4c7] bg-white px-6 py-12 text-center"><h2 className="font-serif text-2xl">No demo orders yet</h2><p className="mt-2 text-sm text-[#68766b]">Your completed demo orders will appear here.</p><Link href="/#catalog" className="mt-5 inline-block rounded-full bg-[#287a4b] px-5 py-3 font-semibold text-white">Shop groceries</Link></div> : <div className="mt-8 space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-[#ebe6dc] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><h2 className="font-semibold">Order {order.id}</h2><p className="mt-1 text-sm text-[#718174]">{new Date(order.placedAt).toLocaleString()} · {order.fulfillment === "delivery" ? "Demo delivery" : "Demo pickup"}</p></div><p className="font-semibold">${order.total.toFixed(2)}</p></div><p className="mt-3 text-sm text-[#596b5d]">{order.items.reduce((sum, line) => sum + line.quantity, 0)} items</p><div className="mt-4 flex flex-wrap gap-3"><Link href={`/orders/${order.id}`} className="rounded-full bg-[#e5f2e8] px-4 py-2 text-sm font-semibold text-[#183b2b]">View order</Link><Link href={`/account?repeat=${encodeURIComponent(order.id)}`} onClick={() => {}} className="rounded-full border border-[#d8ded6] px-4 py-2 text-sm font-semibold">Buy again</Link></div></article>)}</div>}
  </main></div>;
}
