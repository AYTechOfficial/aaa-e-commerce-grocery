"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import ShopNav from "@/components/shop-nav";
import { Badge, Card } from "@/components/ui";
import { money, products, storeDetails } from "@/lib/shop";

export default function StorePage() {
  const params = useParams<{ storeId: string }>();
  const storeId = decodeURIComponent(params.storeId);
  const store = storeDetails[storeId];
  const items = products.filter((product) => product.storeIds.includes(storeId));
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><div className="mx-auto max-w-6xl px-5 py-10">
    <Link href="/" className="text-sm font-semibold text-[#287a4b]">← All stores</Link>
    {store ? <>
      <div className="mt-6 rounded-3xl bg-[#e5f2e8] px-6 py-9 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-[.16em] text-[#287a4b]">{store.neighborhood} · Demo store</p>
        <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">{store.name}</h1>
        <p className="mt-3 max-w-xl leading-7 text-[#496451]">{store.description} Sample prices and availability are simulated.</p>
      </div>
      <div className="mt-9 flex items-end justify-between gap-4"><div><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">Fresh picks</p><h2 className="mt-1 font-serif text-3xl">Shop the catalog</h2></div><span className="text-sm text-[#617367]">{items.length} sample items</span></div>
      <div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {items.map((product) => <Card key={product.id} className="overflow-hidden rounded-2xl border border-[#e9e2d7] bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <Link href={`/product/${product.slug}`} className="block"><div className="aspect-[4/3] overflow-hidden bg-[#e5f2e8]"><img src={product.image} alt={product.name} className="h-full w-full object-cover transition duration-300 hover:scale-105" /></div>
            <div className="p-4"><Badge tone="brand">{product.category}</Badge><h3 className="mt-2 font-semibold">{product.name}</h3><p className="mt-1 text-sm text-[#66766a]">{product.unit}</p><p className="mt-3 font-bold text-[#287a4b]">{money(product.price)}</p><span className="mt-3 inline-block text-sm font-semibold text-[#287a4b]">View details →</span></div>
          </Link>
        </Card>)}
      </div>
    </> : <div className="mt-12 rounded-2xl bg-white p-8"><h1 className="font-serif text-3xl">We couldn’t find that store</h1><p className="mt-2 text-[#617367]">Choose one of our neighborhood demo stores to browse its sample catalog.</p><Link href="/" className="mt-5 inline-block font-semibold text-[#287a4b]">Browse stores and shop →</Link></div>}
  </div></main>;
}
