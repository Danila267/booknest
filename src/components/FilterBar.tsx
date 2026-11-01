import type { FormEvent } from "react";
import type { GenreFilter, SortKey } from "../types";
import { Button } from "./Button";

interface FilterBarProps {
  search: string;
  genre: GenreFilter;
  sort: SortKey;
  availableOnly: boolean;
  onSearch: (value: string) => void;
  onGenre: (value: GenreFilter) => void;
  onSort: (value: SortKey) => void;
  onAvailable: (value: boolean) => void;
  onReset: () => void;
}

const GENRES: GenreFilter[] = ["all", "Роман", "Поэзия", "Фантастика", "Детектив", "Нон-фикшн", "Драма"];
const SORTS: Array<{ value: SortKey; label: string }> = [
  { value: "title-asc", label: "По названию (А–Я)" },
  { value: "author-asc", label: "По автору (А–Я)" },
  { value: "year-desc", label: "Сначала новые" },
  { value: "year-asc", label: "Сначала старые" },
];

export function FilterBar({
  search,
  genre,
  sort,
  availableOnly,
  onSearch,
  onGenre,
  onSort,
  onAvailable,
  onReset,
}: FilterBarProps) {
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="filters" aria-labelledby="filters-title">
      <h2 id="filters-title">Поиск и фильтры</h2>
      <form className="filters__form" id="filters-form" role="search" onSubmit={submit} onReset={onReset}>
        <p className="field">
          <label className="field__label" htmlFor="search">
            Название или автор
          </label>
          <input
            className="field__control"
            id="search"
            name="search"
            type="search"
            maxLength={80}
            placeholder="Например, Булгаков"
            autoComplete="off"
            value={search}
            onChange={(event) => onSearch(event.target.value)}
          />
        </p>
        <p className="field">
          <label className="field__label" htmlFor="genre">
            Жанр
          </label>
          <select
            className="field__control"
            id="genre"
            name="genre"
            value={genre}
            onChange={(event) => onGenre(asGenre(event.target.value))}
          >
            {GENRES.map((item) => (
              <option key={item} value={item}>
                {item === "all" ? "Все жанры" : item}
              </option>
            ))}
          </select>
        </p>
        <p className="field">
          <label className="field__label" htmlFor="sort">
            Сортировка
          </label>
          <select
            className="field__control"
            id="sort"
            name="sort"
            value={sort}
            onChange={(event) => onSort(asSort(event.target.value))}
          >
            {SORTS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </p>
        <p className="field field--checkbox">
          <input
            className="field__control"
            id="available"
            name="available"
            type="checkbox"
            value="1"
            checked={availableOnly}
            onChange={(event) => onAvailable(event.target.checked)}
          />
          <label className="field__label" htmlFor="available">
            Только доступные
          </label>
        </p>
        <p className="filters__actions">
          <Button type="submit">Показать</Button>
          <Button type="reset" ghost>
            Сбросить
          </Button>
        </p>
      </form>
    </section>
  );
}

function asGenre(value: string): GenreFilter {
  return GENRES.find((item) => item === value) ?? "all";
}

function asSort(value: string): SortKey {
  return SORTS.find((item) => item.value === value)?.value ?? "title-asc";
}
