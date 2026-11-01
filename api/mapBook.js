export const COVER_URL = "https://covers.openlibrary.org";

const PLACEHOLDER_COVER = "images/covers/placeholder.svg";
const UNTITLED = "Без названия";
const UNKNOWN_AUTHOR = "Автор не указан";

// Longer subjects come first so "fiction" does not claim science fiction or nonfiction.
const GENRE_SUBJECTS = [
  ["science_fiction", "Фантастика"],
  ["nonfiction", "Нон-фикшн"],
  ["mystery", "Детектив"],
  ["poetry", "Поэзия"],
  ["drama", "Драма"],
  ["fiction", "Роман"],
];

export function mapSearchDoc(doc) {
  const source = record(doc) ?? {};
  return {
    id: typeof source.key === "string" ? source.key : "",
    title: nonempty(source.title, UNTITLED),
    author: firstName(source.author_name),
    genre: genreFromSubjects(source.subject),
    year: publishYear(source),
    available: isAvailable(source.ebook_access),
    cover: coverFromId(source.cover_i),
    description: "",
  };
}

export function mapWork(work, id) {
  const source = record(work) ?? {};
  const covers = Array.isArray(source.covers) ? source.covers : [];
  return {
    id: workId(source, id),
    title: nonempty(source.title, UNTITLED),
    author: authorFromWork(source),
    genre: genreFromSubjects(source.subject ?? source.subjects),
    year: publishYear(source),
    available: isAvailable(source.ebook_access),
    cover: coverFromId(covers[0]),
    description: descriptionText(source.description),
  };
}

function genreFromSubjects(value) {
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

function subjectList(value) {
  if (Array.isArray(value)) return value;
  if (typeof value === "string") return [value];
  return [];
}

function normalizeSubject(value) {
  return String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

function firstName(names) {
  if (!Array.isArray(names)) return UNKNOWN_AUTHOR;
  return nonempty(names[0], UNKNOWN_AUTHOR);
}

function authorFromWork(source) {
  const authors = Array.isArray(source.authors) ? source.authors : [];
  const first = authors[0];
  if (typeof first === "string") return nonempty(first, UNKNOWN_AUTHOR);
  if (!record(first)) return UNKNOWN_AUTHOR;
  if (typeof first.name === "string") return nonempty(first.name, UNKNOWN_AUTHOR);
  const nested = record(first.author) ? first.author.name : undefined;
  if (typeof nested === "string") return nonempty(nested, UNKNOWN_AUTHOR);
  return UNKNOWN_AUTHOR;
}

function publishYear(source) {
  if (typeof source.first_publish_year === "number" && Number.isFinite(source.first_publish_year)) {
    return source.first_publish_year;
  }
  if (typeof source.first_publish_date === "string") {
    const match = source.first_publish_date.match(/\d{3,4}/);
    if (match) return Number(match[0]);
  }
  return 0;
}

function isAvailable(access) {
  return access === "public" || access === "borrowable";
}

function coverFromId(coverId) {
  if (typeof coverId === "number" && Number.isInteger(coverId) && coverId > 0) {
    return `${COVER_URL}/b/id/${coverId}-M.jpg`;
  }
  if (typeof coverId === "string" && /^[1-9]\d*$/.test(coverId)) {
    return `${COVER_URL}/b/id/${coverId}-M.jpg`;
  }
  return PLACEHOLDER_COVER;
}

function descriptionText(value) {
  if (typeof value === "string") return value;
  if (record(value) && typeof value.value === "string") return value.value;
  return "";
}

function workId(source, id) {
  if (typeof source.key === "string" && source.key.startsWith("/works/OL")) return source.key;
  return typeof id === "string" ? id : "";
}

function nonempty(value, fallback) {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed ? trimmed : fallback;
}

function record(value) {
  return value !== null && typeof value === "object" ? value : null;
}
