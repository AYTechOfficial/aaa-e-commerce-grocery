"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import { Badge, Button, Card } from "@/components/ui";
import { readLocal, writeLocal } from "@/lib/persist";

const CART_KEY = "local-grocery-cart";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  available: boolean;
  image: string;
};

type Store = {
  id: string;
  name: string;
  description: string;
  delivery: boolean;
  pickup: boolean;
  products: Product[];
};

type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  storeId: string;
  storeName: string;
};

const stores: Store[] = [
  {
    id: "northside-market",
    name: "Northside Market",
    description: "Everyday produce, pantry staples, and neighborhood favorites.",
    delivery: true,
    pickup: true,
    products: [
      { id: "apples", name: "Crisp Gala Apples", category: "Produce", price: 3.49, available: true, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?auto=format&fit=crop&w=700&q=80" },
      { id: "greens", name: "Baby Spinach", category: "Produce", price: 3.99, available: true, image: "https://images.unsplash.com/photo-1576045057995-568f588f82fb?auto=format&fit=crop&w=700&q=80" },
      { id: "carrots", name: "Rainbow Carrots", category: "Produce", price: 2.79, available: true, image: "https://images.unsplash.com/photo-1445282768818-728615cc910a?auto=format&fit=crop&w=700&q=80" },
      { id: "sourdough", name: "Country Sourdough", category: "Bakery", price: 5.5, available: true, image: "https://images.unsplash.com/photo-1585478259715-876acc5be8eb?auto=format&fit=crop&w=700&q=80" },
      { id: "eggs", name: "Free-Range Eggs", category: "Dairy & eggs", price: 6.25, available: true, image: "https://images.unsplash.com/photo-1506976785307-8732e854ad03?auto=format&fit=crop&w=700&q=80" },
      { id: "tomatoes", name: "Heirloom Tomatoes", category: "Produce", price: 4.75, available: false, image: "https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=700&q=80" },
      { id: "oats", name: "Rolled Oats", category: "Pantry", price: 4.25, available: true, image: "https://images.unsplash.com/photo-1517673132405-a56a62b18caf?auto=format&fit=crop&w=700&q=80" },
      { id: "milk", name: "Whole Milk", category: "Dairy & eggs", price: 4.1, available: true, image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=700&q=80" },
    ],
  },
  {
    id: "little-green-grocer",
    name: "Little Green Grocer",
    description: "Seasonal fruit, fresh greens, and thoughtfully chosen basics.",
    delivery: true,
    pickup: false,
    products: [
      { id: "pears", name: "Ripe Bartlett Pears", category: "Produce", price: 4.25, available: true, image: "https://images.unsplash.com/photo-1514756331096-242fdeb70d4a?auto=format&fit=crop&w=700&q=80" },
      { id: "lettuce", name: "Little Gem Lettuce", category: "Produce", price: 3.5, available: true, image: "https://images.unsplash.com/photo-1556801712-76c8eb07bbc9?auto=format&fit=crop&w=700&q=80" },
      { id: "lemons", name: "Sunny Lemons", category: "Produce", price: 2.99, available: true, image: "https://images.unsplash.com/photo-1519623469871-5c1e8137bf8b?auto=format&fit=crop&w=700&q=80" },
      { id: "granola", name: "Maple House Granola", category: "Pantry", price: 7.25, available: true, image: "https://images.unsplash.com/photo-1517093157656-b9ecಾಬ3e46?auto=format&fit=crop&w=700&q=80" },
    ],
  },
];

const money = (amount: number) => `$${amount.toFixed(2)}`;

export default function StorePage() {
  const params = useParams<{ storeId: string }>();
  const storeId = Array.isArray(params.storeId) ? params.storeId[0] : params.storeId;
  const store = stores.find((item) => item.id === storeId);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [notice, setNotice] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    setCart(readLocal<CartItem[]>(CART_KEY, []));
  }, []);

  const categories = useMemo(() => ["All", ...Array.from(new Set(store?.products.map((product) => product.category) ?? []))], [store]);
  const products = store?.products.filter((product) => category === "All" || product.category === category) ?? [];
  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  function addProduct(product: Product) {
    if (!store || !product.available) return;
    const current = readLocal<CartItem[]>(CART_KEY, []);
    const otherStore = current.length > 0 && current.some((item) => item.storeId !== store.id);
    if (otherStore && !window.confirm(`Your basket is from ${current[0].storeName}. Replace it with a basket from ${store.name}?`)) return;
    const base = otherStore ? [] : current;
    const existing = base.find((item) => item.productId === product.id);
    const next = existing
      ? base.map((item) => item.productId === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...base, { id: product.id, productId: product.id, name: product.name, price: product.price, quantity: 1, storeId: store.id, storeName: store.name }];
    writeLocal(CART_KEY, next);
    setCart(next);
    setNotice(`${product.name} added to your basket.`);
    window.setTimeout(() => setNotice(""), 2800);
  }

  if (!store) {
    return (
      <main className="min-h-screen bg-[#F7F5EF] px-5 py-16 text-[#20352B]">
        <div className="mx-auto max-w-xl rounded-2xl border border-[#E5E8DF] bg-white p-8 text-center">
          <h1 className="text-3xl font-semibold">We couldn’t find that store</h1>
          <p className="mt-3 text-[#6B756E]">Choose one of the stores available in the Northside demo area.</p>
          <Link href="/" className="mt-6 inline-flex"><Button>Browse all stores</Button></Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F5EF] text-[#20352B]">
      <header className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-5 sm:px-8">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold"><span className="text-2xl text-[#2F7657]">❧</span>Local Grocery</Link>
        <div className="hidden text-sm text-[#6B756E] sm:block">Northside demo area</div>
        <nav className="flex items-center gap-4 text-sm font-semibold"><Link className="hover:text-[#2F7657]" href="/">Stores</Link><Link className="hover:text-[#2F7657]" href="/cart">Cart <span className="rounded-full bg-[#E6F1E7] px-2 py-1">{cartCount}</span></Link><Link className="hidden hover:text-[#2F7657] sm:inline" href="/orders">Orders</Link></nav>
      </header>
      <div className="mx-auto max-w-7xl px-5 pb-16 sm:px-8">
        <Link href="/" className="inline-flex items-center gap-2 py-5 text-sm font-semibold text-[#2F7657] hover:underline">← All stores</Link>
        <section className="relative overflow-hidden rounded-[24px] bg-gradient-to-br from-[#E6F1E7] via-[#f4f2e8] to-[#d3e7d4] px-7 py-9 sm:px-11 sm:py-12">
          <span className="pointer-events-none absolute -right-8 -top-16 text-[220px] leading-none text-[#2F7657]/10" aria-hidden="true">❧</span>
          <div className="relative max-w-2xl">
            <Badge tone="brand">Northside demo area</Badge>
            <h1 className="mt-4 text-4xl font-semibold sm:text-5xl" style={{ fontFamily: "Fraunces, Georgia, serif" }}>{store.name}</h1>
            <p className="mt-3 text-[#526157]">{store.description}</p>
            <div className="mt-5 flex flex-wrap gap-2 text-sm font-semibold">
              <span className={`rounded-full px-3 py-2 ${store.delivery ? "bg-white text-[#2F7657]" : "bg-[#ecece7] text-[#858B85]"}`}>Delivery {store.delivery ? "available" : "unavailable"}</span>
              <span className={`rounded-full px-3 py-2 ${store.pickup ? "bg-white text-[#2F7657]" : "bg-[#ecece7] text-[#858B85]"}`}>Pickup {store.pickup ? "available" : "unavailable"}</span>
            </div>
          </div>
        </section>
        <div className="mt-10 flex flex-wrap items-end justify-between gap-4">
          <div><p className="text-sm font-bold uppercase tracking-[0.14em] text-[#2F7657]">Shop the shelves</p><h2 className="mt-1 text-3xl font-semibold" style={{ fontFamily: "Fraunces, Georgia, serif" }}>Market favorites</h2></div>
          <Link href="/cart"><Button variant="secondary">View basket ({cartCount})</Button></Link>
        </div>
        <div className="mt-5 flex flex-wrap gap-2" aria-label="Filter products by category">
          {categories.map((item) => <button key={item} type="button" onClick={() => setCategory(item)} className={`min-h-10 rounded-full px-4 text-sm font-semibold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#2F7657] ${category === item ? "bg-[#2F7657] text-white" : "border border-[#E5E8DF] bg-white text-[#526157] hover:bg-[#E6F1E7]"}`}>{item}</button>)}
        </div>
        {notice && <p role="status" className="mt-5 rounded-xl border border-[#b7d4ba] bg-[#E6F1E7] px-4 py-3 text-sm font-semibold text-[#245a3e]">{notice} <Link className="ml-2 underline" href="/cart">View basket</Link></p>}
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden p-0">
              <div className="relative aspect-[4/3] bg-gradient-to-br from-[#e4eddc] to-[#bacfb8]">
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(0deg, rgba(32,53,43,.08), transparent), url("${product.image}")` }} />
                {!product.available && <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#6B756E]">Currently unavailable</span>}
              </div>
              <div className="p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-[#2F7657]">{product.category}</p>
                <h3 className="mt-1 min-h-12 font-bold">{product.name}</h3>
                <div className="mt-3 flex items-center justify-between gap-3">
                  <span className="text-lg font-bold">{money(product.price)}</span>
                  <Button size="sm" disabled={!product.available} onClick={() => addProduct(product)}>{product.available ? "Add" : "Unavailable"}</Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        <p className="mt-8 text-center text-sm text-[#6B756E]">Prices and availability are part of this simulated local demo.</p>
      </div>
    </main>
  );
}
