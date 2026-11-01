import { useEffect, useState } from "react";
import featured from "../../docs/contracts/featured-books.json";
import { describeError, getWork } from "../api/client";
import { catalogHash } from "../lib/routes";
import type { Book, GenreLabel, Status } from "../types";
import { BookCard } from "./BookCard";
import { Breadcrumbs } from "./Breadcrumbs";
import { Button } from "./Button";
import { EmptyState } from "./EmptyState";
import { ErrorBox } from "./ErrorBox";
import { ReviewForm } from "./ReviewForm";
import { ReviewList } from "./ReviewList";
import { Specs } from "./Specs";
import { Spinner } from "./Spinner";

interface BookPageProps {
  bookId?: string;
  isSaved: (id: string) => boolean;
  onToggleWish: (book: Book) => void;
}

const FEATURED_ID = featured.detailId;
const FEATURED_SOURCE = featured.books.find((item) => item.id === FEATURED_ID);
const FEATURED_BOOK: Book = {
  id: FEATURED_SOURCE?.id ?? FEATURED_ID, title: FEATURED_SOURCE?.title ?? "", author: FEATURED_SOURCE?.author ?? "",
  genre: asGenre(FEATURED_SOURCE?.genre ?? ""), year: FEATURED_SOURCE?.year ?? 0, available: FEATURED_SOURCE?.available ?? false,
  cover: FEATURED_SOURCE?.cover ?? "images/covers/placeholder.svg", description: FEATURED_SOURCE?.description ?? "",
};

export function BookPage({ bookId, isSaved, onToggleWish }: BookPageProps) {
  const remote = Boolean(bookId?.startsWith("/works/"));
  const notFound = Boolean(bookId) && bookId !== FEATURED_ID && !remote;
  const [loaded, setLoaded] = useState<Book | null>(null);
  const [failedId, setFailedId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [attempt, setAttempt] = useState(0);
  const book = bookId === FEATURED_ID ? FEATURED_BOOK : loaded?.id === bookId ? loaded : null;
  const status: Status = notFound || failedId === bookId ? "error" : book ? "success" : remote ? "loading" : "success";

  useEffect(() => {
    if (!remote || !bookId) return;
    const controller = new AbortController();
    let active = true;
    getWork(bookId, { signal: controller.signal })
      .then((next) => {
        if (!active) return;
        setLoaded(next);
        setFailedId("");
      })
      .catch((error: unknown) => {
        if (!active || (typeof error === "object" && error !== null && "name" in error && error.name === "AbortError")) return;
        setFailedId(bookId);
        setErrorMessage(describeError(error));
      });
    return () => {
      active = false;
      controller.abort();
    };
  }, [bookId, remote, attempt]);

  if (!bookId) {
    return (
      <>
        <h1>Карточка книги</h1>
        <EmptyState title="Выберите книгу" text="Выберите книгу в каталоге." />
        <Button href={catalogHash()}>Каталог</Button>
      </>
    );
  }

  const message = notFound ? "Такой книги нет в Open Library." : errorMessage;
  return (
    <>
      <Breadcrumbs
        items={[
          { label: "Каталог", href: catalogHash() },
          { label: book?.genre ?? "Книга", href: catalogHash() },
          { label: book?.title ?? "Карточка книги" },
        ]}
      />
      <article className="book">
        <header>
          <h1>{status === "loading" ? "Загрузка карточки…" : book?.title ?? "Карточка книги"}</h1>
          {book ? <p className="card__author">{book.author}</p> : null}
        </header>
        {status === "loading" ? <Spinner>Загрузка карточки…</Spinner> : null}
        {status === "error" ? (
          <ErrorBox title="Не удалось загрузить каталог" message={message} onRetry={() => setAttempt((value) => value + 1)} />
        ) : null}
        {status === "success" && book ? <BookBody book={book} isSaved={isSaved} onToggleWish={onToggleWish} /> : null}
      </article>
    </>
  );
}

function BookBody({ book, isSaved, onToggleWish }: { book: Book; isSaved: (id: string) => boolean; onToggleWish: (book: Book) => void }) {
  const similar = featured.books.filter((item) => featured.similarIds.includes(item.id) && item.id !== book.id).slice(0, 3);
  return (
    <section className="layout-book">
      <section className="book__main">
        <figure className="book__cover card__cover">
          <img src={book.cover} alt={`Обложка: ${book.author}, «${book.title}»`} width={240} height={360} />
        </figure>
        <Specs
          items={[
            { label: "Автор", value: book.author },
            { label: "Жанр", value: book.genre },
            { label: "Год", value: String(book.year), dateTime: String(book.year) },
            { label: "Статус", value: book.available ? "Доступна" : "На руках" },
          ]}
        />
        <section aria-labelledby="description-title">
          <h2 id="description-title">Описание</h2>
          <p className="book__description">{book.description}</p>
        </section>
        <p className="card__actions">
          <Button href="#/loan">Оформить выдачу</Button>
          <Button wish pressed={isSaved(book.id)} onClick={() => onToggleWish(book)}>
            {isSaved(book.id) ? "В списке" : "Хочу прочитать"}
          </Button>
        </p>
        <ReviewList />
        <ReviewForm />
      </section>
      <aside className="similar" aria-labelledby="similar-title">
        <h2 id="similar-title">Похожие книги</h2>
        <ul className="similar__list">
          {similar.map((item) => (
            <li className="catalog__item" key={item.id}>
              <BookCard book={asBook(item)} pressed={isSaved(item.id)} onToggle={onToggleWish} />
            </li>
          ))}
        </ul>
      </aside>
    </section>
  );
}

function asBook(item: (typeof featured.books)[number]): Book {
  return {
    id: item.id, title: item.title, author: item.author, genre: asGenre(item.genre),
    year: item.year, available: item.available, cover: item.cover, description: item.description,
  };
}

function asGenre(value: string): GenreLabel {
  if (value === "Роман" || value === "Поэзия" || value === "Фантастика" || value === "Детектив" || value === "Нон-фикшн" || value === "Драма") return value;
  return "Другое";
}
