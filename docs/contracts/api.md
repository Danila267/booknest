# Open Library contract

Only `api/client.js` and `src/api/client.ts` may call `fetch`.
Both export the same behavior. The React file is a typed port, not a second design.

```js
export const BASE_URL = "https://openlibrary.org";
export const COVER_URL = "https://covers.openlibrary.org";

export class ApiError extends Error {
  // name = "ApiError"
  // status: number
  // kind: "offline" | "client" | "server"
}

export async function searchBooks(filters, { signal } = {}) {}
export async function getWork(id, { signal } = {}) {}
export function describeError(error) {}
```

`searchBooks` returns `{ items, total, page, pageSize }`.
`getWork` returns a `Book`.
Both use `async/await`, build the query with `URLSearchParams`, and throw `ApiError` when `response.ok` is false.
They do not put response HTML into the error message.

## Search request

`GET {BASE_URL}/search.json`

| Param | Value |
| --- | --- |
| q | Trimmed search, or `classic literature` when the search box is empty |
| limit | 20 |
| page | `filters.page` |
| fields | `key,title,author_name,first_publish_year,cover_i,ebook_access,subject` |
| sort | See the table below. Omit `sort` rather than sending an unknown value. |
| subject | Included only when a genre is selected |

Genre subjects:

| Genre | subject |
| --- | --- |
| Роман | fiction |
| Поэзия | poetry |
| Фантастика | science_fiction |
| Детектив | mystery |
| Нон-фикшн | nonfiction |
| Драма | drama |

Sort values that were checked against the live API:

| SortKey | Query | Notes |
| --- | --- | --- |
| year-desc | `sort=new` | Server sort |
| year-asc | `sort=old` | Server sort |
| title-asc | `sort=title` | Server accepted this value |
| author-asc | omit `sort` | `sort=author` returned HTTP 500. Sort the loaded page with `sortBooks` after the response. |

Do not send `sort=author`.

## Mapping

`api/mapBook.js` and `src/api/mapBook.ts` are pure. They do not fetch.

Search doc to `Book`:

| Book field | Source |
| --- | --- |
| id | `doc.key` |
| title | `doc.title`, or `Без названия` |
| author | first `author_name`, or `Автор не указан` |
| genre | Russian label whose subject appears in `doc.subject`; otherwise `Другое` |
| year | `first_publish_year`, or `0` |
| available | `ebook_access` is `public` or `borrowable` |
| cover | `{COVER_URL}/b/id/{cover_i}-M.jpg`, or `images/covers/placeholder.svg` when `cover_i` is missing |
| description | `""` on a search hit |

Work document:

- Request `GET {BASE_URL}{id}.json` only when `id` matches `/works/OL`.
- `description` is a string, or `description.value`, or `""`.
- Cover uses the first `covers` id with the same cover URL rule.
- Title falls back to `Без названия`.
- A work response has no reliable author list. Keep `Автор не указан` unless `authors` can be shown without a second request. Do not fan out one request per author.

## Errors

| Condition | ApiError |
| --- | --- |
| `TypeError` from `fetch`, or `navigator.onLine === false` | kind `offline`, status `0`, message from `describeError` |
| `AbortError` | Rethrow the abort. Callers ignore it. It is not a UI error. |
| status 404 | kind `client`, status 404 |
| status 400–499 | kind `client` |
| status 500–599 | kind `server` |

`describeError` returns the Russian strings in `docs/contracts/copy.md`.
404 uses `errorNotFound`. Other client errors use `errorClient`.

The loading flag is cleared in `finally`.
A stale response checks a generation number or an aborted signal and does not write state, including inside `finally`.

## Detail page

- `book.html?id=%2Fworks%2FOL...` fetches that work.
- No `id`, or `id=master-i-margarita`, leaves the static featured book and does not show an error.
- Any other id shows the not-found error without inventing a book.

## Collection

`docs/lab4/api-collection.json` is a Postman Collection v2.1 with four requests:

1. Search `classic literature`, page 1, limit 20.
2. Search a query that returns no docs (`q` set to a long unlikely string).
3. `GET /works/OL109524W.json` (Solaris), expected 200.
4. `GET /works/OL0W.json`, expected 404.

Save real example responses in the collection only if they contain no personal data. These endpoints do not require a key.

## Debounce and cancellation

- Search input waits 350ms after the last keystroke.
- Genre, sort, availability, reset, pagination, and retry start immediately.
- Starting a load aborts the previous `AbortController`.
- The input value updates on each keystroke so the field stays responsive while the request waits.
