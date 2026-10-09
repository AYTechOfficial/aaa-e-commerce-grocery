"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { readLocal, writeLocal } from "@/lib/persist";

type RecordItem = { id: string; title: string; notes: string; createdAt: string };
type ProductDetailEntry = {
  id: string;
  title: string;
  notes: string;
  price: number | null;
  unit: string;
  category: string;
  description: string;
  ingredients: string;
  tags: string[];
};
type CartLineEntry = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  unit: string;
  image?: string;
};

const CATALOG_KEY = "lastmile:aaa-e-commerce-grocery:Product (static sample catalog)";
const CART_KEY = "lastmile:aaa-e-commerce-grocery:cart";

function slugify(value: string) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function recordToProduct(record: RecordItem): ProductDetailEntry {
  const notes = record.notes || "";
  let parsed: Record<string, unknown> = {};
  try {
    const value = JSON.parse(notes);
    if (value && typeof value === "object" && !Array.isArray(value)) parsed = value as Record<string, unknown>;
  } catch {
    // Catalog notes may be plain text instead of structured data.
  }
  const pick = (...keys: string[]) => {
    for (const key of keys) {
      const value = parsed[key];
      if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
  };
  const rawPrice = parsed.price ?? parsed.amount ?? parsed.cost;
  const priceMatch = notes.match(/(?:\$\s*)(\d+(?:\.\d{1,2})?)/) || notes.match(/(?:price\s*:?\s*)(\d+(?:\.\d{1,2})?)/i);
  const price = typeof rawPrice === "number" ? rawPrice : typeof rawPrice === "string" && Number.isFinite(Number(rawPrice)) ? Number(rawPrice) : priceMatch ? Number(priceMatch[1]) : null;
  const unit = pick("unit", "size", "packSize", "weight") || notes.match(/\b(\d+(?:\.\d+)?\s?(?:oz|lb|lbs|g|kg|ct|count|pack|fl oz|each))\b/i)?.[1] || "See package";
  const category = pick("category", "aisle", "department") || "Grocery";
  const description = pick("description", "details", "subtitle") || notes.replace(/\$\s*\d+(?:\.\d{1,2})?/g, "").trim() || "A carefully selected everyday grocery favorite.";
  const ingredients = pick("ingredients", "ingredientList");
  const tagValue = parsed.tags ?? parsed.dietaryTags ?? parsed.dietary;
  const tags = Array.isArray(tagValue) ? tagValue.filter((tag): tag is string => typeof tag === "string") : typeof tagValue === "string" ? tagValue.split(/[,|]/).map((tag) => tag.trim()).filter(Boolean) : [];
  return { id: record.id, title: record.title, notes, price, unit, category, description, ingredients, tags };
}

export default function ProductDetailsPage() {
  const params = useParams<{ slug: string }>();
  const routeSlug = Array.isArray(params?.slug) ? params.slug[0] : params?.slug || "";
  const [catalog, setCatalog] = useState<RecordItem[]>([]);
  const [cart, setCart] = useState<CartLineEntry[]>([]);
  const [ready, setReady] = useState(false);
  const [added, setAdded] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedCatalog = readLocal<RecordItem[]>(CATALOG_KEY, []);
    setCatalog(Array.isArray(storedCatalog) ? storedCatalog.filter((item) => item && typeof item.title === "string") : []);
    const storedCart = readLocal<CartLineEntry[]>(CART_KEY, []);
    setCart(Array.isArray(storedCart) ? storedCart : []);
    setReady(true);
  }, []);

  const product = useMemo(() => {
    const found = catalog.find((item) => slugify(item.title) === routeSlug || item.id === routeSlug);
    return found ? recordToProduct(found) : null;
  }, [catalog, routeSlug]);
  const cartCount = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const imageUrl = "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85";

  function addToCart() {
    if (!product || product.price === null) {
      setError("This sample item does not have a listed price, so it cannot be added to the cart.");
      return;
    }
    try {
      const existing = readLocal<CartLineEntry[]>(CART_KEY, []);
      const next = Array.isArray(existing) ? [...existing] : [];
      const index = next.findIndex((item) => item.id === product.id);
      if (index >= 0) next[index] = { ...next[index], quantity: (Number(next[index].quantity) || 0) + 1 };
      else next.push({ id: product.id, title: product.title, price: product.price, quantity: 1, unit: product.unit, image: imageUrl });
      writeLocal(CART_KEY, next);
      setCart(next);
      setAdded(true);
      setError("");
    } catch {
      setError("We couldn't save this item to your cart. Please try again.");
    }
  }

  return (
    <main className="min-h-screen bg-[#faf9f7] text-[#1a1d21]">
      <div className="border-b border-[#ece9e4] bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2.5 font-semibold tracking-tight" aria-label="AAA Grocery home">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#4f8cff] text-lg text-white">✳</span>
            <span className="text-lg">AAA <span className="font-normal text-[#777a7e]">Grocery</span></span>
          </Link>
          <div className="flex items-center gap-5">
            <span className="hidden text-xs font-medium text-[#777a7e] sm:block">A fresh take on everyday shopping</span>
            <Link href="/cart" className="inline-flex items-center gap-2 rounded-full border border-[#e9e7e3] px-4 py-2 text-sm font-semibold transition hover:border-[#4f8cff]">
              Cart <span className="flex min-w-5 items-center justify-center rounded-full bg-[#4f8cff] px-1.5 py-0.5 text-[11px] text-white">{ready ? cartCount : 0}</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-7 sm:px-8 sm:py-10">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-[#61656a] transition hover:text-[#1a1d21]"><span aria-hidden="true">←</span> Back to shopping</Link>
        {!ready ? (
          <div className="mt-8 animate-pulse rounded-[28px] bg-white p-8 text-sm text-[#777a7e]">Loading product details…</div>
        ) : product ? (
          <div className="mt-6 grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
            <div className="relative min-h-[340px] overflow-hidden rounded-[28px] bg-[#e9eee8] sm:min-h-[520px]">
              <img src={imageUrl} alt="A colorful selection of fresh market groceries" className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute left-5 top-5 rounded-full border border-white/70 bg-white/90 px-3.5 py-2 text-xs font-semibold tracking-wide text-[#343a40] shadow-sm">SAMPLE CATALOG</div>
              <div className="absolute bottom-5 left-5 max-w-[80%] rounded-2xl bg-white/90 px-4 py-3 shadow-sm backdrop-blur-sm">
                <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#4f8cff]">Good things, simply</p>
                <p className="mt-1 text-sm font-medium text-[#343a40]">Thoughtful picks for your everyday table.</p>
              </div>
            </div>

            <section className="flex flex-col rounded-[28px] bg-white p-6 shadow-[0_12px_40px_rgba(26,29,33,0.045)] sm:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[#eef4ff] px-3 py-1.5 text-xs font-semibold text-[#356fce]">{product.category}</span>
                <span className="rounded-full bg-[#f4f2ee] px-3 py-1.5 text-xs font-medium text-[#696d70]">Demo item</span>
              </div>
              <h1 className="mt-5 break-words text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-[42px]">{product.title}</h1>
              <p className="mt-4 max-w-xl break-words text-base leading-7 text-[#686c70]">{product.description}</p>

              <div className="mt-7 flex items-end justify-between border-b border-[#eeece8] pb-6">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#85888b]">Sample price</p>
                  <p className="mt-1 text-3xl font-semibold tracking-tight">{product.price === null ? "Price unavailable" : `$${product.price.toFixed(2)}`}<span className="ml-2 text-sm font-normal text-[#85888b]">/ {product.unit}</span></p>
                </div>
                <span className="mb-1 text-2xl text-[#4f8cff]" aria-hidden="true">✳</span>
              </div>

              {product.tags.length > 0 && <div className="border-b border-[#eeece8] py-5"><h2 className="text-sm font-semibold">Dietary & product details</h2><div className="mt-3 flex flex-wrap gap-2">{product.tags.map((tag, index) => <span key={`${tag}-${index}`} className="rounded-full border border-[#e7e5e0] px-3 py-1.5 text-xs font-medium text-[#606469]">{tag}</span>)}</div></div>}
              {product.ingredients && <div className="border-b border-[#eeece8] py-5"><h2 className="text-sm font-semibold">Ingredients</h2><p className="mt-2 break-words text-sm leading-6 text-[#686c70]">{product.ingredients}</p></div>}

              <div className="mt-auto pt-7">
                <button onClick={addToCart} disabled={product.price === null} className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#1a1d21] px-6 py-4 text-sm font-semibold text-white transition hover:bg-[#343a40] disabled:cursor-not-allowed disabled:bg-[#a6a8aa]">
                  <span aria-hidden="true">＋</span> Add to cart
                </button>
                {added && <p role="status" className="mt-3 text-center text-sm font-medium text-[#287a53]">Added to your cart. Cart quantity: {cartCount}.</p>}
                {error && <p role="alert" className="mt-3 rounded-xl bg-[#fff0ed] px-4 py-3 text-sm text-[#a33e2d]">{error}</p>}
                <p className="mt-4 text-center text-xs leading-5 text-[#85888b]">Demo information only. Prices, product details, availability, and fulfillment are not connected to a live store.</p>
              </div>
            </section>
          </div>
        ) : (
          <section className="mx-auto mt-8 max-w-2xl rounded-[28px] bg-white px-7 py-12 text-center shadow-sm">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eef4ff] text-2xl text-[#4f8cff]">⌕</div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight">We couldn’t find that sample item</h1>
            <p className="mx-auto mt-3 max-w-lg break-words text-sm leading-6 text-[#686c70]">This product may not be part of the catalog saved in this browser. Catalog data is for demonstration only and can be unavailable if browser storage has been cleared.</p>
            <Link href="/" className="mt-6 inline-flex rounded-xl bg-[#1a1d21] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#343a40]">Back to shopping</Link>
          </section>
        )}
        <p className="mt-8 text-center text-[11px] leading-5 text-[#929497]">AAA Grocery is a client-side demo. No inventory, payment, delivery, or retailer systems are connected.</p>
      </div>
    </main>
  );
}
