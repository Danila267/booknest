import type { Book, Filters, GenreFilter, SortKey, WishItem } from "../types";

export const PAGE_SIZE = 20;

export const FILTER_DEFAULTS: Filters = {
  search: "",
  genre: "all",
  sort: "title-asc",
  availableOnly: false,
  page: 1,
};

const GENRE_FILTERS = new Set<GenreFilter>([
  "all",
  "Роман",
  "Поэзия",
  "Фантастика",
  "Детектив",
  "Нон-фикшн",
  "Драма",
]);

const SORT_KEYS = new Set<SortKey>(["title-asc", "author-asc", "year-desc", "year-asc"]);

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== "object") return false;
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function wishSnapshot(book: Pick<Book, "id" | "title" | "author" | "cover">): WishItem {
  return {
    id: book.id,
    title: book.title,
    author: book.author,
    cover: book.cover,
  };
}

function compareId(left: { id: string }, right: { id: string }) {
  return left.id.localeCompare(right.id, "ru");
}

function compareBooks(left: Book, right: Book, sortKey: SortKey) {
  const key = SORT_KEYS.has(sortKey) ? sortKey : "title-asc";

  if (key === "author-asc") {
    const byAuthor = left.author.localeCompare(right.author, "ru");
    return byAuthor === 0 ? compareId(left, right) : byAuthor;
  }

  if (key === "year-desc" || key === "year-asc") {
    const byYear = key === "year-desc" ? right.year - left.year : left.year - right.year;
    return byYear === 0 ? compareId(left, right) : byYear;
  }

  const byTitle = left.title.localeCompare(right.title, "ru");
  return byTitle === 0 ? compareId(left, right) : byTitle;
}

export function sanitizeFilters(value: unknown): Filters {
  if (!isPlainObject(value)) return { ...FILTER_DEFAULTS };

  const search =
    typeof value.search === "string" && value.search.length <= 80 ? value.search : FILTER_DEFAULTS.search;
  const genre = GENRE_FILTERS.has(value.genre as GenreFilter) ? (value.genre as GenreFilter) : FILTER_DEFAULTS.genre;
  const sort = SORT_KEYS.has(value.sort as SortKey) ? (value.sort as SortKey) : FILTER_DEFAULTS.sort;
  const availableOnly =
    typeof value.availableOnly === "boolean" ? value.availableOnly : FILTER_DEFAULTS.availableOnly;
  const page =
    Number.isInteger(value.page) && Number(value.page) >= 1 && Number(value.page) <= 500
      ? Number(value.page)
      : FILTER_DEFAULTS.page;

  return { search, genre, sort, availableOnly, page };
}

export function filterBooks(books: Book[], filters: Filters): Book[] {
  const query = filters.search.trim().toLocaleLowerCase("ru");

  return books.filter((book) => {
    if (query) {
      const title = book.title.toLocaleLowerCase("ru");
      const author = book.author.toLocaleLowerCase("ru");
      if (!title.includes(query) && !author.includes(query)) return false;
    }
    if (filters.genre !== "all" && book.genre !== filters.genre) return false;
    if (filters.availableOnly && book.available !== true) return false;
    return true;
  });
}

export function sortBooks(books: Book[], sortKey: SortKey): Book[] {
  return books.slice().sort((left, right) => compareBooks(left, right, sortKey));
}

export function applyAvailability(books: Book[], availableOnly: boolean): Book[] {
  if (!availableOnly) return books.slice();
  return books.filter((book) => book.available === true);
}

export function pageCount(total: number): number {
  if (total <= 0) return 1;
  return Math.ceil(total / PAGE_SIZE);
}

export function isWished(wishlist: WishItem[], id: string): boolean {
  return wishlist.some((item) => item.id === id);
}

export function addWish(wishlist: WishItem[], book: Book): WishItem[] {
  const snapshot = wishSnapshot(book);
  const next = wishlist.slice();
  const index = next.findIndex((item) => item.id === snapshot.id);
  if (index === -1) next.push(snapshot);
  else next[index] = snapshot;
  return next;
}

export function removeWish(wishlist: WishItem[], id: string): WishItem[] {
  return wishlist.filter((item) => item.id !== id);
}

export function mergeWishlist(wishlist: WishItem[], books: Book[]): WishItem[] {
  const booksById = new Map(books.map((book) => [book.id, book]));

  return wishlist.map((item) => {
    const book = booksById.get(item.id);
    if (!book) return wishSnapshot(item);
    return {
      id: item.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
    };
  });
}

export function sanitizeWishlist(value: unknown): WishItem[] {
  if (!Array.isArray(value)) return [];
  const items: WishItem[] = [];
  for (const item of value) {
    if (!isPlainObject(item)) continue;
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
