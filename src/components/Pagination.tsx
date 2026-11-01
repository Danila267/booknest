import { Button } from "./Button";

interface PaginationProps {
  page: number;
  pages: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ page, pages, onPrevious, onNext }: PaginationProps) {
  return (
    <nav className="pagination" aria-label="Страницы каталога">
      <Button type="button" ghost disabled={page <= 1} onClick={onPrevious}>
        Назад
      </Button>
      <p className="pagination__status">
        Страница <span data-page-current>{page}</span> из <span data-page-total>{pages}</span>
      </p>
      <Button type="button" ghost disabled={page >= pages} onClick={onNext}>
        Дальше
      </Button>
    </nav>
  );
}
