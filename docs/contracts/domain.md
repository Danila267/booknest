# Domain contract

Vanilla modules and the React port share this behavior.
Pure functions never read the DOM, `localStorage`, or the network, and never mutate their arguments.

## Book

```ts
export type Genre =
  | "Роман"
  | "Поэзия"
  | "Фантастика"
  | "Детектив"
  | "Нон-фикшн"
  | "Драма";

export type GenreLabel = Genre | "Другое";
export type GenreFilter = "all" | Genre;
export type SortKey = "title-asc" | "author-asc" | "year-desc" | "year-asc";
export type Status = "loading" | "success" | "empty" | "error";
export type ErrorKind = "offline" | "client" | "server";

export interface Book {
  id: string;
  title: string;
  author: string;
  genre: GenreLabel;
  year: number;
  available: boolean;
  cover: string;
  description: string;
}

export interface WishItem {
  id: string;
  title: string;
  author: string;
  cover: string;
}

export interface Filters {
  search: string;
  genre: GenreFilter;
  sort: SortKey;
  availableOnly: boolean;
  page: number;
}

export interface SearchResult {
  items: Book[];
  total: number;
  page: number;
  pageSize: number;
}

export interface Route {
  name: "catalog" | "book" | "loan";
  bookId?: string;
}
```

`src/types.ts` exports these domain types and nothing about raw HTTP payloads.
Open Library response types live in `src/api/openLibraryTypes.ts`.

## Local shelf

`data/books.js` exports:

- `books`: a frozen array of 40 frozen book objects.
- `getBooks()`: a fresh array of shallow copies.

The first six objects match `docs/contracts/featured-books.json` in array order and omit `coverColor`, `alt`, `pages`, and `language`.
The other 34 are real published books a university club might read.

Rules for the extra 34:

- Unique `id` in Latin kebab-case.
- `genre` is one of the six genres. Across all 40 books, each genre appears at least five times.
- About a quarter have `available: false`.
- `year` is the real first-publication year.
- `description` is one or two original Russian sentences, not a publisher blurb.
- `cover` is `images/covers/placeholder.svg`.
- `author` is a non-empty string.

## Filters

```js
export const PAGE_SIZE = 20;

export const FILTER_DEFAULTS = {
  search: "",
  genre: "all",
  sort: "title-asc",
  availableOnly: false,
  page: 1,
};
```

`sanitizeFilters(value)` returns `FILTER_DEFAULTS` when `value` is not a plain object.
It keeps `search` only when it is a string of at most 80 characters.
It keeps `genre` and `sort` only when they are in the unions above.
It keeps `availableOnly` only as a boolean.
It keeps `page` only when it is an integer from 1 to 500.

`filterBooks(books, filters)` returns a new array:

- `search` trims and compares with `toLocaleLowerCase("ru")` against title and author.
- `genre` of `all` does not filter. Any other genre keeps strict equality.
- `availableOnly` keeps `available === true`.

`sortBooks(books, sortKey)` copies the array, then sorts the copy.
Title and author use `localeCompare` with `"ru"`. Year sorts numerically.
Equal keys fall back to `id`. Unknown sort keys behave as `title-asc`.

`applyAvailability(books, availableOnly)` returns a copy filtered only by availability.

`pageCount(total)` returns `1` when `total <= 0`, otherwise `Math.ceil(total / PAGE_SIZE)`.

## Wishlist

```js
export function isWished(wishlist, id) {}
export function addWish(wishlist, book) {}
export function removeWish(wishlist, id) {}
export function mergeWishlist(wishlist, books) {}
```

- `addWish` returns a new array. If the id exists, that snapshot is replaced in place in the copy and the order of the others stays.
- `removeWish` returns a new array without that id.
- `mergeWishlist` returns a new wishlist. Items whose id appears in `books` refresh `title`, `author`, and `cover` from that book. Other snapshots stay as stored.
- A card is pressed when `isWished` is true for `book.id`.

Storage keys:

- `booknest.wishlist` — array of `WishItem`
- `booknest.filters` — `Filters`

Reading storage parses JSON inside `try/catch` and then runs it through a sanitizer.
A corrupt value falls back to `[]` or `FILTER_DEFAULTS`.
Writing storage is also inside `try/catch`. A failed write keeps the in-memory state.

## Vanilla state and render

`main.js` owns one `state` object:

```js
const state = {
  books: [],
  total: 0,
  filters: { ...FILTER_DEFAULTS },
  wishlist: [],
  status: "success",
  errorMessage: "",
  requestId: 0,
};
```

`ui/render.js` exports one `render(state)` function.
It rebuilds the card list and the wishlist with `createElement`, `replaceChildren`, and `textContent`.
It sets `hidden` so that loading, empty, error, and `.catalog__books` are mutually exclusive.
It writes the count, wishlist count, button labels, `aria-pressed`, pagination labels, and disabled state.

Lab 3 fills `state.books` from `getBooks()` passed through `sortBooks(filterBooks(...))`, sets `total` to that length, forces `page` to 1, and leaves pagination disabled.
Lab 4 replaces that load with the API client. Lab 4 still uses `applyAvailability` and, for `author-asc` only, `sortBooks` on the current page.

Event delegation is one listener set on `document` in `main.js`.
`event.target.closest` may find the control. `getElementById` may find the stable regions inside `render.js`.
Do not query individual cards.

Click handling order:

1. `data-action="remove-wish"` removes that id.
2. A wish button with `data-wish` and no remove action toggles the book.
3. `data-action="retry"` repeats the last load.
4. `data-action="page-prev"` and `data-action="page-next"` change page inside bounds.
5. `submit` on `#filters-form` is prevented. The field values are read from the form and stored.
6. `reset` restores `FILTER_DEFAULTS`.
7. `input` on the search field updates filters and, in Lab 4, schedules a load in 350ms.
8. `change` on genre, sort, and availability updates filters and loads immediately.
9. Any change except pagination sets `page` back to 1.

The search handler reads `FormData` or the named controls. It does not scrape card text.

## React state

Derived values are computed during render and are not copied into state.
`visibleBooks`, wishlist count, `pageCount`, and pressed flags are derived.
`books` in React state is the latest server page before the availability filter.
The catalog effect aborts its `AbortController` in cleanup so Strict Mode does not leave a stale request running.

Hash routes:

| Hash | Route |
| --- | --- |
| `#/` or empty | catalog |
| `#/book` | book without id |
| `#/book/<encodeURIComponent(id)>` | book |
| `#/loan` | loan |

`lib/routes.ts` parses and builds these hashes. Components receive a `Route` and callbacks.
