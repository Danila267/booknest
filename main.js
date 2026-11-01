import { describeError, searchBooks } from "./api/client.js";
import { getBooks } from "./data/books.js";
import {
  FILTER_DEFAULTS,
  addWish,
  applyAvailability,
  isWished,
  mergeWishlist,
  removeWish,
  sanitizeFilters,
  sortBooks,
} from "./lib/books.js";
import { render } from "./ui/render.js";

const FILTERS_KEY = "booknest.filters";
const WISHLIST_KEY = "booknest.wishlist";
const SEARCH_DELAY = 350;

let searchTimer = 0;
let activeController = null;

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
  state.books = [];
  state.total = 0;
  state.status = "success";
  state.errorMessage = "";
}

function isAbort(error) {
  return Boolean(error) && typeof error === "object" && error.name === "AbortError";
}

function scheduleLoad() {
  window.clearTimeout(searchTimer);
  searchTimer = window.setTimeout(() => {
    void loadCatalog();
  }, SEARCH_DELAY);
}

function loadNow() {
  window.clearTimeout(searchTimer);
  void loadCatalog();
}

async function loadCatalog() {
  const requestId = state.requestId + 1;
  state.requestId = requestId;
  if (activeController) activeController.abort();
  activeController = new AbortController();
  const signal = activeController.signal;
  const filters = state.filters;

  try {
    const result = await searchBooks(filters, { signal });
    if (state.requestId !== requestId || signal.aborted) return;

    // Open Library rejects sort=author.
    const sorted = filters.sort === "author-asc" ? sortBooks(result.items, "author-asc") : result.items.slice();
    // Open Library does not provide a trustworthy shelf-availability query.
    const visible = applyAvailability(sorted, filters.availableOnly);
    state.books = visible;
    state.total = result.total;
    state.status = visible.length === 0 ? "empty" : "success";
    state.errorMessage = "";
    state.wishlist = mergeWishlist(state.wishlist, visible);
    persist();
    render(state);
  } catch (error) {
    if (isAbort(error) || signal.aborted || state.requestId !== requestId) return;
    state.books = [];
    state.status = "error";
    state.errorMessage = describeError(error);
    render(state);
  }
}

function persist() {
  try {
    localStorage.setItem(FILTERS_KEY, JSON.stringify(state.filters));
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(state.wishlist));
  } catch {
    // A failed write keeps the in-memory state.
  }
}

function bookById(id) {
  return state.books.find((book) => book.id === id) ?? getBooks().find((book) => book.id === id);
}

function toggleWish(id) {
  if (isWished(state.wishlist, id)) {
    state.wishlist = removeWish(state.wishlist, id);
  } else {
    const book = bookById(id);
    if (!book) return;
    state.wishlist = addWish(state.wishlist, book);
  }
  persist();
  render(state);
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
    persist();
    render(state);
    return;
  }

  const wish = target.closest("[data-wish]");
  if (wish instanceof HTMLElement && wish.dataset.wish) {
    toggleWish(wish.dataset.wish);
    return;
  }

  if (target.closest("[data-action='retry']")) {
    loadNow();
    return;
  }

  if (target.closest("[data-action='page-prev']") || target.closest("[data-action='page-next']")) {
    state.filters = { ...state.filters, page: 1 };
    loadNow();
  }
}

function handleSubmit(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "filters-form") return;
  event.preventDefault();
  readForm(form);
  loadNow();
}

function handleReset(event) {
  const form = event.target;
  if (!(form instanceof HTMLFormElement) || form.id !== "filters-form") return;
  event.preventDefault();
  state.filters = { ...FILTER_DEFAULTS };
  loadNow();
}

function handleInput(event) {
  const target = event.target;
  if (!(target instanceof HTMLInputElement) || target.name !== "search") return;
  state.filters = sanitizeFilters({ ...state.filters, search: target.value, page: 1 });
  persist();
  scheduleLoad();
}

function handleChange(event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.id !== "genre" && target.id !== "sort" && target.id !== "available") return;
  const form = target.closest("form");
  if (!(form instanceof HTMLFormElement)) return;
  readForm(form);
  loadNow();
}

loadStoredState();
loadNow();

for (const type of ["click", "submit", "reset", "input", "change"]) {
  document.addEventListener(type, onDocument);
}
