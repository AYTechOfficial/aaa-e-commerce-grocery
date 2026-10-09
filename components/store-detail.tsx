"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import GroceryNav from "@/components/grocery-nav";
import { products } from "@/lib/grocery-data";

const stores: Record<string, { name: string; area: string; description: string }> = {
  "northside-market": { name: "Northside Market", area: "Northside", description: "A friendly neighborhood market with fresh produce and everyday favorites." },
  "garden-district-grocer": { name: "Garden District Grocer", area: "Garden District", description: "Seasonal picks and pantry essentials for the Garden District." },
  "riverside-foods": { name: "Riverside Foods", area: "Riverside", description: "A local sample shop offering a little something for every table." },
};

export default function StoreDetail() {
  const params = useParams<{ storeId: string }>();
  const store = stores[params.storeId];
  return <main className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><GroceryNav/><div className="mx-auto max-w-7xl px-5 py-10">{store ? <><Link href="/" className="font-semibold text-[#287a4b]">← All groceries</Link><p className="mt-7 text-sm font-bold uppercase tracking-wider text-[#287a4b]">{store.area} · Demo store</p><h1 className="mt-2 font-serif text-4xl font-bold">{store.name}</h1><p className="mt-3 max-w-2xl leading-7 text-[#617367]">{store.description} Store inventory and prices are simulated.</p><h2 className="mt-9 font-serif text-2xl font-bold">Shop the sample selection</h2><div className="mt-5 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">{products.slice(0, 16).map((product) => <Link key={product.slug} href={`/product/${product.slug}`} className="overflow-hidden rounded-2xl border border-[#e9e2d7] bg-white transition hover:shadow-lg"><img src={product.image} alt={product.name} className="h-40 w-full object-cover"/><div className="p-4"><p className="text-xs font-semibold text-[#287a4b]">{product.category}</p><h3 className="mt-1 font-semibold">{product.name}</h3><p className="mt-2 text-sm text-[#617367]">{product.unit}</p></div></Link>)}</div></> : <div className="py-20 text-center"><h1 className="font-serif text-3xl font-bold">We couldn’t find that store</h1><p className="mt-3 text-[#617367]">Choose a sample store or browse the full catalog.</p><Link href="/" className="mt-5 inline-block rounded-full bg-[#287a4b] px-6 py-3 font-semibold text-white">Browse groceries</Link></div>}</div></main>;
}
