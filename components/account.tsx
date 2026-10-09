"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import GroceryNav from "@/components/grocery-nav";
import { readLocal, writeLocal } from "@/lib/persist";
import { CART_KEY, ORDERS_KEY, findProduct, money, type CartItem, type DemoOrder } from "@/lib/grocery-data";

export default function AccountPage() {
  const [orders, setOrders] = useState<DemoOrder[]>([]);
  const [notice, setNotice] = useState("");
  useEffect(() => setOrders(readLocal<DemoOrder[]>(ORDERS_KEY, [])), []);
  function buyAgain(order: DemoOrder) {
    const cart = readLocal<CartItem[]>(CART_KEY, []);
    const merged = [...cart];
    order.items.forEach((ordered) => {
      const found = merged.find((item) => item.slug === ordered.slug);
      if (found) found.quantity += ordered.quantity;
      else merged.push({ ...ordered });
    });
    writeLocal(CART_KEY, merged);
    window.dispatchEvent(new Event("aaa-cart-updated"));
    setNotice("Order items have been added to your basket.");
  }
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><GroceryNav/><div className="mx-auto max-w-4xl px-5 py-10"><p className="text-sm font-bold uppercase tracking-wider text-[#287a4b]">Your account</p><h1 className="mt-1 font-serif text-4xl font-bold">Order history</h1><p className="mt-2 text-[#617367]">Demo orders are stored locally in this browser.</p>{notice && <p role="status" className="mt-4 rounded-xl bg-[#e5f2e8] p-3 font-semibold text-[#287a4b]">{notice} <Link href="/cart" className="underline">View basket</Link></p>}{orders.length === 0 ? <div className="mt-8 rounded-2xl border border-dashed border-[#cfc8bc] bg-white p-10 text-center"><h2 className="font-serif text-2xl font-bold">No demo orders yet</h2><p className="mt-2 text-[#617367]">Your completed sample orders will appear here.</p><Link href="/" className="mt-5 inline-block rounded-full bg-[#287a4b] px-6 py-3 font-semibold text-white">Shop groceries</Link></div> : <div className="mt-7 space-y-4">{orders.map((order) => <article key={order.id} className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><div className="flex flex-wrap items-start justify-between gap-3"><div><p className="text-sm text-[#617367]">{new Date(order.createdAt).toLocaleString()}</p><h2 className="mt-1 font-semibold">Order {order.id}</h2><p className="mt-1 text-sm text-[#617367]">{order.fulfillment} · {order.items.reduce((sum, item) => sum + item.quantity, 0)} items</p></div><p className="text-lg font-bold">{money(order.total)}</p></div><div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-[#617367]">{order.items.map((item) => <span key={item.slug}>{findProduct(item.slug)?.name ?? "Grocery item"} × {item.quantity}</span>)}</div><div className="mt-4 flex flex-wrap gap-4"><Link href={`/orders/${order.id}`} className="font-semibold text-[#287a4b] underline">Review order</Link><button onClick={() => buyAgain(order)} className="font-semibold text-[#287a4b] underline">Buy again</button></div></article>)}</div>}</div></main>;
}
