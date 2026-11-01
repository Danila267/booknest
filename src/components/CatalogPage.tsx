import type { Book, Status, WishItem } from "../types";
import { applyAvailability, mergeWishlist, pageCount, sortBooks } from "../lib/books";
import { BookCard } from "./BookCard";
import { FilterBar } from "./FilterBar";
import { Pagination } from "./Pagination";
import { StateView } from "./StateView";
import { WishlistPanel } from "./WishlistPanel";
import { useCatalog } from "../lib/useCatalog";

interface CatalogPageProps {
  wishlist: WishItem[];
  onToggleWish: (book: Book) => void;
  onRemoveWish: (id: string) => void;
}

const EMPTY_TEXT = "Измените запрос или сбросьте фильтры.";
const EMPTY_PAGE_TEXT = "На этой странице нет подходящих книг. Перейдите дальше или сбросьте фильтры.";

export function CatalogPage({ wishlist, onToggleWish, onRemoveWish }: CatalogPageProps) {
  const catalog = useCatalog();
  // Open Library rejects sort=author, so this page is ordered locally.
  const ordered = catalog.filters.sort === "author-asc" ? sortBooks(catalog.books, "author-asc") : catalog.books;
  // Open Library does not provide a trustworthy shelf-availability query.
  const visibleBooks = applyAvailability(ordered, catalog.filters.availableOnly);
  const viewStatus: Status =
    catalog.status === "loading" || catalog.status === "error"
      ? catalog.status
      : visibleBooks.length === 0
        ? "empty"
        : "success";
  const emptyText = catalog.total > 0 ? EMPTY_PAGE_TEXT : EMPTY_TEXT;
  const saved = mergeWishlist(wishlist, catalog.books);

  return (
    <>
      <header className="page-intro">
        <h1>Каталог книжного клуба</h1>
        <p className="lead">Ищите книги клуба и откладывайте их в «Хочу прочитать».</p>
      </header>
      <FilterBar
        search={catalog.search}
        genre={catalog.filters.genre}
        sort={catalog.filters.sort}
        availableOnly={catalog.filters.availableOnly}
        onSearch={catalog.setSearch}
        onGenre={catalog.setGenre}
        onSort={catalog.setSort}
        onAvailable={catalog.setAvailableOnly}
        onReset={catalog.reset}
      />
      <section className="layout-catalog">
        <section className="catalog" aria-labelledby="catalog-title">
          <h2 id="catalog-title">Список книг</h2>
          <p className="catalog__count" role="status">
            Найдено книг: {viewStatus === "success" ? visibleBooks.length : 0}
          </p>
          <StateView
            status={viewStatus}
            loadingText="Загрузка каталога…"
            emptyTitle="Ничего не найдено"
            emptyText={emptyText}
            errorTitle="Не удалось загрузить каталог"
            errorMessage={catalog.errorMessage}
            onRetry={catalog.retry}
          >
            <ul className="catalog__books">
              {visibleBooks.map((book) => (
                <li className="catalog__item" key={book.id}>
                  <BookCard
                    book={book}
                    pressed={saved.some((item) => item.id === book.id)}
                    onToggle={onToggleWish}
                  />
                </li>
              ))}
            </ul>
          </StateView>
          {viewStatus === "success" || viewStatus === "empty" ? (
            <Pagination
              page={catalog.filters.page}
              pages={pageCount(catalog.total)}
              onPrevious={() => catalog.setPage(catalog.filters.page - 1)}
              onNext={() => catalog.setPage(catalog.filters.page + 1)}
            />
          ) : null}
        </section>
        <WishlistPanel items={saved} onRemove={onRemoveWish} />
      </section>
    </>
  );
}
