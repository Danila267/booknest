import type { Filters, WishItem } from "../types";
import { sanitizeFilters, sanitizeWishlist } from "./books";

const FILTERS_KEY = "booknest.filters";
const WISHLIST_KEY = "booknest.wishlist";

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw) as unknown;
  } catch {
    return undefined;
  }
}

function writeJson(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // A failed write keeps the in-memory state.
  }
}

export function readFilters(): Filters {
  return sanitizeFilters(readJson(FILTERS_KEY));
}

export function writeFilters(filters: Filters): void {
  writeJson(FILTERS_KEY, filters);
}

export function readWishlist(): WishItem[] {
  return sanitizeWishlist(readJson(WISHLIST_KEY));
}

export function writeWishlist(wishlist: WishItem[]): void {
  writeJson(WISHLIST_KEY, wishlist);
}
