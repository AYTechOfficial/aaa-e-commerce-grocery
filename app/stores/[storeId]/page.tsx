"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, Card } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  available: boolean;
};

type Store = {
  id: string;
  name: string;
  description: string;
  delivery: boolean;
  pickup: boolean;
  products: Product[];
};

type CartItem = Product & { quantity: number };
type CartState = { storeId: string; storeName: string; items: CartItem[] };

const stores: Store[] = [
  {
    id: "maple-main",
    name: "Maple & Main Market",
    description: "Everyday pantry favorites and fresh neighborhood produce.",
    delivery: true,
    pickup: true,
    products: [
      { id: "crisp-apples", name: "Crisp apples", category: "Produce", price: 4.49, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "baby-spinach", name: "Baby spinach", category: "Produce", price: 3.29, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "sourdough", name: "Country sourdough", category: "Bakery", price: 5.5, image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "whole-milk", name: "Whole milk", category: "Dairy & eggs", price: 4.19, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "free-range-eggs", name: "Free-range eggs", category: "Dairy & eggs", price: 6.25, image: "https://images.unsplash.com/photo-1518569656558-1f25e69d93d7?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "strawberries", name: "Local strawberries", category: "Produce", price: 5.99, image: "https://images.unsplash.com/photo- strawberries?auto=format&fit=crop&w=700&q=80", available: false },
    ],
  },
  {
    id: "northside-co-op",
    name: "Northside Co-op",
    description: "Seasonal finds, thoughtful staples, and local favorites.",
    delivery: true,
    pickup: false,
    products: [
      { id: "market-carrots", name: "Rainbow carrots", category: "Produce", price: 3.75, image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "avocados", name: "Ripe avocados", category: "Produce", price: 4.99, image: "https://images.unsplash.com/photo-1523049673857-eb18f1d7b578?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "granola", name: "Maple oat granola", category: "Pantry", price: 7.25, image: "https://images.unsplash.com/photo-1517093157656-b9eccef91cb1?auto=format&fit=crop&w=700&q=80", available: true },
      { id: "cheddar", name: "Aged cheddar", category: "Dairy & eggs", price: 6.5, image: "https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?auto=format&fit=crop&w=700&q=80", available: true },
    ],
  },
];

const cartKey = "local-grocery-cart";
const emptyCart: CartState = { storeId: "", storeName: "", items: [] };

function loadCart(): CartState {
  const saved = readLocal<CartState>(cartKey, emptyCart);
  if (!saved || !Array.isArray(saved.items)) return emptyCart;
  return { storeId: saved.storeId || "", storeName: saved.storeName || "", items: saved.items };
}

function money(value: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}

export default function StorePage() {
  const params = useParams<{ storeId: string }>();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
  const store = useMemo(() => stores.find((item) => item.id === storeId), [storeId]);
  const [cart, setCart] = useState<CartState>(emptyCart);
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setCart(loadCart());
  }, []);

  const categories = useMemo(() => ["All", ...new Set((store?.products ?? []).map((product) => product.category))], [store]);
  const visibleProducts = (store?.products ?? []).filter((product) => category === "All" || product.category === category);
  const cartCount = cart.items.reduce((total, item) => total + item.quantity, 0);

  function addProduct(product: Product) {
    if (!store || !product.available) return;
    let current = loadCart();
    if (current.items.length && current.storeId !== store.id) {
      const confirmed = window.confirm(`Your basket has items from ${current.storeName}. Replace it with a basket from ${store.name}?`);
      if (!confirmed) return;
      current = { storeId: store.id, storeName: store.name, items: [] };
    }
    const existing = current.items.find((item) => item.id === product.id);
    const next: CartState = {
      storeId: store.id,
      storeName: store.name,
      items: existing
        ? current.items.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
        : [...current.items, { ...product, quantity: 1 }],
    };
    writeLocal(cartKey, next);
    setCart(next);
    setNotice(`${product.name} added to your basket`);
    window.setTimeout(() => setNotice(""), 2600);
  }

  if (!store) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-5 py-16 text-[#20352B]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#E5E8DF] bg-white p-8 text-center shadow-sm">
          <h1 className="font-serif text-3xl">We couldn’t find that store</h1>
          <p className="mt-3 text-[#6B756E]">This demo store may not be part of the Northside launch area.</p>
          <Link href="/" className="mt-6 inline-flex rounded-full bg-[#2F7657] px-5 py-3 font-semibold text-white hover:bg-[#255f46]">Browse stores</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#20352B]">
      <header className="border-b border-[#E5E8DF] bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <Link href="/" className="text-xl font-bold tracking-tight">🌿 Local Grocery</Link>
          <nav className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/" className="hover:text-[#2F7657]">Stores</Link>
            <Link href="/cart" className="hover:text-[#2F7657]">Cart <span className="ml-1 rounded-full bg-[#E6F1E7] px-2 py-1">{cartCount}</span></Link>
            <Link href="/orders" className="hover:text-[#2F7657]">Orders</Link>
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-5 py-8 md:py-12">
        <Link href="/" className="text-sm font-semibold text-[#2F7657] hover:underline">← All stores</Link>
        <section className="mt-5 rounded-3xl border border-[#E5E8DF] bg-[radial-gradient(ellipse_at_top_right,_#E6F1E7,_#FFFFFF_65%)] p-7 md:p-10">
          <p className="text-sm font-bold uppercase tracking-[0.16em] text-[#2F7657]">Northside demo area · simulated availability</p>
          <h1 className="mt-3 font-serif text-4xl md:text-5xl">{store.name}</h1>
          <p className="mt-3 max-w-2xl text-[#6B756E]">{store.description}</p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Badge tone={store.delivery ? "pass" : "neutral"}>{store.delivery ? "Delivery available" : "Delivery unavailable"}</Badge>
            <Badge tone={store.pickup ? "pass" : "neutral"}>{store.pickup ? "Pickup available" : "Pickup unavailable"}</Badge>
            <Badge tone="warn">Demo catalog</Badge>
          </div>
        </section>

        <div className="mt-9 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <h2 className="font-serif text-3xl">Shop the catalog</h2>
            <p className="mt-2 text-sm text-[#6B756E]">Availability and prices are simulated for this demo.</p>
          </div>
          <div className="flex flex-wrap gap-2" aria-label="Filter by category">
            {categories.map((item) => (
              <button key={item} type="button" onClick={() => setCategory(item)} className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${category === item ? "border-[#2F7657] bg-[#2F7657] text-white" : "border-[#E5E8DF] bg-white text-[#20352B] hover:border-[#2F7657]"}`}>
                {item}
              </button>
            ))}
          </div>
        </div>

        {notice && <p role="status" className="mt-5 rounded-xl border border-[#b9d5be] bg-[#E6F1E7] px-4 py-3 font-semibold text-[#20352B]">{notice} · <Link href="/cart" className="underline">View basket</Link></p>}

        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden rounded-2xl border border-[#E5E8DF] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
              <div className="relative aspect-[16/10] overflow-hidden bg-[radial-gradient(circle_at_25%_30%,_#E6F1E7,_#d0e3d2_55%,_#f4e8c8)]">
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" onError={(event) => { event.currentTarget.style.display = "none"; }} />
                {!product.available && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#6B756E]">Currently unavailable</span>}
              </div>
              <div className="p-5">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#6B756E]">{product.category}</p>
                <div className="mt-2 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-bold">{product.name}</h3>
                  <span className="shrink-0 font-bold">{money(product.price)}</span>
                </div>
                <Button variant={product.available ? "primary" : "secondary"} size="md" onClick={() => addProduct(product)} disabled={!product.available} className="mt-5 w-full">
                  {product.available ? "Add to basket" : "Unavailable"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
        <div className="mt-9 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#E6F1E7] p-5 sm:flex-row sm:items-center">
          <div><p className="font-bold">Your basket has {cartCount} {cartCount === 1 ? "item" : "items"}</p><p className="mt-1 text-sm text-[#6B756E]">You can review quantities and fulfillment before placing a simulated order.</p></div>
          <Link href="/cart" className="rounded-full bg-[#2F7657] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#255f46]">Go to basket</Link>
        </div>
      </div>
    </main>
  );
}
