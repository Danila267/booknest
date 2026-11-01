import { getBooks } from "./data/books.js";
import {
  FILTER_DEFAULTS,
  addWish,
  filterBooks,
  isWished,
  mergeWishlist,
  removeWish,
  sanitizeFilters,
  sortBooks,
} from "./lib/books.js";
import { render } from "./ui/render.js";

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

function publish() {
  const visible = sortBooks(filterBooks(getBooks(), state.filters), state.filters.sort);
  state.books = visible;
  state.total = visible.length;
  state.filters = { ...state.filters, page: 1 };
  state.status = visible.length === 0 ? "empty" : "success";
  state.errorMessage = "";
  state.wishlist = mergeWishlist(state.wishlist, getBooks());
  persist();
  render(state);
}

function persist() {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(state.filters));
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
  } catch {
    // A failed write keeps the in-memory state.
  }
}

function toggleWish(id) {
  if (isWished(state.wishlist, id)) {
    state.wishlist = removeWish(state.wishlist, id);
    publish();
    return;
  }

  const book = getBooks().find((item) => item.id === id);
  if (!book) return;
  state.wishlist = addWish(state.wishlist, book);
  publish();
}

function readForm(form) {
  const data = new FormData(form);
  state.filters = sanitizeFilters({
    search: String(data.get("search") ?? ""),
    genre: String(data.get("genre") ?? "all"),
    sort: String(data.get("sort") ?? "title-asc"),
    availableOnly: data.get("available") === "1",
    page: 1,
  });
}

function onDocument(event) {
  if (event.type === "click") handleClick(event);
  if (event.type === "submit") handleSubmit(event);
  if (event.type === "reset") handleReset(event);
  if (event.type === "input") handleInput(event);
  if (event.type === "change") handleChange(event);
}

function handleClick(event) {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;

  const remove = target.closest("[data-action='remove-wish']");
  if (remove instanceof HTMLElement && remove.dataset.wish) {
    state.wishlist = removeWish(state.wishlist, remove.dataset.wish);
    publish();
    return;
  }

  const wish = target.closest("[data-wish]");
  if (wish instanceof HTMLElement && wish.dataset.wish) {
    toggleWish(wish.dataset.wish);
    return;
  }

  if (target.closest("[data-action='retry']")) {
    publish();
    return;
  }

  if (target.closest("[data-action='page-prev']") || target.closest("[data-action='page-next']")) {
    state.filters = { ...state.filters, page: 1 };
    publish();
  }
}

function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "filters-form") return;
  event.preventDefault();
  readForm(form);
  publish();
}

function handleReset(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "filters-form") return;
  event.preventDefault();
  state.filters = { ...FILTER_DEFAULTS };
  publish();
}

function handleInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.name !== "search") return;
  state.filters = sanitizeFilters({ ...state.filters, search: target.value, page: 1 });
  publish();
}

function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id !== "genre" && target.id !== "sort" && target.id !== "available") return;
  const form = target.closest("form");
  if (!(form instanceof HTMLFormElement)) return;
  readForm(form);
  publish();
}

loadStoredState();
publish();

for (const type of ["click", "submit", "reset", "input", "change"]) {
  document.addEventListener(type, onDocument);
}
