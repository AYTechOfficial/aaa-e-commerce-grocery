"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Badge, Button, Card } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };

const STORE_KEY = "lastmile:aaa-e-commerce-grocery:Store (seeded client-side data)";

const SEEDED_STORES: RecordItem[] = [
  {
    id: "maple-main",
    title: "Maple & Main Market",
    notes: "Neighborhood favorites, fresh produce, and pantry staples.",
    createdAt: "2025-01-01T09:00:00.000Z",
  },
  {
    id: "cornerstone-grocers",
    title: "Cornerstone Grocers",
    notes: "A well-stocked local shop for everyday essentials and more.",
    createdAt: "2025-01-01T09:00:00.000Z",
  },
  {
    id: "green-basket-coop",
    title: "Green Basket Co-op",
    notes: "Seasonal produce and thoughtful picks from local makers.",
    createdAt: "2025-01-01T09:00:00.000Z",
  },
];

const STORE_DETAILS: Record<string, { category: string; minutes: string; fee: string; rating: string; image: string; alt: string }> = {
  "maple-main": {
    category: "Neighborhood market",
    minutes: "20–30 min",
    fee: "$2.49 demo fee",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1100&q=85",
    alt: "Colorful fresh produce arranged in a neighborhood market",
  },
  "cornerstone-grocers": {
    category: "Everyday groceries",
    minutes: "25–35 min",
    fee: "$1.99 demo fee",
    rating: "4.8",
    image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1100&q=85",
    alt: "Fresh greens and vegetables at a local grocery store",
  },
  "green-basket-coop": {
    category: "Organic & local",
    minutes: "30–40 min",
    fee: "$2.99 demo fee",
    rating: "4.9",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=1100&q=85",
    alt: "A basket of fresh greens and seasonal vegetables",
  },
};

