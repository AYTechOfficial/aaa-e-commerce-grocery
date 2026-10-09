"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import ShopNav from "@/components/shop-nav";
import { Button, Card } from "@/components/ui";
import { CartItem, getCart, money, Order, saveCart, seedOrders } from "@/lib/shop";

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [orders, setOrders] = useState<Order[]>([]);
  const [message, setMessage] = useState("");
  useEffect(() => setOrders(seedOrders()), []);
  const order = orders.find((entry) => entry.id === decodeURIComponent(params.id));
  function buyAgain() {
    if (!order) return;
    const cart = getCart();
    const next = [...cart];
    order.items.forEach((ordered) => {
      const found = next.find((item) => item.productId === ordered.productId);
      if (found) {
        const updated = next.map((item) => item.productId === ordered.productId ? { ...item, quantity: item.quantity + ordered.quantity } : item);
        next.splice(0, next.length, ...updated);
      } else next.push({ ...ordered } as CartItem);
    });
    saveCart(next);
    window.dispatchEvent(new Event("cart-updated"));
    setMessage("Items from this order were added to your basket.");
  }
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-4xl px-5 py-10"><Link href="/orders" className="text-sm font-semibold text-[#287a4b]">← Order history</Link>
    {order ? <><div className="mt-5 flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Order details</p><h1 className="mt-2 font-serif text-4xl font-bold">Order {order.id}</h1><p className="mt-2 text-[#617367]">Placed {new Date(order.placedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p></div><span className="rounded-full bg-[#e5f2e8] px-4 py-2 font-semibold text-[#287a4b]">{order.status}</span></div>
      <div className="mt-7 grid gap-5 md:grid-cols-[1fr_300px]"><Card className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-2xl">Items in this order</h2><div className="mt-4 divide-y divide-[#eee8de]">{order.items.map((item) => <div key={item.productId} className="flex items-center gap-4 py-4"><img src={item.image} alt={item.name} className="h-16 w-16 rounded-xl bg-[#e5f2e8] object-cover" /><div className="flex-1"><p className="font-semibold">{item.name}</p><p className="text-sm text-[#617367]">{item.quantity} × {money(item.price)}</p></div><strong>{money(item.price * item.quantity)}</strong></div>)}</div><div className="mt-3 border-t border-[#eee8de] pt-4"><div className="flex justify-between"><span>Subtotal</span><span>{money(order.subtotal)}</span></div><div className="mt-2 flex justify-between"><span>Demo fulfillment fee</span><span>{money(order.fee)}</span></div><div className="mt-4 flex justify-between text-lg font-bold"><span>Total</span><span>{money(order.total)}</span></div></div></Card>
        <div className="space-y-5"><Card className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-xl">Fulfillment</h2><p className="mt-2 font-semibold">{order.fulfillment}</p><p className="mt-2 text-sm leading-6 text-[#617367]">This is a simulated order status for demonstration only. No payment, delivery, or pickup request was made.</p></Card><Card className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-xl">Substitutions</h2><p className="mt-2 text-sm leading-6 text-[#617367]">{order.substitution || "No substitution proposals for this demo order."}</p></Card><Card className="rounded-2xl border border-[#e9e2d7] bg-white p-5"><h2 className="font-serif text-xl">Need help?</h2><p className="mt-2 text-sm text-[#617367]">Questions about how this demo works?</p><Link href="/help" className="mt-3 inline-block font-semibold text-[#287a4b]">Visit help and FAQs →</Link></Card></div>
      </div><div className="mt-6">{message && <p role="status" className="mb-3 rounded-xl bg-[#e5f2e8] p-3 text-sm">{message}</p>}<Button variant="primary" onClick={buyAgain}>Buy these items again</Button><Link href="/cart" className="ml-4 font-semibold text-[#287a4b]">View basket</Link></div></> : <div className="mt-8 rounded-2xl bg-white p-8"><h1 className="font-serif text-3xl">Order not found</h1><p className="mt-2 text-[#617367]">We couldn’t find that locally saved demo order.</p><Link href="/orders" className="mt-4 inline-block font-semibold text-[#287a4b]">Return to order history</Link></div>}
  </div></main>;
}
