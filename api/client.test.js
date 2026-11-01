import assert from "node:assert/strict";
import { afterEach, beforeEach, describe, it } from "node:test";
import { ApiError, describeError, getWork, searchBooks } from "./client.js";

const FIELDS = "key,title,author_name,first_publish_year,cover_i,ebook_access,subject";
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = async () => {
    throw new Error("live network is not allowed in tests");
  };
});

afterEach(() => {
  globalThis.fetch = originalFetch;
});

describe("searchBooks", () => {
  it("maps a 200 search", async () => {
    const signal = new AbortController().signal;
    const calls = stubFetch(() =>
      jsonResponse({
        numFound: 2,
        docs: [
          {
            key: "/works/OL1W",
            title: "Solaris",
            author_name: ["Stanisław Lem"],
            first_publish_year: 1961,
            cover_i: 8739161,
            ebook_access: "public",
            subject: ["Fiction", "Science fiction"],
          },
          {
            ebook_access: "no_ebook",
            subject: ["History"],
          },
        ],
      }),
    );

    const result = await searchBooks(
      {
        search: "  Solaris  ",
        genre: "Фантастика",
        sort: "title-asc",
        availableOnly: true,
        page: 1,
      },
      { signal },
    );

    const url = new URL(calls[0].url);
    assert.equal(url.origin + url.pathname, "https://openlibrary.org/search.json");
    assert.equal(url.searchParams.get("q"), "Solaris");
    assert.equal(url.searchParams.get("limit"), "20");
    assert.equal(url.searchParams.get("page"), "1");
    assert.equal(url.searchParams.get("fields"), FIELDS);
    assert.equal(url.searchParams.get("sort"), "title");
    assert.equal(url.searchParams.get("subject"), "science_fiction");
    assert.equal(url.searchParams.has("available"), false);
    assert.equal(calls[0].options.signal, signal);
    assert.equal(result.total, 2);
    assert.equal(result.page, 1);
    assert.equal(result.pageSize, 20);
    assert.deepEqual(result.items[0], {
      id: "/works/OL1W",
      title: "Solaris",
      author: "Stanisław Lem",
      genre: "Фантастика",
      year: 1961,
      available: true,
      cover: "https://covers.openlibrary.org/b/id/8739161-M.jpg",
      description: "",
    });
    assert.equal(result.items[1].title, "Без названия");
    assert.equal(result.items[1].author, "Автор не указан");
    assert.equal(result.items[1].genre, "Другое");
    assert.equal(result.items[1].year, 0);
    assert.equal(result.items[1].available, false);
    assert.equal(result.items[1].cover, "images/covers/placeholder.svg");
    assert.equal(result.items[1].description, "");
  });

  it("omits sort when the key is author-asc", async () => {
    const calls = stubFetch(() => jsonResponse({ numFound: 0, docs: [] }));

    await searchBooks({ search: "   ", genre: "all", sort: "author-asc", page: 3 });

    const url = new URL(calls[0].url);
    assert.equal(url.searchParams.get("q"), "classic literature");
    assert.equal(url.searchParams.get("page"), "3");
    assert.equal(url.searchParams.get("sort"), null);
    assert.equal(url.searchParams.has("subject"), false);
    assert.equal(url.searchParams.get("fields"), FIELDS);
  });
});

describe("getWork", () => {
  it("throws a client error for a 404 work", async () => {
    const calls = stubFetch(() => htmlResponse(404, "<html>missing work</html>"));

    await assert.rejects(
      () => getWork("/works/OL0W"),
      (error) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.name, "ApiError");
        assert.equal(error.status, 404);
        assert.equal(error.kind, "client");
        assert.equal(describeError(error), "Такой книги нет в Open Library.");
        assert.equal(error.message.includes("<html>"), false);
        return true;
      },
    );
    assert.equal(calls[0].url, "https://openlibrary.org/works/OL0W.json");
  });

  it("does not fetch an id that is not an Open Library work", async () => {
    let called = false;
    globalThis.fetch = async () => {
      called = true;
      throw new Error("fetch should not run");
    };

    await assert.rejects(
      () => getWork("master-i-margarita"),
      (error) => error instanceof ApiError && error.status === 404 && error.kind === "client",
    );
    assert.equal(called, false);
  });

  it("maps a work description without a second author request", async () => {
    stubFetch(() =>
      jsonResponse({
        key: "/works/OL109524W",
        title: "Solaris",
        description: { type: "/type/text", value: "A station orbits Solaris." },
        covers: [8739161],
        subjects: ["Science fiction"],
        first_publish_date: "1961",
        authors: [{ author: { key: "/authors/OL31639A" } }],
        ebook_access: "borrowable",
      }),
    );

    const book = await getWork("/works/OL109524W");
    assert.equal(book.id, "/works/OL109524W");
    assert.equal(book.author, "Автор не указан");
    assert.equal(book.genre, "Фантастика");
    assert.equal(book.year, 1961);
    assert.equal(book.available, true);
    assert.equal(book.cover, "https://covers.openlibrary.org/b/id/8739161-M.jpg");
    assert.equal(book.description, "A station orbits Solaris.");
  });
});

describe("errors", () => {
  it("turns a 500 response into a server error", async () => {
    stubFetch(() => htmlResponse(500, "<html>unavailable</html>"));

    await assert.rejects(
      () => searchBooks({ search: "Solaris", sort: "year-desc", page: 1 }),
      (error) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 500);
        assert.equal(error.kind, "server");
        assert.equal(describeError(error), "Open Library временно недоступен. Попробуйте ещё раз.");
        assert.equal(error.message.includes("<html>"), false);
        return true;
      },
    );
  });

  it("turns a thrown TypeError into an offline error", async () => {
    globalThis.fetch = async () => {
      throw new TypeError("Failed to fetch");
    };

    await assert.rejects(
      () => searchBooks({ search: "Solaris" }),
      (error) => {
        assert.ok(error instanceof ApiError);
        assert.equal(error.status, 0);
        assert.equal(error.kind, "offline");
        assert.equal(describeError(error), "Нет соединения. Проверьте сеть и повторите.");
        return true;
      },
    );
  });

  it("lets AbortError pass through", async () => {
    const abort = new DOMException("The operation was aborted.", "AbortError");
    globalThis.fetch = async () => {
      throw abort;
    };

    await assert.rejects(() => getWork("/works/OL109524W"), (error) => error === abort);
  });
});

function stubFetch(handler) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url: String(url), options });
    return handler(url, options);
  };
  return calls;
}

function jsonResponse(body, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    async text() {
      return JSON.stringify(body);
    },
  };
}

function htmlResponse(status, html) {
  return {
    ok: false,
    status,
    async text() {
      return html;
    },
  };
}