export default function HomePage() {
  const [stores, setStores] = useState<RecordItem[]>(SEEDED_STORES);
  const [query, setQuery] = useState("");
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    const saved = readLocal<RecordItem[]>(STORE_KEY, SEEDED_STORES);
    if (Array.isArray(saved) && saved.length > 0) {
      setStores(saved);
    } else {
      setStores(SEEDED_STORES);
      writeLocal(STORE_KEY, SEEDED_STORES);
    }
  }, []);

  const visibleStores = useMemo(() => {
    const term = query.trim().toLowerCase();
    const matches = stores.filter((store) => {
      const detail = STORE_DETAILS[store.id];
      return !term || `${store.title} ${store.notes} ${detail?.category ?? ""}`.toLowerCase().includes(term);
    });
    return showAll ? matches : matches.slice(0, 3);
  }, [query, showAll, stores]);

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Manrope:wght@500;600;700;800&display=swap" rel="stylesheet" />

      <header className="border-b border-[#ece9e4] bg-white/90">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3" aria-label="Local Grocery home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#1a1d21] text-xl text-white">◒</span>
            <span className="font-[Manrope] text-lg font-extrabold tracking-tight">local<span className="text-[#4f8cff]">grocery</span></span>
          </Link>
          <nav className="flex items-center gap-2 sm:gap-6" aria-label="Main navigation">
            <Link href="/orders" className="hidden text-sm font-semibold text-[#565b62] transition hover:text-[#1a1d21] sm:block">Your orders</Link>
            <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-[#e9e7e3] bg-white px-4 py-2.5 text-sm font-bold transition hover:border-[#4f8cff] hover:bg-[#f6f9ff]">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M3 4h2l2.2 10.1a2 2 0 0 0 2 1.6h7.9a2 2 0 0 0 2-1.6L21 8H6" strokeLinecap="round" strokeLinejoin="round"/><circle cx="10" cy="20" r="1"/><circle cx="18" cy="20" r="1"/></svg>
              Basket
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-5 pb-12 pt-7 sm:px-8 sm:pt-10 lg:pb-16">
        <div className="mb-5 flex flex-wrap items-center gap-2 text-sm font-medium text-[#62676d]">
          <span className="inline-flex items-center gap-2 rounded-full bg-white px-3 py-1.5 shadow-sm ring-1 ring-[#eeece8]">
            <span className="h-2 w-2 rounded-full bg-[#4f8cff]" /> Serving the demo neighborhood
          </span>
          <span className="text-[#aaa69e]">·</span>
          <span>Local shops, one easy basket</span>
        </div>

        <div className="grid overflow-hidden rounded-[2rem] bg-[#eaf1ff] lg:min-h-[430px] lg:grid-cols-[1fr_0.92fr]">
          <div className="flex flex-col items-start justify-center px-7 py-10 sm:px-12 sm:py-14 lg:px-14">
            <Badge tone="brand">A LOCAL GROCERY DEMO</Badge>
            <h1 className="mt-5 max-w-xl font-[Manrope] text-4xl font-extrabold leading-[1.08] tracking-[-0.045em] sm:text-5xl lg:text-[3.65rem]">
              Good food from<br className="hidden sm:block" /> right around you.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-[#555e6c] sm:text-lg">
              Browse neighborhood stores, build a basket, and choose delivery or pickup. Start with a shop below.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#stores"><Button size="lg" variant="primary">Explore local stores <span aria-hidden="true" className="ml-2">↓</span></Button></a>
              <Link href="/orders"><Button size="lg" variant="outline">View demo orders</Button></Link>
            </div>
            <p className="mt-5 max-w-md text-xs leading-5 text-[#747b85]">This is a simulated shopping experience. Availability, delivery times, fees, and prices are illustrative—not live service information.</p>
          </div>
          <div className="relative min-h-[270px] overflow-hidden sm:min-h-[360px] lg:min-h-full">
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=90" alt="Fresh seasonal produce at a local grocery market" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#131a22]/55 via-transparent to-transparent" />
            <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-8 sm:left-8 sm:right-8">
              <div className="rounded-2xl border border-white/35 bg-white/90 px-4 py-3 shadow-lg backdrop-blur-sm">
                <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#717780]">A little closer to home</p>
                <p className="mt-1 font-[Manrope] text-base font-extrabold">Shop small. Eat well.</p>
              </div>
              <span className="hidden rounded-full bg-[#1a1d21] px-3 py-2 text-xs font-bold text-white sm:inline-flex">Made for your neighborhood</span>
            </div>
          </div>
        </div>

        <section id="stores" className="scroll-mt-8 pt-12 sm:pt-16">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
            <div>
              <div className="text-xs font-bold uppercase tracking-[0.16em] text-[#4f8cff]">Your neighborhood lineup</div>
              <h2 className="mt-2 font-[Manrope] text-3xl font-extrabold tracking-[-0.035em] sm:text-4xl">Stores near you</h2>
              <p className="mt-2 text-sm leading-6 text-[#74777b]">Choose a local favorite to see its demo product selection.</p>
            </div>
            <div className="flex w-full items-center gap-3 md:w-auto">
              <label className="relative block w-full md:w-72">
                <span className="sr-only">Search local stores</span>
                <svg aria-hidden="true" viewBox="0 0 24 24" className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#858991]" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="10.8" cy="10.8" r="6.8"/><path d="m16 16 4.5 4.5" strokeLinecap="round"/></svg>
                <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stores" className="w-full rounded-xl border border-[#e8e5df] bg-white py-3 pl-10 pr-4 text-sm outline-none transition placeholder:text-[#a1a3a6] focus:border-[#4f8cff] focus:ring-4 focus:ring-[#4f8cff]/10" />
              </label>
            </div>
          </div>

          {visibleStores.length === 0 ? (
            <Card className="mt-7 rounded-3xl border border-[#ece9e4] bg-white p-10 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#f1f5ff] text-2xl">⌕</span>
              <h3 className="mt-4 font-[Manrope] text-lg font-bold">No stores match that search</h3>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-[#74777b]">Try another name or clear your search to browse the demo neighborhood.</p>
              <Button className="mt-5" variant="outline" onClick={() => setQuery("")}>Clear search</Button>
            </Card>
          ) : (
            <div className="mt-7 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {visibleStores.map((store, index) => {
                const details = STORE_DETAILS[store.id] ?? {
                  category: "Local grocery",
                  minutes: "25–35 min",
                  fee: "Demo fee shown at checkout",
                  rating: "4.8",
                  image: "https://images.unsplash.com/photo-1579113800032-c38bd7635818?auto=format&fit=crop&w=1100&q=85",
                  alt: "Fresh groceries at a local shop",
                };
                return (
                  <Link key={store.id} href={`/stores/${encodeURIComponent(store.id)}`} className="group block min-w-0 rounded-[1.6rem] outline-none focus-visible:ring-4 focus-visible:ring-[#4f8cff]/30">
                    <Card className="h-full overflow-hidden rounded-[1.6rem] border border-[#ece9e4] bg-white p-0 transition duration-200 group-hover:-translate-y-1 group-hover:border-[#d4e2ff] group-hover:shadow-xl group-hover:shadow-[#1a1d21]/[0.07]">
                      <div className="relative h-52 overflow-hidden bg-[#eef0ed]">
                        <img src={details.image} alt={details.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.04]" />
                        <div className="absolute left-4 top-4"><Badge tone="pass">Open for demo orders</Badge></div>
                        <div className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1.5 text-xs font-bold shadow-sm">★ {details.rating}</div>
                      </div>
                      <div className="p-5 sm:p-6">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-[#858991]">{details.category}</p>
                            <h3 className="mt-1 truncate font-[Manrope] text-xl font-extrabold tracking-[-0.025em]">{store.title}</h3>
                          </div>
                          <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#e9e7e3] text-lg transition group-hover:border-[#4f8cff] group-hover:bg-[#4f8cff] group-hover:text-white">↗</span>
                        </div>
                        <p className="mt-2 min-h-[2.75rem] break-words text-sm leading-[1.4rem] text-[#74777b]">{store.notes}</p>
                        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[#f0eeea] pt-4 text-xs font-semibold text-[#62676d]">
                          <span className="inline-flex items-center gap-1.5"><span className="text-[#4f8cff]">◷</span>{details.minutes}</span>
                          <span className="inline-flex items-center gap-1.5"><span className="text-[#4f8cff]">⌁</span>{details.fee}</span>
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}

          {!query && stores.length > 3 && (
            <div className="mt-7 text-center">
              <Button variant="outline" onClick={() => setShowAll((current) => !current)}>{showAll ? "Show featured stores" : `See all ${stores.length} stores`}</Button>
            </div>
          )}
        </section>

        <section className="mt-12 grid gap-4 rounded-[1.7rem] border border-[#e9e7e2] bg-white p-5 sm:grid-cols-3 sm:p-7">
          <div className="flex gap-3 p-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-lg">⌕</span>
            <div><h3 className="font-[Manrope] text-sm font-extrabold">Pick your shop</h3><p className="mt-1 text-xs leading-5 text-[#777b80]">Browse a local store’s demo selection.</p></div>
          </div>
          <div className="flex gap-3 p-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-lg">＋</span>
            <div><h3 className="font-[Manrope] text-sm font-extrabold">Build your basket</h3><p className="mt-1 text-xs leading-5 text-[#777b80]">Adjust quantities before checkout.</p></div>
          </div>
          <div className="flex gap-3 p-2">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#edf3ff] text-lg">↗</span>
            <div><h3 className="font-[Manrope] text-sm font-extrabold">Choose what works</h3><p className="mt-1 text-xs leading-5 text-[#777b80]">Select simulated delivery or pickup.</p></div>
          </div>
        </section>
        <p className="mx-auto mt-7 max-w-3xl text-center text-xs leading-5 text-[#858991]">Demo only: store availability, assortment, timing, fees, taxes, and prices are illustrative and have not been verified as live service data. Your saved basket and demo activity stay in this browser only; clearing browser data removes them. This research demo does not establish viable prices or order-level margins.</p>
      </section>

      <footer className="border-t border-[#ece9e4] bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-3 px-5 py-6 text-xs text-[#858991] sm:flex-row sm:items-center sm:justify-between sm:px-8">
          <span>© Local Grocery · A neighborhood shopping demo</span>
          <div className="flex items-center gap-5"><Link className="hover:text-[#1a1d21]" href="/orders">Demo orders</Link><Link className="hover:text-[#1a1d21]" href="/cart">Your basket</Link></div>
        </div>
      </footer>
    </main>
  );
}
