import type { Book, GenreLabel } from "../types";
import type { SearchDoc, WorkAuthor, WorkDoc } from "./openLibraryTypes";

export const COVER_URL = "https://covers.openlibrary.org";

const PLACEHOLDER_COVER = "images/covers/placeholder.svg";
const UNTITLED = "Без названия";
const UNKNOWN_AUTHOR = "Автор не указан";

const GENRE_SUBJECTS: Array<[string, GenreLabel]> = [
  ["science_fiction", "Фантастика"],
  ["nonfiction", "Нон-фикшн"],
  ["mystery", "Детектив"],
  ["poetry", "Поэзия"],
  ["drama", "Драма"],
  ["fiction", "Роман"],
];

export function mapSearchDoc(doc: SearchDoc): Book {
  return {
    id: typeof doc.key === "string" ? doc.key : "",
    title: nonempty(doc.title, UNTITLED),
    author: firstName(doc.author_name),
    genre: genreFromSubjects(doc.subject),
    year: publishYear(doc),
    available: isAvailable(doc.ebook_access),
    cover: coverFromId(doc.cover_i),
    description: "",
  };
}

export function mapWork(work: WorkDoc, id: string): Book {
  const covers = Array.isArray(work.covers) ? work.covers : [];
  return {
    id: workId(work, id),
    title: nonempty(work.title, UNTITLED),
    author: authorFromWork(work),
    genre: genreFromSubjects(work.subject ?? work.subjects),
    year: publishYear(work),
    available: isAvailable(work.ebook_access),
    cover: coverFromId(covers[0]),
    description: descriptionText(work.description),
  };
}

function genreFromSubjects(value: string[] | string | undefined): GenreLabel {
  const subjects = subjectList(value).map(normalizeSubject);
  for (const [subject, label] of GENRE_SUBJECTS) {
    const needle = normalizeSubject(subject.replaceAll("_", " "));
    const compactNeedle = needle.replaceAll(" ", "");
    const found = subjects.some((item) => {
      if (item === needle || item.replaceAll(" ", "") === compactNeedle) return true;
      return ` ${item} `.includes(` ${needle} `);
    });
    if (found) return label;
  }
  return "Другое";
}

function subjectList(value: string[] | string | undefined): string[] {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}

function normalizeSubject(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function firstName(names: string[] | undefined): string {
  if (!Array.isArray(names)) return UNKNOWN_AUTHOR;
  return nonempty(names[0], UNKNOWN_AUTHOR);
}

function authorFromWork(source: WorkDoc): string {
  const authors = Array.isArray(source.authors) ? source.authors : [];
  const first = authors[0];
  if (typeof first === "string") return nonempty(first, UNKNOWN_AUTHOR);
  if (!first) return UNKNOWN_AUTHOR;
  if (typeof first.name === "string") return nonempty(first.name, UNKNOWN_AUTHOR);
  const nested = authorName(first);
  if (typeof nested === "string") return nonempty(nested, UNKNOWN_AUTHOR);
  return UNKNOWN_AUTHOR;
}

function authorName(author: WorkAuthor): string | undefined {
  return author.author?.name;
}

function publishYear(source: { first_publish_year?: number; first_publish_date?: string }): number {
  if (typeof source.first_publish_year === "number" && Number.isFinite(source.first_publish_year)) {
    return source.first_publish_year;
  }
  if (typeof source.first_publish_date === "string") {
    const match = source.first_publish_date.match(/\d{3,4}/);
    if (match) return Number(match[0]);
  }
  return 0;
}

function isAvailable(access: string | undefined): boolean {
  return access === "public" || access === "borrowable";
}

function coverFromId(coverId: number | string | undefined): string {
  if (typeof coverId === "number" && Number.isInteger(coverId) && coverId > 0) {
    return `${COVER_URL}/b/id/${coverId}-M.jpg`;
  }
  if (typeof coverId === "string" && /^[1-9]\d*$/.test(coverId)) {
    return `${COVER_URL}/b/id/${coverId}-M.jpg`;
  }
  return PLACEHOLDER_COVER;
}

function descriptionText(value: string | { value?: string } | undefined): string {
  if (typeof value === "string") return value;
  if (value && typeof value.value === "string") return value.value;
  return "";
}

function workId(source: WorkDoc, id: string): string {
  if (typeof source.key === "string" && source.key.startsWith("/works/OL")) return source.key;
  return id;
}

function nonempty(value: string | undefined, fallback: string): string {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}
