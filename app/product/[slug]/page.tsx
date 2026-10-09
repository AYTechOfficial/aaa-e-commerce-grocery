"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button, Badge } from "@/components/ui";
import { addToCart, getCart, getCartCount, getProduct, type CartLine } from "@/lib/grocery";

const money = (amount: number) => `$${amount.toFixed(2)}`;

export default function ProductPage() {
  const params = useParams<{ slug: string }>();
  const product = getProduct(params.slug);
  const [cart, setCart] = useState<CartLine[]>([]);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    setCart(getCart());
  }, []);

  if (!product) {
    return (
      <main className="min-h-screen bg-[#FAF7F0] px-5 py-16 text-[#183B2B]">
        <div className="mx-auto max-w-3xl rounded-2xl border border-[#e5e0d5] bg-white p-8 text-center shadow-sm">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#287A4B]">AAA Grocery</p>
          <h1 className="mt-4 font-serif text-4xl">We couldn’t find that product</h1>
          <p className="mt-3 text-[#526456]">It may have moved. Browse our sample catalog to find something fresh.</p>
          <Link href="/" className="mt-7 inline-flex rounded-lg bg-[#287A4B] px-5 py-3 font-semibold text-white transition hover:bg-[#20623b]">Back to shopping</Link>
        </div>
      </main>
    );
  }

  function handleAdd() {
    setCart(addToCart(product.slug));
    setAdded(true);
  }

  return (
    <main className="min-h-screen bg-[#FAF7F0] px-4 py-6 text-[#183B2B] sm:px-6 sm:py-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-8 flex items-center justify-between gap-4">
          <Link href="/" className="font-serif text-2xl font-bold tracking-tight">AAA Grocery</Link>
          <Link href="/cart" className="rounded-full border border-[#dce5dc] bg-white px-4 py-2 text-sm font-semibold hover:border-[#287A4B]">Cart <span className="ml-1 text-[#287A4B]">{getCartCount(cart)}</span></Link>
        </nav>
        <Link href="/" className="mb-6 inline-flex text-sm font-semibold text-[#287A4B] hover:underline">← Back to shopping</Link>
        <section className="grid overflow-hidden rounded-3xl border border-[#e8e2d7] bg-white shadow-sm md:grid-cols-2">
          <div className="min-h-[300px] bg-[#E5F2E8] md:min-h-[520px]">
            <img src={product.image} alt={product.name} className="h-full min-h-[300px] w-full object-cover md:min-h-[520px]" />
          </div>
          <div className="flex flex-col items-start p-6 sm:p-10 lg:p-14">
            <Badge tone="brand">{product.category}</Badge>
            <h1 className="mt-5 font-serif text-4xl leading-tight sm:text-5xl">{product.name}</h1>
            <p className="mt-4 text-2xl font-bold text-[#E66A45]">{money(product.price)} <span className="text-sm font-normal text-[#657367]">{product.unit}</span></p>
            <p className="mt-6 max-w-lg leading-7 text-[#526456]">{product.description}</p>
            {product.tags.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{product.tags.map((tag) => <Badge key={tag}>{tag}</Badge>)}</div>}
            <div className="mt-auto w-full pt-9">
              <Button onClick={handleAdd} size="lg" className="w-full rounded-xl bg-[#287A4B] text-white hover:bg-[#20623b]">{added ? "Add one more" : "Add to cart"} · {money(product.price)}</Button>
              {added && <p role="status" className="mt-3 text-center text-sm font-medium text-[#287A4B]">Added to your demo cart. Cart now has {getCartCount(cart)} item{getCartCount(cart) === 1 ? "" : "s"}.</p>}
              <p className="mt-4 text-center text-xs leading-5 text-[#788278]">Sample product and price for demonstration only. No retailer order is placed.</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
