import { isWished, pageCount } from "../lib/books.js";

const EMPTY_TEXT = "Измените запрос или сбросьте фильтры.";
const EMPTY_PAGE_TEXT = "На этой странице нет подходящих книг. Перейдите дальше или сбросьте фильтры.";
const WISH = "Хочу прочитать";
const WISHED = "В списке";
const REMOVE = "Убрать";
const WISHLIST_EMPTY = "Пока пусто. Отметьте книги в каталоге.";
const AVAILABLE = "Доступна";
const UNAVAILABLE = "На руках";

export function render(state) {
  syncFilters(state.filters);
  renderCount(state);
  renderStates(state);
  renderBooks(state);
  renderPagination(state);
  renderWishlist(state);
}

function syncFilters(filters) {
  const search = document.getElementById("search");
  const genre = document.getElementById("genre");
  const sort = document.getElementById("sort");
  const available = document.getElementById("available");
  if (search instanceof HTMLInputElement && search.value !== filters.search) {
    search.value = filters.search;
  }
  if (genre instanceof HTMLSelectElement) genre.value = filters.genre;
  if (sort instanceof HTMLSelectElement) sort.value = filters.sort;
  if (available instanceof HTMLInputElement) available.checked = filters.availableOnly;
}

function renderCount(state) {
  const count = document.querySelector(".catalog__count");
  if (count) count.textContent = `Найдено книг: ${state.books.length}`;
}

function renderStates(state) {
  const loading = document.querySelector(".state--loading");
  const empty = document.querySelector(".state--empty");
  const error = document.querySelector(".state--error");
  const books = document.querySelector(".catalog__books");
  const pagination = document.querySelector(".pagination");
  const showBooks = state.status === "success";

  setHidden(loading, state.status !== "loading");
  setHidden(empty, state.status !== "empty");
  setHidden(error, state.status !== "error");
  setHidden(books, !showBooks);
  setHidden(pagination, state.status === "loading" || state.status === "error");

  const emptyMessage = empty?.querySelector(".state__message");
  if (emptyMessage) {
    const laterPage = state.books.length === 0 && state.total > 0;
    emptyMessage.textContent = laterPage ? EMPTY_PAGE_TEXT : EMPTY_TEXT;
  }

  const errorMessage = error?.querySelector(".state__message");
  if (errorMessage && state.errorMessage) errorMessage.textContent = state.errorMessage;
}

function renderBooks(state) {
  const list = document.querySelector(".catalog__books");
  if (!list) return;
  if (state.status !== "success") {
    list.replaceChildren();
    return;
  }
  list.replaceChildren(...state.books.map((book) => bookCard(book, state.wishlist)));
}

function renderPagination(state) {
  const pages = pageCount(state.total);
  const page = state.filters.page;
  const current = document.querySelector("[data-page-current]");
  const total = document.querySelector("[data-page-total]");
  const previous = document.querySelector("[data-action='page-prev']");
  const next = document.querySelector("[data-action='page-next']");
  if (current) current.textContent = String(page);
  if (total) total.textContent = String(pages);
  if (previous instanceof HTMLButtonElement) previous.disabled = page <= 1;
  if (next instanceof HTMLButtonElement) next.disabled = page >= pages;
}

function renderWishlist(state) {
  const count = document.querySelector(".wishlist__count");
  const list = document.querySelector(".wishlist__list");
  if (count) count.textContent = String(state.wishlist.length);
  if (!list) return;
  if (state.wishlist.length === 0) {
    list.replaceChildren(textElement("li", "wishlist__empty", WISHLIST_EMPTY));
    return;
  }
  list.replaceChildren(...state.wishlist.map(wishItem));
}

function bookCard(book, wishlist) {
  const item = element("li", "catalog__item");
  const article = element("article", "card");
  const figure = element("figure", "card__cover");
  const image = element("img");
  image.src = book.cover;
  image.alt = `Обложка: ${book.author}, «${book.title}»`;
  image.width = 240;
  image.height = 360;
  figure.append(image);

  const meta = element("p", "card__meta");
  meta.append(textElement("span", "badge", book.genre));
  const year = textElement("time", "", String(book.year));
  year.dateTime = String(book.year);
  meta.append(year);

  const statusClass = book.available ? "badge badge--available" : "badge badge--unavailable";
  const actions = element("p", "card__actions");
  const details = element("a", "button button--ghost");
  details.href = `book.html?id=${encodeURIComponent(book.id)}`;
  details.textContent = "Подробнее";
  actions.append(details, wishButton(book, wishlist));

  article.append(
    figure,
    textElement("h3", "card__title", book.title),
    textElement("p", "card__author", book.author),
    meta,
    textElement("p", statusClass, book.available ? AVAILABLE : UNAVAILABLE),
    actions,
  );
  item.append(article);
  return item;
}

function wishButton(book, wishlist) {
  const pressed = isWished(wishlist, book.id);
  const button = element("button", "button button--wish");
  button.type = "button";
  button.dataset.wish = book.id;
  button.setAttribute("aria-pressed", pressed ? "true" : "false");
  button.textContent = pressed ? WISHED : WISH;
  return button;
}

function wishItem(item) {
  const row = element("li", "wishlist__item");
  const title = textElement("span", "", item.title);
  const button = element("button", "button button--ghost");
  button.type = "button";
  button.dataset.action = "remove-wish";
  button.dataset.wish = item.id;
  button.textContent = REMOVE;
  row.append(title, button);
  return row;
}

function element(tag, className) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  return node;
}

function textElement(tag, className, text) {
  const node = element(tag, className);
  node.textContent = text;
  return node;
}

function setHidden(node, hidden) {
  if (node) node.hidden = hidden;
}
