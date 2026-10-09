"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Badge, Button, EmptyState } from "@/components/ui";
import { CATEGORIES, CART_STORAGE_KEY, PRODUCTS, type CartLine, type GroceryCategory, cartCount, readCart } from "@/lib/grocery";

export default function HomePage() {
  const [category, setCategory] = useState<GroceryCategory | "All">("All");
  const [query, setQuery] = useState("");
  const [count, setCount] = useState(0);

  useEffect(() => {
    setCount(cartCount(readCart()));
    const refresh = () => setCount(cartCount(readCart()));
    window.addEventListener("storage", refresh);
    window.addEventListener("focus", refresh);
    return () => {
      window.removeEventListener("storage", refresh);
      window.removeEventListener("focus", refresh);
    };
  }, []);

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    return PRODUCTS.filter((product) => (category === "All" || product.category === category) && (!search || product.name.toLowerCase().includes(search)));
  }, [category, query]);

  return (
    <main style={{ minHeight: "100vh", background: "#FAF7F0", color: "#183B2B" }}>
      <div style={{ background: "#183B2B", color: "white", textAlign: "center", padding: "9px 16px", fontSize: 13 }}>A neighborhood grocery demo — prices, inventory, and fulfillment are simulated.</div>
      <header style={{ maxWidth: 1200, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 18, flexWrap: "wrap" }}>
        <Link href="/" style={{ color: "#183B2B", textDecoration: "none", fontFamily: "Georgia, serif", fontSize: 27, fontWeight: 700 }}>AAA Grocery</Link>
        <nav style={{ display: "flex", alignItems: "center", gap: 20, fontSize: 14 }}>
          <a href="#shop" style={{ color: "#183B2B" }}>Shop</a><a href="#categories" style={{ color: "#183B2B" }}>Categories</a><Link href="/orders" style={{ color: "#183B2B" }}>Orders</Link>
          <Link href="/cart" style={{ color: "white", background: "#287A4B", borderRadius: 24, padding: "10px 16px", textDecoration: "none", fontWeight: 700 }}>Cart ({count})</Link>
        </nav>
      </header>

      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "12px 24px 38px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", overflow: "hidden", borderRadius: 24, background: "#E5F2E8", minHeight: 350 }}>
          <div style={{ padding: "clamp(28px, 6vw, 64px)", display: "flex", flexDirection: "column", justifyContent: "center" }}>
            <Badge tone="pass">GOOD FOOD, CLOSE TO HOME</Badge>
            <h1 style={{ fontFamily: "Georgia, serif", fontSize: "clamp(38px, 5vw, 62px)", lineHeight: 1.05, margin: "20px 0 14px", maxWidth: 540 }}>Fresh picks for your everyday table.</h1>
            <p style={{ fontSize: 17, lineHeight: 1.6, maxWidth: 470, margin: "0 0 24px" }}>Discover market favorites and build a basket at your own pace. This is a locally saved shopping demo, not a real order service.</p>
            <Link href="#shop" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "fit-content", background: "#287A4B", color: "white", padding: "13px 20px", borderRadius: 10, textDecoration: "none", fontWeight: 700 }}>Shop groceries</Link>
          </div>
          <div style={{ minHeight: 280, background: "#d4e8d7" }}>
            <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1200&q=85" alt="Fresh colorful produce at a neighborhood market" style={{ width: "100%", height: "100%", minHeight: 300, objectFit: "cover" }} />
          </div>
        </div>
      </section>

      <section id="shop" style={{ maxWidth: 1200, margin: "0 auto", padding: "14px 24px 64px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "end", gap: 20, flexWrap: "wrap", marginBottom: 24 }}>
          <div><p style={{ color: "#287A4B", fontWeight: 700, letterSpacing: 1, fontSize: 12, margin: "0 0 8px" }}>THE MARKET</p><h2 style={{ fontFamily: "Georgia, serif", fontSize: 36, margin: 0 }}>Shop the catalog</h2><p style={{ color: "#526358", marginBottom: 0 }}>Browse 64 sample favorites across the departments.</p></div>
          <label style={{ display: "flex", gap: 9, alignItems: "center", border: "1px solid #d9dfd7", background: "white", borderRadius: 10, padding: "0 13px", minWidth: "min(100%, 310px)" }}><span aria-hidden="true">⌕</span><input aria-label="Search products" placeholder="Search products" value={query} onChange={(event) => setQuery(event.target.value)} style={{ border: 0, outline: 0, background: "transparent", padding: "13px 0", width: "100%", color: "#183B2B" }} /></label>
        </div>
        <div id="categories" style={{ display: "flex", gap: 9, flexWrap: "wrap", marginBottom: 26 }}>
          {(["All", ...CATEGORIES] as const).map((item) => <Button key={item} size="sm" variant={category === item ? "primary" : "outline"} onClick={() => setCategory(item)} style={category === item ? { background: "#287A4B", color: "white" } : { background: "white", color: "#183B2B", borderColor: "#d9dfd7" }}>{item}</Button>)}
        </div>
        {visibleProducts.length === 0 ? <EmptyState title="No products found" message={query ? `No matches for “${query}”. Try another search or clear it.` : "There are no products in this category."} action={<Button variant="secondary" onClick={() => { setQuery(""); setCategory("All"); }}>Show all products</Button>} /> : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(205px, 1fr))", gap: 18 }}>
            {visibleProducts.map((product) => <article key={product.slug} style={{ background: "white", border: "1px solid #e9e6de", borderRadius: 14, overflow: "hidden", boxShadow: "0 4px 14px rgba(24,59,43,.04)" }}>
              <Link href={`/product/${product.slug}`} style={{ color: "inherit", textDecoration: "none" }}>
                <div style={{ height: 172, background: "#E5F2E8" }}><img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} /></div>
                <div style={{ padding: "14px 15px 16px" }}><p style={{ color: "#287A4B", fontSize: 11, fontWeight: 700, margin: "0 0 7px" }}>{product.category.toUpperCase()}</p><h3 style={{ fontSize: 16, margin: "0 0 8px", minHeight: 40 }}>{product.name}</h3><div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8 }}><strong style={{ color: "#E66A45", fontSize: 17 }}>${product.price.toFixed(2)}</strong><span style={{ color: "#68766c", fontSize: 12 }}>{product.unit}</span></div></div>
              </Link>
            </article>)}
          </div>
        )}
        <p style={{ textAlign: "center", color: "#68766c", fontSize: 13, marginTop: 28 }}>All products, prices, availability, and fulfillment options shown are simulated demo data.</p>
      </section>
    </main>
  );
}
