import { useEffect, useState } from "react";
import { describeError, searchBooks } from "../api/client";
import type { Book, Filters, GenreFilter, SortKey, Status } from "../types";
import { FILTER_DEFAULTS } from "./books";
import { debounce } from "./debounce";
import { readFilters, writeFilters } from "./storage";

interface CatalogController {
  filters: Filters;
  search: string;
  status: Status;
  errorMessage: string;
  books: Book[];
  total: number;
  setSearch: (value: string) => void;
  setGenre: (value: GenreFilter) => void;
  setSort: (value: SortKey) => void;
  setAvailableOnly: (value: boolean) => void;
  setPage: (page: number) => void;
  reset: () => void;
  retry: () => void;
}

export function useCatalog(): CatalogController {
  const stored = readFilters();
  const [filters, setFilters] = useState<Filters>({ ...stored, search: "" });
  const [search, setSearch] = useState(stored.search);
  const [debouncedSearch, setDebouncedSearch] = useState(stored.search);
  const [status, setStatus] = useState<Status>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [books, setBooks] = useState<Book[]>([]);
  const [total, setTotal] = useState(0);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    writeFilters({ ...filters, search });
  }, [filters, search]);

  useEffect(() => {
    if (search === debouncedSearch) return;
    return debounce(() => {
      setStatus("loading");
      setErrorMessage("");
      setDebouncedSearch(search);
    });
  }, [search, debouncedSearch]);

  const genre = filters.genre;
  const sort = filters.sort;
  const page = filters.page;

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    searchBooks({ ...FILTER_DEFAULTS, genre, sort, page, search: debouncedSearch }, { signal: controller.signal })
      .then((result) => {
        if (!active) return;
        setBooks(result.items);
        setTotal(result.total);
        setStatus(result.items.length === 0 ? "empty" : "success");
      })
      .catch((error: unknown) => {
        if (!active || isAbort(error)) return;
        setBooks([]);
        setStatus("error");
        setErrorMessage(describeError(error));
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [genre, sort, page, debouncedSearch, attempt]);

  function markLoading() {
    setStatus("loading");
    setErrorMessage("");
  }

  return {
    filters: { ...filters, search },
    search,
    status,
    errorMessage,
    books,
    total,
    setSearch: (value) => {
      setSearch(value);
      setFilters((current) => ({ ...current, page: 1 }));
    },
    setGenre: (next) => {
      markLoading();
      setFilters((current) => ({ ...current, genre: next, page: 1 }));
    },
    setSort: (next) => {
      markLoading();
      setFilters((current) => ({ ...current, sort: next, page: 1 }));
    },
    setAvailableOnly: (availableOnly) => {
      if (page !== 1) markLoading();
      setFilters((current) => ({ ...current, availableOnly, page: 1 }));
    },
    setPage: (next) => {
      markLoading();
      setFilters((current) => ({ ...current, page: next }));
    },
    reset: () => {
      markLoading();
      setFilters({ ...FILTER_DEFAULTS });
      setSearch("");
      setDebouncedSearch("");
    },
    retry: () => {
      markLoading();
      setAttempt((current) => current + 1);
    },
  };
}

function isAbort(error: unknown): boolean {
  return Boolean(error) && typeof error === "object" && "name" in error && error.name === "AbortError";
}
