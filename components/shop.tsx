'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { readLocal, writeLocal } from '@/lib/persist';
import { CartLine, CART_KEY, findProduct, Product } from '@/lib/grocery';

export function getCart(): CartLine[] {
  return readLocal<CartLine[]>(CART_KEY, []);
}
export function saveCart(cart: CartLine[]) {
  writeLocal(CART_KEY, cart);
  if (typeof window !== 'undefined') window.dispatchEvent(new Event('aaa-cart-change'));
}
export function addToCart(slug: string, quantity = 1) {
  const cart = getCart();
  const found = cart.find((line) => line.slug === slug);
  saveCart(found ? cart.map((line) => line.slug === slug ? { ...line, quantity: line.quantity + quantity } : line) : [...cart, { slug, quantity }]);
}
export function cartCount(cart: CartLine[]) {
  return cart.reduce((total, line) => total + line.quantity, 0);
}
export function subtotalFor(cart: CartLine[]) {
  return cart.reduce((total, line) => total + (findProduct(line.slug)?.price ?? 0) * line.quantity, 0);
}
export function Header() {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const refresh = () => setCount(cartCount(getCart()));
    refresh();
    window.addEventListener('aaa-cart-change', refresh);
    window.addEventListener('storage', refresh);
    return () => {
      window.removeEventListener('aaa-cart-change', refresh);
      window.removeEventListener('storage', refresh);
    };
  }, []);
  return <>
    <div className='bg-[#183B2B] px-4 py-2 text-center text-xs font-medium tracking-wide text-white'>Sample catalog, prices, inventory, and fulfillment are demo data only.</div>
    <header className='sticky top-0 z-20 border-b border-[#e8e1d5] bg-[#FAF7F0]/95 backdrop-blur'>
      <nav className='mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6' aria-label='Main navigation'>
        <Link href='/' className='font-serif text-2xl font-bold text-[#183B2B]'>AAA Grocery</Link>
        <div className='flex items-center gap-3 text-sm font-medium text-[#183B2B] sm:gap-6'>
          <Link href='/#shop' className='hidden hover:text-[#287A4B] sm:block'>Shop</Link>
          <Link href='/help' className='hidden hover:text-[#287A4B] sm:block'>Help</Link>
          <Link href='/account' className='hidden hover:text-[#287A4B] sm:block'>Account</Link>
          <Link href='/cart' className='rounded-full bg-[#287A4B] px-4 py-2 text-white transition hover:bg-[#183B2B]' aria-label={`Cart, ${count} items`}>Cart <span className='ml-1 rounded-full bg-white/20 px-2 py-0.5'>{count}</span></Link>
        </div>
      </nav>
    </header>
  </>;
}

export function ProductCard({ product }: { product: Product }) {
  return <article className='overflow-hidden rounded-2xl border border-[#e8e1d5] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md'>
    <Link href={`/product/${product.slug}`} className='block focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#287A4B]'>
      <div className='aspect-[4/3] bg-[#E5F2E8]'><img src={product.image} alt={product.name} className='h-full w-full object-cover' /></div>
      <div className='p-4'>
        <p className='text-xs font-semibold uppercase tracking-wide text-[#287A4B]'>{product.category}</p>
        <h3 className='mt-1 min-h-12 text-base font-semibold text-[#183B2B]'>{product.name}</h3>
        <div className='mt-3 flex items-baseline justify-between gap-2'><span className='font-semibold text-[#183B2B]'>${product.price.toFixed(2)}</span><span className='text-sm text-[#6b746d]'>{product.unit}</span></div>
      </div>
    </Link>
  </article>;
}

export function PageShell({ children }: { children: React.ReactNode }) {
  return <div className='min-h-screen bg-[#FAF7F0] text-[#183B2B]'><Header />{children}<footer className='mt-16 border-t border-[#e8e1d5] px-4 py-8 text-center text-sm text-[#68736b]'>AAA Grocery is a shopping demo. No real orders or payments are placed. <Link className='underline' href='/help'>Learn more</Link></footer></div>;
}

export function Money({ value }: { value: number }) {
  return <span>${value.toFixed(2)}</span>;
}
