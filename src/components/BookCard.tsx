import type { Book } from "../types";
import { bookHash } from "../lib/routes";
import { Badge } from "./Badge";
import { Button } from "./Button";

interface BookCardProps {
  book: Book;
  pressed: boolean;
  onToggle: (book: Book) => void;
}

export function BookCard({ book, pressed, onToggle }: BookCardProps) {
  return (
    <article className="card">
      <figure className="card__cover">
        <img src={book.cover} alt={`Обложка: ${book.author}, «${book.title}»`} width={240} height={360} />
      </figure>
      <h3 className="card__title">{book.title}</h3>
      <p className="card__author">{book.author}</p>
      <p className="card__meta">
        <Badge tone="neutral">{book.genre}</Badge>
        <time dateTime={String(book.year)}>{book.year}</time>
      </p>
      <p>
        <Badge tone={book.available ? "available" : "unavailable"}>{book.available ? "Доступна" : "На руках"}</Badge>
      </p>
      <p className="card__actions">
        <Button ghost href={bookHash(book.id)}>
          Подробнее
        </Button>
        <Button wish pressed={pressed} onClick={() => onToggle(book)}>
          {pressed ? "В списке" : "Хочу прочитать"}
        </Button>
      </p>
    </article>
  );
}
