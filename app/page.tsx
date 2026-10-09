"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import StoreHeader from "@/components/store-header";
import { categories, money, products, type GroceryCategory } from "@/lib/grocery";

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState<GroceryCategory | "All">("All");
  const [query, setQuery] = useState("");
  const visibleProducts = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return products.filter((product) =>
      (activeCategory === "All" || product.category === activeCategory) &&
      (!normalizedQuery || product.name.toLowerCase().includes(normalizedQuery)),
    );
  }, [activeCategory, query]);

  return (
    <main style={{ background: "#FAF7F0", minHeight: "100vh", color: "#183B2B" }}>
      <StoreHeader />
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "36px 24px 24px" }}>
        <div style={{ minHeight: 330, display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", overflow: "hidden", borderRadius: 22, background: "#E5F2E8" }}>
          <div style={{ padding: "clamp(28px, 6vw, 64px)", alignSelf: "center" }}>
            <p style={{ color: "#287A4B", fontSize: 13, fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase" }}>Good things, close to home</p>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px, 5vw, 60px)", lineHeight: 1.06, margin: "12px 0 18px", maxWidth: 540 }}>Fresh picks for your everyday table.</h1>
            <p style={{ color: "#456451", fontSize: 17, lineHeight: 1.65, maxWidth: 470 }}>Discover the neighborhood favorites you love, all in one easy-to-shop place.</p>
            <a href="#catalog" style={{ display: "inline-block", marginTop: 14, padding: "13px 22px", borderRadius: 999, background: "#287A4B", color: "#fff", textDecoration: "none", fontWeight: 700 }}>Shop groceries</a>
            <p style={{ color: "#62796a", fontSize: 12, marginTop: 16 }}>Sample catalog and prices · No real orders are placed</p>
          </div>
          <div role="img" aria-label="A colorful selection of fresh market produce" style={{ minHeight: 280, backgroundImage: "linear-gradient(90deg, rgba(229,242,232,.08), rgba(24,59,43,.05)), url(https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85)", backgroundPosition: "center", backgroundSize: "cover" }} />
        </div>
      </section>
      <section id="catalog" style={{ maxWidth: 1200, margin: "0 auto", padding: "24px 24px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap" }}>
          <div>
            <p style={{ color: "#287A4B", fontWeight: 700, fontSize: 13, textTransform: "uppercase", letterSpacing: ".1em" }}>From our shelves</p>
            <h2 style={{ fontFamily: "Georgia, serif", fontSize: 36, margin: "4px 0 0" }}>Shop the catalog</h2>
          </div>
          <label style={{ display: "block", width: "min(100%, 360px)" }}>
            <span style={{ display: "block", fontSize: 12, fontWeight: 700, marginBottom: 6 }}>Search products</span>
            <input value={query} onChange={(event) => setQuery(event.target.value)} type="search" placeholder="Try apples, bread, coffee…" style={{ boxSizing: "border-box", width: "100%", border: "1px solid #d9ded5", borderRadius: 10, padding: "12px 14px", background: "#fff", color: "#183B2B", fontSize: 15, outlineColor: "#287A4B" }} />
          </label>
        </div>
        <div aria-label="Filter by category" style={{ display: "flex", flexWrap: "wrap", gap: 8, margin: "24px 0" }}>
          {(["All", ...categories] as const).map((category) => {
            const selected = activeCategory === category;
            return <button key={category} type="button" onClick={() => setActiveCategory(category)} aria-pressed={selected} style={{ border: `1px solid ${selected ? "#287A4B" : "#d9ded5"}`, borderRadius: 999, padding: "9px 15px", background: selected ? "#287A4B" : "#fff", color: selected ? "#fff" : "#315640", cursor: "pointer", fontSize: 13, fontWeight: 600 }}>{category}</button>;
          })}
        </div>
        {visibleProducts.length ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 220px), 1fr))", gap: 18 }}>
            {visibleProducts.map((product) => (
              <article key={product.slug} style={{ overflow: "hidden", border: "1px solid #e9e5db", borderRadius: 15, background: "#fff", boxShadow: "0 3px 12px rgba(24,59,43,.04)" }}>
                <Link href={`/product/${product.slug}`} aria-label={`View ${product.name}`} style={{ color: "inherit", textDecoration: "none" }}>
                  <div style={{ height: 175, background: "#E5F2E8" }}><img src={product.image} alt={product.name} loading="lazy" style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                  <div style={{ padding: "15px 16px 17px" }}>
                    <p style={{ color: "#65806c", fontSize: 11, fontWeight: 700, letterSpacing: ".06em", textTransform: "uppercase", margin: "0 0 7px" }}>{product.category}</p>
                    <h3 style={{ fontSize: 16, lineHeight: 1.35, minHeight: 43, margin: 0 }}>{product.name}</h3>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginTop: 13, gap: 10 }}><strong style={{ color: "#183B2B", fontSize: 18 }}>{money(product.price)}</strong><span style={{ color: "#758278", fontSize: 12 }}>{product.unit}</span></div>
                    <span style={{ display: "block", color: "#287A4B", fontWeight: 700, fontSize: 13, marginTop: 14 }}>View product →</span>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", border: "1px dashed #bdcbbf", borderRadius: 16, padding: "48px 20px", background: "rgba(255,255,255,.55)" }}>
            <h3 style={{ fontFamily: "Georgia, serif", fontSize: 25, margin: "0 0 8px" }}>No groceries found</h3>
            <p style={{ color: "#62796a" }}>{query ? `We couldn’t find a match for “${query}”. Try another search or browse all products.` : "There are no products in this category right now."}</p>
            <button type="button" onClick={() => { setQuery(""); setActiveCategory("All"); }} style={{ border: 0, borderRadius: 999, padding: "11px 18px", background: "#287A4B", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Browse all products</button>
          </div>
        )}
      </section>
      <footer style={{ borderTop: "1px solid #e9e5db", padding: "22px 24px", textAlign: "center", color: "#718075", fontSize: 12 }}>AAA Grocery is a demo. Product availability, prices, fees, and fulfillment options are simulated.</footer>
    </main>
  );
}
