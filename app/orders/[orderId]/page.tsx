"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

const ORDERS_KEY = "local-grocery-orders";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
};

type Order = {
  id: string;
  storeName: string;
  items: OrderItem[];
  fulfillment: string;
  status: string;
  placedAt: string;
  subtotal: number;
  deliveryFee: number;
  serviceFee: number;
  tax: number;
  total: number;
  substitutions: Record<string, string>;
};

const money = (amount: number) => `$${amount.toFixed(2)}`;

export default function OrderDetailsPage() {
  const params = useParams<{ orderId: string }>();
  const orderId = Array.isArray(params.orderId) ? params.orderId[0] : params.orderId;
  const [orders, setOrders] = useState<Order[]>([]);
  const [loaded, setLoaded] = useState(false);
  const order = orders.find((item) => item.id === orderId);

  useEffect(() => {
    setOrders(readLocal<Order[]>(ORDERS_KEY, []));
    setLoaded(true);
  }, []);

  function updateSubstitution(itemId: string, decision: string) {
    const next = orders.map((item) => item.id === orderId
      ? { ...item, substitutions: { ...item.substitutions, [itemId]: decision } }
      : item);
    setOrders(next);
    writeLocal(ORDERS_KEY, next);
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#20352B]">
      <header className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold"><span className="text-2xl text-[#2F7657]">❧</span>Local Grocery</Link>
        <nav className="flex items-center gap-4 text-sm font-semibold"><Link className="hover:text-[#2F7657]" href="/">Stores</Link><Link className="hover:text-[#2F7657]" href="/cart">Cart</Link><Link className="text-[#2F7657]" href="/orders">Orders</Link></nav>
      </header>
      <div className="mx-auto max-w-5xl px-5 pb-16 sm:px-8">
        <Link href="/orders" className="inline-flex py-5 text-sm font-semibold text-[#2F7657] hover:underline">← Order history</Link>
        {!loaded ? null : !order ? (
          <Card className="mx-auto max-w-xl p-8 text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[radial-gradient(circle_at_35%_35%,#fff7dd,#dceedd_72%)] text-5xl text-[#2F7657]" aria-hidden="true">❧</div>
            <h1 className="mt-5 text-3xl font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>Order not found</h1>
            <p className="mt-3 text-[#6B756E]">This order isn’t saved in this browser. Orders in Local Grocery are simulated and stored on this device.</p>
            <Link href="/orders" className="mt-6 inline-flex"><Button>View order history</Button></Link>
          </Card>
        ) : (
          <>
            <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#E6F1E7] via-[#f7f5ef] to-[#e5eedc] p-7 sm:p-10">
              <span className="pointer-events-none absolute -right-5 -top-12 text-[200px] leading-none text-[#2F7657]/10" aria-hidden="true">❧</span>
              <div className="relative">
                <Badge tone="pass">Simulated order</Badge>
                <h1 className="mt-4 text-4xl font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>Your order details</h1>
                <p className="mt-2 text-[#6B756E]">Order {order.id} · {order.placedAt || "Placed recently"}</p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#2F7657]">{order.status || "Order received"}</span>
                  <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-[#526157]">{order.fulfillment || "Delivery"}</span>
                </div>
                <p className="mt-4 text-sm text-[#526157]">From <strong>{order.storeName || "Your local store"}</strong> · Northside demo area</p>
              </div>
            </section>
            <div className="mt-7 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
              <Card className="p-6 sm:p-7">
                <h2 className="text-xl font-bold">Items in this order</h2>
                <p className="mt-1 text-sm text-[#6B756E]">Substitutions are a simulation. You’re in control of each decision.</p>
                <div className="mt-5 divide-y divide-[#E5E8DF]">
                  {order.items.map((item) => {
                    const decision = order.substitutions?.[item.id] || "pending";
                    return <div key={item.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-center justify-between gap-4">
                        <div><p className="font-semibold">{item.name}</p><p className="mt-1 text-sm text-[#6B756E]">Qty {item.quantity} · {money(item.price)} each</p></div>
                        <p className="font-bold">{money(item.price * item.quantity)}</p>
                      </div>
                      <div className="mt-3 rounded-xl bg-[#F7F5EF] p-3">
                        <div className="flex flex-wrap items-center justify-between gap-2"><span className="text-sm font-semibold">Substitution preference</span><span className="text-xs font-semibold capitalize text-[#6B756E]">{decision === "approved" ? "Replacement approved" : decision === "declined" ? "No replacement" : "Awaiting your choice"}</span></div>
                        <div className="mt-3 flex gap-2">
                          <Button size="sm" variant={decision === "approved" ? "primary" : "outline"} onClick={() => updateSubstitution(item.id, "approved")}>Approve replacement</Button>
                          <Button size="sm" variant={decision === "declined" ? "secondary" : "outline"} onClick={() => updateSubstitution(item.id, "declined")}>No replacement</Button>
                        </div>
                      </div>
                    </div>;
                  })}
                </div>
              </Card>
              <div className="space-y-6">
                <Card className="p-6">
                  <h2 className="text-xl font-bold">Order total</h2>
                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-[#6B756E]">Items</span><span>{money(order.subtotal)}</span></div>
                    <div className="flex justify-between"><span className="text-[#6B756E]">Delivery</span><span>{money(order.deliveryFee)}</span></div>
                    <div className="flex justify-between"><span className="text-[#6B756E]">Service fee</span><span>{money(order.serviceFee)}</span></div>
                    <div className="flex justify-between"><span className="text-[#6B756E]">Estimated tax</span><span>{money(order.tax)}</span></div>
                    <div className="flex justify-between border-t border-[#E5E8DF] pt-3 text-base font-bold"><span>Total</span><span>{money(order.total)}</span></div>
                  </div>
                </Card>
                <Card className="border-[#d7e6d6] bg-[#E6F1E7] p-6">
                  <h2 className="text-lg font-bold">Need a hand?</h2>
                  <p className="mt-2 text-sm leading-6 text-[#526157]">This is a simulated order, so no store or delivery team is connected. For demo help, contact <a className="font-semibold text-[#245a3e] underline" href="mailto:hello@localgrocery.demo">hello@localgrocery.demo</a>.</p>
                </Card>
                <Link href="/stores/northside-market" className="inline-flex"><Button variant="secondary">Browse stores</Button></Link>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
