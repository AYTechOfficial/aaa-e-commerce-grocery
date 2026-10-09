"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };

type DemoOrderItem = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image: string;
  unavailable?: boolean;
  substitute?: string;
};

type DemoOrder = {
  id: string;
  title: string;
  placedAt: string;
  status: string;
  fulfillment: string;
  items: DemoOrderItem[];
  simulated: boolean;
  total: number;
};

type AppData = {
  [key: string]: unknown;
  orders?: DemoOrder[];
  records?: RecordItem[];
};

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Store (seeded client-side data)";
const seededOrders: DemoOrder[] = [
  {
    id: "demo-order-1048",
    title: "Market basket · Juniper Market",
    placedAt: "2025-04-18T16:20:00.000Z",
    status: "Delivered",
    fulfillment: "Pickup · Juniper Market",
    simulated: true,
    total: 32.47,
    items: [
      { id: "apples", name: "Honeycrisp apples", quantity: 4, price: 1.29, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=120&q=80" },
      { id: "bread", name: "Country sourdough", quantity: 1, price: 6.5, image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=120&q=80" },
      { id: "greens", name: "Baby spinach", quantity: 1, price: 4.25, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=120&q=80" },
      { id: "eggs", name: "Large brown eggs · 12 ct", quantity: 1, price: 5.49, image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=120&q=80" },
      { id: "milk", name: "Whole milk ·  half gallon", quantity: 1, price: 4.99, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=120&q=80" },
    ],
  },
  {
    id: "demo-order-1052",
    title: "A little midweek top-up · Juniper Market",
    placedAt: "2025-04-21T10:10:00.000Z",
    status: "Substitution needed",
    fulfillment: "Delivery · Today, 11 am–1 pm",
    simulated: true,
    total: 18.85,
    items: [
      { id: "tomatoes", name: "Vine tomatoes", quantity: 3, price: 1.5, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=120&q=80", unavailable: true, substitute: "Heirloom tomatoes" },
      { id: "avocados", name: "Ripe avocados", quantity: 2, price: 2.25, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=120&q=80" },
      { id: "tortillas", name: "Soft corn tortillas", quantity: 1, price: 4.5, image: "https://images.unsplash.com/photo-1615870216519-2f9fa575fa5c?auto=format&fit=crop&w=120&q=80" },
    ],
  },
];

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

function isOrder(value: unknown): value is DemoOrder {
  if (!value || typeof value !== "object") return false;
  const candidate = value as Partial<DemoOrder>;
  return typeof candidate.id === "string" && typeof candidate.status === "string" && Array.isArray(candidate.items);
}

function readableDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "Date unavailable" : new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function statusTone(status: string): "brand" | "pass" | "warn" | "bad" | "neutral" {
  if (/delivered|complete/i.test(status)) return "pass";
  if (/substitution|preparing|shopping/i.test(status)) return "warn";
  if (/cancel/i.test(status)) return "bad";
  return "brand";
}

export default function OrdersPage() {
  const [data, setData] = useState<AppData>({ orders: [] });
  const [ready, setReady] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<"all" | "completed">("all");

  useEffect(() => {
    try {
      const stored = readLocal<unknown>(STORAGE_KEY, null);
      const root: AppData = stored && typeof stored === "object" && !Array.isArray(stored) ? (stored as AppData) : {};
      const savedOrders = Array.isArray(root.orders) ? root.orders.filter(isOrder) : [];
      const next = { ...root, orders: savedOrders.length ? savedOrders : seededOrders };
      setData(next);
      if (!savedOrders.length) writeLocal(STORAGE_KEY, next);
    } catch {
      setData({ orders: seededOrders });
      setError("We couldn’t load saved demo orders. You can still review these sample baskets.");
    } finally {
      setReady(true);
    }
  }, []);

  const orders = useMemo(() => {
    const all = Array.isArray(data.orders) ? data.orders.filter(isOrder) : [];
    return filter === "completed" ? all.filter((order) => /delivered|complete/i.test(order.status)) : all;
  }, [data.orders, filter]);

  function repeatOrder(order: DemoOrder) {
    const items = order.items.map((item) => ({
      id: item.id,
      productId: item.id,
      name: item.name,
      title: item.name,
      quantity: item.quantity,
      price: item.price,
    }));
    try {
      const next: AppData = { ...data, cart: items, cartItems: items, fulfillment: "delivery", cartFulfillment: "delivery" };
      writeLocal(STORAGE_KEY, next);
      setData(next);
      setError("");
      setNotice(`${order.items.length} items from this order are in your basket. Adjust quantities in your cart before checkout.`);
      window.setTimeout(() => setNotice(""), 6000);
    } catch {
      setError("We couldn’t add this order to your basket. Your saved order is still here—please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Playfair+Display:wght@600;700&display=swap" rel="stylesheet" />
      <header className="border-b border-[#e9e6e1] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Local Grocery home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a1d21] text-xl text-white">⌂</span>
            <span className="leading-tight"><span className="block text-sm font-bold tracking-tight">local grocery</span><span className="text-xs text-[#777873]">Good food, close by</span></span>
          </Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="hidden text-[#666a6e] transition hover:text-[#1a1d21] sm:block">Shop nearby</Link>
            <span className="border-b-2 border-[#4f8cff] py-2 text-[#1a1d21]">Your orders</span>
            <Link href="/cart" className="rounded-full border border-[#e5e5e2] px-4 py-2 transition hover:border-[#4f8cff]">Basket</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 pb-20 pt-8 sm:px-8 sm:pt-12">
        <div className="mb-8 overflow-hidden rounded-[2rem] bg-[#eaf1ff] sm:grid sm:grid-cols-[1.2fr_0.8fr]">
          <div className="relative z-10 px-6 py-8 sm:px-10 sm:py-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#d3e1ff] bg-white/80 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#315fae]"><span className="h-2 w-2 rounded-full bg-[#4f8cff]" /> Your local grocery history</div>
            <h1 className="max-w-lg font-[family-name:var(--font-display)] text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Good things are worth repeating.</h1>
            <p className="mt-4 max-w-md text-sm leading-6 text-[#4f5968] sm:text-base">Pick up where you left off. Review a previous basket or bring it back to your cart in one tap.</p>
            <div className="mt-6 flex flex-wrap items-center gap-3 text-xs font-medium text-[#566277]"><span className="rounded-full bg-white px-3 py-2">Nearby stores</span><span className="rounded-full bg-white px-3 py-2">Flexible quantities</span><span className="rounded-full bg-white px-3 py-2">No commitment</span></div>
          </div>
          <div className="relative hidden min-h-[265px] sm:block">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1000&q=85" alt="Fresh produce at a neighborhood market" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#eaf1ff] via-[#eaf1ff]/30 to-transparent" />
            <div className="absolute bottom-5 right-6 rounded-2xl border border-white/70 bg-white/90 px-4 py-3 shadow-lg backdrop-blur"><p className="text-xs font-bold uppercase tracking-wider text-[#72767c]">A little closer</p><p className="mt-1 text-sm font-semibold">Your neighborhood, on your table.</p></div>
          </div>
        </div>

        <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div><p className="text-xs font-bold uppercase tracking-[0.16em] text-[#858780]">The good stuff, again</p><h2 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Your orders</h2></div>
          <div className="flex w-fit rounded-full border border-[#e7e4df] bg-white p-1">
            <button onClick={() => setFilter("all")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === "all" ? "bg-[#1a1d21] text-white" : "text-[#777873] hover:text-[#1a1d21]"}`}>All orders</button>
            <button onClick={() => setFilter("completed")} className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === "completed" ? "bg-[#1a1d21] text-white" : "text-[#777873] hover:text-[#1a1d21]"}`}>Completed</button>
          </div>
        </div>

        {!ready ? <Card className="rounded-3xl p-8"><div className="animate-pulse space-y-4"><div className="h-5 w-48 rounded bg-[#eeece8]" /><div className="h-24 rounded-2xl bg-[#f3f1ee]" /></div></Card> : orders.length === 0 ? (
          <Card className="rounded-3xl border-[#ebe8e3] bg-white p-5 sm:p-8"><EmptyState title="No completed orders yet" message="Once you’ve shopped with a nearby store, your past baskets will be ready to revisit here." description="In the meantime, explore the shops around you and find something fresh." icon="🧺" action={<Link href="/"><Button variant="primary">Explore nearby stores</Button></Link>} /></Card>
        ) : (
          <div className="space-y-5">
            {orders.map((order) => {
              const isOpen = expanded === order.id;
              const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0);
              return (
                <Card key={order.id} className="overflow-hidden rounded-[1.6rem] border border-[#ebe8e3] bg-white p-0 shadow-[0_8px_30px_rgba(29,32,37,0.035)] transition hover:shadow-[0_12px_36px_rgba(29,32,37,0.07)]">
                  <div className="p-5 sm:p-7">
                    <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="mb-3 flex flex-wrap items-center gap-2"><Badge tone={statusTone(order.status)}>{order.status}</Badge>{order.simulated && <span className="rounded-full bg-[#f3f1ee] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.11em] text-[#777873]">Demo order</span>}</div>
                        <Link href={`/orders/${encodeURIComponent(order.id)}`} className="break-words text-lg font-bold tracking-tight hover:text-[#315fae] sm:text-xl">{order.title}</Link>
                        <p className="mt-1 text-sm text-[#777873]">{readableDate(order.placedAt)} <span className="mx-1">·</span> {order.fulfillment}</p>
                        <p className="mt-3 text-sm font-semibold text-[#45494e]">{itemCount} {itemCount === 1 ? "item" : "items"}<span className="mx-2 text-[#c4c2bd]">·</span>{money(order.total)}</p>
                      </div>
                      <div className="flex flex-wrap gap-2 sm:justify-end">
                        <Button variant="outline" size="sm" onClick={() => setExpanded(isOpen ? null : order.id)} aria-expanded={isOpen}>{isOpen ? "Hide items" : "Review items"}</Button>
                        <Button variant="primary" size="sm" onClick={() => repeatOrder(order)}>Reorder</Button>
                      </div>
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-[#f0eeea] pt-4">
                      <Link href={`/orders/${encodeURIComponent(order.id)}`} className="text-sm font-semibold text-[#416fc4] hover:underline">View order details <span aria-hidden="true">→</span></Link>
                      {order.items.some((item) => item.unavailable) && <span className="text-xs font-semibold text-[#99712b]">Action needed on a substitute</span>}
                    </div>
                  </div>
                  {isOpen && <div className="border-t border-[#ebe8e3] bg-[#fcfbf9] px-5 py-4 sm:px-7">
                    <div className="mb-3 flex items-center justify-between"><h3 className="text-sm font-bold">What was in this basket</h3><span className="text-xs text-[#81827e]">Original quantities</span></div>
                    <ul className="divide-y divide-[#eeece8]">
                      {order.items.map((item) => <li key={item.id} className="flex min-w-0 items-center gap-3 py-3">
                        <img src={item.image} alt="" className="h-12 w-12 shrink-0 rounded-xl bg-[#eeece8] object-cover" />
                        <div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold">{item.name}</p><p className="mt-0.5 text-xs text-[#777873]">Qty {item.quantity}{item.unavailable ? " · item unavailable" : ""}</p></div>
                        <span className="shrink-0 text-sm font-semibold">{money(item.price * item.quantity)}</span>
                      </li>)}
                    </ul>
                    <div className="mt-2 flex justify-end"><Link href={`/orders/${encodeURIComponent(order.id)}`} className="text-sm font-semibold text-[#416fc4] hover:underline">See full order and updates →</Link></div>
                  </div>}
                </Card>
              );
            })}
          </div>
        )}

        <div className="mt-8 flex gap-3 rounded-2xl border border-[#e9e6e1] bg-white px-4 py-4 text-xs leading-5 text-[#777873] sm:px-5">
          <span className="mt-0.5 text-base" aria-hidden="true">ⓘ</span><p><span className="font-bold text-[#54575a]">Demo experience.</span> Orders, availability, fees, taxes, and prices shown here are simulated and are not a live store promise. This demo is saved only in this browser; clearing browser data removes it, and it does not sync across devices. Prices and order-level margins have not been verified.</p>
        </div>
      </div>

      {notice && <div role="status" className="fixed bottom-5 left-1/2 z-30 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl bg-[#1a1d21] px-5 py-4 text-sm font-medium text-white shadow-2xl"><div className="flex items-start justify-between gap-4"><p className="break-words">{notice}</p><button onClick={() => setNotice("")} className="text-white/70 hover:text-white" aria-label="Dismiss">✕</button></div><Link href="/cart" className="mt-2 inline-block font-bold text-[#9fc0ff] hover:underline">Go to your basket →</Link></div>}
      {error && <div role="alert" className="fixed bottom-5 left-1/2 z-30 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 rounded-2xl border border-[#f0c8bf] bg-white px-5 py-4 text-sm text-[#8d3b2a] shadow-xl"><div className="flex items-start justify-between gap-4"><p className="break-words">{error}</p><button onClick={() => setError("")} className="text-[#8d3b2a]" aria-label="Dismiss error">✕</button></div></div>}
    </main>
  );
}
