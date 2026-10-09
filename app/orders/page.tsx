"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { Card } from "@/components/ui";
import { money, Order, seedOrders } from "@/lib/shop";

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(seedOrders()), []);
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-4xl px-5 py-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Your account</p><h1 className="mt-2 font-serif text-4xl font-bold">Order history</h1><p className="mt-3 text-[#617367]">Locally saved demo orders are stored on this device. No orders are sent to a retailer.</p>
    <div className="mt-8 space-y-4">{orders.map((order) => <Card key={order.id} className="rounded-2xl border border-[#e9e2d7] bg-white p-5 sm:p-6"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-[#617367]">Order {order.id}</p><h2 className="mt-1 font-serif text-2xl">{order.status}</h2></div><span className="rounded-full bg-[#e5f2e8] px-3 py-1 text-sm font-semibold text-[#287a4b]">{order.fulfillment}</span></div><p className="mt-3 text-sm text-[#617367]">{new Date(order.placedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p><div className="mt-4 flex items-center justify-between border-t border-[#eee8de] pt-4"><span>Total</span><strong>{money(order.total)}</strong></div><div className="mt-4 flex flex-wrap gap-3"><Link href={`/orders/${order.id}`} className="rounded-full bg-[#287a4b] px-4 py-2 text-sm font-semibold text-white">Review order</Link><Link href={`/orders/${order.id}`} className="rounded-full border border-[#cbd9ce] px-4 py-2 text-sm font-semibold text-[#287a4b]">Buy again</Link></div></Card>)}</div>
  </div></main>;
}
