import type { Book, ErrorKind, Filters, SearchResult } from "../types";
import { COVER_URL, mapSearchDoc, mapWork } from "./mapBook";
import type { SearchDoc, SearchResponse, WorkDoc } from "./openLibraryTypes";

export const BASE_URL = "https://openlibrary.org";
export { COVER_URL };

const PAGE_SIZE = 20;
const SEARCH_FIELDS = "key,title,author_name,first_publish_year,cover_i,ebook_access,subject";
const EMPTY_QUERY = "classic literature";
const WORK_ID = /^\/works\/OL\d+W$/;

const OFFLINE = "Нет соединения. Проверьте сеть и повторите.";
const CLIENT = "Запрос отклонён. Проверьте условия поиска.";
const SERVER = "Open Library временно недоступен. Попробуйте ещё раз.";
const NOT_FOUND = "Такой книги нет в Open Library.";

const SORT_QUERY: Record<string, string> = {
  "year-desc": "new",
  "year-asc": "old",
  "title-asc": "title",
};

const GENRE_QUERY: Record<string, string> = {
  Роман: "fiction",
  Поэзия: "poetry",
  Фантастика: "science_fiction",
  Детектив: "mystery",
  "Нон-фикшн": "nonfiction",
  Драма: "drama",
};

export class ApiError extends Error {
  status: number;
  kind: ErrorKind;

  constructor(status: number, kind: ErrorKind) {
    super(messageFor(status, kind));
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
  }
}

export function describeError(error: unknown): string {
  if (error instanceof ApiError) return messageFor(error.status, error.kind);
  return SERVER;
}

export async function searchBooks(
  filters: Filters,
  options: { signal?: AbortSignal } = {},
): Promise<SearchResult> {
  const params = new URLSearchParams();
  const search = filters.search.trim();
  params.set("q", search || EMPTY_QUERY);
  params.set("limit", String(PAGE_SIZE));
  params.set("page", String(pageOf(filters)));
  params.set("fields", SEARCH_FIELDS);

  // Open Library returns HTTP 500 for sort=author. author-asc is sorted after the response.
  const sort = SORT_QUERY[filters.sort];
  if (sort && sort !== "author") params.set("sort", sort);

  const subject = GENRE_QUERY[filters.genre];
  if (subject) params.set("subject", subject);

  const payload = await getJson(`${BASE_URL}/search.json?${params}`, options.signal);
  const body = record(payload);
  const docs = Array.isArray(body.docs) ? body.docs.filter(isSearchDoc) : [];
  const total = typeof body.numFound === "number" && Number.isFinite(body.numFound) ? body.numFound : 0;

  return {
    items: docs.map((doc) => mapSearchDoc(doc)),
    total,
    page: pageOf(filters),
    pageSize: PAGE_SIZE,
  };
}

export async function getWork(id: string, options: { signal?: AbortSignal } = {}): Promise<Book> {
  if (!WORK_ID.test(id)) throw new ApiError(404, "client");
  const payload = await getJson(`${BASE_URL}${id}.json`, options.signal);
  return mapWork(asWork(payload), id);
}

async function getJson(url: string, signal?: AbortSignal): Promise<unknown> {
  if (isOffline()) throw new ApiError(0, "offline");

  let response: Response;
  try {
    response = await fetch(url, { signal });
  } catch (error) {
    if (isAbort(error)) throw error;
    if (error instanceof TypeError || isOffline()) throw new ApiError(0, "offline");
    throw error;
  }

  if (!response.ok) throw statusError(response.status);

  let text = "";
  try {
    text = await response.text();
  } catch (error) {
    if (isAbort(error)) throw error;
    throw new ApiError(response.status || 500, "server");
  }

  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new ApiError(response.status || 500, "server");
  }
}

function statusError(status: number): ApiError {
  if (status >= 400 && status <= 499) return new ApiError(status, "client");
  return new ApiError(status || 500, "server");
}

function messageFor(status: number, kind: ErrorKind): string {
  if (kind === "offline") return OFFLINE;
  if (status === 404) return NOT_FOUND;
  if (kind === "server") return SERVER;
  return CLIENT;
}

function pageOf(filters: Filters): number {
  const page = filters.page;
  if (Number.isInteger(page) && page >= 1 && page <= 500) return page;
  return 1;
}

function isOffline(): boolean {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

function isAbort(error: unknown): boolean {
  return Boolean(error) && typeof error === "object" && "name" in error && error.name === "AbortError";
}

function record(value: unknown): SearchResponse {
  if (value !== null && typeof value === "object") return value as SearchResponse;
  return {};
}

function isSearchDoc(value: unknown): value is SearchDoc {
  return value !== null && typeof value === "object";
}

function asWork(value: unknown): WorkDoc {
  if (value !== null && typeof value === "object") return value as WorkDoc;
  return {};
}
