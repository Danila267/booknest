import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  FILTER_DEFAULTS,
  PAGE_SIZE,
  addWish,
  applyAvailability,
  filterBooks,
  isWished,
  mergeWishlist,
  pageCount,
  removeWish,
  sanitizeFilters,
  sortBooks,
} from "./books.js";

function book(overrides) {
  return {
    id: "anna-karenina",
    title: "Анна Каренина",
    author: "Лев Толстой",
    genre: "Роман",
    year: 1877,
    available: true,
    cover: "images/covers/placeholder.svg",
    description: "История Анны.",
    ...overrides,
  };
}

function wish(overrides) {
  return {
    id: "anna-karenina",
    title: "Анна Каренина",
    author: "Лев Толстой",
    cover: "images/covers/placeholder.svg",
    ...overrides,
  };
}

function freezeList(items) {
  items.forEach((item) => Object.freeze(item));
  return Object.freeze(items);
}

const shelf = freezeList([
  book({ id: "anna", title: "Анна Каренина", author: "Лев Толстой", genre: "Роман", year: 1877 }),
  book({
    id: "voy",
    title: "Война и мир",
    author: "Лев Толстой",
    genre: "Роман",
    year: 1869,
    available: false,
  }),
  book({
    id: "master",
    title: "Мастер и Маргарита",
    author: "Михаил Булгаков",
    genre: "Фантастика",
    year: 1967,
  }),
  book({
    id: "eugene",
    title: "Евгений Онегин",
    author: "Александр Пушкин",
    genre: "Поэзия",
    year: 1833,
    available: false,
  }),
]);

describe("sanitizeFilters", () => {
  it("falls back when the filter input is corrupt", () => {
    for (const value of [null, undefined, "filters", 4, [], new Date()]) {
      assert.deepEqual(sanitizeFilters(value), FILTER_DEFAULTS);
    }

    assert.deepEqual(
      sanitizeFilters({
        search: 12,
        genre: "Комедия",
        sort: "popular",
        availableOnly: "yes",
        page: 0,
      }),
      FILTER_DEFAULTS,
    );
  });

  it("keeps only fields that match the contract", () => {
    const search = "а".repeat(80);
    assert.deepEqual(
      sanitizeFilters({
        search,
        genre: "Детектив",
        sort: "year-desc",
        availableOnly: true,
        page: 500,
      }),
      {
        search,
        genre: "Детектив",
        sort: "year-desc",
        availableOnly: true,
        page: 500,
      },
    );
    assert.equal(sanitizeFilters({ search: "а".repeat(81) }).search, "");
    assert.equal(sanitizeFilters({ page: 1.5 }).page, 1);
    assert.equal(sanitizeFilters({ page: 501 }).page, 1);
  });
});

describe("filterBooks", () => {
  it("matches title and author without case", () => {
    const byTitle = filterBooks(shelf, { ...FILTER_DEFAULTS, search: "  МАСТЕР " });
    assert.deepEqual(
      byTitle.map((item) => item.id),
      ["master"],
    );

    const byAuthor = filterBooks(shelf, { ...FILTER_DEFAULTS, search: "пушкин" });
    assert.deepEqual(
      byAuthor.map((item) => item.id),
      ["eugene"],
    );
  });

  it("filters by genre and availability", () => {
    const novels = filterBooks(shelf, { ...FILTER_DEFAULTS, genre: "Роман" });
    assert.deepEqual(
      novels.map((item) => item.id),
      ["anna", "voy"],
    );

    const available = filterBooks(shelf, { ...FILTER_DEFAULTS, availableOnly: true });
    assert.deepEqual(
      available.map((item) => item.id),
      ["anna", "master"],
    );
    assert.deepEqual(
      applyAvailability(shelf, true).map((item) => item.id),
      ["anna", "master"],
    );
    assert.notEqual(applyAvailability(shelf, false), shelf);
    assert.equal(applyAvailability(shelf, false).length, shelf.length);
  });

  it("returns an empty list for an unknown genre", () => {
    const result = filterBooks(shelf, { ...FILTER_DEFAULTS, genre: "Комедия" });
    assert.deepEqual(result, []);
  });
});

describe("sortBooks", () => {
  it("does not mutate the input and orders Russian titles", () => {
    const input = freezeList([
      book({ id: "apple", title: "Яблоко", author: "Автор Я" }),
      book({ id: "anna", title: "Анна Каренина", author: "Автор А" }),
      book({ id: "war", title: "Война и мир", author: "Автор В" }),
      book({ id: "late", title: "Анна Каренина", author: "Автор А" }),
    ]);
    const before = input.map((item) => item.id);

    const sorted = sortBooks(input, "title-asc");

    assert.deepEqual(
      before,
      ["apple", "anna", "war", "late"],
    );
    assert.deepEqual(
      sorted.map((item) => item.id),
      ["anna", "late", "war", "apple"],
    );
    assert.notEqual(sorted, input);
  });

  it("sorts years numerically and treats an unknown key as title order", () => {
    const byYear = sortBooks(shelf, "year-desc").map((item) => item.year);
    assert.deepEqual(byYear, [1967, 1877, 1869, 1833]);

    const unknown = sortBooks(shelf, "popular").map((item) => item.id);
    const byTitle = sortBooks(shelf, "title-asc").map((item) => item.id);
    assert.deepEqual(unknown, byTitle);
  });
});

describe("pageCount", () => {
  it("uses the page size and stays at one page for an empty total", () => {
    assert.equal(PAGE_SIZE, 20);
    assert.equal(pageCount(0), 1);
    assert.equal(pageCount(-4), 1);
    assert.equal(pageCount(20), 1);
    assert.equal(pageCount(21), 2);
  });
});

describe("wishlist", () => {
  it("adds, removes, and merges without mutating the arguments", () => {
    const stored = freezeList([
      wish({ id: "anna", title: "Старое название", cover: "images/covers/old.svg" }),
      wish({ id: "local-slug", title: "Местный экземпляр", author: "Клуб", cover: "images/covers/local.svg" }),
    ]);
    const page = freezeList([
      book({
        id: "anna",
        title: "Анна Каренина",
        author: "Лев Толстой",
        cover: "images/covers/anna.svg",
      }),
    ]);
    const addedBook = Object.freeze(
      book({ id: "master", title: "Мастер и Маргарита", author: "Михаил Булгаков" }),
    );

    const added = addWish(stored, addedBook);
    const replaced = addWish(stored, book({ id: "anna", title: "Новая Анна", cover: "images/covers/new.svg" }));
    const removed = removeWish(stored, "anna");
    const merged = mergeWishlist(stored, page);

    assert.equal(isWished(stored, "anna"), true);
    assert.equal(isWished(added, "master"), true);
    assert.deepEqual(
      stored.map((item) => item.title),
      ["Старое название", "Местный экземпляр"],
    );
    assert.deepEqual(
      added.map((item) => item.id),
      ["anna", "local-slug", "master"],
    );
    assert.equal(replaced[0].title, "Новая Анна");
    assert.equal(replaced[1].id, "local-slug");
    assert.deepEqual(
      removed.map((item) => item.id),
      ["local-slug"],
    );
    assert.deepEqual(merged[0], {
      id: "anna",
      title: "Анна Каренина",
      author: "Лев Толстой",
      cover: "images/covers/anna.svg",
    });
    assert.deepEqual(merged[1], {
      id: "local-slug",
      title: "Местный экземпляр",
      author: "Клуб",
      cover: "images/covers/local.svg",
    });
    assert.notEqual(added, stored);
    assert.notEqual(removed, stored);
    assert.notEqual(merged, stored);
  });
});
