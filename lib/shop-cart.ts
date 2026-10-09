export type CartItem = {
  slug: string;
  quantity: number;
};

export const CART_STORAGE_KEY = "aaa-grocery-cart";
export const CART_UPDATED_EVENT = "aaa-cart-updated";

export function notifyCartUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(CART_UPDATED_EVENT));
  }
}
