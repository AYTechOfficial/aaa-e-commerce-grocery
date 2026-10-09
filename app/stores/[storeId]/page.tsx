import Link from "next/link";
import ShopNav from "@/components/shop-nav";
import { categories, products } from "@/lib/grocery";

const stores: Record<string, { name: string; neighborhood: string; description: string }> = {
  "northside-market": { name: "Northside Market", neighborhood: "Northside neighborhood", description: "A friendly neighborhood market with fresh produce, everyday pantry favorites, and more." },
  "garden-district-grocer": { name: "Garden District Grocer", neighborhood: "Garden District", description: "A sample local grocer featuring market-day favorites and household essentials." },
};

export default function StorePage({ params }: { params: { storeId: string } }) {
  const store = stores[params.storeId];
  return <div className="min-h-screen bg-[#faf7f0] text-[#183b2b]"><ShopNav /><main className="mx-auto max-w-6xl px-5 py-10"><Link href="/" className="text-sm font-semibold text-[#287a4b] hover:underline">← Back to shopping</Link>
    {!store ? <section className="mt-8 rounded-2xl bg-white p-10 text-center"><h1 className="font-serif text-3xl">We couldn’t find that store</h1><p className="mt-3 text-[#68766b]">Explore the sample catalog instead.</p><Link href="/" className="mt-5 inline-block font-semibold text-[#287a4b]">Browse groceries →</Link></section> : <><header className="mt-7 rounded-3xl bg-[#e5f2e8] p-8 sm:p-12"><p className="text-sm font-semibold uppercase tracking-wider text-[#287a4b]">{store.neighborhood} · Demo store</p><h1 className="mt-3 font-serif text-4xl sm:text-5xl">{store.name}</h1><p className="mt-4 max-w-2xl leading-7 text-[#526a58]">{store.description} Catalog, prices, inventory, and fulfillment are demo data.</p></header><div className="mt-10"><h2 className="font-serif text-3xl">Shop the shelves</h2>{categories.map((category) => <section key={category} className="mt-7"><h3 className="mb-3 text-lg font-semibold">{category}</h3><div className="grid grid-cols-2 gap-4 sm:grid-cols-4">{products.filter((product) => product.category === category).slice(0, 4).map((product) => <Link key={product.slug} href={`/product/${product.slug}`} className="overflow-hidden rounded-2xl border border-[#ebe6dc] bg-white transition hover:shadow-md"><img src={product.image} alt={product.name} className="aspect-[4/3] w-full object-cover" /><div className="p-4"><p className="font-semibold">{product.name}</p><p className="mt-2 text-sm text-[#287a4b]">${product.price.toFixed(2)} · {product.unit}</p></div></Link>)}</div></section>)}</div></>}
  </main></div>;
}
