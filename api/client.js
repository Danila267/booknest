import { COVER_URL, mapSearchDoc, mapWork } from "./mapBook.js";

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

const SORT_QUERY = {
  "year-desc": "new",
  "year-asc": "old",
  "title-asc": "title",
};

const GENRE_QUERY = {
  Роман: "fiction",
  Поэзия: "poetry",
  Фантастика: "science_fiction",
  Детектив: "mystery",
  "Нон-фикшн": "nonfiction",
  Драма: "drama",
};

export class ApiError extends Error {
  constructor(status, kind) {
    super(messageFor(status, kind));
    this.name = "ApiError";
    this.status = status;
    this.kind = kind;
  }
}

export function describeError(error) {
  if (error instanceof ApiError) return messageFor(error.status, error.kind);
  return SERVER;
}

export async function searchBooks(filters, options = {}) {
  const params = new URLSearchParams();
  const search = typeof filters?.search === "string" ? filters.search.trim() : "";
  params.set("q", search || EMPTY_QUERY);
  params.set("limit", String(PAGE_SIZE));
  params.set("page", String(pageOf(filters)));
  params.set("fields", SEARCH_FIELDS);

  // Open Library returns HTTP 500 for sort=author. author-asc is sorted after the response.
  const sort = SORT_QUERY[filters?.sort];
  if (sort && sort !== "author") params.set("sort", sort);

  const subject = GENRE_QUERY[filters?.genre];
  if (subject) params.set("subject", subject);

  const payload = await getJson(`${BASE_URL}/search.json?${params}`, options?.signal);
  const body = record(payload);
  const docs = Array.isArray(body.docs) ? body.docs : [];
  const total = typeof body.numFound === "number" && Number.isFinite(body.numFound) ? body.numFound : 0;

  return {
    items: docs.map((doc) => mapSearchDoc(doc)),
    total,
    page: pageOf(filters),
    pageSize: PAGE_SIZE,
  };
}

export async function getWork(id, options = {}) {
  if (typeof id !== "string" || !WORK_ID.test(id)) {
    throw new ApiError(404, "client");
  }
  const payload = await getJson(`${BASE_URL}${id}.json`, options?.signal);
  return mapWork(payload, id);
}

async function getJson(url, signal) {
  if (isOffline()) throw new ApiError(0, "offline");

  let response;
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
    return JSON.parse(text);
  } catch {
    throw new ApiError(response.status || 500, "server");
  }
}

function statusError(status) {
  if (status >= 400 && status <= 499) return new ApiError(status, "client");
  return new ApiError(status || 500, "server");
}

function messageFor(status, kind) {
  if (kind === "offline") return OFFLINE;
  if (status === 404) return NOT_FOUND;
  if (kind === "server") return SERVER;
  return CLIENT;
}

function pageOf(filters) {
  const page = filters?.page;
  if (typeof page === "number" && Number.isInteger(page) && page >= 1 && page <= 500) return page;
  return 1;
}

function isOffline() {
  return typeof navigator !== "undefined" && navigator.onLine === false;
}

function isAbort(error) {
  return Boolean(error) && typeof error === "object" && error.name === "AbortError";
}

function record(value) {
  return value !== null && typeof value === "object" ? value : {};
}
