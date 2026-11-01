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
