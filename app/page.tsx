"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { readLocal } from "@/lib/persist";

const CART_KEY = "local-grocery-cart";

type Store = {
  id: string;
  name: string;
  description: string;
  image: string;
  delivery: boolean;
  pickup: boolean;
  note: string;
};

const stores: Store[] = [
  {
    id: "northside-market",
    name: "Northside Market",
    description: "Everyday produce, pantry staples, and neighborhood favorites.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=80",
    delivery: true,
    pickup: true,
    note: "A friendly neighborhood market",
  },
  {
    id: "little-green-grocer",
    name: "Little Green Grocer",
    description: "Seasonal fruit, fresh greens, and thoughtfully chosen basics.",
    image: "https://images.unsplash.com/photo-1540420773428-7eab949d8a4?auto=format&fit=crop&w=1200&q=80",
    delivery: true,
    pickup: false,
    note: "Fresh picks for the week",
  },
];

export default function HomePage() {
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    const cart = readLocal<{ quantity: number }[]>(CART_KEY, []);
    setCartCount(cart.reduce((total, item) => total + (Number(item.quantity) || 0), 0));
  }, []);

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#20352B]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight" aria-label="Local Grocery home">
          <span className="text-2xl text-[#2F7657]" aria-hidden="true">❧</span>
          <span>Local Grocery</span>
        </Link>
        <div className="hidden rounded-full border border-[#E5E8DF] bg-white px-4 py-2 text-sm text-[#526157] sm:block">
          <span className="mr-2 text-[#2F7657]">●</span>Northside demo area
        </div>
        <nav className="flex items-center gap-2 text-sm font-semibold sm:gap-5">
          <Link className="hidden transition-colors hover:text-[#2F7657] sm:inline" href="#stores">Stores</Link>
          <Link className="rounded-full px-3 py-2 transition-colors hover:bg-[#E6F1E7]" href="/cart">Cart <span className="ml-1 rounded-full bg-[#E6F1E7] px-2 py-0.5 text-xs">{cartCount}</span></Link>
          <Link className="hidden transition-colors hover:text-[#2F7657] sm:inline" href="/orders">Orders</Link>
        </nav>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-4 sm:px-8 sm:pt-8">
        <div className="relative isolate overflow-hidden rounded-[28px] bg-[#244B39] shadow-[0_18px_50px_rgba(32,53,43,0.16)]">
          <div className="absolute inset-0 -z-20 bg-[url('https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center" />
          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#173c2d]/95 via-[#244b39]/75 to-[#244b39]/20" />
          <div className="pointer-events-none absolute -right-12 -top-20 -z-0 select-none text-[260px] leading-none text-white/10" aria-hidden="true">❧</div>
          <div className="relative z-10 max-w-2xl px-7 py-16 sm:px-14 sm:py-24">
            <Badge tone="pass">A little closer to home</Badge>
            <p className="mt-6 text-sm font-semibold uppercase tracking-[0.18em] text-[#D6E8D9]">Northside demo area</p>
            <h1 className="mt-3 text-4xl font-semibold leading-tight text-white sm:text-6xl" style={{ fontFamily: "Fraunces, Georgia, serif" }}>Good food, from around the corner.</h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/85 sm:text-lg">Shop a neighborhood grocery basket at your own pace. Compare local picks, choose how you’d like to collect them, and see every cost before checkout.</p>
            <Link href="#stores" className="mt-8 inline-flex">
              <Button size="lg">Browse nearby stores</Button>
            </Link>
            <p className="mt-4 text-xs text-white/75">A local demo: store availability, inventory, and orders are simulated.</p>
          </div>
        </div>
      </section>

      <section id="stores" className="mx-auto max-w-7xl scroll-mt-6 px-5 pb-20 sm:px-8">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.14em] text-[#2F7657]">Your launch area</p>
            <h2 className="mt-2 text-3xl font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>Stores near Northside</h2>
            <p className="mt-2 text-[#6B756E]">A small, seeded selection for this demo area.</p>
          </div>
          <span className="rounded-full bg-[#E6F1E7] px-4 py-2 text-sm font-semibold text-[#2F7657]">Availability is simulated</span>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {stores.map((store) => (
            <Link key={store.id} href={`/stores/${store.id}`} className="group rounded-[20px] outline-none focus-visible:ring-4 focus-visible:ring-[#9fc8a9]">
              <Card className="h-full overflow-hidden p-0 transition duration-200 group-hover:-translate-y-1 group-hover:shadow-lg">
                <div className="relative h-52 overflow-hidden bg-gradient-to-br from-[#d5e8d4] via-[#8cb78e] to-[#365d43]">
                  <div className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105" style={{ backgroundImage: `linear-gradient(0deg, rgba(23,50,36,.3), transparent 58%), url("${store.image}")` }} />
                  <span className="absolute left-5 top-5 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-[#2F7657]">{store.note}</span>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold">{store.name}</h3>
                      <p className="mt-2 max-w-md text-sm leading-6 text-[#6B756E]">{store.description}</p>
                    </div>
                    <span className="text-xl text-[#2F7657]" aria-hidden="true">↗</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${store.delivery ? "bg-[#E6F1E7] text-[#2F7657]" : "bg-[#F0F0EC] text-[#858B85]"}`}>Delivery {store.delivery ? "available" : "unavailable"}</span>
                    <span className={`rounded-full px-3 py-1.5 text-xs font-semibold ${store.pickup ? "bg-[#E6F1E7] text-[#2F7657]" : "bg-[#F0F0EC] text-[#858B85]"}`}>Pickup {store.pickup ? "available" : "unavailable"}</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
        <div className="mt-8 rounded-2xl border border-[#E5E8DF] bg-white/70 p-5 text-sm leading-6 text-[#6B756E]">
          <strong className="text-[#20352B]">A clear, low-pressure demo.</strong> Browsing and basket building happen on this device. No live inventory, payment, delivery, or store support is connected.
        </div>
      </section>
    </main>
  );
}
