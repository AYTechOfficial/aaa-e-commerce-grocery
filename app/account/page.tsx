"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { Card } from "@/components/ui";
import { money, Order, seedOrders } from "@/lib/shop";

export default function AccountPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => setOrders(seedOrders()), []);
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-4xl px-5 py-10"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Your neighborhood shop</p><h1 className="mt-2 font-serif text-4xl font-bold">Account & order history</h1><p className="mt-3 max-w-2xl leading-7 text-[#617367]">This demo account is stored only in your browser. No sign-in or real retailer account is required.</p>
    <div className="mt-8 flex items-center justify-between gap-4"><h2 className="font-serif text-2xl">Your demo orders</h2><Link href="/orders" className="text-sm font-semibold text-[#287a4b]">Full history →</Link></div>
    <div className="mt-4 space-y-4">{orders.map((order) => <Card key={order.id} className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><div className="flex flex-wrap justify-between gap-3"><div><p className="text-sm text-[#617367]">Order {order.id}</p><p className="mt-1 font-semibold">{order.status} · {order.fulfillment}</p></div><strong>{money(order.total)}</strong></div><div className="mt-4 flex gap-3"><Link href={`/orders/${order.id}`} className="rounded-full bg-[#287a4b] px-4 py-2 text-sm font-semibold text-white">Review order</Link><Link href={`/orders/${order.id}`} className="rounded-full border border-[#cbd9ce] px-4 py-2 text-sm font-semibold text-[#287a4b]">Buy again</Link></div></Card>)}</div>
  </div></main>;
}
