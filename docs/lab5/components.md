# Lab 5 component tree

Write this tree before writing React components. Later phases follow it.
A component file is at most 150 lines. Props are declared with `interface` in that file.
Presentational components take data and callbacks and hold no state.

## Tree

```text
App
  skip link
  SiteHeader
  main#content
    CatalogPage
      FilterBar
      p.catalog__count
      StateView
        Spinner + loading copy | EmptyState | ErrorBox | BookGrid
      Pagination
      WishlistPanel
    BookPage
      Breadcrumbs
      book header, Specs, description
      Button wish
      ReviewList
      ReviewForm
      similar BookCard list
      StateView for loading / error / missing id
    LoanPage
      LoanForm
      librarian aside
  SiteFooter
```

`StateView` chooses exactly one of loading, empty, error, or children.

## Files

| File | Kind | State it owns |
| --- | --- | --- |
| `src/App.tsx` | container | wishlist, hash route |
| `src/components/SiteHeader.tsx` | presentational | none |
| `src/components/SiteFooter.tsx` | presentational | none |
| `src/components/Button.tsx` | presentational | none |
| `src/components/Badge.tsx` | presentational | none |
| `src/components/Spinner.tsx` | presentational | none |
| `src/components/EmptyState.tsx` | presentational | none |
| `src/components/ErrorBox.tsx` | presentational | none |
| `src/components/BookCard.tsx` | presentational | none |
| `src/components/FilterBar.tsx` | presentational | none |
| `src/components/Pagination.tsx` | presentational | none |
| `src/components/WishlistPanel.tsx` | presentational | none |
| `src/components/StateView.tsx` | presentational | none |
| `src/components/Breadcrumbs.tsx` | presentational | none |
| `src/components/Specs.tsx` | presentational | none |
| `src/components/ReviewList.tsx` | presentational | none |
| `src/components/ReviewForm.tsx` | presentational | none |
| `src/components/CatalogPage.tsx` | container | filters, status, errorMessage, server page, total |
| `src/components/BookPage.tsx` | container | status, errorMessage, book |
| `src/components/LoanPage.tsx` | container | submitted boolean |
| `src/lib/useCatalog.ts` | hook | used only by CatalogPage |
| `src/lib/useWishlist.ts` | hook | used only by App |
| `src/lib/books.ts` | pure | none |
| `src/lib/storage.ts` | storage | none |
| `src/lib/debounce.ts` | pure | none |
| `src/lib/routes.ts` | pure | none |
| `src/api/client.ts` | network | none |
| `src/api/mapBook.ts` | pure | none |
| `src/types.ts` | types | none |

## Reuse

| Component | Used by |
| --- | --- |
| Button | FilterBar, BookCard, Pagination, WishlistPanel, ErrorBox, BookPage, ReviewForm, LoanPage |
| Badge | BookCard, ReviewList |
| Spinner | StateView, which CatalogPage and BookPage both render |
| EmptyState | Catalog results, wishlist, book route without an id |
| ErrorBox | CatalogPage, BookPage |

## State rules

- App holds the wishlist and passes `isWished` plus `onToggleWish` down.
- CatalogPage stores the server page on `books` and derives `visibleBooks` with `applyAvailability`. For `author-asc` it also derives the sorted page with `sortBooks`.
- It stores `filters` and the raw `search` string. The debounced query is derived with a hook or a small helper, not by copying the book list into another state field.
- BookPage stores the fetched book. Similar books are a constant list of the three featured snapshots, excluding the open book when it is one of them.
- LoanPage keeps `submitted`. Inputs stay uncontrolled and use native validation. Submit calls `preventDefault`, checks `form.reportValidity()`, then sets `submitted`.
- Keys are `book.id` and `wish.id`. Review keys are the review date plus author.

## Styles

Import no CSS module and create no new stylesheet.
The Vite `index.html` links `styles/tokens.css`, `styles/base.css`, `styles/layout.css`, and `styles/components.css` in that order.
Components use the classes already defined for the static pages.

## Routes

See the hash table in `docs/contracts/domain.md`.
Header links: `#/`, `#/book`, `#/loan`.
“Подробнее” uses `routes.book(id)`.
The book route without an id renders `EmptyState` with “Выберите книгу в каталоге.” and a Button-styled link back to the catalog.
