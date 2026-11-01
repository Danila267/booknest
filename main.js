import { ApiError, describeError, getWork, searchBooks } from "./api/client.js";
import { getBooks } from "./data/books.js";
import {
  FILTER_DEFAULTS,
  addWish,
  applyAvailability,
  isWished,
  pageCount,
  mergeWishlist,
  removeWish,
  sanitizeFilters,
  sortBooks,
} from "./lib/books.js";
import { render } from "./ui/render.js";

const FILTERS_KEY = "booknest.filters";
const WISHLIST_KEY = "booknest.wishlist";
const SEARCH_DELAY = 350;
const FEATURED_BOOK_ID = "master-i-margarita";

let searchTimer = 0;
let activeController = null;
let detailRequest = null;

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
  state.filters = filters;
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

  state.status = "loading";
  state.errorMessage = "";
  state.books = [];
  render(state);

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
    state.wishlist = mergeWishlist(state.wishlist, result.items);
  } catch (error) {
    if (isAbort(error) || signal.aborted || state.requestId !== requestId) return;
    state.books = [];
    state.status = "error";
    state.errorMessage = describeError(error);
  } finally {
    if (state.requestId === requestId && !signal.aborted) {
      if (state.status === "loading") state.status = "error";
      persist();
      render(state);
    }
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
  showWishlist();
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
    showWishlist();
    return;
  }

  const wish = target.closest("[data-wish]");
  if (wish instanceof HTMLElement && wish.dataset.wish) {
    toggleWish(wish.dataset.wish);
    return;
  }

  if (target.closest("[data-action='retry']")) {
    if (document.body.dataset.page === "book") retryBook();
    else loadNow();
    return;
  }

  const previous = target.closest("[data-action='page-prev']");
  if (previous instanceof HTMLButtonElement && !previous.disabled) {
    state.filters = { ...state.filters, page: Math.max(1, state.filters.page - 1) };
    loadNow();
    return;
  }

  const next = target.closest("[data-action='page-next']");
  if (next instanceof HTMLButtonElement && !next.disabled && state.filters.page < pageCount(state.total)) {
    state.filters = { ...state.filters, page: state.filters.page + 1 };
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

function showWishlist() {
  persist();
  if (document.body.dataset.page === "book") syncBookWish();
  else render(state);
}

function syncBookWish() {
  const button = document.querySelector(".book .button--wish");
  if (!(button instanceof HTMLButtonElement) || !button.dataset.wish) return;
  const pressed = isWished(state.wishlist, button.dataset.wish);
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
  button.textContent = pressed ? "В списке" : "Хочу прочитать";
}

function startBook() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  if (!id || id === FEATURED_BOOK_ID) {
    syncBookWish();
    return;
  }
  if (id.startsWith("/works/")) {
    detailRequest = { id, kind: "work" };
    void loadWork(id);
    return;
  }
  detailRequest = { id, kind: "missing" };
  showBookFailure(describeError(new ApiError(404, "client")));
}

function retryBook() {
  if (!detailRequest) return;
  if (detailRequest.kind === "work") {
    void loadWork(detailRequest.id);
    return;
  }
  showBookFailure(describeError(new ApiError(404, "client")));
}

async function loadWork(id) {
  const requestId = state.requestId + 1;
  state.requestId = requestId;
  if (activeController) activeController.abort();
  activeController = new AbortController();
  const signal = activeController.signal;
  state.status = "loading";
  showBookLoading();

  try {
    const book = await getWork(id, { signal });
    if (state.requestId !== requestId || signal.aborted) return;
    state.books = [book];
    state.status = "success";
    state.errorMessage = "";
    paintBook(book);
  } catch (error) {
    if (isAbort(error) || signal.aborted || state.requestId !== requestId) return;
    state.books = [];
    state.status = "error";
    state.errorMessage = describeError(error);
    showBookFailure(state.errorMessage);
  } finally {
    if (state.requestId === requestId && !signal.aborted && state.status === "loading") {
      showBookFailure(describeError(new ApiError(500, "server")));
    }
  }
}

function showBookLoading() {
  const panel = document.querySelector(".book-error");
  if (panel instanceof HTMLElement) panel.hidden = true;
  const layout = document.querySelector(".layout-book");
  if (layout instanceof HTMLElement) layout.hidden = true;
  const title = document.querySelector(".book h1");
  if (title) title.textContent = "Загрузка карточки…";
}

function showBookFailure(message) {
  const layout = document.querySelector(".layout-book");
  if (layout instanceof HTMLElement) layout.hidden = true;
  const panel = ensureBookError();
  const messageNode = panel.querySelector(".state__message");
  if (messageNode) messageNode.textContent = message;
  panel.hidden = false;
  const title = document.querySelector(".book h1");
  if (title) title.textContent = "Не удалось загрузить каталог";
}

function ensureBookError() {
  const existing = document.querySelector(".book-error");
  if (existing instanceof HTMLElement) return existing;

  const panel = document.createElement("section");
  panel.className = "state state--error book-error";
  panel.setAttribute("role", "alert");
  const title = document.createElement("h2");
  title.className = "state__title";
  title.textContent = "Не удалось загрузить каталог";
  const message = document.createElement("p");
  message.className = "state__message";
  const retry = document.createElement("button");
  retry.className = "button";
  retry.type = "button";
  retry.dataset.action = "retry";
  retry.textContent = "Повторить";
  panel.append(title, message, retry);
  document.querySelector(".book")?.append(panel);
  return panel;
}

function paintBook(book) {
  const layout = document.querySelector(".layout-book");
  if (layout instanceof HTMLElement) layout.hidden = false;
  const panel = document.querySelector(".book-error");
  if (panel instanceof HTMLElement) panel.hidden = true;

  const title = document.querySelector(".book h1");
  if (title) title.textContent = book.title;
  document.title = `${book.title} — BookNest`;

  const author = document.querySelector(".book header .card__author");
  if (author) author.textContent = book.author;
  const description = document.querySelector(".book__description");
  if (description) description.textContent = book.description;

  const image = document.querySelector(".book__cover img");
  if (image) {
    image.setAttribute("src", book.cover);
    image.setAttribute("alt", `Обложка: ${book.author}, «${book.title}»`);
  }

  const current = document.querySelector(".crumbs [aria-current='page']");
  if (current) current.textContent = book.title;
  setSpec("Автор", book.author);
  setSpec("Жанр", book.genre);
  setSpec("Год", String(book.year));
  setSpec("Статус", book.available ? "Доступна" : "На руках");

  const wish = document.querySelector(".book .button--wish");
  if (wish instanceof HTMLButtonElement) wish.dataset.wish = book.id;
  syncBookWish();
}

function setSpec(label, value) {
  const terms = document.querySelectorAll(".specs dt");
  for (const term of terms) {
    if (term.textContent !== label) continue;
    const slot = term.nextElementSibling;
    if (!slot) return;
    const time = slot.querySelector("time");
    if (time) {
      time.setAttribute("datetime", value);
      time.textContent = value;
      return;
    }
    slot.textContent = value;
    return;
  }
}

const pageName = document.body.dataset.page;
if (pageName === "catalog" || pageName === "book") {
  loadStoredState();
  for (const type of ["click", "submit", "reset", "input", "change"]) {
    document.addEventListener(type, onDocument);
  }
}
if (pageName === "catalog") loadNow();
if (pageName === "book") startBook();
