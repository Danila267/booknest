import { getBooks } from "./data/books.js";
import {
  FILTER_DEFAULTS,
  filterBooks,
  mergeWishlist,
  sanitizeFilters,
  sortBooks,
} from "./lib/books.js";

const FILTERS_KEY = "booknest.filters";
const WISHLIST_KEY = "booknest.wishlist";

const state = {
  books: [],
  total: 0,
  filters: { ...FILTER_DEFAULTS },
  wishlist: [],
  status: "success",
  errorMessage: "",
  requestId: 0,
};

function readStored(key) {
  try {
    const raw = localStorage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

function sanitizeWishlist(value) {
  if (!Array.isArray(value)) return [];

  const items = [];
  for (const item of value) {
    if (item === null || typeof item !== "object") continue;
    if (typeof item.id !== "string" || item.id.length === 0) continue;
    items.push({
      id: item.id,
      title: typeof item.title === "string" ? item.title : "",
      author: typeof item.author === "string" ? item.author : "",
      cover: typeof item.cover === "string" ? item.cover : "",
    });
  }
  return items;
}

function loadStoredState() {
  const filters = sanitizeFilters(readStored(FILTERS_KEY));
  state.filters = { ...filters, page: 1 };
  state.wishlist = mergeWishlist(sanitizeWishlist(readStored(WISHLIST_KEY)), getBooks());
  const visible = sortBooks(filterBooks(getBooks(), state.filters), state.filters.sort);
  state.books = visible;
  state.total = visible.length;
  state.status = visible.length === 0 ? "empty" : "success";
  state.errorMessage = "";
}

loadStoredState();
