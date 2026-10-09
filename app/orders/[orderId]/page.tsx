"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/products";
import { readLocal } from "@/lib/persist";

type SavedOrderItem = { name: string; quantity: number; unitPrice: number; productId?: string };
type SavedOrder = {
  id?: string;
  orderId?: string;
  createdAt?: string;
  fulfillment?: string;
  fulfillmentMethod?: string;
  subtotal?: number;
  deliveryFee?: number;
  tax?: number;
  total?: number;
  items?: SavedOrderItem[];
};

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = params.orderId;
  const [order, setOrder] = useState<SavedOrder | null>(null);

  useEffect(() => {
    const savedOrders = readLocal<SavedOrder[]>("aaa-grocery-orders", []);
    const matching = savedOrders.find((item) => item.id === orderId || item.orderId === orderId);
    const savedSingle = readLocal<SavedOrder | null>(`aaa-grocery-order-${orderId}`, null);
    setOrder(matching ?? savedSingle);
  }, [orderId]);

  return <main className="min-h-screen bg-[#FAF7F0] px-4 py-10 text-[#183B2B] sm:py-16"><div className="mx-auto max-w-2xl">
    <Link href="/" className="font-serif text-xl font-bold">AAA Grocery<span className="text-[#287A4B]">.</span></Link>
    {order ? <section className="mt-8 rounded-3xl border border-[#ebe5da] bg-white p-6 shadow-sm sm:p-10"><div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E5F2E8] text-2xl text-[#287A4B]" aria-hidden="true">✓</div><p className="mt-6 text-xs font-bold uppercase tracking-[.17em] text-[#287A4B]">Demo order saved</p><h1 className="mt-2 font-serif text-4xl">Thanks for trying AAA Grocery.</h1><p className="mt-4 leading-7 text-[#53675a]">This confirmation is saved on this device for your demo. It was not sent to a retailer, and no payment or real fulfillment was made.</p><div className="mt-7 rounded-2xl bg-[#FAF7F0] p-5"><div className="flex justify-between gap-4 text-sm"><span className="text-[#718075]">Demo order number</span><strong className="break-all">{order.id ?? order.orderId ?? orderId}</strong></div>{(order.fulfillment || order.fulfillmentMethod) && <div className="mt-3 flex justify-between gap-4 text-sm"><span className="text-[#718075]">Fulfillment choice</span><strong className="capitalize">{order.fulfillment ?? order.fulfillmentMethod}</strong></div>}{order.createdAt && <div className="mt-3 flex justify-between gap-4 text-sm"><span className="text-[#718075]">Saved</span><strong>{new Date(order.createdAt).toLocaleString()}</strong></div>}</div><h2 className="mt-8 font-serif text-2xl">Order details</h2>{order.items && order.items.length > 0 ? <ul className="mt-4 divide-y divide-[#eee8dd]">{order.items.map((item, index) => <li key={`${item.productId ?? item.name}-${index}`} className="flex justify-between gap-4 py-3 text-sm"><span>{item.name} <span className="text-[#718075]">× {item.quantity}</span></span><strong>{formatPrice(item.unitPrice * item.quantity)}</strong></li>)}</ul> : <p className="mt-3 text-sm text-[#718075]">No item details were included with this saved demo order.</p>}<div className="mt-4 space-y-2 border-t border-[#eee8dd] pt-4 text-sm">{typeof order.subtotal === "number" && <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(order.subtotal)}</span></div>}{typeof order.deliveryFee === "number" && <div className="flex justify-between"><span>Simulated fulfillment fee</span><span>{formatPrice(order.deliveryFee)}</span></div>}{typeof order.tax === "number" && <div className="flex justify-between"><span>Estimated tax</span><span>{formatPrice(order.tax)}</span></div>}{typeof order.total === "number" && <div className="flex justify-between border-t border-[#eee8dd] pt-3 text-base font-bold"><span>Demo total</span><span>{formatPrice(order.total)}</span></div>}</div><div className="mt-8 flex flex-wrap gap-3"><Link href="/" className="rounded-full bg-[#287A4B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#1d6039]">Continue shopping</Link><Link href="/help" className="rounded-full border border-[#d9e2d9] px-5 py-3 text-sm font-semibold hover:border-[#287A4B]">Help & FAQs</Link></div></section> : <section className="mt-8 rounded-3xl border border-[#ebe5da] bg-white p-7 text-center sm:p-10"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#E5F2E8] text-2xl" aria-hidden="true">?</div><h1 className="mt-5 font-serif text-3xl">We couldn’t find that demo order.</h1><p className="mt-3 leading-6 text-[#718075]">Saved demo orders are available only in the browser where they were placed. Check the order link or start a new basket.</p><div className="mt-6 flex justify-center gap-3"><Link href="/" className="rounded-full bg-[#287A4B] px-5 py-3 text-sm font-semibold text-white">Back to shopping</Link><Link href="/help" className="rounded-full border border-[#d9e2d9] px-5 py-3 text-sm font-semibold">Help</Link></div></section>}
    <p className="mt-6 text-center text-xs leading-5 text-[#718075]">AAA Grocery is a shopping demo. This page does not confirm a real purchase, payment, delivery, or pickup.</p>
  </div></main>;
}
