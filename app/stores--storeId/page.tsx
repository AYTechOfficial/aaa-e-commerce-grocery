"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Badge, Button, Card, EmptyState } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };
type Product = {
  id: string;
  title: string;
  price: number;
  unit: string;
  category: string;
  description: string;
  image: string;
  storeId: string;
  storeName: string;
};
type CartItem = Product & { quantity: number };

const STORAGE_KEY = "lastmile:aaa-e-commerce-grocery:Store (seeded client-side data)";
const CART_ID = "local-grocery-cart";

const seededCatalog: Omit<Product, "storeId" | "storeName">[] = [
  { id: "market-strawberries", title: "Sweet strawberries", price: 5.49, unit: "1 lb · California", category: "Produce", description: "Bright, juicy berries picked at peak ripeness.", image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?auto=format&fit=crop&w=900&q=85" },
  { id: "market-avocados", title: "Ripe Hass avocados", price: 1.79, unit: "each · ready to enjoy", category: "Produce", description: "Creamy, just-right avocados for toast, salads, and more.", image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=900&q=85" },
  { id: "market-sourdough", title: "Country sourdough", price: 6.25, unit: "1 loaf · baked today", category: "Bakery", description: "A crisp, flour-dusted crust with a tender, tangy center.", image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=900&q=85" },
  { id: "market-eggs", title: "Free-range brown eggs", price: 6.99, unit: "dozen · large", category: "Dairy & eggs", description: "Farm-fresh eggs from pasture-raised hens.", image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=900&q=85" },
  { id: "market-milk", title: "Organic whole milk", price: 5.29, unit: "half gallon · local dairy", category: "Dairy & eggs", description: "Creamy organic milk from a nearby family dairy.", image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=900&q=85" },
  { id: "market-tomatoes", title: "Heirloom tomatoes", price: 4.99, unit: "1 lb · assorted", category: "Produce", description: "Colorful, vine-ripened tomatoes with a sweet garden flavor.", image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=85" },
  { id: "market-pasta", title: "Bronze-cut rigatoni", price: 4.49, unit: "16 oz · Italian", category: "Pantry", description: "Slow-dried pasta with plenty of texture for holding sauce.", image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?auto=format&fit=crop&w=900&q=85" },
  { id: "market-olive-oil", title: "Extra virgin olive oil", price: 14.99, unit: "500 ml · cold pressed", category: "Pantry", description: "A fruity, balanced finishing oil from a small producer.", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=900&q=85" },
  { id: "market-greens", title: "Baby spinach", price: 3.99, unit: "5 oz · washed", category: "Produce", description: "Tender organic leaves, ready for salads and quick sautés.", image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=900&q=85" },
  { id: "market-cheese", title: "Aged cheddar", price: 7.49, unit: "8 oz · sharp", category: "Dairy & eggs", description: "Rich, sharp cheddar aged for a wonderfully crumbly bite.", image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=900&q=85" },
  { id: "market-oranges", title: "Navel oranges", price: 4.25, unit: "3 lb bag · sweet", category: "Produce", description: "Easy-peeling citrus with a bright, refreshing sweetness.", image: "https://images.unsplash.com/photo-1547514701-42782101795e?auto=format&fit=crop&w=900&q=85" },
  { id: "market-coffee", title: "House blend coffee", price: 13.5, unit: "12 oz · whole bean", category: "Pantry", description: "A smooth, chocolatey medium roast from a neighborhood roaster.", image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?auto=format&fit=crop&w=900&q=85" },
];

function parseNotes(notes: string): Record<string, unknown> {
  try {
    const parsed: unknown = JSON.parse(notes);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed as Record<string, unknown> : {};
  } catch {
    return {};
  }
}

function asText(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function asPrice(value: unknown, fallback: number): number {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : fallback;
}

function imageFor(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function productsFromRecord(record: RecordItem, storeId: string, storeName: string): Product[] {
  const data = parseNotes(record.notes);
  const candidates = [data.products, data.catalog, data.items].find(Array.isArray);
  if (!Array.isArray(candidates)) return [];
  return candidates.map((entry, index) => {
    const item = entry && typeof entry === "object" ? entry as Record<string, unknown> : {};
    return {
      id: asText(item.id, `${record.id}-product-${index}`),
      title: asText(item.title ?? item.name, "Market favorite"),
      price: asPrice(item.price ?? item.unitPrice, 0),
      unit: asText(item.unit ?? item.size, "each"),
      category: asText(item.category, "Market picks"),
      description: asText(item.description ?? item.notes, "A fresh pick from your neighborhood market."),
      image: imageFor(item.image ?? item.imageUrl, seededCatalog[index % seededCatalog.length].image),
      storeId,
      storeName,
    };
  });
}

function readCart(records: RecordItem[]): CartItem[] {
  const cartRecord = records.find((record) => record.id === CART_ID || /^(cart|basket)$/i.test(record.title));
  if (!cartRecord) return [];
  const data = parseNotes(cartRecord.notes);
  const rawItems = Array.isArray(data.items) ? data.items : Array.isArray(data.cart) ? data.cart : [];
  return rawItems.flatMap((entry) => {
    if (!entry || typeof entry !== "object") return [];
    const item = entry as Record<string, unknown>;
    const quantity = Math.floor(Number(item.quantity));
    if (!Number.isFinite(quantity) || quantity < 1) return [];
    return [{
      id: asText(item.id ?? item.productId, "saved-item"),
      title: asText(item.title ?? item.name, "Grocery item"),
      price: asPrice(item.price ?? item.unitPrice, 0),
      unit: asText(item.unit, "each"),
      category: asText(item.category, "Market picks"),
      description: asText(item.description, ""),
      image: imageFor(item.image, seededCatalog[0].image),
      storeId: asText(item.storeId, ""),
      storeName: asText(item.storeName, "Neighborhood market"),
      quantity,
    }];
  });
}

export default function StorePage() {
  const params = useParams<{ storeId: string }>();
  const storeId = decodeURIComponent(Array.isArray(params?.storeId) ? params.storeId[0] : params?.storeId ?? "market");
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeCategory, setActiveCategory] = useState("All items");
  const [query, setQuery] = useState("");
  const [notice, setNotice] = useState("");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const stored = readLocal<RecordItem[]>(STORAGE_KEY, []);
    const safeRecords = Array.isArray(stored) ? stored.filter((row): row is RecordItem => !!row && typeof row.id === "string" && typeof row.title === "string" && typeof row.notes === "string") : [];
    setRecords(safeRecords);
    setCart(readCart(safeRecords));
    setLoaded(true);
  }, []);

  const storeRecord = records.find((record) => record.id === storeId);
  const storeData = storeRecord ? parseNotes(storeRecord.notes) : {};
  const storeName = storeRecord ? storeRecord.title : storeId.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Neighborhood market";
  const availability = asText(storeData.availability ?? storeData.status, "Available today");
  const customProducts = storeRecord ? productsFromRecord(storeRecord, storeId, storeName) : [];
  const recordProducts = records.flatMap((record) => {
    if (record.id === storeId) return [];
    const data = parseNotes(record.notes);
    const belongs = [data.storeId, data.store_id, data.store].some((value) => value === storeId || value === storeName);
    const isProduct = /product|item|grocery/i.test(String(data.type ?? data.kind ?? ""));
    if (!belongs || (!isProduct && data.price === undefined && data.unitPrice === undefined)) return [];
    return [{
      id: record.id,
      title: record.title,
      price: asPrice(data.price ?? data.unitPrice, 0),
      unit: asText(data.unit ?? data.size, "each"),
      category: asText(data.category, "Market picks"),
      description: asText(data.description, record.notes),
      image: imageFor(data.image ?? data.imageUrl, seededCatalog[0].image),
      storeId,
      storeName,
    }];
  });
  const products: Product[] = customProducts.length ? customProducts : recordProducts.length ? recordProducts : seededCatalog.map((product) => ({ ...product, storeId, storeName }));
  const categories = ["All items", ...Array.from(new Set(products.map((product) => product.category)))];
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = activeCategory === "All items" || product.category === activeCategory;
    const normalizedQuery = query.trim().toLowerCase();
    return matchesCategory && (!normalizedQuery || `${product.title} ${product.category} ${product.description}`.toLowerCase().includes(normalizedQuery));
  }), [products, activeCategory, query]);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  function saveCart(nextCart: CartItem[]) {
    setCart(nextCart);
    setNotice("");
    try {
      const current = readLocal<RecordItem[]>(STORAGE_KEY, []);
      const safe = Array.isArray(current) ? current : records;
      const withoutCart = safe.filter((record) => record.id !== CART_ID && !/^(cart|basket)$/i.test(record.title));
      const cartRecord: RecordItem = {
        id: CART_ID,
        title: "Basket",
        notes: JSON.stringify({ kind: "cart", items: nextCart }),
        createdAt: new Date().toISOString(),
      };
      const updated = [...withoutCart, cartRecord];
      writeLocal(STORAGE_KEY, updated);
      setRecords(updated);
    } catch {
      setNotice("Your basket could not be saved. Please try again; this page is still usable.");
    }
  }

  function addProduct(product: Product) {
    const existing = cart.find((item) => item.id === product.id && item.storeId === product.storeId);
    const next = existing
      ? cart.map((item) => item.id === product.id && item.storeId === product.storeId ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { ...product, quantity: 1 }];
    saveCart(next);
    setNotice(`${product.title} added to your basket.`);
  }

  function changeQuantity(item: CartItem, delta: number) {
    const next = cart.flatMap((current) => {
      if (current.id !== item.id || current.storeId !== item.storeId) return [current];
      const quantity = current.quantity + delta;
      return quantity > 0 ? [{ ...current, quantity }] : [];
    });
    saveCart(next);
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Fraunces:opsz,wght@9..144,600;9..144,700&display=swap" rel="stylesheet" />
      <header className="border-b border-black/5 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5" aria-label="Local Grocery home">
            <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#4f8cff] text-xl text-white shadow-[0_5px_14px_rgba(79,140,255,0.25)]">✳</span>
            <span className="font-[family-name:var(--font-dm-sans)] text-lg font-bold tracking-tight">local<span className="text-[#4f8cff]">.</span></span>
          </Link>
          <div className="hidden items-center gap-2 text-sm text-[#696d72] sm:flex"><span className="text-[#4f8cff]">⌖</span> Delivering to <span className="font-semibold text-[#1a1d21]">your neighborhood</span></div>
          <Link href="/cart" className="relative rounded-full border border-black/10 px-4 py-2 text-sm font-semibold transition hover:border-[#4f8cff] hover:text-[#4f8cff]">
            Basket <span className="ml-1 text-[#4f8cff]">{cartCount}</span>
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 pb-16 pt-6 sm:px-8">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[#777b80]" aria-label="Breadcrumb"><Link className="hover:text-[#1a1d21]" href="/">Stores</Link><span>/</span><span className="max-w-[60vw] truncate font-medium text-[#1a1d21]">{storeName}</span></nav>
        <section className="relative mb-8 overflow-hidden rounded-[28px] bg-[#1a1d21] px-6 py-8 text-white sm:px-10 sm:py-10">
          <div className="absolute -right-16 -top-28 h-80 w-80 rounded-full border-[44px] border-[#4f8cff]/20" />
          <div className="absolute -bottom-24 right-40 h-48 w-48 rounded-full bg-[#4f8cff]/20 blur-3xl" />
          <div className="relative max-w-2xl">
            <div className="mb-4 flex flex-wrap items-center gap-2"><Badge tone="pass">{availability}</Badge><Badge tone="neutral">Demo store</Badge></div>
            <h1 className="break-words font-[family-name:var(--font-fraunces)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">Good things, <span className="text-[#8db5ff]">close by.</span></h1>
            <p className="mt-3 max-w-xl break-words text-sm leading-6 text-white/70 sm:text-base">Shop {storeName}’s neighborhood picks. Fresh finds, pantry staples, and little things that make dinner better.</p>
            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80"><span>✦ Curated local selection</span><span>◷ Choose delivery or pickup at checkout</span></div>
          </div>
        </section>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_330px]">
          <section className="min-w-0">
            <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div><p className="mb-1 text-xs font-bold uppercase tracking-[0.18em] text-[#4f8cff]">From the neighborhood</p><h2 className="font-[family-name:var(--font-fraunces)] text-3xl font-semibold tracking-tight">Shop the shelves</h2></div>
              <label className="relative block w-full sm:max-w-xs"><span className="sr-only">Search products</span><span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[#8a8d91]">⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search this store" className="w-full rounded-full border border-black/10 bg-white py-3 pl-11 pr-4 text-sm outline-none transition placeholder:text-[#999da1] focus:border-[#4f8cff] focus:ring-4 focus:ring-[#4f8cff]/10" /></label>
            </div>
            <div className="mb-6 flex gap-2 overflow-x-auto pb-1" aria-label="Product categories">{categories.map((category) => <button key={category} onClick={() => setActiveCategory(category)} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${activeCategory === category ? "bg-[#1a1d21] text-white" : "bg-white text-[#62666b] ring-1 ring-black/5 hover:bg-[#f0efed]"}`}>{category}</button>)}</div>
            {!loaded ? <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{[0, 1, 2].map((i) => <div key={i} className="h-72 animate-pulse rounded-3xl bg-white" />)}</div> : filteredProducts.length === 0 ? <EmptyState title="No finds in this aisle" message="Try another search or choose a different category to keep browsing." className="rounded-3xl bg-white" /> : <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">{filteredProducts.map((product, index) => {
              const inCart = cart.find((item) => item.id === product.id && item.storeId === product.storeId);
              return <Card key={`${product.storeId}-${product.id}`} className="group overflow-hidden rounded-3xl border border-black/[0.04] bg-white p-0 shadow-[0_6px_24px_rgba(24,30,38,0.035)] transition duration-200 hover:-translate-y-1 hover:shadow-[0_14px_35px_rgba(24,30,38,0.09)]">
                <div className="relative h-44 overflow-hidden bg-[#f0efed]"><img src={product.image} alt={product.title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /><span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-[#44494e] backdrop-blur">{product.category}</span>{index === 0 && <span className="absolute right-3 top-3 rounded-full bg-[#4f8cff] px-3 py-1 text-[11px] font-bold text-white">Neighborhood pick</span>}</div>
                <div className="p-4"><h3 className="break-words font-semibold leading-snug">{product.title}</h3><p className="mt-1 text-xs text-[#85898e]">{product.unit}</p><p className="mt-2 line-clamp-2 break-words text-sm leading-5 text-[#656a70]">{product.description}</p><div className="mt-4 flex items-center justify-between gap-3"><span className="text-lg font-bold">${product.price.toFixed(2)}</span><Button variant="primary" size="sm" onClick={() => addProduct(product)}>{inCart ? `Add more · ${inCart.quantity}` : "Add to basket"}</Button></div></div>
              </Card>;
            })}</div>}
          </section>

          <aside className="lg:sticky lg:top-6 lg:self-start">
            <Card className="overflow-hidden rounded-[26px] border border-black/[0.04] bg-white p-0 shadow-[0_8px_30px_rgba(24,30,38,0.05)]">
              <div className="flex items-center justify-between border-b border-black/[0.06] px-5 py-4"><div><p className="text-xs font-bold uppercase tracking-[0.15em] text-[#4f8cff]">Your basket</p><h2 className="mt-1 font-[family-name:var(--font-fraunces)] text-2xl font-semibold">The good stuff</h2></div><span className="flex h-10 min-w-10 items-center justify-center rounded-full bg-[#edf3ff] px-2 text-sm font-bold text-[#3977e8]">{cartCount}</span></div>
              <div className="max-h-[380px] divide-y divide-black/[0.06] overflow-y-auto px-5">
                {cart.length === 0 ? <div className="py-8 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f4f6fa] text-2xl">🧺</div><p className="font-semibold">Your basket is waiting</p><p className="mt-1 text-sm leading-5 text-[#777b80]">Add something lovely from the shelves to get started.</p></div> : cart.map((item) => <div key={`${item.storeId}-${item.id}`} className="flex gap-3 py-4"><img src={item.image} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" /><div className="min-w-0 flex-1"><p className="break-words text-sm font-semibold leading-5">{item.title}</p><p className="mt-1 text-xs text-[#85898e]">${item.price.toFixed(2)} · {item.storeName}</p><div className="mt-2 inline-flex items-center rounded-full border border-black/10"><button aria-label={`Remove one ${item.title}`} onClick={() => changeQuantity(item, -1)} className="h-7 w-8 text-sm hover:text-[#4f8cff]">−</button><span className="min-w-6 text-center text-xs font-bold">{item.quantity}</span><button aria-label={`Add one ${item.title}`} onClick={() => changeQuantity(item, 1)} className="h-7 w-8 text-sm hover:text-[#4f8cff]">+</button></div></div><span className="shrink-0 pt-0.5 text-sm font-bold">${(item.price * item.quantity).toFixed(2)}</span></div>)}
              </div>
              {cart.length > 0 && <div className="border-t border-black/[0.06] bg-[#fbfbfa] px-5 py-4"><div className="mb-4 flex justify-between text-sm"><span className="text-[#6f7378]">Item subtotal</span><span className="font-bold">${subtotal.toFixed(2)}</span></div><Link href="/cart" className="flex w-full items-center justify-center rounded-full bg-[#4f8cff] px-5 py-3 text-sm font-bold text-white shadow-[0_6px_14px_rgba(79,140,255,0.24)] transition hover:bg-[#3977e8]">Review basket <span className="ml-auto">→</span></Link><p className="mt-3 text-center text-[11px] leading-4 text-[#8a8d91]">Demo prices and availability. Checkout shows any demo fees and taxes.</p></div>}
            </Card>
            <div className="mt-4 rounded-2xl border border-[#e7ecf5] bg-[#f2f6ff] p-4"><p className="text-xs font-bold uppercase tracking-[0.12em] text-[#3977e8]">A note about this demo</p><p className="mt-2 break-words text-xs leading-5 text-[#626d7e]">Catalog, availability, and prices are examples—not a live service or verified market prices. Basket data is saved only in this browser and does not sync across devices.</p></div>
            {notice && <p role="status" className="mt-3 break-words rounded-xl bg-white px-4 py-3 text-sm text-[#3977e8] shadow-sm">{notice}</p>}
          </aside>
        </div>
      </div>
    </main>
  );
}
